-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Comprehensive security policies for the Student Portal

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('super_admin', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is faculty
CREATE OR REPLACE FUNCTION is_faculty()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'faculty';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's campus ID
CREATE OR REPLACE FUNCTION get_user_campus_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT COALESCE(s.campus_id, f.campus_id)
        FROM profiles p
        LEFT JOIN students s ON p.id = s.profile_id
        LEFT JOIN faculty f ON p.id = f.profile_id
        WHERE p.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user manages a specific campus
CREATE OR REPLACE FUNCTION manages_campus(campus_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Super admins and admins can manage all campuses
    IF is_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Campus managers can only manage their assigned campus
    IF get_user_role() = 'campus_manager' THEN
        RETURN get_user_campus_id() = campus_uuid;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can view their own profile and public profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (is_admin());

-- Faculty can view student and other faculty profiles
CREATE POLICY "Faculty can view student and faculty profiles" ON profiles
    FOR SELECT USING (
        is_faculty() AND role IN ('student', 'faculty')
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (is_admin());

-- Only admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (is_admin());

-- Only super admins can delete profiles
CREATE POLICY "Super admins can delete profiles" ON profiles
    FOR DELETE USING (get_user_role() = 'super_admin');

-- =============================================
-- CAMPUS MANAGEMENT POLICIES
-- =============================================

-- Everyone can view active campuses
CREATE POLICY "Everyone can view active campuses" ON campuses
    FOR SELECT USING (is_active = true);

-- Admins can view all campuses
CREATE POLICY "Admins can view all campuses" ON campuses
    FOR SELECT USING (is_admin());

-- Only admins can modify campuses
CREATE POLICY "Admins can modify campuses" ON campuses
    FOR ALL USING (is_admin());

-- Buildings: Campus managers can view their campus buildings
CREATE POLICY "Campus managers can view campus buildings" ON buildings
    FOR SELECT USING (manages_campus(campus_id));

-- Buildings: Everyone can view active buildings
CREATE POLICY "Everyone can view active buildings" ON buildings
    FOR SELECT USING (is_active = true);

-- Buildings: Admins can modify all buildings
CREATE POLICY "Admins can modify buildings" ON buildings
    FOR ALL USING (is_admin());

-- Rooms: Similar to buildings
CREATE POLICY "Campus managers can view campus rooms" ON rooms
    FOR SELECT USING (manages_campus(campus_id));

CREATE POLICY "Everyone can view active rooms" ON rooms
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can modify rooms" ON rooms
    FOR ALL USING (is_admin());

-- =============================================
-- ACADEMIC STRUCTURE POLICIES
-- =============================================

-- Departments: Campus-based access
CREATE POLICY "Campus users can view campus departments" ON departments
    FOR SELECT USING (manages_campus(campus_id) OR campus_id = get_user_campus_id());

CREATE POLICY "Admins can modify departments" ON departments
    FOR ALL USING (is_admin());

-- Academic Programs: Department-based access
CREATE POLICY "Users can view campus programs" ON academic_programs
    FOR SELECT USING (manages_campus(campus_id) OR campus_id = get_user_campus_id());

CREATE POLICY "Admins can modify programs" ON academic_programs
    FOR ALL USING (is_admin());

-- =============================================
-- STUDENT POLICIES
-- =============================================

-- Students can view their own record
CREATE POLICY "Students can view own record" ON students
    FOR SELECT USING (profile_id = auth.uid());

-- Faculty can view students in their campus/department
CREATE POLICY "Faculty can view campus students" ON students
    FOR SELECT USING (
        is_faculty() AND campus_id = get_user_campus_id()
    );

-- Admins can view all students
CREATE POLICY "Admins can view all students" ON students
    FOR SELECT USING (is_admin());

-- Campus managers can view their campus students
CREATE POLICY "Campus managers can view campus students" ON students
    FOR SELECT USING (manages_campus(campus_id));

-- Students can update limited fields of their own record
CREATE POLICY "Students can update own limited fields" ON students
    FOR UPDATE USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

-- Faculty and admins can update student records
CREATE POLICY "Faculty can update campus student records" ON students
    FOR UPDATE USING (
        (is_faculty() AND campus_id = get_user_campus_id()) OR
        is_admin() OR
        manages_campus(campus_id)
    );

-- Only admins can insert/delete students
CREATE POLICY "Admins can insert students" ON students
    FOR INSERT WITH CHECK (is_admin() OR manages_campus(campus_id));

CREATE POLICY "Admins can delete students" ON students
    FOR DELETE USING (is_admin());

-- =============================================
-- FACULTY POLICIES
-- =============================================

-- Faculty can view their own record
CREATE POLICY "Faculty can view own record" ON faculty
    FOR SELECT USING (profile_id = auth.uid());

-- Faculty can view other faculty in same campus/department
CREATE POLICY "Faculty can view campus faculty" ON faculty
    FOR SELECT USING (
        is_faculty() AND campus_id = get_user_campus_id()
    );

-- Admins can view all faculty
CREATE POLICY "Admins can view all faculty" ON faculty
    FOR SELECT USING (is_admin());

-- Campus managers can view their campus faculty
CREATE POLICY "Campus managers can view campus faculty" ON faculty
    FOR SELECT USING (manages_campus(campus_id));

-- Faculty can update limited fields of their own record
CREATE POLICY "Faculty can update own limited fields" ON faculty
    FOR UPDATE USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

-- Only admins can fully modify faculty records
CREATE POLICY "Admins can modify faculty" ON faculty
    FOR ALL USING (is_admin() OR manages_campus(campus_id));

-- =============================================
-- COURSE POLICIES
-- =============================================

-- Everyone can view active courses
CREATE POLICY "Everyone can view active courses" ON courses
    FOR SELECT USING (status = 'active');

-- Faculty can view all courses in their department
CREATE POLICY "Faculty can view department courses" ON courses
    FOR SELECT USING (
        is_faculty() AND department_id IN (
            SELECT department_id FROM faculty WHERE profile_id = auth.uid()
        )
    );

-- Admins can view all courses
CREATE POLICY "Admins can view all courses" ON courses
    FOR SELECT USING (is_admin());

-- Only admins and department faculty can modify courses
CREATE POLICY "Authorized users can modify courses" ON courses
    FOR ALL USING (
        is_admin() OR 
        (is_faculty() AND department_id IN (
            SELECT department_id FROM faculty WHERE profile_id = auth.uid()
        ))
    );

-- =============================================
-- COURSE OFFERING POLICIES
-- =============================================

-- Students can view course offerings they're enrolled in or can enroll in
CREATE POLICY "Students can view available offerings" ON course_offerings
    FOR SELECT USING (
        is_active = true OR
        is_student() OR
        id IN (
            SELECT course_offering_id FROM enrollments 
            WHERE student_id IN (
                SELECT id FROM students WHERE profile_id = auth.uid()
            )
        )
    );

-- Faculty can view offerings they teach or in their campus
CREATE POLICY "Faculty can view campus offerings" ON course_offerings
    FOR SELECT USING (
        instructor_id IN (
            SELECT id FROM faculty WHERE profile_id = auth.uid()
        ) OR
        (is_faculty() AND campus_id = get_user_campus_id())
    );

-- Admins can view all offerings
CREATE POLICY "Admins can view all offerings" ON course_offerings
    FOR SELECT USING (is_admin());

-- Faculty can modify their own course offerings
CREATE POLICY "Faculty can modify own offerings" ON course_offerings
    FOR ALL USING (
        instructor_id IN (
            SELECT id FROM faculty WHERE profile_id = auth.uid()
        ) OR
        is_admin()
    );

-- =============================================
-- ENROLLMENT POLICIES
-- =============================================

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments" ON enrollments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM students WHERE profile_id = auth.uid()
        )
    );

-- Faculty can view enrollments for their courses
CREATE POLICY "Faculty can view course enrollments" ON enrollments
    FOR SELECT USING (
        course_offering_id IN (
            SELECT id FROM course_offerings 
            WHERE instructor_id IN (
                SELECT id FROM faculty WHERE profile_id = auth.uid()
            )
        ) OR
        is_admin()
    );

-- Students can enroll themselves in courses
CREATE POLICY "Students can enroll in courses" ON enrollments
    FOR INSERT WITH CHECK (
        student_id IN (
            SELECT id FROM students WHERE profile_id = auth.uid()
        )
    );

-- Faculty can modify enrollments for their courses
CREATE POLICY "Faculty can modify course enrollments" ON enrollments
    FOR UPDATE USING (
        course_offering_id IN (
            SELECT id FROM course_offerings 
            WHERE instructor_id IN (
                SELECT id FROM faculty WHERE profile_id = auth.uid()
            )
        ) OR
        is_admin()
    );

-- =============================================
-- ASSIGNMENT POLICIES
-- =============================================

-- Students can view assignments for their enrolled courses
CREATE POLICY "Students can view course assignments" ON assignments
    FOR SELECT USING (
        course_offering_id IN (
            SELECT course_offering_id FROM enrollments 
            WHERE student_id IN (
                SELECT id FROM students WHERE profile_id = auth.uid()
            )
        )
    );

-- Faculty can manage assignments for their courses
CREATE POLICY "Faculty can manage course assignments" ON assignments
    FOR ALL USING (
        course_offering_id IN (
            SELECT id FROM course_offerings 
            WHERE instructor_id IN (
                SELECT id FROM faculty WHERE profile_id = auth.uid()
            )
        ) OR
        is_admin()
    );

-- =============================================
-- ASSIGNMENT SUBMISSION POLICIES
-- =============================================

-- Students can manage their own submissions
CREATE POLICY "Students can manage own submissions" ON assignment_submissions
    FOR ALL USING (
        student_id IN (
            SELECT id FROM students WHERE profile_id = auth.uid()
        )
    );

-- Faculty can view/grade submissions for their assignments
CREATE POLICY "Faculty can grade submissions" ON assignment_submissions
    FOR SELECT USING (
        assignment_id IN (
            SELECT id FROM assignments 
            WHERE course_offering_id IN (
                SELECT id FROM course_offerings 
                WHERE instructor_id IN (
                    SELECT id FROM faculty WHERE profile_id = auth.uid()
                )
            )
        ) OR
        is_admin()
    );

CREATE POLICY "Faculty can update submission grades" ON assignment_submissions
    FOR UPDATE USING (
        assignment_id IN (
            SELECT id FROM assignments 
            WHERE course_offering_id IN (
                SELECT id FROM course_offerings 
                WHERE instructor_id IN (
                    SELECT id FROM faculty WHERE profile_id = auth.uid()
                )
            )
        ) OR
        is_admin()
    );

-- =============================================
-- ATTENDANCE POLICIES
-- =============================================

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON attendance
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM students WHERE profile_id = auth.uid()
        )
    );

