/**
 * Course Enrollment Management
 * Handles student enrollment, waitlists, and enrollment analytics
 */

class CourseEnrollment {
    constructor() {
        this.currentCourse = null;
        this.enrolledStudents = [];
        this.waitlistStudents = [];
        this.availableStudents = [];
        this.init();
    }

    init() {
        this.createEnrollmentModalHTML();
        this.setupEventListeners();
    }

    createEnrollmentModalHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Course Enrollment Modal -->
            <div class="modal fade" id="courseEnrollmentModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-users me-2"></i>Course Enrollment Management
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Course Info Header -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-primary text-white">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <h5 class="card-title mb-1" id="enrollment-course-name">Course Name</h5>
                                                    <p class="card-text mb-0">
                                                        <span id="enrollment-course-code">COURSE001</span> | 
                                                        <span id="enrollment-instructor">Instructor Name</span> | 
                                                        <span id="enrollment-semester">Semester</span>
                                                    </p>
                                                </div>
                                                <div class="col-md-4 text-end">
                                                    <div class="enrollment-stats">
                                                        <div class="h4 mb-0">
                                                            <span id="enrollment-current">0</span>/<span id="enrollment-limit">0</span>
                                                        </div>
                                                        <small>Enrolled Students</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Enrollment Tabs -->
                            <ul class="nav nav-tabs" id="enrollmentTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="enrolled-tab" data-bs-toggle="tab" 
                                        data-bs-target="#enrolled-pane" type="button" role="tab">
                                        <i class="fas fa-check-circle me-2"></i>Enrolled Students 
                                        <span class="badge bg-success ms-2" id="enrolled-count">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="waitlist-tab" data-bs-toggle="tab" 
                                        data-bs-target="#waitlist-pane" type="button" role="tab">
                                        <i class="fas fa-clock me-2"></i>Waitlist 
                                        <span class="badge bg-warning ms-2" id="waitlist-count">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="available-tab" data-bs-toggle="tab" 
                                        data-bs-target="#available-pane" type="button" role="tab">
                                        <i class="fas fa-user-plus me-2"></i>Add Students 
                                        <span class="badge bg-info ms-2" id="available-count">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="analytics-tab" data-bs-toggle="tab" 
                                        data-bs-target="#analytics-pane" type="button" role="tab">
                                        <i class="fas fa-chart-bar me-2"></i>Analytics
                                    </button>
                                </li>
                            </ul>

