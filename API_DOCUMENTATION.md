# Student Portal API Documentation

This document provides comprehensive API documentation for the Student Portal Supabase backend.

## Base URL

```
https://your-project-ref.supabase.co
```

## Authentication

All API requests require authentication using Supabase JWT tokens.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
apikey: <supabase_anon_key>
```

## Authentication Endpoints

### Sign In

```http
POST /auth/v1/token?grant_type=password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Sign Out

```http
POST /auth/v1/logout
```

## Edge Functions

### Student Management

#### Base URL
```
/functions/v1/student-management
```

#### Create Student

```http
POST /functions/v1/student-management
```

**Request Body:**
```json
{
  "action": "create-student",
  "email": "student@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "student_id": "STU001",
  "campus_id": "uuid",
  "program_id": "uuid",
  "department_id": "uuid",
  "phone": "+1234567890",
  "address": "123 Main St",
  "date_of_birth": "2000-01-01",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "student_id": "STU001",
    "profile": {
      "full_name": "John Doe",
      "email": "student@example.com"
    },
    "campus": {
      "name": "Main Campus"
    },
    "program": {
      "name": "Computer Science"
    }
  },
  "message": "Student created successfully"
}
```

#### Enroll Student

```http
POST /functions/v1/student-management
```

**Request Body:**
```json
{
  "action": "enroll-student",
  "student_id": "uuid",
  "course_offering_id": "uuid"
}
```

#### Calculate GPA

```http
POST /functions/v1/student-management
```

**Request Body:**
```json
{
  "action": "calculate-gpa",
  "student_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_gpa": 3.75,
    "cumulative_gpa": 3.68,
    "total_credits": 120,
    "completed_credits": 90
  }
}
```

### Faculty Management

#### Base URL
```
/functions/v1/faculty-management
```

#### Create Faculty

```http
POST /functions/v1/faculty-management
```

**Request Body:**
```json
{
  "action": "create-faculty",
  "email": "faculty@example.com",
  "password": "password123",
  "full_name": "Dr. Jane Smith",
  "employee_id": "FAC001",
  "department_id": "uuid",
  "campus_id": "uuid",
  "position": "assistant_professor",
  "qualification": "PhD Computer Science",
  "specialization": "Artificial Intelligence",
  "hire_date": "2020-08-15",
  "phone": "+1234567890",
  "address": "456 Academic Ave",
  "emergency_contact_name": "John Smith",
  "emergency_contact_phone": "+1234567891"
}
```

#### Assign Courses

```http
POST /functions/v1/faculty-management
```

**Request Body:**
```json
{
  "action": "assign-courses",
  "faculty_id": "uuid",
  "course_assignments": [
    {
      "course_offering_id": "uuid",
      "role": "instructor"
    }
  ]
}
```

#### Get Faculty Workload

```http
POST /functions/v1/faculty-management
```

**Request Body:**
```json
{
  "action": "get-faculty-workload",
  "faculty_id": "uuid",
  "semester": "fall",
  "year": 2024
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "faculty_id": "uuid",
    "semester": "fall",
    "year": 2024,
    "summary": {
      "total_courses": 3,
      "total_credits": 9,
      "total_students": 75,
      "average_class_size": 25
    },
    "schedule": [
      {
        "course_code": "CS101",
        "course_name": "Introduction to Programming",
        "section": "A",
        "schedule": {"monday": ["09:00-10:30"], "wednesday": ["09:00-10:30"]},
        "room": "CS-101",
        "enrolled_students": 30,
        "max_capacity": 35
      }
    ]
  }
}
```

### Course Management

#### Base URL
```
/functions/v1/course-management
```

#### Create Course

```http
POST /functions/v1/course-management
```

**Request Body:**
```json
{
  "action": "create-course",
  "course_code": "CS101",
  "name": "Introduction to Programming",
  "description": "Basic programming concepts",
  "credits": 3,
  "department_id": "uuid",
  "level": "undergraduate",
  "type": "lecture",
  "is_lab": false,
  "prerequisites": ["uuid1", "uuid2"]
}
```

#### Create Course Offering

```http
POST /functions/v1/course-management
```

**Request Body:**
```json
{
  "action": "create-course-offering",
  "course_id": "uuid",
  "instructor_id": "uuid",
  "semester": "fall",
  "year": 2024,
  "section": "A",
  "max_capacity": 35,
  "room_id": "uuid",
  "schedule": {
    "monday": ["09:00-10:30"],
    "wednesday": ["09:00-10:30"],
    "friday": ["09:00-10:30"]
  },
  "campus_id": "uuid"
}
```

#### Get Course Analytics

```http
POST /functions/v1/course-management
```

