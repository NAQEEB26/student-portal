// =============================================
// STUDENT MANAGEMENT EDGE FUNCTIONS
// =============================================

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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    const action = segments[segments.length - 1]

    switch (method) {
      case 'GET':
        return await handleGetRequest(supabaseClient, action, url.searchParams)
      case 'POST':
        const body = await req.json()
        return await handlePostRequest(supabaseClient, action, body)
      case 'PUT':
        const updateBody = await req.json()
        return await handlePutRequest(supabaseClient, action, updateBody)
      case 'DELETE':
        return await handleDeleteRequest(supabaseClient, action, url.searchParams)
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// =============================================
// GET REQUEST HANDLERS
// =============================================

async function handleGetRequest(supabase, action, params) {
  switch (action) {
    case 'students':
      return await getStudents(supabase, params)
    case 'student':
      return await getStudent(supabase, params.get('id'))
    case 'student-analytics':
      return await getStudentAnalytics(supabase, params)
    case 'student-transcript':
      return await getStudentTranscript(supabase, params.get('student_id'))
    case 'student-attendance':
      return await getStudentAttendance(supabase, params.get('student_id'))
    default:
      return new Response(
        JSON.stringify({ error: 'Action not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
  }
}

// =============================================
// POST REQUEST HANDLERS
// =============================================

async function handlePostRequest(supabase, action, body) {
  switch (action) {
    case 'create-student':
      return await createStudent(supabase, body)
    case 'enroll-student':
      return await enrollStudent(supabase, body)
    case 'bulk-import-students':
      return await bulkImportStudents(supabase, body)
    case 'generate-student-id':
      return await generateStudentId(supabase, body)
    case 'calculate-gpa':
      return await calculateGPA(supabase, body)
    default:
      return new Response(
        JSON.stringify({ error: 'Action not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
  }
}

// =============================================
// STUDENT CRUD OPERATIONS
// =============================================

async function getStudents(supabase, params) {
  const page = parseInt(params.get('page') || '1')
  const limit = parseInt(params.get('limit') || '50')
  const search = params.get('search')
  const campus_id = params.get('campus_id')
  const program_id = params.get('program_id')
  const status = params.get('status')
  const sort = params.get('sort') || 'created_at'
  const order = params.get('order') || 'desc'

  let query = supabase
    .from('students')
    .select(`
      *,
      profile:profiles(*),
      campus:campuses(name, code),
      program:academic_programs(name, code),
      department:departments(name, code)
    `)
    .range((page - 1) * limit, page * limit - 1)
    .order(sort, { ascending: order === 'asc' })

  // Apply filters
  if (search) {
    query = query.or(`student_id.ilike.%${search}%,profile.full_name.ilike.%${search}%`)
  }
  if (campus_id) {
    query = query.eq('campus_id', campus_id)
  }
  if (program_id) {
    query = query.eq('program_id', program_id)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getStudent(supabase, studentId) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles(*),
      campus:campuses(*),
      program:academic_programs(*),
      department:departments(*),
      advisor:faculty!advisor_id(*, profile:profiles(*)),
      enrollments(
        *,
        course_offering:course_offerings(
          *,
          course:courses(*),
          instructor:faculty(*, profile:profiles(*))
        )
      )
    `)
    .eq('id', studentId)
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createStudent(supabase, studentData) {
  const {
    profile_data,
    student_data,
    send_welcome_email = true
  } = studentData

  try {
    // Start transaction-like operations
    // 1. Create profile first
    const { data: profile, error: profileError } = await supabase.auth.admin.createUser({
      email: profile_data.email,
      email_confirm: true,
      password: profile_data.password || generateRandomPassword(),
      user_metadata: {
        full_name: profile_data.full_name,
        role: 'student'
      }
    })

    if (profileError) {
      throw new Error(`Profile creation failed: ${profileError.message}`)
    }

    // 2. Update profile table
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        full_name: profile_data.full_name,
        role: 'student',
        phone: profile_data.phone,
        address: profile_data.address,
        date_of_birth: profile_data.date_of_birth,
        emergency_contact_name: profile_data.emergency_contact_name,
        emergency_contact_phone: profile_data.emergency_contact_phone
      })
      .eq('id', profile.user.id)

    if (updateProfileError) {
      throw new Error(`Profile update failed: ${updateProfileError.message}`)
    }

    // 3. Generate student ID
    const studentId = await generateUniqueStudentId(supabase, student_data.campus_id)

    // 4. Create student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        profile_id: profile.user.id,
        student_id: studentId,
        campus_id: student_data.campus_id,
        program_id: student_data.program_id,
        department_id: student_data.department_id,
        enrollment_date: student_data.enrollment_date || new Date().toISOString().split('T')[0],
        expected_graduation_date: student_data.expected_graduation_date,
        current_year: student_data.current_year || 1,
        current_semester: student_data.current_semester,
        advisor_id: student_data.advisor_id
      })
      .select(`
        *,
        profile:profiles(*),
        campus:campuses(name),
        program:academic_programs(name)
      `)
      .single()

    if (studentError) {
      throw new Error(`Student creation failed: ${studentError.message}`)
    }

    // 5. Send welcome email if requested
    if (send_welcome_email) {
      await sendWelcomeEmail(supabase, profile.user.email, {
        name: profile_data.full_name,
        student_id: studentId,
        campus: student.campus.name,
        program: student.program.name
      })
    }

    // 6. Create notification
    await supabase
      .from('notifications')
      .insert({
        recipient_id: profile.user.id,
        title: 'Welcome to the University!',
        message: `Your student account has been created. Your student ID is ${studentId}.`,
        type: 'success'
      })

    return new Response(
      JSON.stringify({
        message: 'Student created successfully',
        data: student
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function enrollStudent(supabase, enrollmentData) {
  const {
    student_id,
    course_offering_id,
    enrollment_date = new Date().toISOString().split('T')[0]
  } = enrollmentData

  try {
    // 1. Check if course offering exists and has capacity
    const { data: offering, error: offeringError } = await supabase
      .from('course_offerings')
      .select('id, capacity, enrolled_count, enrollment_end_date')
      .eq('id', course_offering_id)
      .single()

    if (offeringError || !offering) {
      throw new Error('Course offering not found')
    }

    // Check enrollment deadline
    if (offering.enrollment_end_date && new Date(offering.enrollment_end_date) < new Date()) {
      throw new Error('Enrollment deadline has passed')
    }

    // Check capacity
    if (offering.enrolled_count >= offering.capacity) {
      throw new Error('Course is at full capacity')
    }

    // 2. Check if student is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', student_id)
      .eq('course_offering_id', course_offering_id)
      .single()

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course')
    }

    // 3. Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id,
        course_offering_id,
        enrollment_date,
        status: 'enrolled'
      })
      .select(`
        *,
        student:students(student_id, profile:profiles(full_name)),
        course_offering:course_offerings(
          *,
          course:courses(name, course_code, credits)
        )
      `)
      .single()

    if (enrollmentError) {
      throw new Error(`Enrollment failed: ${enrollmentError.message}`)
    }

    // 4. Update enrolled count
    await supabase
      .from('course_offerings')
      .update({ enrolled_count: offering.enrolled_count + 1 })
      .eq('id', course_offering_id)

    // 5. Update student's total credits
    const { data: student } = await supabase
      .from('students')
      .select('total_credits_earned')
      .eq('id', student_id)
      .single()

    await supabase
      .from('students')
      .update({
        total_credits_earned: (student.total_credits_earned || 0) + enrollment.course_offering.course.credits
      })
      .eq('id', student_id)

    return new Response(
      JSON.stringify({
        message: 'Student enrolled successfully',
        data: enrollment
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

async function generateUniqueStudentId(supabase, campusId) {
  // Get campus code
  const { data: campus } = await supabase
    .from('campuses')
    .select('code')
    .eq('id', campusId)
    .single()

  const campusCode = campus?.code || 'UNI'
  const year = new Date().getFullYear().toString().slice(-2)
  
  // Get the highest existing student ID for this campus and year
  const { data: existingStudents } = await supabase
    .from('students')
    .select('student_id')
    .like('student_id', `${campusCode}${year}%`)
    .order('student_id', { ascending: false })
    .limit(1)

  let nextNumber = 1
  if (existingStudents && existingStudents.length > 0) {
    const lastId = existingStudents[0].student_id
    const lastNumber = parseInt(lastId.slice(-4))
    nextNumber = lastNumber + 1
  }

  return `${campusCode}${year}${nextNumber.toString().padStart(4, '0')}`
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function sendWelcomeEmail(supabase, email, data) {
  // Implementation would use Supabase Edge Functions or external email service
  console.log(`Sending welcome email to ${email}`, data)
  // For now, just log - in production this would integrate with email service
}

async function calculateGPA(supabase, { student_id }) {
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      final_grade,
      grade_points,
      course_offering:course_offerings(
        course:courses(credits)
      )
    `)
    .eq('student_id', student_id)
    .eq('status', 'completed')
    .not('final_grade', 'is', null)

  if (!enrollments || enrollments.length === 0) {
    return new Response(
      JSON.stringify({ gpa: 0.0, total_credits: 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let totalPoints = 0
  let totalCredits = 0

  enrollments.forEach(enrollment => {
    const credits = enrollment.course_offering.course.credits
    const gradePoints = enrollment.grade_points || 0
    
    totalPoints += gradePoints * credits
    totalCredits += credits
  })

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  // Update student record
  await supabase
    .from('students')
    .update({
      gpa: parseFloat(gpa.toFixed(2)),
      total_credits_earned: totalCredits
    })
    .eq('id', student_id)

  return new Response(
    JSON.stringify({
      gpa: parseFloat(gpa.toFixed(2)),
      total_credits: totalCredits,
      total_grade_points: totalPoints
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}