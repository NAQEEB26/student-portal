/**
 * Course Reports and Analytics
 * Generates comprehensive reports and analytics for courses
 */

class CourseReports {
    constructor() {
        this.currentCourse = null;
        this.reportCharts = {};
        this.init();
    }

    init() {
        this.createReportsModalHTML();
        this.setupEventListeners();
    }

    createReportsModalHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Course Reports Modal -->
            <div class="modal fade" id="courseReportsModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-chart-bar me-2"></i>Course Reports & Analytics
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Course Info Header -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-gradient-primary text-white">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <h5 class="card-title mb-1" id="reports-course-name">Course Name</h5>
                                                    <p class="card-text mb-0">
                                                        <span id="reports-course-code">COURSE001</span> | 
                                                        <span id="reports-instructor">Instructor Name</span> | 
                                                        <span id="reports-semester">Semester</span>
                                                    </p>
                                                </div>
                                                <div class="col-md-4 text-end">
                                                    <button class="btn btn-light" onclick="CourseReports.generateFullReport()">
                                                        <i class="fas fa-file-pdf me-2"></i>Generate PDF Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Report Tabs -->
                            <ul class="nav nav-tabs" id="reportsTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="overview-report-tab" data-bs-toggle="tab" 
                                        data-bs-target="#overview-report-pane" type="button" role="tab">
                                        <i class="fas fa-chart-pie me-2"></i>Overview
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="enrollment-report-tab" data-bs-toggle="tab" 
                                        data-bs-target="#enrollment-report-pane" type="button" role="tab">
                                        <i class="fas fa-users me-2"></i>Enrollment
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="performance-report-tab" data-bs-toggle="tab" 
                                        data-bs-target="#performance-report-pane" type="button" role="tab">
                                        <i class="fas fa-graduation-cap me-2"></i>Performance
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="attendance-report-tab" data-bs-toggle="tab" 
                                        data-bs-target="#attendance-report-pane" type="button" role="tab">
                                        <i class="fas fa-calendar-check me-2"></i>Attendance
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="feedback-report-tab" data-bs-toggle="tab" 
                                        data-bs-target="#feedback-report-pane" type="button" role="tab">
                                        <i class="fas fa-comments me-2"></i>Feedback
                                    </button>
                                </li>
                            </ul>

