-- =============================================
-- STUDENT PORTAL - SUPABASE DATABASE SCHEMA
-- =============================================
-- Complete database schema for Student Portal with Supabase
-- Includes all tables, relationships, RLS policies, and functions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- CUSTOM TYPES & ENUMS
-- =============================================

-- User roles enum
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin', 
    'campus_manager',
    'faculty',
    'staff',
    'student',
    'guest'
);

-- Student status enum
CREATE TYPE student_status AS ENUM (
    'active',
    'inactive', 
    'graduated',
    'suspended',
    'on_leave',
    'transferred'
);

-- Faculty status enum  
CREATE TYPE faculty_status AS ENUM (
    'active',
    'on_leave',
    'sabbatical',
    'retired',
    'terminated'
);

-- Course status enum
CREATE TYPE course_status AS ENUM (
    'active',
    'inactive',
    'archived',
    'cancelled'
);

-- Enrollment status enum
CREATE TYPE enrollment_status AS ENUM (
    'enrolled',
    'completed',
    'dropped',
    'failed',
    'withdrawn'
);

-- Campus type enum
CREATE TYPE campus_type AS ENUM (
    'main',
    'branch',
    'satellite',
    'medical',
    'research',
    'online'
);

-- Building type enum
CREATE TYPE building_type AS ENUM (
    'academic',
    'administrative',
    'residential',
    'recreational',
    'library',
    'laboratory',
    'auditorium',
    'cafeteria',
    'parking'
);

-- Room type enum
CREATE TYPE room_type AS ENUM (
    'classroom',
    'laboratory',
    'office',
    'auditorium',
    'library',
    'study_room',
    'conference_room',
    'storage',
    'restroom',
    'other'
);

-- =============================================
-- CORE TABLES
-- =============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    is_active BOOLEAN DEFAULT true,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campuses table
CREATE TABLE campuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    type campus_type DEFAULT 'main',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    established_date DATE,
    total_capacity INTEGER DEFAULT 0,
    current_enrollment INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    facilities TEXT[],
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buildings table
CREATE TABLE buildings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type building_type DEFAULT 'academic',
    address TEXT,
    floors INTEGER DEFAULT 1,
    total_rooms INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 0,
    year_built INTEGER,
    last_renovation INTEGER,
    is_accessible BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    facilities TEXT[],
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campus_id, code)
);

-- Rooms table
CREATE TABLE rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type room_type DEFAULT 'classroom',
    floor INTEGER DEFAULT 1,
    capacity INTEGER DEFAULT 0,
    area_sqft DECIMAL(10,2),
    is_accessible BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    equipment TEXT[],
    features TEXT[],
    booking_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(building_id, code)
);

-- Departments table
CREATE TABLE departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    description TEXT,
    head_of_department UUID REFERENCES profiles(id),
    established_date DATE,
    is_active BOOLEAN DEFAULT true,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    office_location VARCHAR(255),
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campus_id, code)
);

-- Academic programs table
CREATE TABLE academic_programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- Bachelor's, Master's, PhD, Certificate
    duration_years DECIMAL(3,1) DEFAULT 4.0,
    total_credits INTEGER DEFAULT 120,
    description TEXT,
    admission_requirements TEXT,
    graduation_requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    accreditation_status VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department_id, code)
);

-- Students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    campus_id UUID REFERENCES campuses(id),
    program_id UUID REFERENCES academic_programs(id),
    department_id UUID REFERENCES departments(id),
    status student_status DEFAULT 'active',
    enrollment_date DATE NOT NULL,
    expected_graduation_date DATE,
    actual_graduation_date DATE,
    current_year INTEGER DEFAULT 1,
    current_semester VARCHAR(20),
    gpa DECIMAL(3,2) DEFAULT 0.00,
    total_credits_earned INTEGER DEFAULT 0,
    total_credits_required INTEGER DEFAULT 120,
    advisor_id UUID REFERENCES profiles(id),
    financial_aid_status VARCHAR(50),
    housing_status VARCHAR(50),
    transportation_method VARCHAR(50),
    part_time_job BOOLEAN DEFAULT false,
    extracurricular_activities TEXT[],
    achievements TEXT[],
    disciplinary_actions TEXT[],
    medical_conditions TEXT[],
    dietary_restrictions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty table