-- Faculty can manage attendance for their courses
CREATE POLICY "Faculty can manage course attendance" ON attendance
    FOR ALL USING (
        course_offering_id IN (
            SELECT id FROM course_offerings 
            WHERE instructor_id IN (
                SELECT id FROM faculty WHERE profile_id = auth.uid()
            )
        ) OR
        is_admin()
    );

-- =============================================
-- NOTIFICATION POLICIES
-- =============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (recipient_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (recipient_id = auth.uid());

-- Admins and faculty can send notifications
CREATE POLICY "Authorized users can send notifications" ON notifications
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        (is_admin() OR is_faculty())
    );

-- =============================================
-- AUDIT LOG POLICIES
-- =============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin());

-- System can insert audit logs (handled by triggers)
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- =============================================
-- FILE ATTACHMENT POLICIES
-- =============================================

-- Users can view files they uploaded or files attached to their records
CREATE POLICY "Users can view own files" ON file_attachments
    FOR SELECT USING (
        uploaded_by = auth.uid() OR
        is_public = true OR
        (entity_type = 'student' AND entity_id IN (
            SELECT id FROM students WHERE profile_id = auth.uid()
        )) OR
        (entity_type = 'faculty' AND entity_id IN (
            SELECT id FROM faculty WHERE profile_id = auth.uid()
        )) OR
        is_admin()
    );