**Request Body:**
```json
{
  "action": "get-course-analytics",
  "course_id": "uuid",
  "time_period": "current"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_info": {
      "course_code": "CS101",
      "name": "Introduction to Programming",
      "credits": 3
    },
    "offerings_summary": {
      "total_offerings": 5,
      "current_active": 2,
      "total_capacity": 175
    },
    "enrollment_analytics": {
      "total_enrolled": 150,
      "capacity_utilization": 85.7,
      "completion_rate": 92.3,
      "drop_rate": 7.7
    },
    "grade_distribution": {
      "A": 45,
      "B": 60,
      "C": 30,
      "D": 10,
      "F": 5
    },
    "year_wise_enrollment": {
      "1": 80,
      "2": 45,
      "3": 20,
      "4": 5
    }
  }
}
```

## Database Tables API

### Students

#### Get All Students

```http
GET /rest/v1/students?select=*,profile:profiles(*),campus:campuses(name),program:academic_programs(name)
```

**Query Parameters:**
- `search`: Search by student ID or name
- `campus`: Filter by campus ID
- `program`: Filter by program ID
- `status`: Filter by student status
- `year`: Filter by current year
- `limit`: Number of records per page (default: 50)
- `offset`: Number of records to skip

#### Get Single Student

```http
GET /rest/v1/students?id=eq.{student_id}&select=*,profile:profiles(*),campus:campuses(*),program:academic_programs(*),enrollments(*)
```

#### Update Student

```http
PATCH /rest/v1/students?id=eq.{student_id}
```

**Request Body:**
```json
{
  "current_year": 2,
  "status": "active",
  "advisor_id": "uuid"
}
```

### Faculty

#### Get All Faculty

```http
GET /rest/v1/faculty?select=*,profile:profiles(*),department:departments(name),campus:campuses(name)
```

#### Get Single Faculty

```http
GET /rest/v1/faculty?id=eq.{faculty_id}&select=*,profile:profiles(*),department:departments(*),assigned_courses:course_offerings(*)
```

### Courses

#### Get All Courses

```http
GET /rest/v1/courses?select=*,department:departments(name)
```

#### Get Course with Prerequisites

```http
GET /rest/v1/courses?id=eq.{course_id}&select=*,prerequisites:course_prerequisites(prerequisite_course:courses(*))
```

### Course Offerings

#### Get Course Offerings

```http
GET /rest/v1/course_offerings?select=*,course:courses(*),instructor:faculty(*,profile:profiles(*)),room:rooms(*)
```

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by year
- `instructor_id`: Filter by instructor
- `campus_id`: Filter by campus

### Enrollments

#### Get Student Enrollments

```http
GET /rest/v1/enrollments?student_id=eq.{student_id}&select=*,course_offering:course_offerings(*,course:courses(*))
```

#### Create Enrollment

```http
POST /rest/v1/enrollments
```

**Request Body:**
```json
{
  "student_id": "uuid",
  "course_offering_id": "uuid",
  "enrollment_date": "2024-01-15",
  "status": "enrolled"
}
```

## File Storage API

### Upload File

```http
POST /storage/v1/object/{bucket_name}/{file_path}
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "Key": "bucket_name/file_path",
  "Id": "uuid"
}
```

### Get File URL

```http
GET /storage/v1/object/public/{bucket_name}/{file_path}
```

### Delete File

```http
DELETE /storage/v1/object/{bucket_name}/{file_path}
```

## Real-time Subscriptions

### Subscribe to Table Changes

```javascript
const subscription = supabase
  .channel('table-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'enrollments'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Subscribe to User Notifications

```javascript
const subscription = supabase
  .channel('user-notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `recipient_id=eq.${userId}`
  }, (payload) => {
    console.log('New notification!', payload)
  })
  .subscribe()
```

## Error Handling

### Common Error Codes

- `400`: Bad Request - Invalid request format
- `401`: Unauthorized - Invalid or missing authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Duplicate resource or constraint violation
- `500`: Internal Server Error - Server-side error

### Error Response Format

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": "Additional error details"
  }
}
```

## Rate Limiting

- **Authentication endpoints**: 60 requests per hour per IP
- **Edge Functions**: 1000 requests per minute per user
- **Database operations**: 10,000 requests per minute per user
- **Storage operations**: 1000 requests per minute per user

## Pagination

For paginated endpoints, use:

```
?limit=50&offset=0
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1500,
    "totalPages": 30
  }
}
```

## Filtering and Sorting

### Filtering

```http
GET /rest/v1/students?status=eq.active&current_year=gte.2
```

### Sorting

```http
GET /rest/v1/students?order=created_at.desc,full_name.asc
```

### Full-text Search

```http
GET /rest/v1/students?profile.full_name=ilike.*john*
```

---

**Note**: Replace `your-project-ref` with your actual Supabase project reference. All UUIDs should be replaced with actual UUID values when making requests.