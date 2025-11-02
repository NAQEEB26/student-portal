// ================================
// DASHBOARD JAVASCRIPT
// ================================

const Dashboard = {
    currentUser: null,
    currentView: 'overview',
    charts: {},

    // Initialize dashboard
    init: function () {
        this.currentUser = Auth.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.setupUserInterface();
        this.setupNavigation();
        this.loadDashboardContent();
        this.setupGlobalSearch();
        this.setupNotifications();
    },

    // Setup user interface elements
    setupUserInterface: function () {
        // Update user info in sidebar
        const userDisplayName = document.getElementById('userDisplayName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');
        const topbarUserName = document.getElementById('topbarUserName');

        if (userDisplayName) userDisplayName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = this.currentUser.role.replace('_', ' ');
        if (topbarUserName) topbarUserName.textContent = this.currentUser.name;

        // Set user avatar initials
        const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        if (userAvatar) userAvatar.textContent = initials;
    },

    // Setup navigation based on user role
    setupNavigation: function () {
        const sidebarNav = document.getElementById('sidebarNav');
        if (!sidebarNav) return;

        const navigationMenus = {
            superadmin: [
                { icon: 'fas fa-tachometer-alt', label: 'Overview', id: 'overview', active: true },
                { icon: 'fas fa-users', label: 'Students', id: 'students' },
                { icon: 'fas fa-book', label: 'Courses', id: 'courses' },
                { icon: 'fas fa-building', label: 'Campuses', id: 'campuses' },
                { icon: 'fas fa-user-tie', label: 'Staff', id: 'staff' },
                { icon: 'fas fa-chart-bar', label: 'Reports', id: 'reports' },
                { icon: 'fas fa-cog', label: 'Settings', id: 'settings' }
            ],
            campus_manager: [
                { icon: 'fas fa-tachometer-alt', label: 'Overview', id: 'overview', active: true },
                { icon: 'fas fa-users', label: 'Students', id: 'students' },
                { icon: 'fas fa-book', label: 'Courses', id: 'courses' },
                { icon: 'fas fa-id-card', label: 'ID Cards', id: 'id-cards' },
                { icon: 'fas fa-chart-line', label: 'Analytics', id: 'analytics' },
                { icon: 'fas fa-user-cog', label: 'Profile', id: 'profile' }
            ],
            student: [
                { icon: 'fas fa-tachometer-alt', label: 'Dashboard', id: 'overview', active: true },
                { icon: 'fas fa-user', label: 'My Profile', id: 'profile' },
                { icon: 'fas fa-book-open', label: 'My Courses', id: 'my-courses' },
                { icon: 'fas fa-id-card', label: 'ID Card', id: 'id-card' },
                { icon: 'fas fa-calendar-check', label: 'Attendance', id: 'attendance' },
                { icon: 'fas fa-download', label: 'Downloads', id: 'downloads' }
            ]
        };

        const userRole = this.currentUser.role;
        const menuItems = navigationMenus[userRole] || navigationMenus.student;

        sidebarNav.innerHTML = menuItems.map(item => `
            <div class="nav-item">
                <a href="#" class="nav-link ${item.active ? 'active' : ''}" 
                   onclick="Dashboard.navigate('${item.id}')">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                </a>
            </div>
        `).join('');
    },

    // Navigate to different sections
    navigate: function (viewId) {
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.closest('.nav-link').classList.add('active');

        // Update page title and breadcrumb
        this.updatePageTitle(viewId);

        // Load content
        this.currentView = viewId;
        this.loadDashboardContent();
    },

    // Update page title and breadcrumb
    updatePageTitle: function (viewId) {
        const titles = {
            overview: 'Dashboard Overview',
            students: 'Students Management',
            courses: 'Courses Management',
            campuses: 'Campus Management',
            staff: 'Staff Management',
            reports: 'Reports & Analytics',
            settings: 'System Settings',
            profile: 'My Profile',
            'my-courses': 'My Courses',
            'id-card': 'My ID Card',
            'id-cards': 'ID Cards Management',
            attendance: 'Attendance Records',
            downloads: 'Downloads',
            analytics: 'Analytics'
        };

        const pageTitle = document.getElementById('pageTitle');
        const breadcrumb = document.getElementById('breadcrumb');

        if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <li class="breadcrumb-item"><a href="#" onclick="Dashboard.navigate('overview')">Dashboard</a></li>
                ${viewId !== 'overview' ? `<li class="breadcrumb-item active">${titles[viewId] || viewId}</li>` : ''}
            `;
        }
    },

    // Load dashboard content based on current view and user role
    loadDashboardContent: function () {
        const content = document.getElementById('dashboardContent');
        if (!content) return;

        // Show loading
        content.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="loading-spinner"></div>
            </div>
        `;

        // Simulate loading delay
        setTimeout(() => {
            const userRole = this.currentUser.role;

            switch (this.currentView) {
                case 'overview':
                    content.innerHTML = this.getOverviewContent(userRole);
                    this.initializeCharts();
                    break;
                case 'students':
                    content.innerHTML = this.getStudentsContent();
                    break;
                case 'courses':
                    content.innerHTML = this.getCoursesContent();
                    break;
                case 'campuses':
                    content.innerHTML = this.getCampusesContent();
                    break;
                case 'profile':
                    content.innerHTML = this.getProfileContent();
                    break;
                case 'my-courses':
                    content.innerHTML = this.getMyCoursesContent();
                    break;
                case 'id-card':
                    content.innerHTML = this.getIdCardContent();
                    break;
                case 'id-cards':
                    content.innerHTML = this.getIdCardsManagementContent();
                    break;
                default:
                    content.innerHTML = this.getOverviewContent(userRole);
            }
        }, 500);
    },

    // Get overview content based on user role
    getOverviewContent: function (userRole) {
        switch (userRole) {
            case 'superadmin':
                return this.getAdminOverview();
            case 'campus_manager':
                return this.getManagerOverview();
            case 'student':
                return this.getStudentOverview();
            default:
                return this.getDefaultOverview();
        }
    },

    // Admin dashboard overview
    getAdminOverview: function () {
        return `
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card stat-primary">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Total Students</h6>
                        <div class="stat-card-icon bg-primary">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">2,547</h2>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i> +12% from last month
                    </div>
                </div>
                
                <div class="stat-card stat-success">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Active Courses</h6>
                        <div class="stat-card-icon bg-success">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">48</h2>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i> +3 new courses
                    </div>
                </div>
                
                <div class="stat-card stat-warning">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Total Campuses</h6>
                        <div class="stat-card-icon bg-warning">
                            <i class="fas fa-building"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">8</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-minus"></i> No change
                    </div>
                </div>
                
                <div class="stat-card stat-danger">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Pending Reviews</h6>
                        <div class="stat-card-icon bg-danger">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">23</h2>
                    <div class="stat-card-change negative">
                        <i class="fas fa-arrow-down"></i> Needs attention
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="#" class="quick-action" onclick="Dashboard.navigate('students')">
                    <i class="fas fa-user-plus"></i>
                    <h6>Add Student</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('courses')">
                    <i class="fas fa-plus"></i>
                    <h6>Create Course</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('campuses')">
                    <i class="fas fa-building"></i>
                    <h6>Manage Campus</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('reports')">
                    <i class="fas fa-chart-bar"></i>
                    <h6>View Reports</h6>
                </a>
            </div>

            <!-- Dashboard Widgets -->
            <div class="dashboard-widgets">
                <div class="widget">
                    <div class="widget-header">
                        <h5 class="widget-title">Student Enrollment Trends</h5>
                        <div class="widget-actions">
                            <button class="btn btn-sm btn-outline-primary">View Details</button>
                        </div>
                    </div>
                    <div class="widget-body">
                        <canvas id="enrollmentChart" height="100"></canvas>
                    </div>
                </div>
                
                <div class="widget">
                    <div class="widget-header">
                        <h5 class="widget-title">Recent Activity</h5>
                    </div>
                    <div class="widget-body">
                        <ul class="activity-list">
                            <li class="activity-item">
                                <div class="activity-icon bg-primary text-white">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">New student registered</p>
                                    <p class="activity-time">2 minutes ago</p>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon bg-success text-white">
                                    <i class="fas fa-book"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">Course "Web Development" updated</p>
                                    <p class="activity-time">1 hour ago</p>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon bg-warning text-white">
                                    <i class="fas fa-building"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">Campus manager assigned</p>
                                    <p class="activity-time">3 hours ago</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    // Campus Manager dashboard overview
    getManagerOverview: function () {
        return `
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card stat-primary">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">My Campus Students</h6>
                        <div class="stat-card-icon bg-primary">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">324</h2>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i> +8 this week
                    </div>
                </div>
                
                <div class="stat-card stat-success">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Active Courses</h6>
                        <div class="stat-card-icon bg-success">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">12</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-check"></i> All running
                    </div>
                </div>
                
                <div class="stat-card stat-warning">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Pending ID Cards</h6>
                        <div class="stat-card-icon bg-warning">
                            <i class="fas fa-id-card"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">7</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-clock"></i> Awaiting approval
                    </div>
                </div>
                
                <div class="stat-card stat-danger">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">This Month</h6>
                        <div class="stat-card-icon bg-danger">
                            <i class="fas fa-calendar"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">Nov</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-info"></i> 2025
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="#" class="quick-action" onclick="Dashboard.navigate('students')">
                    <i class="fas fa-user-plus"></i>
                    <h6>Add Student</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('id-cards')">
                    <i class="fas fa-id-card"></i>
                    <h6>Generate ID Cards</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('courses')">
                    <i class="fas fa-book-open"></i>
                    <h6>Manage Courses</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('analytics')">
                    <i class="fas fa-chart-line"></i>
                    <h6>View Analytics</h6>
                </a>
            </div>

            <!-- Campus Summary -->
            <div class="widget">
                <div class="widget-header">
                    <h5 class="widget-title">Campus: ${this.currentUser.campus || 'Main Campus'}</h5>
                </div>
                <div class="widget-body">
                    <div class="row">
                        <div class="col-md-8">
                            <canvas id="campusChart" height="80"></canvas>
                        </div>
                        <div class="col-md-4">
                            <h6>Recent Enrollments</h6>
                            <ul class="activity-list">
                                <li class="activity-item">
                                    <div class="activity-content">
                                        <p class="activity-title">Sarah Johnson - Computer Science</p>
                                        <p class="activity-time">Today</p>
                                    </div>
                                </li>
                                <li class="activity-item">
                                    <div class="activity-content">
                                        <p class="activity-title">Mike Chen - Engineering</p>
                                        <p class="activity-time">Yesterday</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Student dashboard overview
    getStudentOverview: function () {
        return `
            <!-- Welcome Message -->
            <div class="alert alert-primary" role="alert">
                <h4 class="alert-heading">Welcome back, ${this.currentUser.name}!</h4>
                <p>Here's your academic overview and quick access to important features.</p>
            </div>

            <!-- Student Stats -->
            <div class="stats-grid">
                <div class="stat-card stat-primary">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Enrolled Courses</h6>
                        <div class="stat-card-icon bg-primary">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">5</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-check"></i> All active
                    </div>
                </div>
                
                <div class="stat-card stat-success">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Attendance Rate</h6>
                        <div class="stat-card-icon bg-success">
                            <i class="fas fa-percentage"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">94%</h2>
                    <div class="stat-card-change positive">
                        <i class="fas fa-arrow-up"></i> Excellent
                    </div>
                </div>
                
                <div class="stat-card stat-warning">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Current Semester</h6>
                        <div class="stat-card-icon bg-warning">
                            <i class="fas fa-calendar"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">3rd</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-info"></i> Fall 2025
                    </div>
                </div>
                
                <div class="stat-card stat-danger">
                    <div class="stat-card-header">
                        <h6 class="stat-card-title">Student ID</h6>
                        <div class="stat-card-icon bg-danger">
                            <i class="fas fa-id-card"></i>
                        </div>
                    </div>
                    <h2 class="stat-card-value">${this.currentUser.studentId || 'STU001'}</h2>
                    <div class="stat-card-change">
                        <i class="fas fa-download"></i> Download ID
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="#" class="quick-action" onclick="Dashboard.navigate('profile')">
                    <i class="fas fa-user"></i>
                    <h6>My Profile</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('my-courses')">
                    <i class="fas fa-book-open"></i>
                    <h6>My Courses</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('id-card')">
                    <i class="fas fa-id-card"></i>
                    <h6>Download ID Card</h6>
                </a>
                <a href="#" class="quick-action" onclick="Dashboard.navigate('attendance')">
                    <i class="fas fa-calendar-check"></i>
                    <h6>Attendance</h6>
                </a>
            </div>

            <!-- Student Dashboard Widgets -->
            <div class="dashboard-widgets">
                <div class="widget">
                    <div class="widget-header">
                        <h5 class="widget-title">My Courses Progress</h5>
                    </div>
                    <div class="widget-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Web Development</span>
                                <span>85%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Database Systems</span>
                                <span>72%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-primary" style="width: 72%"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Mobile Development</span>
                                <span>91%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: 91%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="widget">
                    <div class="widget-header">
                        <h5 class="widget-title">Upcoming Events</h5>
                    </div>
                    <div class="widget-body">
                        <ul class="activity-list">
                            <li class="activity-item">
                                <div class="activity-icon bg-primary text-white">
                                    <i class="fas fa-calendar"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">Database Exam</p>
                                    <p class="activity-time">Tomorrow at 10:00 AM</p>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon bg-success text-white">
                                    <i class="fas fa-presentation"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">Project Presentation</p>
                                    <p class="activity-time">Friday at 2:00 PM</p>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon bg-warning text-white">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="activity-content">
                                    <p class="activity-title">Assignment Due</p>
                                    <p class="activity-time">Next Monday</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    // Students management content
    getStudentsContent: function () {
        return `
            <!-- Students Management Header -->
            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4">
                <div class="mb-3 mb-lg-0">
                    <h2 class="mb-1">Students Management</h2>
                    <p class="text-muted mb-0" id="studentsResultsCount">Loading students...</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="StudentsManager.exportToCSV()">
                        <i class="fas fa-download me-2"></i>Export CSV
                    </button>
                    <button class="btn btn-primary" onclick="StudentsManager.addStudent()">
                        <i class="fas fa-plus me-2"></i>Add Student
                    </button>
                </div>
            </div>

            <!-- Bulk Actions Bar (Hidden by default) -->
            <div id="bulkActionsContainer" class="alert alert-info d-flex justify-content-between align-items-center mb-4" style="display: none;">
                <div>
                    <i class="fas fa-check-circle me-2"></i>
                    <span id="selectedCount">0</span> student(s) selected
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="StudentsManager.bulkExport()">
                        <i class="fas fa-download me-1"></i>Export Selected
                    </button>
                    <button class="btn btn-outline-danger" onclick="StudentsManager.bulkDelete()">
                        <i class="fas fa-trash me-1"></i>Delete Selected
                    </button>
                </div>
            </div>
            
            <!-- Filters Card -->
            <div class="card mb-4">
                <div class="card-header">
                    <h6 class="mb-0">
                        <i class="fas fa-filter me-2"></i>Filter & Search
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Search Students</label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fas fa-search"></i>
                                </span>
                                <input type="text" id="studentSearch" class="form-control" 
                                       placeholder="Search by name, ID, email, phone...">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Campus</label>
                            <select id="campusFilter" class="form-select">
                                <option value="">All Campuses</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Course</label>
                            <select id="courseFilter" class="form-select">
                                <option value="">All Courses</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Status</label>
                            <select id="statusFilter" class="form-select">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Batch</label>
                            <select id="batchFilter" class="form-select">
                                <option value="">All Batches</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Students Table Card -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="fas fa-users me-2"></i>Students List
                    </h6>
                    <div class="d-flex align-items-center gap-2">
                        <label class="form-label mb-0 me-2">Show:</label>
                        <select id="itemsPerPage" class="form-select form-select-sm" style="width: auto;">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 50px;">
                                    <input type="checkbox" id="selectAllStudents" class="form-check-input">
                                </th>
                                <th style="width: 60px;">Photo</th>
                                <th style="width: 120px;">
                                    <a href="#" onclick="StudentsManager.sortStudents('studentId')" 
                                       class="text-decoration-none text-dark">
                                        Student ID
                                        <i id="sort-studentId" class="fas fa-sort sort-icon ms-1"></i>
                                    </a>
                                </th>
                                <th>
                                    <a href="#" onclick="StudentsManager.sortStudents('name')" 
                                       class="text-decoration-none text-dark">
                                        Name
                                        <i id="sort-name" class="fas fa-sort sort-icon ms-1"></i>
                                    </a>
                                </th>
                                <th>Phone</th>
                                <th>Campus</th>
                                <th>
                                    <a href="#" onclick="StudentsManager.sortStudents('coursesCount')" 
                                       class="text-decoration-none text-dark">
                                        Courses
                                        <i id="sort-coursesCount" class="fas fa-sort sort-icon ms-1"></i>
                                    </a>
                                </th>
                                <th>
                                    <a href="#" onclick="StudentsManager.sortStudents('status')" 
                                       class="text-decoration-none text-dark">
                                        Status
                                        <i id="sort-status" class="fas fa-sort sort-icon ms-1"></i>
                                    </a>
                                </th>
                                <th style="width: 180px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentsTableBody">
                            <!-- Dynamic content loaded by StudentsManager -->
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted" id="studentsResultsCount">Loading...</small>
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0" id="studentsPagination">
                                <!-- Dynamic pagination -->
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <script>
                // Initialize students management when content is loaded
                setTimeout(() => {
                    if (typeof StudentsManager !== 'undefined') {
                        StudentsManager.init();
                    }
                }, 100);
            </script>
        `;
    },

    // Other content methods would be implemented similarly...
    getCoursesContent: function () {
        return `
            <!-- Courses Management Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0 text-gray-800">Courses Management</h1>
                    <p class="text-muted">Manage courses, schedules, and enrollment</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" onclick="exportAllCourses()" title="Export All Courses">
                        <i class="fas fa-download me-2"></i>Export
                    </button>
                    <button class="btn btn-primary" onclick="addNewCourse()">
                        <i class="fas fa-plus me-2"></i>Add Course
                    </button>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-primary shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Courses
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-courses">0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-book fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-success shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Active Courses
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="active-courses">0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-info shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Total Enrollment
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-enrollment">0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-warning shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Avg. Enrollment
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="average-enrollment">0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-chart-line fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters and Search -->
            <div class="card shadow mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">
                        <i class="fas fa-filter me-2"></i>Filters & Search
                    </h6>
                    <button class="btn btn-sm btn-outline-secondary" onclick="resetFilters()">
                        <i class="fas fa-undo me-1"></i>Reset
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 mb-3">
                            <label class="form-label">Search</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" id="courses-search" 
                                    placeholder="Search courses, instructors...">
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-6 mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="status-filter">
                                <option value="">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Planned">Planned</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-md-6 mb-3">
                            <label class="form-label">Department</label>
                            <select class="form-select" id="department-filter">
                                <option value="">All Departments</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-md-6 mb-3">
                            <label class="form-label">Semester</label>
                            <select class="form-select" id="semester-filter">
                                <option value="">All Semesters</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-md-6 mb-3">
                            <label class="form-label">Campus</label>
                            <select class="form-select" id="campus-filter">
                                <option value="">All Campuses</option>
                            </select>
                        </div>
                        <div class="col-lg-1 col-md-6 mb-3">
                            <label class="form-label">Credits</label>
                            <select class="form-select" id="credits-filter">
                                <option value="">All</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bulk Actions Bar -->
            <div id="bulk-action-bar" class="alert alert-primary d-none align-items-center justify-content-between">
                <div>
                    <i class="fas fa-check-square me-2"></i>
                    <span id="selected-count">0</span> course(s) selected
                </div>
                <div class="btn-group">
                    <button class="btn btn-sm btn-success" id="bulk-activate" title="Activate Selected">
                        <i class="fas fa-play me-1"></i>Activate
                    </button>
                    <button class="btn btn-sm btn-warning" id="bulk-deactivate" title="Deactivate Selected">
                        <i class="fas fa-pause me-1"></i>Deactivate
                    </button>
                    <button class="btn btn-sm btn-info" id="bulk-export" title="Export Selected">
                        <i class="fas fa-download me-1"></i>Export
                    </button>
                    <button class="btn btn-sm btn-danger" id="bulk-delete" title="Delete Selected">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </div>
            </div>

            <!-- Courses Table -->
            <div class="card shadow">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">
                        <i class="fas fa-list me-2"></i>Courses List
                    </h6>
                    <div class="d-flex align-items-center gap-3">
                        <small class="text-muted" id="courses-results-info">Showing 0-0 of 0 courses</small>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-secondary" onclick="changeItemsPerPage(10)" id="items-10">10</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="changeItemsPerPage(25)" id="items-25">25</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="changeItemsPerPage(50)" id="items-50">50</button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 50px;">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="select-all-courses">
                                        </div>
                                    </th>
                                    <th class="sortable" data-sort="name" style="cursor: pointer;">
                                        Course <i class="fas fa-sort ms-1"></i>
                                    </th>
                                    <th class="sortable" data-sort="instructor" style="cursor: pointer;">
                                        Instructor <i class="fas fa-sort ms-1"></i>
                                    </th>
                                    <th class="sortable" data-sort="credits" style="cursor: pointer;">
                                        Credits <i class="fas fa-sort ms-1"></i>
                                    </th>
                                    <th>Schedule</th>
                                    <th class="sortable" data-sort="enrollment" style="cursor: pointer;">
                                        Enrollment <i class="fas fa-sort ms-1"></i>
                                    </th>
                                    <th class="sortable" data-sort="status" style="cursor: pointer;">
                                        Status <i class="fas fa-sort ms-1"></i>
                                    </th>
                                    <th style="width: 200px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="courses-table-body">
                                <!-- Course rows will be dynamically loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer">
                    <nav aria-label="Courses pagination">
                        <ul class="pagination pagination-sm justify-content-center mb-0" id="courses-pagination">
                            <!-- Pagination will be dynamically loaded here -->
                        </ul>
                    </nav>
                </div>
            </div>

            <!-- Notification Toast Container -->
            <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
            </div>

            <!-- Custom Styles -->
            <style>
                .course-info .course-code {
                    font-weight: 600;
                    color: #0d6efd;
                    font-size: 0.9rem;
                }
                
                .course-info .course-name {
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                
                .instructor-info .instructor-name {
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                
                .schedule-info .schedule-days {
                    font-weight: 500;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                }
                
                .schedule-info .schedule-time {
                    font-size: 0.85rem;
                    color: #6c757d;
                }
                
                .enrollment-info .enrollment-numbers {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .action-buttons .btn {
                    margin-right: 3px;
                    margin-bottom: 3px;
                }
                
                .sortable.sort-asc i:before {
                    content: "\\f0de";
                }
                
                .sortable.sort-desc i:before {
                    content: "\\f0dd";
                }
                
                .notification-toast {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 1056;
                    min-width: 300px;
                }
                
                .border-left-primary {
                    border-left: 0.25rem solid #4e73df !important;
                }
                
                .border-left-success {
                    border-left: 0.25rem solid #1cc88a !important;
                }
                
                .border-left-info {
                    border-left: 0.25rem solid #36b9cc !important;
                }
                
                .border-left-warning {
                    border-left: 0.25rem solid #f6c23e !important;
                }

                .text-xs {
                    font-size: 0.7rem;
                }

                #bulk-action-bar {
                    display: none !important;
                }

                #bulk-action-bar.d-flex {
                    display: flex !important;
                }
            </style>

            <script>
                // Initialize courses management when content is loaded
                setTimeout(() => {
                    if (typeof window.coursesManager === 'undefined') {
                        // Load courses.js and course-modals.js if not already loaded
                        const scripts = [
                            '/frontend/assets/js/courses.js',
                            '/frontend/assets/js/course-modals.js'
                        ];
                        
                        let loadedScripts = 0;
                        scripts.forEach(src => {
                            const script = document.createElement('script');
                            script.src = src;
                            script.onload = () => {
                                loadedScripts++;
                                if (loadedScripts === scripts.length) {
                                    // All scripts loaded, initialize
                                    if (typeof CoursesManager !== 'undefined') {
                                        window.coursesManager = new CoursesManager();
                                    }
                                    if (typeof CourseModals !== 'undefined') {
                                        window.CourseModals = new CourseModals();
                                    }
                                }
                            };
                            document.head.appendChild(script);
                        });
                    }
                }, 100);

                // Helper functions
                function resetFilters() {
                    document.getElementById('courses-search').value = '';
                    document.getElementById('status-filter').value = '';
                    document.getElementById('department-filter').value = '';
                    document.getElementById('semester-filter').value = '';
                    document.getElementById('campus-filter').value = '';
                    document.getElementById('credits-filter').value = '';
                    
                    if (window.coursesManager) {
                        window.coursesManager.filters = {
                            search: '', status: '', department: '', 
                            semester: '', instructor: '', campus: '', credits: ''
                        };
                        window.coursesManager.applyFilters();
                    }
                }

                function changeItemsPerPage(items) {
                    // Update button states
                    document.querySelectorAll('[id^="items-"]').forEach(btn => {
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-outline-secondary');
                    });
                    document.getElementById('items-' + items).classList.remove('btn-outline-secondary');
                    document.getElementById('items-' + items).classList.add('btn-primary');
                    
                    if (window.coursesManager) {
                        window.coursesManager.itemsPerPage = items;
                        window.coursesManager.currentPage = 1;
                        window.coursesManager.renderCoursesTable();
                    }
                }
            </script>
        `;
    },

    getCampusesContent: function () {
        // Initialize campus manager if not already done
        setTimeout(() => {
            if (window.campusManager) {
                window.campusManager.renderCampusInterface();
            }
        }, 100);

        return '<div id="campus-management-container">Loading campus management...</div>';
    },

    getProfileContent: function () {
        return '<div class="alert alert-info">Profile content coming soon...</div>';
    },

    getMyCoursesContent: function () {
        return '<div class="alert alert-info">My courses content coming soon...</div>';
    },

    getIdCardContent: function () {
        return '<div class="alert alert-info">ID Card content coming soon...</div>';
    },

    getIdCardsManagementContent: function () {
        return '<div class="alert alert-info">ID Cards management content coming soon...</div>';
    },

    getDefaultOverview: function () {
        return '<div class="alert alert-warning">Access denied or invalid role.</div>';
    },

    // Initialize charts
    initializeCharts: function () {
        this.initEnrollmentChart();
        this.initCampusChart();
    },

    // Initialize enrollment chart
    initEnrollmentChart: function () {
        const ctx = document.getElementById('enrollmentChart');
        if (!ctx) return;

        if (this.charts.enrollment) {
            this.charts.enrollment.destroy();
        }

        this.charts.enrollment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Student Enrollments',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgb(13, 110, 253)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    // Initialize campus chart
    initCampusChart: function () {
        const ctx = document.getElementById('campusChart');
        if (!ctx) return;

        if (this.charts.campus) {
            this.charts.campus.destroy();
        }

        this.charts.campus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Computer Science', 'Engineering', 'Business', 'Arts'],
                datasets: [{
                    data: [120, 89, 67, 48],
                    backgroundColor: [
                        'rgb(13, 110, 253)',
                        'rgb(25, 135, 84)',
                        'rgb(255, 193, 7)',
                        'rgb(220, 53, 69)'
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
    },

    // Setup global search
    setupGlobalSearch: function () {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;

        const debouncedSearch = Utils.debounce((query) => {
            if (query.length > 2) {
                console.log('Searching for:', query);
                // Implement search functionality
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    },

    // Setup notifications
    setupNotifications: function () {
        // Simulate real-time notifications
        setInterval(() => {
            const count = Math.floor(Math.random() * 10);
            const badge = document.getElementById('notificationCount');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        }, 30000); // Update every 30 seconds
    },

    // Modal functions (to be implemented)
    showAddStudentModal: function () {
        Utils.showToast('Add Student modal would open here', 'info');
    }
};

// Export Dashboard object
window.Dashboard = Dashboard;