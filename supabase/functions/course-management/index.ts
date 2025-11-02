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
      case 'create-course':
        return await createCourse(supabaseClient, data)
      case 'update-course':
        return await updateCourse(supabaseClient, data)
      case 'create-course-offering':
        return await createCourseOffering(supabaseClient, data)
      case 'manage-prerequisites':
        return await managePrerequisites(supabaseClient, data)
      case 'get-course-analytics':
        return await getCourseAnalytics(supabaseClient, data)
      case 'bulk-create-offerings':
        return await bulkCreateOfferings(supabaseClient, data)
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

async function createCourse(supabase, data) {
  const {
    course_code,
    name,
    description,
    credits,
    department_id,
    level,
    type,
    is_lab,
    lab_credits,
    prerequisites
  } = data

  // Validate course code uniqueness
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('course_code', course_code)
    .single()

  if (existingCourse) {
    throw new Error(`Course with code ${course_code} already exists`)
  }

  // Create course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert({
      course_code,
      name,
      description,
      credits,
      department_id,
      level,
      type,
      is_lab,
      lab_credits: is_lab ? lab_credits : null,
      is_active: true
    })
    .select(`
      *,
      department:departments(*)
    `)
    .single()

  if (courseError) {
    throw new Error(`Course creation failed: ${courseError.message}`)
  }

  // Add prerequisites if provided
  if (prerequisites && prerequisites.length > 0) {
    const prerequisiteInserts = prerequisites.map(prereq_id => ({
      course_id: course.id,
      prerequisite_course_id: prereq_id
    }))

    const { error: prereqError } = await supabase
      .from('course_prerequisites')
      .insert(prerequisiteInserts)

    if (prereqError) {
      console.error('Failed to add prerequisites:', prereqError)
    }
  }

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert({
      table_name: 'courses',
      operation: 'INSERT',
      old_values: {},
      new_values: course,
      metadata: { action: 'course_created' }
    })

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: course,
      message: 'Course created successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateCourse(supabase, data) {
  const { course_id, updates } = data

  // Update course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', course_id)
    .select(`
      *,
      department:departments(*)
    `)
    .single()

  if (courseError) {
    throw new Error(`Course update failed: ${courseError.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: course,
      message: 'Course updated successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createCourseOffering(supabase, data) {
  const {
    course_id,
    instructor_id,
    semester,
    year,
    section,
    max_capacity,
    room_id,
    schedule,
    campus_id
  } = data

  // Validate course exists
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', course_id)
    .single()

  if (!course) {
    throw new Error('Course not found')
  }

  // Check for schedule conflicts
  const conflict = await checkOfferingConflicts(supabase, {
    instructor_id,
    room_id,
    schedule,
    semester,
    year
  })

  if (conflict) {
    throw new Error(conflict)
  }

  // Create course offering
  const { data: offering, error: offeringError } = await supabase
    .from('course_offerings')
    .insert({
      course_id,
      instructor_id,
      semester,
      year,
      section,
      max_capacity,
      room_id,
      schedule,
      campus_id,
      is_active: true,
      enrollment_status: 'open'
    })
    .select(`
      *,
      course:courses(*),
      instructor:faculty(*, profile:profiles(*)),
      room:rooms(*),
      campus:campuses(*)
    `)
    .single()

  if (offeringError) {
    throw new Error(`Course offering creation failed: ${offeringError.message}`)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: offering,
      message: 'Course offering created successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function managePrerequisites(supabase, data) {
  const { course_id, prerequisites } = data

  // Remove existing prerequisites
  await supabase
    .from('course_prerequisites')
    .delete()
    .eq('course_id', course_id)

  // Add new prerequisites
  if (prerequisites && prerequisites.length > 0) {
    const prerequisiteInserts = prerequisites.map(prereq_id => ({
      course_id,
      prerequisite_course_id: prereq_id
    }))

    const { error } = await supabase
      .from('course_prerequisites')
      .insert(prerequisiteInserts)

    if (error) {
      throw new Error(`Failed to update prerequisites: ${error.message}`)
    }
  }

  // Get updated course with prerequisites
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      prerequisites:course_prerequisites(
        prerequisite_course:courses(*)
      )
    `)
    .eq('id', course_id)
    .single()

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: course,
      message: 'Prerequisites updated successfully'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getCourseAnalytics(supabase, data) {
  const { course_id, time_period = 'current' } = data

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      department:departments(*)
    `)
    .eq('id', course_id)
    .single()

  if (!course) {
    throw new Error('Course not found')
  }

  // Get offering statistics
  let offeringsQuery = supabase
    .from('course_offerings')
    .select(`
      *,
      enrollments(
        count,
        status,
        grade,
        student:students(current_year)
      )
    `)
    .eq('course_id', course_id)

  // Apply time period filter
  if (time_period === 'current') {
    const currentYear = new Date().getFullYear()
    offeringsQuery = offeringsQuery.eq('year', currentYear)
  }

  const { data: offerings } = await offeringsQuery

  // Calculate analytics
  const analytics = {
    course_info: course,
    offerings_summary: {
      total_offerings: offerings.length,
      current_active: offerings.filter(o => o.is_active).length,
      total_capacity: offerings.reduce((sum, o) => sum + o.max_capacity, 0)
    },
    enrollment_analytics: calculateEnrollmentAnalytics(offerings),
    grade_distribution: calculateGradeDistribution(offerings),
    year_wise_enrollment: calculateYearWiseEnrollment(offerings)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: analytics
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function bulkCreateOfferings(supabase, data) {
  const { offerings, semester, year } = data

  const results = {
    created: [],
    failed: [],
    conflicts: []
  }

  for (const offering of offerings) {
    try {
      // Check for conflicts
      const conflict = await checkOfferingConflicts(supabase, {
        ...offering,
        semester,
        year
      })

      if (conflict) {
        results.conflicts.push({
          offering,
          reason: conflict
        })
        continue
      }

      // Create offering
      const { data: newOffering, error } = await supabase
        .from('course_offerings')
        .insert({
          ...offering,
          semester,
          year,
          is_active: true,
          enrollment_status: 'open'
        })
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

      results.created.push(newOffering)

    } catch (error) {
      results.failed.push({
        offering,
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: results,
      summary: {
        total_requested: offerings.length,
        successfully_created: results.created.length,
        failed: results.failed.length,
        conflicts: results.conflicts.length
      }
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper Functions

async function checkOfferingConflicts(supabase, offering) {
  const { instructor_id, room_id, schedule, semester, year } = offering

  // Check instructor conflict
  if (instructor_id) {
    const { data: instructorConflicts } = await supabase
      .from('course_offerings')
      .select('id, course:courses(course_code)')
      .eq('instructor_id', instructor_id)
      .eq('semester', semester)
      .eq('year', year)
      .contains('schedule', schedule)

    if (instructorConflicts && instructorConflicts.length > 0) {
      return `Instructor schedule conflict with ${instructorConflicts[0].course.course_code}`
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
      .contains('schedule', schedule)

    if (roomConflicts && roomConflicts.length > 0) {
      return `Room conflict with ${roomConflicts[0].course.course_code}`
    }
  }

  return null
}

function calculateEnrollmentAnalytics(offerings) {
  let totalEnrolled = 0
  let totalCapacity = 0
  let completedEnrollments = 0
  let droppedEnrollments = 0

  offerings.forEach(offering => {
    const enrollments = offering.enrollments || []
    totalCapacity += offering.max_capacity
    
    enrollments.forEach(enrollment => {
      totalEnrolled++
      if (enrollment.status === 'completed') {
        completedEnrollments++
      } else if (enrollment.status === 'dropped') {
        droppedEnrollments++
      }
    })
  })

  return {
    total_enrolled: totalEnrolled,
    total_capacity: totalCapacity,
    capacity_utilization: totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0,
    completion_rate: totalEnrolled > 0 ? (completedEnrollments / totalEnrolled) * 100 : 0,
    drop_rate: totalEnrolled > 0 ? (droppedEnrollments / totalEnrolled) * 100 : 0
  }
}

function calculateGradeDistribution(offerings) {
  const gradeCount = {}
  
  offerings.forEach(offering => {
    const enrollments = offering.enrollments || []
    enrollments.forEach(enrollment => {
      if (enrollment.grade) {
        gradeCount[enrollment.grade] = (gradeCount[enrollment.grade] || 0) + 1
      }
    })
  })

  return gradeCount
}

function calculateYearWiseEnrollment(offerings) {
  const yearWiseData = {}
  
  offerings.forEach(offering => {
    const enrollments = offering.enrollments || []
    enrollments.forEach(enrollment => {
      if (enrollment.student && enrollment.student.current_year) {
        const year = enrollment.student.current_year
        yearWiseData[year] = (yearWiseData[year] || 0) + 1
      }
    })
  })

  return yearWiseData
}