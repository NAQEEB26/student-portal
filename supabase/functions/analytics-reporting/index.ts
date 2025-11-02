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
      case 'enrollment-analytics':
        return await getEnrollmentAnalytics(supabaseClient, data)
      case 'academic-performance':
        return await getAcademicPerformance(supabaseClient, data)
      case 'campus-metrics':
        return await getCampusMetrics(supabaseClient, data)
      case 'faculty-analytics':
        return await getFacultyAnalytics(supabaseClient, data)
      case 'financial-summary':
        return await getFinancialSummary(supabaseClient, data)
      case 'trend-analysis':
        return await getTrendAnalysis(supabaseClient, data)
      case 'export-data':
        return await exportData(supabaseClient, data)
      case 'generate-report':
        return await generateReport(supabaseClient, data)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Analytics Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Enrollment Analytics
async function getEnrollmentAnalytics(supabase, data) {
  const { timeframe = '1year', campus_id, program_id } = data

  try {
    const startDate = getStartDate(timeframe)
    
    // Base query for enrollments
    let enrollmentQuery = supabase
      .from('enrollments')
      .select(`
        *,
        student:students(*,profile:profiles(*),campus:campuses(name),program:academic_programs(name)),
        course_offering:course_offerings(*,course:courses(name,credits))
      `)
      .gte('enrollment_date', startDate)

    if (campus_id) {
      enrollmentQuery = enrollmentQuery.eq('student.campus_id', campus_id)
    }

    const { data: enrollments, error } = await enrollmentQuery

    if (error) throw error

    // Calculate metrics
    const analytics = {
      totalEnrollments: enrollments.length,
      enrollmentsByStatus: calculateByStatus(enrollments),
      enrollmentsByMonth: calculateByMonth(enrollments),
      enrollmentsByProgram: calculateByProgram(enrollments),
      enrollmentsByCampus: calculateByCampus(enrollments),
      averageEnrollmentsPerStudent: calculateAverageEnrollments(enrollments),
      completionRate: calculateCompletionRate(enrollments),
      dropoutRate: calculateDropoutRate(enrollments),
      topPerformingPrograms: getTopPerformingPrograms(enrollments),
      enrollmentTrends: getEnrollmentTrends(enrollments, timeframe)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analytics,
        timeframe,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Enrollment analytics failed: ${error.message}`)
  }
}

// Academic Performance Analytics
async function getAcademicPerformance(supabase, data) {
  const { timeframe = '1year', campus_id, program_id, student_id } = data

  try {
    const startDate = getStartDate(timeframe)
    
    // Get grades data
    let gradesQuery = supabase
      .from('grades')
      .select(`
        *,
        enrollment:enrollments(*,
          student:students(*,profile:profiles(*),campus:campuses(name),program:academic_programs(name)),
          course_offering:course_offerings(*,course:courses(name,credits,level))
        )
      `)
      .gte('created_at', startDate)

    if (student_id) {
      gradesQuery = gradesQuery.eq('enrollment.student_id', student_id)
    }

    const { data: grades, error } = await gradesQuery

    if (error) throw error

    // Calculate academic metrics
    const analytics = {
      totalGrades: grades.length,
      averageGPA: calculateAverageGPA(grades),
      gradeDistribution: calculateGradeDistribution(grades),
      performanceByProgram: calculatePerformanceByProgram(grades),
      performanceByCampus: calculatePerformanceByCampus(grades),
      performanceByLevel: calculatePerformanceByLevel(grades),
      passingRate: calculatePassingRate(grades),
      honorsStudents: getHonorsStudents(grades),
      atRiskStudents: getAtRiskStudents(grades),
      improvementTrends: getImprovementTrends(grades, timeframe)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analytics,
        timeframe,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Academic performance analytics failed: ${error.message}`)
  }
}

