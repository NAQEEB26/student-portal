-- =============================================
-- SAMPLE DATA FOR CAMPUSFLOW
-- =============================================
-- This file contains sample data for testing and development

-- Insert sample campuses
INSERT INTO campuses (id, name, code, type, address, city, state, postal_code, phone, email, established_date, total_capacity, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Main Campus', 'MAIN', 'main', '123 University Ave', 'University City', 'California', '90210', '(555) 123-4567', 'info@university.edu', '1950-09-01', 15000, 'The original campus with comprehensive facilities'),
('550e8400-e29b-41d4-a716-446655440002', 'North Campus', 'NORTH', 'branch', '456 College Blvd', 'Northville', 'California', '90211', '(555) 234-5678', 'north@university.edu', '1985-08-15', 8000, 'Satellite campus specializing in technology programs'),
('550e8400-e29b-41d4-a716-446655440003', 'Medical Campus', 'MED', 'medical', '789 Health Center Dr', 'Medtown', 'California', '90212', '(555) 345-6789', 'medical@university.edu', '1995-01-10', 3000, 'Specialized campus for medical and health sciences');

-- Insert sample buildings
INSERT INTO buildings (id, campus_id, name, code, type, floors, total_rooms, capacity, year_built, is_accessible) VALUES
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Science Hall', 'SCI', 'academic', 4, 50, 1200, 1960, true),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Library Building', 'LIB', 'library', 5, 25, 800, 1975, true),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'Administration Building', 'ADMIN', 'administrative', 3, 30, 200, 1950, true),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', 'Technology Center', 'TECH', 'academic', 3, 40, 1000, 1990, true);

-- Insert sample rooms
INSERT INTO rooms (id, building_id, campus_id, name, code, type, floor, capacity, is_accessible, equipment) VALUES
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Physics Lab 101', 'PL101', 'laboratory', 1, 30, true, '{"projector", "laboratory_equipment", "computers"}'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Lecture Hall A', 'LHA', 'classroom', 2, 150, true, '{"projector", "microphone", "whiteboard"}'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Study Room 201', 'SR201', 'study_room', 2, 20, true, '{"whiteboard", "computers"}'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', 'Computer Lab 1', 'CL1', 'laboratory', 1, 40, true, '{"computers", "projector", "software_suite"}');

-- Insert sample departments
INSERT INTO departments (id, campus_id, name, code, established_date, contact_email, contact_phone) VALUES
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CS', '1970-09-01', 'cs@university.edu', '(555) 123-1001'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440001', 'Mathematics', 'MATH', '1950-09-01', 'math@university.edu', '(555) 123-1002'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440001', 'Biology', 'BIO', '1955-09-01', 'bio@university.edu', '(555) 123-1003'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 'Business Administration', 'BUS', '1980-09-01', 'business@university.edu', '(555) 123-1004'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440003', 'Medicine', 'MED', '1995-01-10', 'medicine@university.edu', '(555) 345-2001');

