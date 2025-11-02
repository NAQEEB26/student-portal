import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    switch (action) {
      case 'create-faculty':
        return await createFaculty(supabaseClient, data)
      case 'update-faculty':
        return await updateFaculty(supabaseClient, data)
      case 'assign-courses':
        return await assignCourses(supabaseClient, data)
      case 'get-faculty-workload':
        return await getFacultyWorkload(supabaseClient, data)
      case 'create-schedule':
        return await createSchedule(supabaseClient, data)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createFaculty(supabase, data) {
  const {
    email,
    password,
    full_name,
    employee_id,
    department_id,
    campus_id,
    position,
    qualification,
    specialization,
    hire_date,
    phone,
    address,
    emergency_contact_name,
    emergency_contact_phone
  } = data

  // Generate employee ID if not provided
  const finalEmployeeId = employee_id || await generateEmployeeId(supabase, campus_id)

  // Create auth user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      role: 'faculty'
    }
  })

  if (authError) {
    throw new Error(`Auth creation failed: ${authError.message}`)
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authUser.user.id,
      full_name,
      email,
      role: 'faculty',
      phone,
      address,
      is_active: true
    })

  if (profileError) {
    // Cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authUser.user.id)
    throw new Error(`Profile creation failed: ${profileError.message}`)
  }

  // Create faculty record
  const { data: faculty, error: facultyError } = await supabase
    .from('faculty')
    .insert({
      id: authUser.user.id,
      employee_id: finalEmployeeId,
      department_id,
      campus_id,
      position,
      qualification,
      specialization,
      hire_date,
      emergency_contact_name,
      emergency_contact_phone,
      status: 'active'
    })
    .select(`
      *,
      profile:profiles(*),
      department:departments(*),
      campus:campuses(*)
    `)
    .single()

  if (facultyError) {
    // Cleanup if faculty creation fails
    await supabase.auth.admin.deleteUser(authUser.user.id)
    throw new Error(`Faculty creation failed: ${facultyError.message}`)
  }

  // Create notification for admin
  await createNotification(supabase, {
    recipient_id: null, // Admin notification
    title: 'New Faculty Member Added',
    message: `${full_name} has been added as a new faculty member with ID ${finalEmployeeId}`,
    type: 'faculty_created',
    metadata: { faculty_id: faculty.id }
  })

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: faculty,
      message: 'Faculty member created successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateFaculty(supabase, data) {
  const { faculty_id, updates } = data

  // Update faculty record
  const { data: faculty, error: facultyError } = await supabase
    .from('faculty')
    .update(updates)
    .eq('id', faculty_id)
    .select(`
      *,
      profile:profiles(*),
      department:departments(*),
      campus:campuses(*)
    `)
    .single()

  if (facultyError) {
    throw new Error(`Faculty update failed: ${facultyError.message}`)
  }

  // Update profile if needed
  if (updates.phone || updates.address) {
    await supabase
      .from('profiles')
      .update({
        phone: updates.phone,
        address: updates.address
      })
      .eq('id', faculty_id)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: faculty,
      message: 'Faculty member updated successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function assignCourses(supabase, data) {
  const { faculty_id, course_assignments } = data

  // Validate faculty exists
  const { data: faculty } = await supabase
    .from('faculty')
    .select('id, employee_id')
    .eq('id', faculty_id)
    .single()

  if (!faculty) {
    throw new Error('Faculty member not found')
  }

  // Process course assignments
  const assignments = []
  for (const assignment of course_assignments) {
    const { course_offering_id, role = 'instructor' } = assignment

    // Check if course offering exists and is not already assigned
    const { data: offering } = await supabase
      .from('course_offerings')
      .select('id, instructor_id')
      .eq('id', course_offering_id)
      .single()

    if (!offering) {
      throw new Error(`Course offering ${course_offering_id} not found`)
    }

    if (offering.instructor_id && role === 'instructor') {
      throw new Error(`Course offering ${course_offering_id} already has an instructor`)
    }

    // Assign course
    const { data: updatedOffering, error } = await supabase
      .from('course_offerings')
      .update({ instructor_id: faculty_id })
      .eq('id', course_offering_id)
      .select(`
        *,
        course:courses(*),
        campus:campuses(name)
      `)
      .single()

    if (error) {
      throw new Error(`Failed to assign course: ${error.message}`)
    }

    assignments.push(updatedOffering)
  }

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert({
      table_name: 'course_offerings',
      operation: 'UPDATE',
      old_values: {},
      new_values: { instructor_id: faculty_id },
      user_id: faculty_id,
      metadata: { action: 'course_assignment', assignments: assignments.length }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: assignments,
      message: `Successfully assigned ${assignments.length} courses`
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getFacultyWorkload(supabase, data) {
  const { faculty_id, semester, year } = data

  // Get faculty course assignments
  const { data: courseOfferings, error } = await supabase
    .from('course_offerings')
    .select(`
      *,
      course:courses(*),
      enrollments(count),
      room:rooms(*)
    `)
    .eq('instructor_id', faculty_id)
    .eq('semester', semester)
    .eq('year', year)

  if (error) {
    throw new Error(`Failed to fetch workload: ${error.message}`)
  }

  // Calculate workload metrics
  const totalCourses = courseOfferings.length
  const totalCredits = courseOfferings.reduce((sum, offering) => sum + offering.course.credits, 0)
  const totalStudents = courseOfferings.reduce((sum, offering) => sum + (offering.enrollments[0]?.count || 0), 0)

  // Get teaching schedule
  const scheduleData = courseOfferings.map(offering => ({
    course_code: offering.course.course_code,
    course_name: offering.course.name,
    section: offering.section,
    schedule: offering.schedule,
    room: offering.room?.name,
    enrolled_students: offering.enrollments[0]?.count || 0,
    max_capacity: offering.max_capacity
  }))

  const workload = {
    faculty_id,
    semester,
    year,
    summary: {
      total_courses: totalCourses,
      total_credits: totalCredits,
      total_students: totalStudents,
      average_class_size: totalStudents / totalCourses || 0
    },
    schedule: scheduleData
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: workload
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createSchedule(supabase, data) {
  const { course_offerings } = data

  const createdOfferings = []
  const conflicts = []

  for (const offering of course_offerings) {
    try {
      // Check for scheduling conflicts
      const conflict = await checkScheduleConflict(supabase, offering)
      if (conflict) {
        conflicts.push({
          offering,
          conflict: conflict.message
        })
        continue
      }

      // Create course offering
      const { data: newOffering, error } = await supabase
        .from('course_offerings')
        .insert(offering)
        .select(`
          *,
          course:courses(*),
          instructor:faculty(*, profile:profiles(*)),
          room:rooms(*)
        `)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      createdOfferings.push(newOffering)

    } catch (error) {
      conflicts.push({
        offering,
        conflict: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: {
        created: createdOfferings,
        conflicts,
        summary: {
          total_requested: course_offerings.length,
          successfully_created: createdOfferings.length,
          conflicts: conflicts.length
        }
      }
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper Functions

async function generateEmployeeId(supabase, campus_id) {
  // Get campus code
  const { data: campus } = await supabase
    .from('campuses')
    .select('code')
    .eq('id', campus_id)
    .single()

  const campusCode = campus?.code || 'UNI'
  
  // Get next employee number
  const { data: lastEmployee } = await supabase
    .from('faculty')
    .select('employee_id')
    .like('employee_id', `${campusCode}F%`)
    .order('employee_id', { ascending: false })
    .limit(1)
    .single()

  let nextNumber = 1
  if (lastEmployee) {
    const currentNumber = parseInt(lastEmployee.employee_id.replace(`${campusCode}F`, ''))
    nextNumber = currentNumber + 1
  }

  return `${campusCode}F${nextNumber.toString().padStart(4, '0')}`
}

async function checkScheduleConflict(supabase, offering) {
  const { instructor_id, room_id, schedule, semester, year } = offering

  // Check instructor conflict
  if (instructor_id) {
    const { data: instructorConflicts } = await supabase
      .from('course_offerings')
      .select('id, course:courses(course_code)')
      .eq('instructor_id', instructor_id)
      .eq('semester', semester)
      .eq('year', year)
      .overlaps('schedule', schedule)

    if (instructorConflicts && instructorConflicts.length > 0) {
      return {
        type: 'instructor_conflict',
        message: `Instructor has conflicting schedule with course ${instructorConflicts[0].course.course_code}`
      }
    }
  }

  // Check room conflict
  if (room_id) {
    const { data: roomConflicts } = await supabase
      .from('course_offerings')
      .select('id, course:courses(course_code)')
      .eq('room_id', room_id)
      .eq('semester', semester)
      .eq('year', year)
      .overlaps('schedule', schedule)

    if (roomConflicts && roomConflicts.length > 0) {
      return {
        type: 'room_conflict',
        message: `Room is already booked for course ${roomConflicts[0].course.course_code}`
      }
    }
  }

  return null
}

async function createNotification(supabase, notification) {
  await supabase
    .from('notifications')
    .insert({
      ...notification,
      created_at: new Date().toISOString()
    })
}