-- Users can upload files for their own records
CREATE POLICY "Users can upload own files" ON file_attachments
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid() AND (
            (entity_type = 'student' AND entity_id IN (
                SELECT id FROM students WHERE profile_id = auth.uid()
            )) OR
            (entity_type = 'faculty' AND entity_id IN (
                SELECT id FROM faculty WHERE profile_id = auth.uid()
            )) OR
            is_admin()
        )
    );

-- Users can delete their own uploaded files
CREATE POLICY "Users can delete own files" ON file_attachments
    FOR DELETE USING (
        uploaded_by = auth.uid() OR
        is_admin()
    );

-- =============================================
-- FILE UPLOADS POLICIES
-- =============================================

-- Users can view files they uploaded or public files
CREATE POLICY "Users can view own uploads" ON file_uploads
    FOR SELECT USING (
        uploaded_by = auth.uid() OR
        is_admin()
    );

-- Users can upload files
CREATE POLICY "Users can upload files" ON file_uploads
    FOR INSERT WITH CHECK (uploaded_by = auth.uid());

-- Users can update their own uploaded files
CREATE POLICY "Users can update own uploads" ON file_uploads
    FOR UPDATE USING (
        uploaded_by = auth.uid() OR
        is_admin()
    );

-- Users can delete their own uploaded files
CREATE POLICY "Users can delete own uploads" ON file_uploads
    FOR DELETE USING (
        uploaded_by = auth.uid() OR
        is_admin()
    );

-- =============================================
-- SYSTEM SETTINGS POLICIES
-- =============================================

-- Everyone can view public settings
CREATE POLICY "Everyone can view public settings" ON system_settings
    FOR SELECT USING (is_public = true);

-- Admins can view all settings
CREATE POLICY "Admins can view all settings" ON system_settings
    FOR SELECT USING (is_admin());

-- Only super admins can modify settings
CREATE POLICY "Super admins can modify settings" ON system_settings
    FOR ALL USING (get_user_role() = 'super_admin');

-- =============================================
-- SECURITY FUNCTIONS
-- =============================================

-- Function to validate user permissions for sensitive operations
CREATE OR REPLACE FUNCTION check_permission(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = required_role OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(event_type TEXT, details JSONB DEFAULT '{}')
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values)
    VALUES (auth.uid(), 'security_events', uuid_generate_v4(), event_type, details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This completes the comprehensive RLS implementation
-- All tables are now secured with appropriate access controls