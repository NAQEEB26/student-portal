/**
 * Supabase Integration for CampusFlow
 * Handles all backend communication and data management
 */

// Supabase Configuration - loaded from environment config
// Set these values via window.__ENV__ object (see config.js or your deployment env)
const SUPABASE_CONFIG = {
    url: (window.__ENV__ && window.__ENV__.SUPABASE_URL) || '',
    anonKey: (window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY) || ''
    // NOTE: Service role key must NEVER be exposed in frontend code.
    // It should only be used in server-side Edge Functions.
};

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

class SupabaseService {
    constructor() {
        this.supabase = supabase;
        this.currentUser = null;
        this.userRole = null;
        this.setupAuthStateListener();
    }

    // =============================================
    // AUTHENTICATION METHODS
    // =============================================

    setupAuthStateListener() {
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.loadUserProfile();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.userRole = null;
                localStorage.removeItem('currentUser');
            }
        });
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Load user profile and role
            await this.loadUserProfile();

            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            this.userRole = null;
            localStorage.removeItem('currentUser');

            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async loadUserProfile() {
        if (!this.currentUser) return;

        try {
            const { data: profile, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw error;

            this.userRole = profile.role;

            // Store user info in localStorage for frontend compatibility
            const userInfo = {
                id: this.currentUser.id,
                email: this.currentUser.email,
                name: profile.full_name,
                role: profile.role,
                avatar: profile.avatar_url,
                isActive: profile.is_active
            };

            localStorage.setItem('currentUser', JSON.stringify(userInfo));

            return profile;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    // =============================================
    // STUDENT MANAGEMENT METHODS
    // =============================================

    async getStudents(filters = {}) {
        try {
            let query = this.supabase
                .from('students')
                .select(`
                    *,
                    profile:profiles(*),
                    campus:campuses(name, code),
                    program:academic_programs(name, code),
                    department:departments(name, code)
                `);

            // Apply filters
            if (filters.search) {
                query = query.or(`student_id.ilike.%${filters.search}%,profile.full_name.ilike.%${filters.search}%`);
            }
            if (filters.campus) {
                query = query.eq('campus_id', filters.campus);
            }
            if (filters.program) {
                query = query.eq('program_id', filters.program);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.year) {
                query = query.eq('current_year', filters.year);
            }

            // Apply sorting
            const sortField = filters.sort || 'created_at';
            const sortOrder = filters.order === 'asc' ? { ascending: true } : { ascending: false };
            query = query.order(sortField, sortOrder);

            // Apply pagination
            const page = parseInt(filters.page || '1');
            const limit = parseInt(filters.limit || '50');
            query = query.range((page - 1) * limit, page * limit - 1);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                success: true,
                data,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            console.error('Error fetching students:', error);
            return { success: false, error: error.message };
        }
    }

    async getStudent(studentId) {
        try {
            const { data, error } = await this.supabase
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
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching student:', error);
            return { success: false, error: error.message };
        }
    }

    async createStudent(studentData) {
        try {
            // Call the Edge Function for student creation
            const { data, error } = await this.supabase.functions.invoke('student-management', {
                body: {
                    action: 'create-student',
                    ...studentData
                }
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error creating student:', error);
            return { success: false, error: error.message };
        }
    }

    async updateStudent(studentId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('students')
                .update(updates)
                .eq('id', studentId)
                .select(`
                    *,
                    profile:profiles(*),
                    campus:campuses(name),
                    program:academic_programs(name)
                `)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error updating student:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteStudent(studentId) {
        try {
            const { error } = await this.supabase
                .from('students')
                .delete()
                .eq('id', studentId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Error deleting student:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // FACULTY MANAGEMENT METHODS
    // =============================================

    async getFaculty(filters = {}) {
        try {
            let query = this.supabase
                .from('faculty')
                .select(`
                    *,
                    profile:profiles(*),
                    campus:campuses(name, code),
                    department:departments(name, code)
                `);

            // Apply filters
            if (filters.search) {
                query = query.or(`employee_id.ilike.%${filters.search}%,profile.full_name.ilike.%${filters.search}%`);
            }
            if (filters.department) {
                query = query.eq('department_id', filters.department);
            }
            if (filters.position) {
                query = query.eq('position', filters.position);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching faculty:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // COURSE MANAGEMENT METHODS
    // =============================================

    async getCourses(filters = {}) {
        try {
            let query = this.supabase
                .from('courses')
                .select(`
                    *,
                    department:departments(name, code)
                `);

            // Apply filters
            if (filters.search) {
                query = query.or(`course_code.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
            }
            if (filters.department) {
                query = query.eq('department_id', filters.department);
            }
            if (filters.level) {
                query = query.eq('level', filters.level);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching courses:', error);
            return { success: false, error: error.message };
        }
    }

    async getCourseOfferings(filters = {}) {
        try {
            let query = this.supabase
                .from('course_offerings')
                .select(`
                    *,
                    course:courses(*),
                    instructor:faculty(*, profile:profiles(*)),
                    campus:campuses(name),
                    room:rooms(name, code)
                `);

            // Apply filters
            if (filters.semester) {
                query = query.eq('semester', filters.semester);
            }
            if (filters.year) {
                query = query.eq('year', filters.year);
            }
            if (filters.instructor_id) {
                query = query.eq('instructor_id', filters.instructor_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching course offerings:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // ENROLLMENT METHODS
    // =============================================

    async enrollStudent(enrollmentData) {
        try {
            const { data, error } = await this.supabase.functions.invoke('student-management', {
                body: {
                    action: 'enroll-student',
                    ...enrollmentData
                }
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error enrolling student:', error);
            return { success: false, error: error.message };
        }
    }

    async getStudentEnrollments(studentId) {
        try {
            const { data, error } = await this.supabase
                .from('enrollments')
                .select(`
                    *,
                    course_offering:course_offerings(
                        *,
                        course:courses(*),
                        instructor:faculty(*, profile:profiles(*))
                    )
                `)
                .eq('student_id', studentId);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching student enrollments:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // CAMPUS MANAGEMENT METHODS
    // =============================================

    async getCampuses() {
        try {
            const { data, error } = await this.supabase
                .from('campuses')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching campuses:', error);
            return { success: false, error: error.message };
        }
    }

    async getDepartments(campusId = null) {
        try {
            let query = this.supabase
                .from('departments')
                .select('*')
                .eq('is_active', true);

            if (campusId) {
                query = query.eq('campus_id', campusId);
            }

            const { data, error } = await query.order('name');

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching departments:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // FILE UPLOAD METHODS
    // =============================================

    async uploadFile(bucket, filePath, file) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { success: false, error: error.message };
        }
    }

    async getFileUrl(bucket, filePath) {
        try {
            const { data } = this.supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error getting file URL:', error);
            return null;
        }
    }

    // =============================================
    // NOTIFICATION METHODS
    // =============================================

    async getNotifications(userId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .select('*')
                .eq('recipient_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return { success: false, error: error.message };
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return { success: false, error: error.message };
        }
    }

    // =============================================
    // REAL-TIME SUBSCRIPTIONS
    // =============================================

    subscribeToNotifications(userId, callback) {
        return this.supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_id=eq.${userId}`
            }, callback)
            .subscribe();
    }

    subscribeToEnrollments(callback) {
        return this.supabase
            .channel('enrollments')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'enrollments'
            }, callback)
            .subscribe();
    }

    unsubscribe(subscription) {
        this.supabase.removeChannel(subscription);
    }

    // =============================================
    // ANALYTICS METHODS
    // =============================================

    async getDashboardMetrics() {
        try {
            // Get total counts
            const [
                { count: totalStudents },
                { count: totalFaculty },
                { count: totalCourses },
                { count: activeCourseOfferings }
            ] = await Promise.all([
                this.supabase.from('students').select('*', { count: 'exact', head: true }),
                this.supabase.from('faculty').select('*', { count: 'exact', head: true }),
                this.supabase.from('courses').select('*', { count: 'exact', head: true }),
                this.supabase.from('course_offerings').select('*', { count: 'exact', head: true }).eq('is_active', true)
            ]);

            return {
                success: true,
                data: {
                    totalStudents,
                    totalFaculty,
                    totalCourses,
                    activeCourseOfferings
                }
            };
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize the service
const supabaseService = new SupabaseService();

// Export for global use
window.supabaseService = supabaseService;

// Replace the existing Auth object with Supabase integration
window.Auth = {
    login: (email, password) => supabaseService.signIn(email, password),
    logout: () => supabaseService.signOut(),
    getCurrentUser: () => supabaseService.getCurrentUser(),
    isLoggedIn: () => !!supabaseService.getCurrentUser()
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseService;
}