/**
 * Faculty Management System
 * Comprehensive faculty profiles and academic management
 */

class FacultyManager {
    constructor() {
        this.faculty = [];
        this.filteredFaculty = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.filters = {
            search: '',
            department: '',
            position: '',
            status: '',
            campus: ''
        };
        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
    }

    loadMockData() {
        this.faculty = [
            {
                id: 'faculty_001',
                employeeId: 'EMP001',
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@university.edu',
                phone: '(555) 123-4567',
                department: 'Computer Science',
                position: 'Professor',
                status: 'Active',
                campus: 'Main Campus',
                office: 'CS Building, Room 301',
                officeHours: 'Mon-Wed-Fri 2:00-4:00 PM',
                hireDate: '2015-08-15',
                education: [
                    { degree: 'Ph.D. Computer Science', institution: 'MIT', year: 2010 },
                    { degree: 'M.S. Computer Science', institution: 'Stanford', year: 2006 },
                    { degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: 2004 }
                ],
                specializations: ['Machine Learning', 'Data Science', 'AI Ethics'],
                researchInterests: ['Artificial Intelligence', 'Natural Language Processing', 'Computer Vision'],
                courses: ['CS 101', 'CS 301', 'CS 401'],
                publications: 45,
                awards: ['Excellence in Teaching 2022', 'Research Grant NSF 2021'],
                rating: 4.8,
                totalStudents: 156,
                photo: 'assets/images/faculty/sarah-johnson.jpg',
                bio: 'Dr. Johnson is a renowned expert in machine learning with over 15 years of experience in both academia and industry.',
                salary: 95000,
                contractType: 'Tenure Track',
                workload: {
                    teaching: 60,
                    research: 30,
                    service: 10
                },
                performance: {
                    teachingScore: 4.8,
                    researchScore: 4.6,
                    serviceScore: 4.4,
                    overallScore: 4.6
                }
            },
            {
                id: 'faculty_002',
                employeeId: 'EMP002',
                name: 'Prof. Michael Chen',
                email: 'michael.chen@university.edu',
                phone: '(555) 234-5678',
                department: 'Mathematics',
                position: 'Associate Professor',
                status: 'Active',
                campus: 'Main Campus',
                office: 'Math Building, Room 205',
                officeHours: 'Tue-Thu 1:00-3:00 PM',
                hireDate: '2018-01-20',
                education: [
                    { degree: 'Ph.D. Mathematics', institution: 'Harvard', year: 2014 },
                    { degree: 'M.S. Applied Mathematics', institution: 'Caltech', year: 2010 },
                    { degree: 'B.S. Mathematics', institution: 'Princeton', year: 2008 }
                ],
                specializations: ['Abstract Algebra', 'Number Theory', 'Cryptography'],
                researchInterests: ['Algebraic Geometry', 'Mathematical Cryptography', 'Quantum Mathematics'],
                courses: ['MATH 201', 'MATH 305', 'MATH 450'],
                publications: 28,
                awards: ['Young Researcher Award 2020'],
                rating: 4.6,
                totalStudents: 134,
                photo: 'assets/images/faculty/michael-chen.jpg',
                bio: 'Prof. Chen specializes in abstract algebra and its applications to modern cryptography.',
                salary: 82000,
                contractType: 'Tenure Track',
                workload: {
                    teaching: 50,
                    research: 40,
                    service: 10
                },
                performance: {
                    teachingScore: 4.6,
                    researchScore: 4.7,
                    serviceScore: 4.3,
                    overallScore: 4.5
                }
            },
            {
                id: 'faculty_003',
                employeeId: 'EMP003',
                name: 'Dr. Emily Rodriguez',
                email: 'emily.rodriguez@university.edu',
                phone: '(555) 345-6789',
                department: 'Biology',
                position: 'Assistant Professor',
                status: 'Active',
                campus: 'Medical Campus',
                office: 'Bio Lab, Room 401',
                officeHours: 'Mon-Wed 10:00-12:00 PM',
                hireDate: '2021-09-01',
                education: [
                    { degree: 'Ph.D. Molecular Biology', institution: 'Johns Hopkins', year: 2018 },
                    { degree: 'M.S. Biochemistry', institution: 'Yale', year: 2014 },
                    { degree: 'B.S. Biology', institution: 'UCLA', year: 2012 }
                ],
                specializations: ['Molecular Biology', 'Genetics', 'Biotechnology'],
                researchInterests: ['Gene Therapy', 'CRISPR Technology', 'Cancer Research'],
                courses: ['BIO 101', 'BIO 250', 'BIO 380'],
                publications: 15,
                awards: ['Early Career Research Award 2023'],
                rating: 4.7,
                totalStudents: 98,
                photo: 'assets/images/faculty/emily-rodriguez.jpg',
                bio: 'Dr. Rodriguez is a rising star in molecular biology, focusing on gene therapy applications.',
                salary: 75000,
                contractType: 'Tenure Track',
                workload: {
                    teaching: 45,
                    research: 45,
                    service: 10
                },
                performance: {
                    teachingScore: 4.7,
                    researchScore: 4.8,
                    serviceScore: 4.2,
                    overallScore: 4.6
                }
            },
            {
                id: 'faculty_004',
                employeeId: 'EMP004',
                name: 'Prof. David Wilson',
                email: 'david.wilson@university.edu',
                phone: '(555) 456-7890',
                department: 'Engineering',
                position: 'Professor',
                status: 'Active',
                campus: 'North Campus',
                office: 'Engineering Hall, Room 503',
                officeHours: 'Tue-Thu 3:00-5:00 PM',
                hireDate: '2012-02-15',
                education: [
                    { degree: 'Ph.D. Mechanical Engineering', institution: 'Georgia Tech', year: 2008 },
                    { degree: 'M.S. Engineering', institution: 'Carnegie Mellon', year: 2004 },
                    { degree: 'B.S. Mechanical Engineering', institution: 'Purdue', year: 2002 }
                ],
                specializations: ['Robotics', 'Automation', 'Control Systems'],
                researchInterests: ['Autonomous Systems', 'Industrial Robotics', 'AI in Engineering'],
                courses: ['ENG 201', 'ENG 350', 'ENG 475'],
                publications: 52,
                awards: ['IEEE Fellow 2021', 'Best Paper Award 2020'],
                rating: 4.9,
                totalStudents: 203,
                photo: 'assets/images/faculty/david-wilson.jpg',
                bio: 'Prof. Wilson is a leading expert in robotics and automation with extensive industry experience.',
                salary: 105000,
                contractType: 'Tenured',
                workload: {
                    teaching: 40,
                    research: 50,
                    service: 10
                },
                performance: {
                    teachingScore: 4.9,
                    researchScore: 4.8,
                    serviceScore: 4.7,
                    overallScore: 4.8
                }
            },
            {
                id: 'faculty_005',
                employeeId: 'EMP005',
                name: 'Dr. Lisa Anderson',
                email: 'lisa.anderson@university.edu',
                phone: '(555) 567-8901',
                department: 'Psychology',
                position: 'Associate Professor',
                status: 'On Leave',
                campus: 'Main Campus',
                office: 'Psychology Building, Room 102',
                officeHours: 'Currently on sabbatical',
                hireDate: '2017-07-01',
                education: [
                    { degree: 'Ph.D. Clinical Psychology', institution: 'NYU', year: 2013 },
                    { degree: 'M.A. Psychology', institution: 'Columbia', year: 2009 },
                    { degree: 'B.A. Psychology', institution: 'Vassar', year: 2007 }
                ],
                specializations: ['Clinical Psychology', 'Cognitive Therapy', 'Mental Health'],
                researchInterests: ['Depression Treatment', 'Anxiety Disorders', 'Therapeutic Interventions'],
                courses: ['PSY 101', 'PSY 305', 'PSY 420'],
                publications: 31,
                awards: ['Clinical Excellence Award 2022'],
                rating: 4.5,
                totalStudents: 87,
                photo: 'assets/images/faculty/lisa-anderson.jpg',
                bio: 'Dr. Anderson is a clinical psychologist specializing in mood disorders and therapeutic interventions.',
                salary: 78000,
                contractType: 'Tenure Track',
                workload: {
                    teaching: 0,
                    research: 100,
                    service: 0
                },
                performance: {
                    teachingScore: 4.5,
                    researchScore: 4.6,
                    serviceScore: 4.3,
                    overallScore: 4.5
                }
            },
            {
                id: 'faculty_006',
                employeeId: 'EMP006',
                name: 'Prof. James Thompson',
                email: 'james.thompson@university.edu',
                phone: '(555) 678-9012',
                department: 'Business',
                position: 'Lecturer',
                status: 'Active',
                campus: 'Main Campus',
                office: 'Business Center, Room 210',
                officeHours: 'Mon-Fri 11:00 AM-12:00 PM',
                hireDate: '2020-03-10',
                education: [
                    { degree: 'MBA', institution: 'Wharton', year: 2016 },
                    { degree: 'B.S. Finance', institution: 'NYU Stern', year: 2012 }
                ],
                specializations: ['Finance', 'Investment Management', 'Corporate Strategy'],
                researchInterests: ['Financial Markets', 'Risk Management', 'Behavioral Finance'],
                courses: ['BUS 101', 'BUS 250', 'BUS 380'],
                publications: 8,
                awards: ['Industry Partnership Award 2023'],
                rating: 4.4,
                totalStudents: 145,
                photo: 'assets/images/faculty/james-thompson.jpg',
                bio: 'Prof. Thompson brings real-world finance experience to the classroom with 10 years in investment banking.',
                salary: 68000,
                contractType: 'Contract',
                workload: {
                    teaching: 80,
                    research: 10,
                    service: 10
                },
                performance: {
                    teachingScore: 4.4,
                    researchScore: 3.8,
                    serviceScore: 4.2,
                    overallScore: 4.1
                }
            }
        ];

        this.applyFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('faculty-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filter dropdowns
        const filterSelects = ['faculty-department-filter', 'faculty-position-filter', 'faculty-status-filter', 'faculty-campus-filter'];
        filterSelects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', this.handleFilterChange.bind(this));
            }
        });

        // Sort functionality
        const sortSelect = document.getElementById('faculty-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSort.bind(this));
        }

        // Items per page
        const itemsPerPageSelect = document.getElementById('faculty-items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', this.handleItemsPerPageChange.bind(this));
        }

        // View toggle
        const viewToggle = document.querySelectorAll('input[name="faculty-view"]');
        viewToggle.forEach(toggle => {
            toggle.addEventListener('change', this.handleViewToggle.bind(this));
        });
    }

    renderFacultyInterface() {
        const facultyContent = `
            <!-- Faculty Management Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="h3 mb-0">Faculty Management</h2>
                    <p class="text-muted">Manage faculty profiles and academic assignments</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="addFaculty()">
                        <i class="fas fa-plus me-2"></i>Add Faculty
                    </button>
                    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-cog me-2"></i>Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="exportFacultyData()">
                            <i class="fas fa-download me-2"></i>Export Data
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="generateFacultyReport()">
                            <i class="fas fa-chart-bar me-2"></i>Performance Report
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="facultyWorkloadAnalysis()">
                            <i class="fas fa-tasks me-2"></i>Workload Analysis
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="facultySettings()">
                            <i class="fas fa-cog me-2"></i>Settings
                        </a></li>
                    </ul>
                </div>
            </div>

            <!-- Faculty Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card border-left-primary h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Faculty
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.faculty.length}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-user-tie fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-success h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Active Faculty
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getActiveFacultyCount()}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-check-circle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-info h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Avg. Rating
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getAverageRating()}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-star fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-warning h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Total Students
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getTotalStudents().toLocaleString()}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Faculty Filters and Controls -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="faculty-search" placeholder="Search faculty...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="faculty-department-filter">
                        <option value="">All Departments</option>
                        ${this.getDepartmentOptions()}
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="faculty-position-filter">
                        <option value="">All Positions</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Adjunct">Adjunct</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="faculty-status-filter">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Sabbatical">Sabbatical</option>
                        <option value="Retired">Retired</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="faculty-sort">
                        <option value="name">Sort by Name</option>
                        <option value="department">Department</option>
                        <option value="position">Position</option>
                        <option value="rating">Rating</option>
                        <option value="hireDate">Hire Date</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-secondary" onclick="resetFacultyFilters()" title="Reset Filters">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>

            <!-- View Options -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <span class="text-muted">Showing ${this.getDisplayInfo()} of ${this.filteredFaculty.length} faculty members</span>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="btn-group" role="group">
                        <input type="radio" class="btn-check" name="faculty-view" id="faculty-grid-view" checked>
                        <label class="btn btn-outline-primary" for="faculty-grid-view">
                            <i class="fas fa-th"></i> Grid
                        </label>
                        <input type="radio" class="btn-check" name="faculty-view" id="faculty-table-view">
                        <label class="btn btn-outline-primary" for="faculty-table-view">
                            <i class="fas fa-list"></i> Table
                        </label>
                    </div>
                    <select class="form-select" id="faculty-items-per-page" style="width: auto;">
                        <option value="12">12 per page</option>
                        <option value="24">24 per page</option>
                        <option value="48">48 per page</option>
                    </select>
                </div>
            </div>

            <!-- Faculty Content Container -->
            <div id="faculty-content-container">
                ${this.renderFacultyGrid()}
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="text-muted">
                    Total faculty: ${this.filteredFaculty.length}
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            </div>
        `;

        const container = document.getElementById('main-content') || document.getElementById('faculty-management-container');
        if (container) {
            container.innerHTML = facultyContent;
            this.setupEventListeners();
        }
    }

    renderFacultyGrid() {
        return `
            <div class="row" id="faculty-grid">
                ${this.getPaginatedFaculty().map(faculty => this.renderFacultyCard(faculty)).join('')}
            </div>
        `;
    }

    renderFacultyCard(faculty) {
        return `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card faculty-card h-100">
                    <div class="card-header text-center bg-white border-bottom-0">
                        <div class="faculty-avatar mb-3">
                            <img src="${faculty.photo}" alt="${faculty.name}" class="rounded-circle" 
                                 style="width: 80px; height: 80px; object-fit: cover;"
                                 onerror="this.src='assets/images/default-avatar.png'">
                        </div>
                        <h6 class="card-title mb-1">${faculty.name}</h6>
                        <small class="text-muted">${faculty.position}</small>
                        <div class="mt-2">
                            <span class="badge bg-${this.getStatusBadgeClass(faculty.status)}">${faculty.status}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="faculty-info">
                            <div class="info-item mb-2">
                                <i class="fas fa-building text-muted me-2"></i>
                                <small>${faculty.department}</small>
                            </div>
                            <div class="info-item mb-2">
                                <i class="fas fa-map-marker-alt text-muted me-2"></i>
                                <small>${faculty.campus}</small>
                            </div>
                            <div class="info-item mb-2">
                                <i class="fas fa-envelope text-muted me-2"></i>
                                <small>${faculty.email}</small>
                            </div>
                            <div class="info-item mb-2">
                                <i class="fas fa-users text-muted me-2"></i>
                                <small>${faculty.totalStudents} students</small>
                            </div>
                            <div class="info-item mb-3">
                                <i class="fas fa-star text-warning me-2"></i>
                                <small>${faculty.rating}/5.0</small>
                                <div class="rating-stars">
                                    ${this.renderStars(faculty.rating)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="specializations mb-3">
                            <small class="text-muted d-block mb-1">Specializations:</small>
                            <div class="d-flex flex-wrap gap-1">
                                ${faculty.specializations.slice(0, 2).map(spec =>
            `<span class="badge bg-light text-dark">${spec}</span>`
        ).join('')}
                                ${faculty.specializations.length > 2 ? '<span class="badge bg-secondary">+' + (faculty.specializations.length - 2) + '</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary btn-sm" onclick="viewFaculty('${faculty.id}')" title="View Profile">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="editFaculty('${faculty.id}')" title="Edit Faculty">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-info btn-sm" onclick="facultyCourses('${faculty.id}')" title="Courses">
                                <i class="fas fa-book"></i>
                            </button>
                            <button class="btn btn-outline-warning btn-sm" onclick="facultyPerformance('${faculty.id}')" title="Performance">
                                <i class="fas fa-chart-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-muted"></i>';
        }
        return stars;
    }

    renderFacultyTable() {
        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Faculty</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Campus</th>
                            <th>Students</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.getPaginatedFaculty().map(faculty => this.renderFacultyRow(faculty)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderFacultyRow(faculty) {
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${faculty.photo}" alt="${faculty.name}" class="rounded-circle me-3" 
                             style="width: 40px; height: 40px; object-fit: cover;"
                             onerror="this.src='assets/images/default-avatar.png'">
                        <div>
                            <div class="fw-bold">${faculty.name}</div>
                            <small class="text-muted">${faculty.email}</small>
                        </div>
                    </div>
                </td>
                <td>${faculty.department}</td>
                <td>
                    <span class="badge bg-${this.getPositionBadgeClass(faculty.position)}">${faculty.position}</span>
                </td>
                <td>${faculty.campus}</td>
                <td>${faculty.totalStudents}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="me-2">${faculty.rating}</span>
                        <div class="rating-stars small">
                            ${this.renderStars(faculty.rating)}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusBadgeClass(faculty.status)}">${faculty.status}</span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewFaculty('${faculty.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="editFaculty('${faculty.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="facultyCourses('${faculty.id}')" title="Courses">
                            <i class="fas fa-book"></i>
                        </button>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="facultyPerformance('${faculty.id}')">
                                    <i class="fas fa-chart-line me-2"></i>Performance
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="facultySchedule('${faculty.id}')">
                                    <i class="fas fa-calendar me-2"></i>Schedule
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deleteFaculty('${faculty.id}')">
                                    <i class="fas fa-trash me-2"></i>Delete
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    // Helper methods
    getActiveFacultyCount() {
        return this.faculty.filter(faculty => faculty.status === 'Active').length;
    }

    getAverageRating() {
        if (this.faculty.length === 0) return '0.0';
        const totalRating = this.faculty.reduce((total, faculty) => total + faculty.rating, 0);
        return (totalRating / this.faculty.length).toFixed(1);
    }

    getTotalStudents() {
        return this.faculty.reduce((total, faculty) => total + faculty.totalStudents, 0);
    }

    getDepartmentOptions() {
        const departments = [...new Set(this.faculty.map(faculty => faculty.department))];
        return departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
    }

    getStatusBadgeClass(status) {
        const classes = {
            'Active': 'success',
            'On Leave': 'warning',
            'Sabbatical': 'info',
            'Retired': 'secondary'
        };
        return classes[status] || 'secondary';
    }

    getPositionBadgeClass(position) {
        const classes = {
            'Professor': 'primary',
            'Associate Professor': 'info',
            'Assistant Professor': 'success',
            'Lecturer': 'warning',
            'Adjunct': 'secondary'
        };
        return classes[position] || 'secondary';
    }

    // Event handlers
    handleSearch(event) {
        this.filters.search = event.target.value;
        this.applyFilters();
        this.updateFacultyDisplay();
    }

    handleFilterChange(event) {
        const filterId = event.target.id;
        const value = event.target.value;

        switch (filterId) {
            case 'faculty-department-filter':
                this.filters.department = value;
                break;
            case 'faculty-position-filter':
                this.filters.position = value;
                break;
            case 'faculty-status-filter':
                this.filters.status = value;
                break;
            case 'faculty-campus-filter':
                this.filters.campus = value;
                break;
        }

        this.applyFilters();
        this.updateFacultyDisplay();
    }

    handleSort(event) {
        this.sortBy = event.target.value;
        this.applyFilters();
        this.updateFacultyDisplay();
    }

    handleItemsPerPageChange(event) {
        this.itemsPerPage = parseInt(event.target.value);
        this.currentPage = 1;
        this.updateFacultyDisplay();
    }

    handleViewToggle(event) {
        const isGridView = event.target.id === 'faculty-grid-view';
        this.updateFacultyDisplay(isGridView);
    }

    applyFilters() {
        this.filteredFaculty = this.faculty.filter(faculty => {
            const matchesSearch = this.filters.search === '' ||
                faculty.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                faculty.email.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                faculty.specializations.some(spec => spec.toLowerCase().includes(this.filters.search.toLowerCase()));

            const matchesDepartment = this.filters.department === '' || faculty.department === this.filters.department;
            const matchesPosition = this.filters.position === '' || faculty.position === this.filters.position;
            const matchesStatus = this.filters.status === '' || faculty.status === this.filters.status;
            const matchesCampus = this.filters.campus === '' || faculty.campus === this.filters.campus;

            return matchesSearch && matchesDepartment && matchesPosition && matchesStatus && matchesCampus;
        });

        this.sortFaculty();
    }

    sortFaculty() {
        this.filteredFaculty.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    getPaginatedFaculty() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredFaculty.slice(startIndex, endIndex);
    }

    updateFacultyDisplay(isGridView = true) {
        const container = document.getElementById('faculty-content-container');
        if (container) {
            if (isGridView) {
                container.innerHTML = this.renderFacultyGrid();
            } else {
                container.innerHTML = this.renderFacultyTable();
            }
        }

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const paginationContainer = document.querySelector('.d-flex.justify-content-between.align-items-center.mt-4');
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <div class="text-muted">
                    Total faculty: ${this.filteredFaculty.length}
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            `;
        }
    }

    getDisplayInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredFaculty.length);
        return `${start}-${end}`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredFaculty.length / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let pagination = '<ul class="pagination pagination-sm mb-0">';

        // Previous button
        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="facultyManager.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="facultyManager.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="facultyManager.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul>';
        return pagination;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredFaculty.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateFacultyDisplay();
        }
    }

    // Faculty CRUD operations
    getFacultyById(id) {
        return this.faculty.find(faculty => faculty.id === id);
    }

    addFaculty(facultyData) {
        const newFaculty = {
            id: 'faculty_' + Date.now(),
            ...facultyData,
            createdAt: new Date().toISOString()
        };
        this.faculty.push(newFaculty);
        this.applyFilters();
        this.updateFacultyDisplay();
        return newFaculty;
    }

    updateFaculty(id, updates) {
        const index = this.faculty.findIndex(faculty => faculty.id === id);
        if (index !== -1) {
            this.faculty[index] = { ...this.faculty[index], ...updates };
            this.applyFilters();
            this.updateFacultyDisplay();
            return this.faculty[index];
        }
        return null;
    }

    deleteFaculty(id) {
        const index = this.faculty.findIndex(faculty => faculty.id === id);
        if (index !== -1) {
            this.faculty.splice(index, 1);
            this.applyFilters();
            this.updateFacultyDisplay();
            return true;
        }
        return false;
    }

    exportToCSV(faculty = this.filteredFaculty, filename = 'faculty.csv') {
        const headers = ['Name', 'Employee ID', 'Department', 'Position', 'Status', 'Campus', 'Email', 'Rating', 'Students', 'Publications'];
        const csvContent = [
            headers.join(','),
            ...faculty.map(faculty => [
                `"${faculty.name}"`,
                faculty.employeeId,
                faculty.department,
                faculty.position,
                faculty.status,
                faculty.campus,
                faculty.email,
                faculty.rating,
                faculty.totalStudents,
                faculty.publications
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Global functions for faculty management
window.addFaculty = function () {
    if (window.facultyModals) {
        window.facultyModals.showAddModal();
    }
};

window.editFaculty = function (facultyId) {
    if (window.facultyModals) {
        window.facultyModals.showEditModal(facultyId);
    }
};

window.viewFaculty = function (facultyId) {
    if (window.facultyModals) {
        window.facultyModals.showViewModal(facultyId);
    }
};

window.deleteFaculty = function (facultyId) {
    if (confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
        window.facultyManager.deleteFaculty(facultyId);
    }
};

window.facultyCourses = function (facultyId) {
    console.log('View courses for faculty:', facultyId);
};

window.facultyPerformance = function (facultyId) {
    console.log('View performance for faculty:', facultyId);
};

window.facultySchedule = function (facultyId) {
    console.log('View schedule for faculty:', facultyId);
};

window.resetFacultyFilters = function () {
    document.getElementById('faculty-search').value = '';
    document.getElementById('faculty-department-filter').value = '';
    document.getElementById('faculty-position-filter').value = '';
    document.getElementById('faculty-status-filter').value = '';

    window.facultyManager.filters = {
        search: '',
        department: '',
        position: '',
        status: '',
        campus: ''
    };

    window.facultyManager.applyFilters();
    window.facultyManager.updateFacultyDisplay();
};

window.exportFacultyData = function () {
    window.facultyManager.exportToCSV();
};

window.generateFacultyReport = function () {
    console.log('Generate faculty report');
};

window.facultyWorkloadAnalysis = function () {
    console.log('Faculty workload analysis');
};

window.facultySettings = function () {
    console.log('Faculty settings');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.facultyManager = new FacultyManager();
    }
});