// Campus Metrics
async function getCampusMetrics(supabase, data) {
  const { campus_id } = data

  try {
    // Get campus overview
    const { data: campus, error: campusError } = await supabase
      .from('campuses')
      .select('*')
      .eq('id', campus_id)
      .single()

    if (campusError) throw campusError

    // Get student count
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('campus_id', campus_id)
      .eq('status', 'active')

    // Get faculty count
    const { count: facultyCount } = await supabase
      .from('faculty')
      .select('*', { count: 'exact', head: true })
      .eq('campus_id', campus_id)
      .eq('status', 'active')

    // Get department count
    const { count: departmentCount } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true })
      .eq('campus_id', campus_id)
      .eq('is_active', true)

    // Get program count
    const { count: programCount } = await supabase
      .from('academic_programs')
      .select('*', { count: 'exact', head: true })
      .eq('campus_id', campus_id)
      .eq('is_active', true)

    // Get current enrollments
    const { count: enrollmentCount } = await supabase
      .from('enrollments')
      .select('*, student:students!inner(campus_id)', { count: 'exact', head: true })
      .eq('student.campus_id', campus_id)
      .eq('status', 'enrolled')

    // Calculate utilization
    const utilizationRate = campus.total_capacity > 0 ? 
      (studentCount / campus.total_capacity) * 100 : 0

    const metrics = {
      campus: campus,
      totalStudents: studentCount,
      totalFaculty: facultyCount,
      totalDepartments: departmentCount,
      totalPrograms: programCount,
      currentEnrollments: enrollmentCount,
      capacityUtilization: utilizationRate,
      studentToFacultyRatio: facultyCount > 0 ? (studentCount / facultyCount).toFixed(2) : 0,
      averageEnrollmentsPerProgram: programCount > 0 ? (enrollmentCount / programCount).toFixed(2) : 0
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: metrics,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Campus metrics failed: ${error.message}`)
  }
}

// Faculty Analytics
async function getFacultyAnalytics(supabase, data) {
  const { timeframe = '1year', campus_id, department_id } = data

  try {
    // Get faculty data
    let facultyQuery = supabase
      .from('faculty')
      .select(`
        *,
        profile:profiles(*),
        department:departments(name),
        campus:campuses(name),
        course_offerings:course_offerings(count)
      `)

    if (campus_id) {
      facultyQuery = facultyQuery.eq('campus_id', campus_id)
    }

    if (department_id) {
      facultyQuery = facultyQuery.eq('department_id', department_id)
    }

    const { data: faculty, error } = await facultyQuery

    if (error) throw error

    // Calculate faculty metrics
    const analytics = {
      totalFaculty: faculty.length,
      facultyByPosition: calculateFacultyByPosition(faculty),
      facultyByDepartment: calculateFacultyByDepartment(faculty),
      facultyByCampus: calculateFacultyByCampus(faculty),
      averageExperience: calculateAverageExperience(faculty),
      tenuredPercentage: calculateTenuredPercentage(faculty),
      teachingLoad: calculateTeachingLoad(faculty),
      facultyPerformance: calculateFacultyPerformance(faculty),
      facultyRetention: calculateFacultyRetention(faculty, timeframe)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analytics,
        timeframe,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Faculty analytics failed: ${error.message}`)
  }
}

// Financial Summary
async function getFinancialSummary(supabase, data) {
  const { timeframe = '1year', campus_id } = data

  try {
    const startDate = getStartDate(timeframe)
    
    // Get enrollment data for revenue calculation
    let enrollmentQuery = supabase
      .from('enrollments')
      .select(`
        *,
        course_offering:course_offerings(*,course:courses(fees)),
        student:students(campus_id)
      `)
      .gte('enrollment_date', startDate)

    if (campus_id) {
      enrollmentQuery = enrollmentQuery.eq('student.campus_id', campus_id)
    }

    const { data: enrollments, error } = await enrollmentQuery

    if (error) throw error

    // Calculate financial metrics
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course_offering?.course?.fees || 0)
    }, 0)

    const revenueByMonth = calculateRevenueByMonth(enrollments)
    const revenueByProgram = calculateRevenueByProgram(enrollments)

    const analytics = {
      totalRevenue,
      totalEnrollments: enrollments.length,
      averageRevenuePerEnrollment: enrollments.length > 0 ? totalRevenue / enrollments.length : 0,
      revenueByMonth,
      revenueByProgram,
      projectedAnnualRevenue: projectAnnualRevenue(revenueByMonth),
      revenueGrowth: calculateRevenueGrowth(revenueByMonth)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analytics,
        timeframe,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Financial summary failed: ${error.message}`)
  }
}

// Trend Analysis
async function getTrendAnalysis(supabase, data) {
  const { metric, timeframe = '2years', campus_id } = data

  try {
    const analytics = {}

    switch (metric) {
      case 'enrollment':
        analytics.enrollmentTrends = await getEnrollmentTrendData(supabase, timeframe, campus_id)
        break
      case 'performance':
        analytics.performanceTrends = await getPerformanceTrendData(supabase, timeframe, campus_id)
        break
      case 'faculty':
        analytics.facultyTrends = await getFacultyTrendData(supabase, timeframe, campus_id)
        break
      default:
        // Get all trends
        analytics.enrollmentTrends = await getEnrollmentTrendData(supabase, timeframe, campus_id)
        analytics.performanceTrends = await getPerformanceTrendData(supabase, timeframe, campus_id)
        analytics.facultyTrends = await getFacultyTrendData(supabase, timeframe, campus_id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analytics,
        metric,
        timeframe,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Trend analysis failed: ${error.message}`)
  }
}