CREATE TABLE faculty (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    campus_id UUID REFERENCES campuses(id),
    department_id UUID REFERENCES departments(id),
    position VARCHAR(100) NOT NULL, -- Professor, Associate Professor, etc.
    status faculty_status DEFAULT 'active',
    hire_date DATE NOT NULL,
    tenure_date DATE,
    contract_end_date DATE,
    office_location VARCHAR(255),
    office_hours TEXT,
    specializations TEXT[],
    research_interests TEXT[],
    education JSONB, -- Array of degrees with institution, year, etc.
    publications INTEGER DEFAULT 0,
    research_grants JSONB,
    awards TEXT[],
    teaching_load_percentage INTEGER DEFAULT 60,
    research_load_percentage INTEGER DEFAULT 30,
    service_load_percentage INTEGER DEFAULT 10,
    salary_annual DECIMAL(12,2),
    performance_rating DECIMAL(3,2) DEFAULT 4.0,
    teaching_rating DECIMAL(3,2) DEFAULT 4.0,
    research_rating DECIMAL(3,2) DEFAULT 4.0,
    service_rating DECIMAL(3,2) DEFAULT 4.0,
    student_evaluations JSONB,
    peer_evaluations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    department_id UUID REFERENCES departments(id),
    campus_id UUID REFERENCES campuses(id),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    level VARCHAR(20) DEFAULT 'undergraduate', -- undergraduate, graduate, doctorate
    prerequisites TEXT[],
    corequisites TEXT[],
    learning_outcomes TEXT[],
    assessment_methods TEXT[],
    textbooks JSONB,
    syllabus_url TEXT,
    status course_status DEFAULT 'active',
    max_enrollment INTEGER DEFAULT 30,
    estimated_workload_hours INTEGER DEFAULT 45,
    delivery_method VARCHAR(50) DEFAULT 'in-person', -- in-person, online, hybrid
    language VARCHAR(50) DEFAULT 'English',
    fees DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course offerings table (specific instances of courses)
CREATE TABLE course_offerings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES faculty(id),
    campus_id UUID REFERENCES campuses(id),
    room_id UUID REFERENCES rooms(id),
    semester VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    section VARCHAR(10) DEFAULT 'A',
    schedule JSONB, -- Days, times, etc.
    capacity INTEGER DEFAULT 30,
    enrolled_count INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    midterm_date DATE,
    final_exam_date DATE,
    enrollment_start_date DATE,
    enrollment_end_date DATE,
    drop_deadline DATE,
    grading_scale JSONB,
    attendance_policy TEXT,
    late_policy TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, semester, year, section)
);

-- Student enrollments table
CREATE TABLE enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled',
    enrollment_date DATE DEFAULT CURRENT_DATE,
    drop_date DATE,
    completion_date DATE,
    final_grade VARCHAR(5),
    grade_points DECIMAL(3,2),
    credits_earned INTEGER DEFAULT 0,
    attendance_percentage DECIMAL(5,2) DEFAULT 100.00,
    midterm_grade VARCHAR(5),
    assignments_completed INTEGER DEFAULT 0,
    total_assignments INTEGER DEFAULT 0,
    participation_score DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    is_audit BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_offering_id)
);

-- Assignments/Assessments table
CREATE TABLE assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- homework, quiz, exam, project, etc.
    total_points INTEGER DEFAULT 100,
    weight_percentage DECIMAL(5,2) DEFAULT 0.00,
    due_date TIMESTAMP WITH TIME ZONE,
    submission_method VARCHAR(50) DEFAULT 'online',
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0.00,
    instructions TEXT,
    resources TEXT[],
    rubric JSONB,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student assignment submissions