                            <!-- Tab Content -->
                            <div class="tab-content mt-3" id="enrollmentTabContent">
                                <!-- Enrolled Students Tab -->
                                <div class="tab-pane fade show active" id="enrolled-pane" role="tabpanel">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="input-group" style="max-width: 300px;">
                                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                                            <input type="text" class="form-control" id="enrolled-search" 
                                                placeholder="Search enrolled students...">
                                        </div>
                                        <div class="btn-group">
                                            <button class="btn btn-outline-primary btn-sm" onclick="CourseEnrollment.exportEnrolledStudents()">
                                                <i class="fas fa-download me-1"></i>Export
                                            </button>
                                            <button class="btn btn-outline-danger btn-sm" onclick="CourseEnrollment.bulkUnenroll()">
                                                <i class="fas fa-user-minus me-1"></i>Bulk Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="select-all-enrolled">
                                                        </div>
                                                    </th>
                                                    <th>Student</th>
                                                    <th>Student ID</th>
                                                    <th>Email</th>
                                                    <th>Enrollment Date</th>
                                                    <th>Grade</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="enrolled-students-table">
                                                <!-- Enrolled students will be loaded here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Waitlist Tab -->
                                <div class="tab-pane fade" id="waitlist-pane" role="tabpanel">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="input-group" style="max-width: 300px;">
                                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                                            <input type="text" class="form-control" id="waitlist-search" 
                                                placeholder="Search waitlist...">
                                        </div>
                                        <div class="btn-group">
                                            <button class="btn btn-outline-success btn-sm" onclick="CourseEnrollment.processWaitlist()">
                                                <i class="fas fa-forward me-1"></i>Process Waitlist
                                            </button>
                                            <button class="btn btn-outline-primary btn-sm" onclick="CourseEnrollment.exportWaitlist()">
                                                <i class="fas fa-download me-1"></i>Export
                                            </button>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Student</th>
                                                    <th>Student ID</th>
                                                    <th>Email</th>
                                                    <th>Waitlist Date</th>
                                                    <th>Priority</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="waitlist-students-table">
                                                <!-- Waitlist students will be loaded here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Available Students Tab -->
                                <div class="tab-pane fade" id="available-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h6>Available Students</h6>
                                                <div class="input-group" style="max-width: 250px;">
                                                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                                                    <input type="text" class="form-control" id="available-search" 
                                                        placeholder="Search students...">
                                                </div>
                                            </div>
                                            <div class="available-students-list" id="available-students-list" 
                                                style="height: 400px; overflow-y: auto;">
                                                <!-- Available students will be loaded here -->
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h6>Selected for Enrollment</h6>
                                                <button class="btn btn-success btn-sm" onclick="CourseEnrollment.enrollSelectedStudents()">
                                                    <i class="fas fa-user-plus me-1"></i>Enroll Selected
                                                </button>
                                            </div>
                                            <div class="selected-students-list" id="selected-students-list" 
                                                style="height: 400px; overflow-y: auto; border: 2px dashed #dee2e6; border-radius: 8px; padding: 15px;">
                                                <div class="text-center text-muted">
                                                    <i class="fas fa-users fa-3x mb-3"></i>
                                                    <p>Select students from the left to enroll them in this course</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Analytics Tab -->
                                <div class="tab-pane fade" id="analytics-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Enrollment Timeline</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="enrollmentTimelineChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Grade Distribution</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="gradeDistributionChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col-md-12">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Enrollment Statistics</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-md-3">
                                                            <div class="stat-item text-center">
                                                                <h4 class="text-primary" id="stat-total-enrolled">0</h4>
                                                                <small class="text-muted">Total Enrolled</small>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <div class="stat-item text-center">
                                                                <h4 class="text-warning" id="stat-waitlist">0</h4>
                                                                <small class="text-muted">On Waitlist</small>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <div class="stat-item text-center">
                                                                <h4 class="text-success" id="stat-completion-rate">0%</h4>
                                                                <small class="text-muted">Completion Rate</small>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <div class="stat-item text-center">
                                                                <h4 class="text-info" id="stat-avg-grade">N/A</h4>
                                                                <small class="text-muted">Average Grade</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="CourseEnrollment.saveChanges()">
                                <i class="fas fa-save me-2"></i>Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
    }

    setupEventListeners() {
        // Search functionality
        const searchInputs = ['enrolled-search', 'waitlist-search', 'available-search'];
        searchInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.handleSearch.bind(this, id));
            }
        });

        // Select all checkboxes
        const selectAllEnrolled = document.getElementById('select-all-enrolled');
        if (selectAllEnrolled) {
            selectAllEnrolled.addEventListener('change', this.handleSelectAllEnrolled.bind(this));
        }
    }

    showEnrollmentModal(courseId) {
        const course = window.coursesManager?.getCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.loadEnrollmentData(course);
        this.populateCourseInfo(course);
        this.loadCharts();

        const modal = new bootstrap.Modal(document.getElementById('courseEnrollmentModal'));
        modal.show();
    }

    populateCourseInfo(course) {
        document.getElementById('enrollment-course-name').textContent = course.name;
        document.getElementById('enrollment-course-code').textContent = course.code;
        document.getElementById('enrollment-instructor').textContent = course.instructor.name;
        document.getElementById('enrollment-semester').textContent = course.semester;
        document.getElementById('enrollment-current').textContent = course.currentEnrollment;
        document.getElementById('enrollment-limit').textContent = course.enrollmentLimit;
    }

    loadEnrollmentData(course) {
        // Mock enrolled students data
        this.enrolledStudents = [
            {
                id: 'STU2024001',
                name: 'Emma Johnson',
                email: 'emma.johnson@university.edu',
                enrollmentDate: '2025-08-25',
                grade: 'A',
                status: 'Active'
            },
            {
                id: 'STU2024002',
                name: 'Michael Smith',
                email: 'michael.smith@university.edu',
                enrollmentDate: '2025-08-26',
                grade: 'B+',
                status: 'Active'
            },
            {
                id: 'STU2024003',
                name: 'Sarah Davis',
                email: 'sarah.davis@university.edu',
                enrollmentDate: '2025-08-27',
                grade: 'A-',
                status: 'Active'
            }
        ];

        // Mock waitlist students data
        this.waitlistStudents = [
            {
                id: 'STU2024050',
                name: 'James Wilson',
                email: 'james.wilson@university.edu',
                waitlistDate: '2025-09-01',
                position: 1,
                priority: 'High'
            },
            {
                id: 'STU2024051',
                name: 'Lisa Brown',
                email: 'lisa.brown@university.edu',
                waitlistDate: '2025-09-02',
                position: 2,
                priority: 'Normal'
            }
        ];

        // Mock available students data
        this.availableStudents = [
            {
                id: 'STU2024100',
                name: 'David Anderson',
                email: 'david.anderson@university.edu',
                year: '2nd Year',
                gpa: 3.7
            },
            {
                id: 'STU2024101',
                name: 'Jennifer Lee',
                email: 'jennifer.lee@university.edu',
                year: '3rd Year',
                gpa: 3.9
            }
        ];

        this.renderEnrolledStudents();
        this.renderWaitlistStudents();
        this.renderAvailableStudents();
        this.updateCounters();
    }

    renderEnrolledStudents() {
        const tbody = document.getElementById('enrolled-students-table');
        tbody.innerHTML = this.enrolledStudents.map(student => `
            <tr>
                <td>
                    <div class="form-check">
                        <input class="form-check-input enrolled-checkbox" type="checkbox" value="${student.id}">
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="student-avatar me-2">
                            <i class="fas fa-user-circle fa-2x text-muted"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${student.name}</div>
                        </div>
                    </div>
                </td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${this.formatDate(student.enrollmentDate)}</td>
                <td><span class="badge bg-${this.getGradeBadgeClass(student.grade)}">${student.grade}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="CourseEnrollment.viewStudentDetails('${student.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="CourseEnrollment.editGrade('${student.id}')" title="Edit Grade">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="CourseEnrollment.unenrollStudent('${student.id}')" title="Remove">
                            <i class="fas fa-user-minus"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderWaitlistStudents() {
        const tbody = document.getElementById('waitlist-students-table');
        tbody.innerHTML = this.waitlistStudents.map(student => `
            <tr>
                <td><span class="badge bg-info">#${student.position}</span></td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="student-avatar me-2">
                            <i class="fas fa-user-circle fa-2x text-muted"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${student.name}</div>
                        </div>
                    </div>
                </td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${this.formatDate(student.waitlistDate)}</td>
                <td><span class="badge bg-${student.priority === 'High' ? 'danger' : 'secondary'}">${student.priority}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-success" onclick="CourseEnrollment.enrollFromWaitlist('${student.id}')" title="Enroll">
                            <i class="fas fa-user-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="CourseEnrollment.removeFromWaitlist('${student.id}')" title="Remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAvailableStudents() {
        const container = document.getElementById('available-students-list');
        container.innerHTML = this.availableStudents.map(student => `
            <div class="card mb-2 available-student-card" data-student-id="${student.id}">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="card-title mb-1">${student.name}</h6>
                            <p class="card-text small text-muted mb-1">${student.id} | ${student.email}</p>
                            <small class="text-muted">${student.year} | GPA: ${student.gpa}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-primary" onclick="CourseEnrollment.selectStudentForEnrollment('${student.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCounters() {
        document.getElementById('enrolled-count').textContent = this.enrolledStudents.length;
        document.getElementById('waitlist-count').textContent = this.waitlistStudents.length;
        document.getElementById('available-count').textContent = this.availableStudents.length;
    }

    loadCharts() {
        setTimeout(() => {
            this.loadEnrollmentTimelineChart();
            this.loadGradeDistributionChart();
            this.updateAnalyticsStats();
        }, 100);
    }

    loadEnrollmentTimelineChart() {
        const ctx = document.getElementById('enrollmentTimelineChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [{
                    label: 'Enrollments',
                    data: [5, 12, 8, 3, 2],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    loadGradeDistributionChart() {
        const ctx = document.getElementById('gradeDistributionChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['A', 'B', 'C', 'D', 'F'],
                datasets: [{
                    data: [40, 30, 20, 8, 2],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#fd7e14',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    updateAnalyticsStats() {
        document.getElementById('stat-total-enrolled').textContent = this.enrolledStudents.length;
        document.getElementById('stat-waitlist').textContent = this.waitlistStudents.length;
        document.getElementById('stat-completion-rate').textContent = '95%';
        document.getElementById('stat-avg-grade').textContent = '3.7';
    }

    handleSearch(inputId, event) {
        const searchTerm = event.target.value.toLowerCase();
        // Implement search functionality for each tab
        console.log(`Searching ${inputId} for: ${searchTerm}`);
    }

    handleSelectAllEnrolled(event) {
        const checkboxes = document.querySelectorAll('.enrolled-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
    }

    getGradeBadgeClass(grade) {
        if (grade.startsWith('A')) return 'success';
        if (grade.startsWith('B')) return 'info';
        if (grade.startsWith('C')) return 'warning';
        return 'danger';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Static methods for global access
    static viewStudentDetails(studentId) {
        console.log('View student details:', studentId);
    }

    static editGrade(studentId) {
        console.log('Edit grade for student:', studentId);
    }

    static unenrollStudent(studentId) {
        if (confirm('Are you sure you want to remove this student from the course?')) {
            console.log('Unenroll student:', studentId);
        }
    }

    static enrollFromWaitlist(studentId) {
        console.log('Enroll from waitlist:', studentId);
    }

    static removeFromWaitlist(studentId) {
        if (confirm('Are you sure you want to remove this student from the waitlist?')) {
            console.log('Remove from waitlist:', studentId);
        }
    }

    static selectStudentForEnrollment(studentId) {
        console.log('Select student for enrollment:', studentId);
    }

    static enrollSelectedStudents() {
        console.log('Enroll selected students');
    }

    static exportEnrolledStudents() {
        console.log('Export enrolled students');
    }

    static exportWaitlist() {
        console.log('Export waitlist');
    }

    static bulkUnenroll() {
        console.log('Bulk unenroll');
    }

    static processWaitlist() {
        console.log('Process waitlist');
    }

    static saveChanges() {
        console.log('Save enrollment changes');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.CourseEnrollment = new CourseEnrollment();
});