-- Insert sample academic programs
INSERT INTO academic_programs (id, department_id, campus_id, name, code, degree_type, duration_years, total_credits) VALUES
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'Bachelor of Science in Computer Science', 'BSCS', 'Bachelor''s', 4.0, 120),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440001', 'Bachelor of Science in Mathematics', 'BSMATH', 'Bachelor''s', 4.0, 120),
('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440001', 'Bachelor of Science in Biology', 'BSBIO', 'Bachelor''s', 4.0, 128),
('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 'Master of Business Administration', 'MBA', 'Master''s', 2.0, 60),
('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440003', 'Doctor of Medicine', 'MD', 'Doctorate', 4.0, 160);

-- Insert sample courses
INSERT INTO courses (id, department_id, campus_id, course_code, name, description, credits, level, prerequisites) VALUES
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 3, 'undergraduate', '{}'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'CS201', 'Data Structures and Algorithms', 'Advanced programming with data structures', 4, 'undergraduate', '{"CS101"}'),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'CS301', 'Database Systems', 'Database design and SQL programming', 3, 'undergraduate', '{"CS201"}'),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440001', 'MATH101', 'Calculus I', 'Differential and integral calculus', 4, 'undergraduate', '{}'),
('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440001', 'MATH201', 'Calculus II', 'Advanced calculus and series', 4, 'undergraduate', '{"MATH101"}'),
('550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440001', 'BIO101', 'General Biology', 'Introduction to biological sciences', 4, 'undergraduate', '{}'),
('550e8400-e29b-41d4-a716-446655440057', '550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 'BUS101', 'Introduction to Business', 'Fundamentals of business operations', 3, 'undergraduate', '{}');

-- Note: You'll need to create users in Supabase Auth first, then reference their IDs
-- For now, we'll use placeholder UUIDs that should be replaced with actual auth user IDs

-- Insert sample profiles (these would normally be created through Supabase Auth)
INSERT INTO profiles (id, email, full_name, role, phone, address, date_of_birth) VALUES
-- Faculty profiles
('550e8400-e29b-41d4-a716-446655440101', 'john.smith@university.edu', 'Dr. John Smith', 'faculty', '(555) 111-1001', '123 Faculty Lane', '1975-03-15'),
('550e8400-e29b-41d4-a716-446655440102', 'jane.doe@university.edu', 'Dr. Jane Doe', 'faculty', '(555) 111-1002', '456 Professor St', '1980-07-22'),
('550e8400-e29b-41d4-a716-446655440103', 'bob.johnson@university.edu', 'Prof. Bob Johnson', 'faculty', '(555) 111-1003', '789 Academic Ave', '1970-11-08'),
-- Admin profiles
('550e8400-e29b-41d4-a716-446655440104', 'admin@university.edu', 'System Administrator', 'admin', '(555) 111-2001', '100 Admin Building', '1985-05-20'),
-- Student profiles
('550e8400-e29b-41d4-a716-446655440201', 'alice.student@university.edu', 'Alice Johnson', 'student', '(555) 222-0001', '100 Student Housing', '2003-09-15'),
('550e8400-e29b-41d4-a716-446655440202', 'bob.student@university.edu', 'Bob Wilson', 'student', '(555) 222-0002', '101 Student Housing', '2002-12-10'),
('550e8400-e29b-41d4-a716-446655440203', 'carol.student@university.edu', 'Carol Brown', 'student', '(555) 222-0003', '102 Student Housing', '2004-01-25'),
('550e8400-e29b-41d4-a716-446655440204', 'david.student@university.edu', 'David Miller', 'student', '(555) 222-0004', '103 Student Housing', '2003-06-18'),
('550e8400-e29b-41d4-a716-446655440205', 'emma.student@university.edu', 'Emma Davis', 'student', '(555) 222-0005', '104 Student Housing', '2002-11-30');

-- Insert sample faculty
INSERT INTO faculty (id, profile_id, employee_id, campus_id, department_id, position, hire_date, office_location, specializations, education, publications) VALUES
('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440101', 'FAC001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440031', 'Professor', '2010-08-15', 'Science Hall 301', '{"Artificial Intelligence", "Machine Learning", "Data Science"}', '[{"degree": "Ph.D. Computer Science", "institution": "Stanford University", "year": 2008}]', 25),
('550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440102', 'FAC002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440032', 'Associate Professor', '2015-01-10', 'Science Hall 302', '{"Statistics", "Applied Mathematics", "Data Analysis"}', '[{"degree": "Ph.D. Mathematics", "institution": "MIT", "year": 2012}]', 18),
('550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440103', 'FAC003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440033', 'Professor', '2005-09-01', 'Science Hall 303', '{"Molecular Biology", "Genetics", "Biochemistry"}', '[{"degree": "Ph.D. Biology", "institution": "Harvard University", "year": 2003}]', 32);

-- Insert sample students
INSERT INTO students (id, profile_id, student_id, campus_id, program_id, department_id, enrollment_date, current_year, current_semester, gpa) VALUES
('550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440201', 'MAIN240001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '2024-08-15', 1, 'Fall 2024', 3.75),
('550e8400-e29b-41d4-a716-446655440212', '550e8400-e29b-41d4-a716-446655440202', 'MAIN230001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '2023-08-15', 2, 'Fall 2024', 3.42),
('550e8400-e29b-41d4-a716-446655440213', '550e8400-e29b-41d4-a716-446655440203', 'MAIN240002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440032', '2024-08-15', 1, 'Fall 2024', 3.88),
('550e8400-e29b-41d4-a716-446655440214', '550e8400-e29b-41d4-a716-446655440204', 'MAIN230002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440033', '2023-08-15', 2, 'Fall 2024', 3.56),
('550e8400-e29b-41d4-a716-446655440215', '550e8400-e29b-41d4-a716-446655440205', 'MAIN220001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '2022-08-15', 3, 'Fall 2024', 3.29);

-- Insert sample course offerings
INSERT INTO course_offerings (id, course_id, instructor_id, campus_id, room_id, semester, year, section, capacity, enrolled_count, start_date, end_date) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440022', 'Fall 2024', 2024, 'A', 150, 45, '2024-08-20', '2024-12-15'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'Fall 2024', 2024, 'A', 30, 25, '2024-08-20', '2024-12-15'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440022', 'Fall 2024', 2024, 'A', 150, 67, '2024-08-20', '2024-12-15'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'Fall 2024', 2024, 'A', 30, 28, '2024-08-20', '2024-12-15');

-- Insert sample enrollments
INSERT INTO enrollments (id, student_id, course_offering_id, enrollment_date, status, final_grade, grade_points) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440301', '2024-08-15', 'enrolled', null, null),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440303', '2024-08-15', 'enrolled', null, null),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440212', '550e8400-e29b-41d4-a716-446655440302', '2024-08-15', 'enrolled', null, null),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440213', '550e8400-e29b-41d4-a716-446655440303', '2024-08-15', 'enrolled', null, null),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440214', '550e8400-e29b-41d4-a716-446655440304', '2024-08-15', 'enrolled', null, null);

-- Insert sample assignments
INSERT INTO assignments (id, course_offering_id, title, description, type, total_points, due_date, is_published) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440301', 'Hello World Program', 'Create your first Python program', 'homework', 100, '2024-09-01 23:59:00', true),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440301', 'Midterm Exam', 'Comprehensive exam on programming fundamentals', 'exam', 200, '2024-10-15 14:00:00', true),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440302', 'Binary Search Implementation', 'Implement binary search algorithm', 'homework', 150, '2024-09-15 23:59:00', true),
('550e8400-e29b-41d4-a716-446655440504', '550e8400-e29b-41d4-a716-446655440303', 'Calculus Problem Set 1', 'Derivative and integral problems', 'homework', 100, '2024-09-05 23:59:00', true);

-- Insert sample notifications
INSERT INTO notifications (recipient_id, title, message, type, priority) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'Welcome to University!', 'Your student account has been created successfully. Your student ID is MAIN240001.', 'success', 'normal'),
('550e8400-e29b-41d4-a716-446655440201', 'Assignment Due Soon', 'Hello World Program is due tomorrow at 11:59 PM.', 'warning', 'high'),
('550e8400-e29b-41d4-a716-446655440202', 'Grade Posted', 'Your grade for Assignment 1 has been posted.', 'info', 'normal'),
('550e8400-e29b-41d4-a716-446655440101', 'New Student Enrollment', 'A new student has enrolled in your CS101 course.', 'info', 'normal');

-- This completes the sample data insertion
-- Remember to update the auth user IDs with actual Supabase Auth user IDs in production