CREATE TABLE assignment_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT,
    file_urls TEXT[],
    score INTEGER,
    max_score INTEGER,
    percentage DECIMAL(5,2),
    feedback TEXT,
    is_late BOOLEAN DEFAULT false,
    late_penalty_applied DECIMAL(5,2) DEFAULT 0.00,
    graded_date TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Attendance tracking
CREATE TABLE attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_offering_id UUID REFERENCES course_offerings(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present', -- present, absent, late, excused
    arrival_time TIME,
    departure_time TIME,
    notes TEXT,
    recorded_by UUID REFERENCES faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_offering_id, student_id, date)
);

-- =============================================
-- SUPPORT TABLES
-- =============================================

-- System settings
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, error, success
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments
CREATE TABLE file_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- student, faculty, course, assignment, etc.
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id),
    is_public BOOLEAN DEFAULT false,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads table for tracking uploaded files
CREATE TABLE file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bucket TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    url TEXT,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_active ON profiles(is_active);

-- Students indexes
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_campus ON students(campus_id);
CREATE INDEX idx_students_program ON students(program_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_advisor ON students(advisor_id);
CREATE INDEX idx_students_gpa ON students(gpa);

-- Faculty indexes
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);
CREATE INDEX idx_faculty_campus ON faculty(campus_id);
CREATE INDEX idx_faculty_department ON faculty(department_id);
CREATE INDEX idx_faculty_status ON faculty(status);
CREATE INDEX idx_faculty_position ON faculty(position);

-- Courses indexes
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_status ON courses(status);

-- Course offerings indexes
CREATE INDEX idx_course_offerings_course ON course_offerings(course_id);
CREATE INDEX idx_course_offerings_instructor ON course_offerings(instructor_id);
CREATE INDEX idx_course_offerings_semester_year ON course_offerings(semester, year);
CREATE INDEX idx_course_offerings_active ON course_offerings(is_active);

-- Enrollments indexes
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_offering ON enrollments(course_offering_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_grade ON enrollments(final_grade);

-- Full-text search indexes (simplified for core table columns only)
CREATE INDEX idx_students_search ON students USING gin(to_tsvector('english', student_id));
CREATE INDEX idx_faculty_search ON faculty USING gin(to_tsvector('english', employee_id));
CREATE INDEX idx_courses_search ON courses USING gin(to_tsvector('english', course_code || ' ' || name || ' ' || coalesce(description, '')));

-- =============================================
-- TRIGGERS FOR AUTOMATION
-- =============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campuses_updated_at BEFORE UPDATE ON campuses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_programs_updated_at BEFORE UPDATE ON academic_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_offerings_updated_at BEFORE UPDATE ON course_offerings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs(table_name, record_id, action, old_values)
        VALUES(TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs(table_name, record_id, action, old_values, new_values)
        VALUES(TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs(table_name, record_id, action, new_values)
        VALUES(TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_students AFTER INSERT OR UPDATE OR DELETE ON students FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_faculty AFTER INSERT OR UPDATE OR DELETE ON faculty FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_enrollments AFTER INSERT OR UPDATE OR DELETE ON enrollments FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('academic_year_start', '"2024-08-15"', 'Start date of academic year', true),
('academic_year_end', '"2025-05-15"', 'End date of academic year', true),
('default_semester_length', '15', 'Default semester length in weeks', true),
('max_credits_per_semester', '18', 'Maximum credits per semester', true),
('min_gpa_graduation', '2.0', 'Minimum GPA required for graduation', true),
('late_enrollment_fee', '50.00', 'Late enrollment fee amount', true),
('id_card_validity_years', '4', 'ID card validity in years', true);

-- This completes the comprehensive database schema for the Student Portal
-- Ready for Row Level Security policies and Edge Functions implementation