                            <!-- Tab Content -->
                            <div class="tab-content mt-3" id="reportsTabContent">
                                <!-- Overview Report Tab -->
                                <div class="tab-pane fade show active" id="overview-report-pane" role="tabpanel">
                                    <div class="row">
                                        <!-- Key Metrics Cards -->
                                        <div class="col-md-3 mb-4">
                                            <div class="card border-left-primary h-100">
                                                <div class="card-body">
                                                    <div class="row no-gutters align-items-center">
                                                        <div class="col mr-2">
                                                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                Total Students
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="overview-total-students">0</div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <i class="fas fa-users fa-2x text-gray-300"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-3 mb-4">
                                            <div class="card border-left-success h-100">
                                                <div class="card-body">
                                                    <div class="row no-gutters align-items-center">
                                                        <div class="col mr-2">
                                                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                Average Grade
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="overview-avg-grade">0</div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <i class="fas fa-star fa-2x text-gray-300"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-3 mb-4">
                                            <div class="card border-left-info h-100">
                                                <div class="card-body">
                                                    <div class="row no-gutters align-items-center">
                                                        <div class="col mr-2">
                                                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                                Attendance Rate
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="overview-attendance">0%</div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <i class="fas fa-calendar-check fa-2x text-gray-300"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-3 mb-4">
                                            <div class="card border-left-warning h-100">
                                                <div class="card-body">
                                                    <div class="row no-gutters align-items-center">
                                                        <div class="col mr-2">
                                                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                                Completion Rate
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="overview-completion">0%</div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Grade Distribution</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="overviewGradeChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Enrollment Trend</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="overviewEnrollmentChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Enrollment Report Tab -->
                                <div class="tab-pane fade" id="enrollment-report-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="card">
                                                <div class="card-header d-flex justify-content-between align-items-center">
                                                    <h6 class="card-title mb-0">Enrollment Timeline</h6>
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary" onclick="CourseReports.exportEnrollmentData()">
                                                            <i class="fas fa-download me-1"></i>Export
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="enrollmentTimelineChart" height="350"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Enrollment Statistics</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="enrollment-stat-item mb-3">
                                                        <label class="form-label">Current Enrollment</label>
                                                        <div class="h4 text-primary" id="enrollment-current">0</div>
                                                    </div>
                                                    <div class="enrollment-stat-item mb-3">
                                                        <label class="form-label">Enrollment Limit</label>
                                                        <div class="h4 text-info" id="enrollment-limit">0</div>
                                                    </div>
                                                    <div class="enrollment-stat-item mb-3">
                                                        <label class="form-label">Waitlist Count</label>
                                                        <div class="h4 text-warning" id="enrollment-waitlist">0</div>
                                                    </div>
                                                    <div class="enrollment-stat-item mb-3">
                                                        <label class="form-label">Dropped Students</label>
                                                        <div class="h4 text-danger" id="enrollment-dropped">0</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Performance Report Tab -->
                                <div class="tab-pane fade" id="performance-report-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Grade Distribution by Assignment</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="performanceByAssignmentChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Performance Trends</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="performanceTrendsChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="card">
                                                <div class="card-header d-flex justify-content-between align-items-center">
                                                    <h6 class="card-title mb-0">Student Performance Details</h6>
                                                    <button class="btn btn-sm btn-outline-primary" onclick="CourseReports.exportPerformanceData()">
                                                        <i class="fas fa-download me-1"></i>Export Performance Data
                                                    </button>
                                                </div>
                                                <div class="card-body">
                                                    <div class="table-responsive">
                                                        <table class="table table-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Student</th>
                                                                    <th>Midterm</th>
                                                                    <th>Final</th>
                                                                    <th>Assignments</th>
                                                                    <th>Overall Grade</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="performance-details-table">
                                                                <!-- Performance details will be loaded here -->
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Attendance Report Tab -->
                                <div class="tab-pane fade" id="attendance-report-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Weekly Attendance Trends</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="attendanceTrendsChart" height="350"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Attendance Summary</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="attendanceSummaryChart" height="250"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Feedback Report Tab -->
                                <div class="tab-pane fade" id="feedback-report-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Course Satisfaction Ratings</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="satisfactionChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-4">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Feedback Categories</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="feedbackCategoriesChart" height="300"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Recent Feedback Comments</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div id="feedback-comments">
                                                        <!-- Recent feedback comments will be loaded here -->
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
                            <div class="btn-group">
                                <button type="button" class="btn btn-primary" onclick="CourseReports.scheduleReport()">
                                    <i class="fas fa-clock me-2"></i>Schedule Report
                                </button>
                                <button type="button" class="btn btn-success" onclick="CourseReports.generateFullReport()">
                                    <i class="fas fa-file-pdf me-2"></i>Generate PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
    }

    setupEventListeners() {
        // Tab change events to load charts
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', this.handleTabChange.bind(this));
        });
    }

    showReportsModal(courseId) {
        const course = window.coursesManager?.getCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.populateReportInfo(course);
        this.loadReportData();

        const modal = new bootstrap.Modal(document.getElementById('courseReportsModal'));
        modal.show();

        // Load initial charts after modal is shown
        setTimeout(() => {
            this.loadOverviewCharts();
        }, 300);
    }

    populateReportInfo(course) {
        document.getElementById('reports-course-name').textContent = course.name;
        document.getElementById('reports-course-code').textContent = course.code;
        document.getElementById('reports-instructor').textContent = course.instructor.name;
        document.getElementById('reports-semester').textContent = course.semester;
    }

    loadReportData() {
        // Load overview metrics
        document.getElementById('overview-total-students').textContent = '25';
        document.getElementById('overview-avg-grade').textContent = '3.7';
        document.getElementById('overview-attendance').textContent = '92%';
        document.getElementById('overview-completion').textContent = '95%';

        // Load enrollment data
        document.getElementById('enrollment-current').textContent = this.currentCourse.currentEnrollment;
        document.getElementById('enrollment-limit').textContent = this.currentCourse.enrollmentLimit;
        document.getElementById('enrollment-waitlist').textContent = '2';
        document.getElementById('enrollment-dropped').textContent = '1';

        // Load performance details
        this.loadPerformanceTable();

        // Load feedback comments
        this.loadFeedbackComments();
    }

    loadOverviewCharts() {
        this.loadGradeDistributionChart();
        this.loadEnrollmentTrendChart();
    }

    loadGradeDistributionChart() {
        const ctx = document.getElementById('overviewGradeChart');
        if (!ctx) return;

        this.reportCharts.gradeDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['A', 'B', 'C', 'D', 'F'],
                datasets: [{
                    data: [40, 35, 20, 4, 1],
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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    loadEnrollmentTrendChart() {
        const ctx = document.getElementById('overviewEnrollmentChart');
        if (!ctx) return;

        this.reportCharts.enrollmentTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Enrollment',
                    data: [15, 20, 23, 24, 25, 25],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
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

    loadPerformanceTable() {
        const performanceData = [
            { name: 'Emma Johnson', midterm: 'A', final: 'A-', assignments: 'A', overall: 'A', status: 'Excellent' },
            { name: 'Michael Smith', midterm: 'B+', final: 'B', assignments: 'B+', overall: 'B+', status: 'Good' },
            { name: 'Sarah Davis', midterm: 'A-', final: 'A', assignments: 'A-', overall: 'A-', status: 'Excellent' }
        ];

        const tbody = document.getElementById('performance-details-table');
        tbody.innerHTML = performanceData.map(student => `
            <tr>
                <td>${student.name}</td>
                <td><span class="badge bg-${this.getGradeBadgeClass(student.midterm)}">${student.midterm}</span></td>
                <td><span class="badge bg-${this.getGradeBadgeClass(student.final)}">${student.final}</span></td>
                <td><span class="badge bg-${this.getGradeBadgeClass(student.assignments)}">${student.assignments}</span></td>
                <td><span class="badge bg-${this.getGradeBadgeClass(student.overall)}">${student.overall}</span></td>
                <td><span class="badge bg-${student.status === 'Excellent' ? 'success' : 'info'}">${student.status}</span></td>
            </tr>
        `).join('');
    }

    loadFeedbackComments() {
        const feedbackComments = [
            { student: 'Anonymous', rating: 5, comment: 'Excellent course content and teaching methodology.', date: '2025-10-25' },
            { student: 'Anonymous', rating: 4, comment: 'Very informative, could use more practical examples.', date: '2025-10-20' },
            { student: 'Anonymous', rating: 5, comment: 'Great instructor, well-organized course materials.', date: '2025-10-18' }
        ];

        const container = document.getElementById('feedback-comments');
        container.innerHTML = feedbackComments.map(feedback => `
            <div class="feedback-item border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="rating mb-2">
                            ${Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star ${i < feedback.rating ? 'text-warning' : 'text-muted'}"></i>`
        ).join('')}
                        </div>
                        <p class="mb-1">${feedback.comment}</p>
                        <small class="text-muted">by ${feedback.student} on ${this.formatDate(feedback.date)}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleTabChange(event) {
        const targetTab = event.target.getAttribute('data-bs-target');

        setTimeout(() => {
            switch (targetTab) {
                case '#enrollment-report-pane':
                    this.loadEnrollmentCharts();
                    break;
                case '#performance-report-pane':
                    this.loadPerformanceCharts();
                    break;
                case '#attendance-report-pane':
                    this.loadAttendanceCharts();
                    break;
                case '#feedback-report-pane':
                    this.loadFeedbackCharts();
                    break;
            }
        }, 100);
    }

    loadEnrollmentCharts() {
        const ctx = document.getElementById('enrollmentTimelineChart');
        if (!ctx || this.reportCharts.enrollmentTimeline) return;

        this.reportCharts.enrollmentTimeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Enrolled Students',
                    data: [15, 22, 24, 25, 25],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    loadPerformanceCharts() {
        // Performance by Assignment Chart
        const ctx1 = document.getElementById('performanceByAssignmentChart');
        if (ctx1 && !this.reportCharts.performanceByAssignment) {
            this.reportCharts.performanceByAssignment = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Midterm', 'Final', 'Assignments', 'Participation'],
                    datasets: [{
                        label: 'Average Score',
                        data: [85, 82, 88, 92],
                        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Performance Trends Chart
        const ctx2 = document.getElementById('performanceTrendsChart');
        if (ctx2 && !this.reportCharts.performanceTrends) {
            this.reportCharts.performanceTrends = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 4', 'Week 8', 'Week 12', 'Week 16'],
                    datasets: [{
                        label: 'Class Average',
                        data: [75, 78, 82, 85, 87],
                        borderColor: '#28a745',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    loadAttendanceCharts() {
        // Attendance Trends Chart
        const ctx1 = document.getElementById('attendanceTrendsChart');
        if (ctx1 && !this.reportCharts.attendanceTrends) {
            this.reportCharts.attendanceTrends = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [{
                        label: 'Attendance Rate',
                        data: [95, 92, 89, 94, 91, 93],
                        borderColor: '#17a2b8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 80,
                            max: 100
                        }
                    }
                }
            });
        }

        // Attendance Summary Chart
        const ctx2 = document.getElementById('attendanceSummaryChart');
        if (ctx2 && !this.reportCharts.attendanceSummary) {
            this.reportCharts.attendanceSummary = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Absent', 'Late'],
                    datasets: [{
                        data: [92, 5, 3],
                        backgroundColor: ['#28a745', '#dc3545', '#ffc107']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    loadFeedbackCharts() {
        // Satisfaction Chart
        const ctx1 = document.getElementById('satisfactionChart');
        if (ctx1 && !this.reportCharts.satisfaction) {
            this.reportCharts.satisfaction = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Course Content', 'Teaching Quality', 'Pace', 'Difficulty', 'Overall'],
                    datasets: [{
                        label: 'Average Rating',
                        data: [4.5, 4.7, 4.2, 4.0, 4.4],
                        backgroundColor: '#28a745'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        }

        // Feedback Categories Chart
        const ctx2 = document.getElementById('feedbackCategoriesChart');
        if (ctx2 && !this.reportCharts.feedbackCategories) {
            this.reportCharts.feedbackCategories = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Positive', 'Neutral', 'Constructive'],
                    datasets: [{
                        data: [70, 20, 10],
                        backgroundColor: ['#28a745', '#6c757d', '#ffc107']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
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
    static exportEnrollmentData() {
        console.log('Export enrollment data');
    }

    static exportPerformanceData() {
        console.log('Export performance data');
    }

    static generateFullReport() {
        console.log('Generate full PDF report');
    }

    static scheduleReport() {
        console.log('Schedule automated report');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.CourseReports = new CourseReports();
});