// Export Data
async function exportData(supabase, data) {
  const { type, format = 'csv', filters = {} } = data

  try {
    let exportData = []
    let filename = ''

    switch (type) {
      case 'students':
        exportData = await exportStudentData(supabase, filters)
        filename = `students_export_${Date.now()}.${format}`
        break
      case 'faculty':
        exportData = await exportFacultyData(supabase, filters)
        filename = `faculty_export_${Date.now()}.${format}`
        break
      case 'enrollments':
        exportData = await exportEnrollmentData(supabase, filters)
        filename = `enrollments_export_${Date.now()}.${format}`
        break
      case 'grades':
        exportData = await exportGradeData(supabase, filters)
        filename = `grades_export_${Date.now()}.${format}`
        break
      default:
        throw new Error('Invalid export type')
    }

    // Convert to requested format
    const formattedData = format === 'csv' ? 
      convertToCSV(exportData) : 
      JSON.stringify(exportData, null, 2)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formattedData,
        filename,
        recordCount: exportData.length,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Data export failed: ${error.message}`)
  }
}

// Generate Report
async function generateReport(supabase, data) {
  const { reportType, parameters = {} } = data

  try {
    let report = {}

    switch (reportType) {
      case 'comprehensive':
        report = await generateComprehensiveReport(supabase, parameters)
        break
      case 'academic':
        report = await generateAcademicReport(supabase, parameters)
        break
      case 'administrative':
        report = await generateAdministrativeReport(supabase, parameters)
        break
      default:
        throw new Error('Invalid report type')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: report,
        reportType,
        generated_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Report generation failed: ${error.message}`)
  }
}

// Helper Functions

function getStartDate(timeframe) {
  const now = new Date()
  switch (timeframe) {
    case '1month':
      return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
    case '3months':
      return new Date(now.setMonth(now.getMonth() - 3)).toISOString()
    case '6months':
      return new Date(now.setMonth(now.getMonth() - 6)).toISOString()
    case '1year':
      return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
    case '2years':
      return new Date(now.setFullYear(now.getFullYear() - 2)).toISOString()
    default:
      return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
  }
}

function calculateByStatus(enrollments) {
  return enrollments.reduce((acc, enrollment) => {
    acc[enrollment.status] = (acc[enrollment.status] || 0) + 1
    return acc
  }, {})
}

function calculateByMonth(enrollments) {
  return enrollments.reduce((acc, enrollment) => {
    const month = new Date(enrollment.enrollment_date).toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})
}

function calculateByProgram(enrollments) {
  return enrollments.reduce((acc, enrollment) => {
    const program = enrollment.student?.program?.name || 'Unknown'
    acc[program] = (acc[program] || 0) + 1
    return acc
  }, {})
}

function calculateByCampus(enrollments) {
  return enrollments.reduce((acc, enrollment) => {
    const campus = enrollment.student?.campus?.name || 'Unknown'
    acc[campus] = (acc[campus] || 0) + 1
    return acc
  }, {})
}

function calculateAverageGPA(grades) {
  const validGrades = grades.filter(g => g.grade_points !== null)
  if (validGrades.length === 0) return 0
  
  const totalPoints = validGrades.reduce((sum, grade) => sum + grade.grade_points, 0)
  return (totalPoints / validGrades.length).toFixed(2)
}

function calculateGradeDistribution(grades) {
  return grades.reduce((acc, grade) => {
    const letter = grade.final_grade || 'No Grade'
    acc[letter] = (acc[letter] || 0) + 1
    return acc
  }, {})
}

function convertToCSV(data) {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n')
  
  return csvContent
}

// Additional helper functions would be implemented here for other calculations...