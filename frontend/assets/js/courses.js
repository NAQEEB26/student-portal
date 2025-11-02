/**
 * Courses Management System
 * Comprehensive course management with CRUD operations, scheduling, enrollment, and instructor assignment
 */

class CoursesManager {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'name';
        this.sortDirection = 'asc';
        this.filters = {
            search: '',
            status: '',
            department: '',
            semester: '',
            instructor: '',
            campus: '',
            credits: ''
        };
        this.selectedCourses = new Set();
        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.renderCoursesTable();
        this.updateStatistics();
        this.setupAdvancedFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('courses-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        }

        // Filter changes
        const filterElements = ['status-filter', 'department-filter', 'semester-filter', 'instructor-filter', 'campus-filter', 'credits-filter'];
        filterElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', this.handleFilterChange.bind(this));
            }
        });

        // Bulk actions
        const selectAllCheckbox = document.getElementById('select-all-courses');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', this.handleSelectAll.bind(this));
        }

        // Sort functionality
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', this.handleSort.bind(this));
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-link')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.renderCoursesTable();
                }
            }
        });

        // Bulk action buttons
        const bulkButtons = ['bulk-activate', 'bulk-deactivate', 'bulk-delete', 'bulk-export'];
        bulkButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.handleBulkAction.bind(this));
            }
        });
    }

    loadMockData() {
        this.courses = [
            {
                id: 'CS101',
                name: 'Introduction to Computer Science',
                code: 'CS101',
                department: 'Computer Science',
                credits: 3,
                description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
                instructor: {
                    id: 'FAC001',
                    name: 'Dr. Sarah Wilson',
                    email: 'sarah.wilson@university.edu'
                },
                semester: 'Fall 2025',
                status: 'Active',
                campus: 'Main Campus',
                schedule: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    time: '09:00 AM - 10:00 AM',
                    room: 'CS Building - Room 101'
                },
                enrollmentLimit: 30,
                currentEnrollment: 25,
                prerequisites: [],
                materials: [
                    { type: 'Textbook', title: 'Computer Science: An Overview', required: true },
                    { type: 'Software', title: 'Python 3.9+', required: true }
                ],
                assessments: [
                    { type: 'Midterm Exam', weight: 30, date: '2025-10-15' },
                    { type: 'Final Exam', weight: 40, date: '2025-12-15' },
                    { type: 'Assignments', weight: 20, date: null },
                    { type: 'Participation', weight: 10, date: null }
                ],
                startDate: '2025-08-25',
                endDate: '2025-12-20',
                createdAt: '2025-08-01T10:00:00Z',
                updatedAt: '2025-10-15T14:30:00Z'
            },
            {
                id: 'MATH201',
                name: 'Calculus II',
                code: 'MATH201',
                department: 'Mathematics',
                credits: 4,
                description: 'Advanced calculus topics including integration techniques, sequences, and series.',
                instructor: {
                    id: 'FAC002',
                    name: 'Prof. Michael Chen',
                    email: 'michael.chen@university.edu'
                },
                semester: 'Fall 2025',
                status: 'Active',
                campus: 'Main Campus',
                schedule: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    time: '10:00 AM - 11:30 AM',
                    room: 'Math Building - Room 205'
                },
                enrollmentLimit: 25,
                currentEnrollment: 23,
                prerequisites: ['MATH101'],
                materials: [
                    { type: 'Textbook', title: 'Calculus: Early Transcendentals', required: true },
                    { type: 'Calculator', title: 'TI-84 Plus', required: true }
                ],
                assessments: [
                    { type: 'Midterm Exam', weight: 35, date: '2025-10-20' },
                    { type: 'Final Exam', weight: 45, date: '2025-12-18' },
                    { type: 'Homework', weight: 20, date: null }
                ],
                startDate: '2025-08-25',
                endDate: '2025-12-20',
                createdAt: '2025-08-01T10:00:00Z',
                updatedAt: '2025-10-20T09:15:00Z'
            },
            {
                id: 'ENG102',
                name: 'English Composition',
                code: 'ENG102',
                department: 'English',
                credits: 3,
                description: 'Advanced writing and composition skills for academic and professional communication.',
                instructor: {
                    id: 'FAC003',
                    name: 'Dr. Jennifer Martinez',
                    email: 'jennifer.martinez@university.edu'
                },
                semester: 'Fall 2025',
                status: 'Active',
                campus: 'North Campus',
                schedule: {
                    days: ['Tuesday', 'Thursday'],
                    time: '02:00 PM - 03:30 PM',
                    room: 'Liberal Arts - Room 302'
                },
                enrollmentLimit: 20,
                currentEnrollment: 18,
                prerequisites: ['ENG101'],
                materials: [
                    { type: 'Textbook', title: 'The Norton Field Guide to Writing', required: true },
                    { type: 'Software', title: 'Microsoft Office Suite', required: false }
                ],
                assessments: [
                    { type: 'Essays', weight: 50, date: null },
                    { type: 'Final Portfolio', weight: 30, date: '2025-12-10' },
                    { type: 'Participation', weight: 20, date: null }
                ],
                startDate: '2025-08-25',
                endDate: '2025-12-20',
                createdAt: '2025-08-01T10:00:00Z',
                updatedAt: '2025-11-01T16:45:00Z'
            },
            {
                id: 'PHYS301',
                name: 'Quantum Physics',
                code: 'PHYS301',
                department: 'Physics',
                credits: 4,
                description: 'Introduction to quantum mechanics and its applications in modern physics.',
                instructor: {
                    id: 'FAC004',
                    name: 'Dr. Robert Thompson',
                    email: 'robert.thompson@university.edu'
                },
                semester: 'Spring 2026',
                status: 'Planned',
                campus: 'Main Campus',
                schedule: {
                    days: ['Monday', 'Wednesday', 'Friday'],
                    time: '11:00 AM - 12:30 PM',
                    room: 'Physics Building - Room 401'
                },
                enrollmentLimit: 15,
                currentEnrollment: 0,
                prerequisites: ['PHYS201', 'MATH201'],
                materials: [
                    { type: 'Textbook', title: 'Introduction to Quantum Mechanics', required: true },
                    { type: 'Lab Equipment', title: 'Physics Lab Kit', required: true }
                ],
                assessments: [
                    { type: 'Midterm Exam', weight: 30, date: '2026-03-15' },
                    { type: 'Final Exam', weight: 40, date: '2026-05-15' },
                    { type: 'Lab Reports', weight: 25, date: null },
                    { type: 'Homework', weight: 5, date: null }
                ],
                startDate: '2026-01-20',
                endDate: '2026-05-15',
                createdAt: '2025-11-01T10:00:00Z',
                updatedAt: '2025-11-01T10:00:00Z'
            },
            {
                id: 'BUS205',
                name: 'Business Management',
                code: 'BUS205',
                department: 'Business',
                credits: 3,
                description: 'Fundamentals of business management including planning, organizing, and leadership.',
                instructor: {
                    id: 'FAC005',
                    name: 'Prof. Lisa Anderson',
                    email: 'lisa.anderson@university.edu'
                },
                semester: 'Fall 2025',
                status: 'Inactive',
                campus: 'Business Campus',
                schedule: {
                    days: ['Tuesday', 'Thursday'],
                    time: '01:00 PM - 02:30 PM',
                    room: 'Business Building - Room 150'
                },
                enrollmentLimit: 35,
                currentEnrollment: 32,
                prerequisites: ['BUS101'],
                materials: [
                    { type: 'Textbook', title: 'Principles of Management', required: true },
                    { type: 'Case Studies', title: 'Harvard Business Review Cases', required: true }
                ],
                assessments: [
                    { type: 'Case Analysis', weight: 40, date: null },
                    { type: 'Final Project', weight: 35, date: '2025-12-12' },
                    { type: 'Participation', weight: 25, date: null }
                ],
                startDate: '2025-08-25',
                endDate: '2025-12-20',
                createdAt: '2025-08-01T10:00:00Z',
                updatedAt: '2025-10-25T11:20:00Z'
            }
        ];

        this.filteredCourses = [...this.courses];
    }

    renderCoursesTable() {
        const tbody = document.getElementById('courses-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedCourses = this.filteredCourses.slice(startIndex, endIndex);

        tbody.innerHTML = paginatedCourses.map(course => {
            const statusClass = this.getStatusClass(course.status);
            const enrollmentPercentage = Math.round((course.currentEnrollment / course.enrollmentLimit) * 100);
            const enrollmentClass = this.getEnrollmentClass(enrollmentPercentage);

            return `
                <tr data-course-id="${course.id}">
                    <td>
                        <div class="form-check">
                            <input class="form-check-input course-checkbox" type="checkbox" value="${course.id}">
                        </div>
                    </td>
                    <td>
                        <div class="course-info">
                            <div class="course-code">${course.code}</div>
                            <div class="course-name">${course.name}</div>
                            <small class="text-muted">${course.department}</small>
                        </div>
                    </td>
                    <td>
                        <div class="instructor-info">
                            <div class="instructor-name">${course.instructor.name}</div>
                            <small class="text-muted">${course.instructor.email}</small>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-info">${course.credits} Credits</span>
                    </td>
                    <td>
                        <div class="schedule-info">
                            <div class="schedule-days">${course.schedule.days.join(', ')}</div>
                            <div class="schedule-time">${course.schedule.time}</div>
                            <small class="text-muted">${course.schedule.room}</small>
                        </div>
                    </td>
                    <td>
                        <div class="enrollment-info">
                            <div class="enrollment-numbers">${course.currentEnrollment}/${course.enrollmentLimit}</div>
                            <div class="progress mt-1" style="height: 6px;">
                                <div class="progress-bar bg-${enrollmentClass}" role="progressbar" 
                                     style="width: ${enrollmentPercentage}%" 
                                     aria-valuenow="${enrollmentPercentage}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100"></div>
                            </div>
                            <small class="text-muted">${enrollmentPercentage}% Full</small>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-${statusClass}">${course.status}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewCourse('${course.id}')" title="View Course">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="editCourse('${course.id}')" title="Edit Course">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="manageCourseEnrollment('${course.id}')" title="Manage Enrollment">
                                <i class="fas fa-users"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="viewCourseSchedule('${course.id}')" title="Schedule">
                                <i class="fas fa-calendar"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-dark" onclick="viewCourseReports('${course.id}')" title="Reports & Analytics">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" title="More Actions">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="duplicateCourse('${course.id}')">
                                        <i class="fas fa-copy me-2"></i>Duplicate
                                    </a></li>
                                    <li><a class="dropdown-item" href="#" onclick="exportCourseData('${course.id}')">
                                        <i class="fas fa-download me-2"></i>Export
                                    </a></li>
                                    <li><a class="dropdown-item" href="#" onclick="viewCourseReports('${course.id}')">
                                        <i class="fas fa-chart-bar me-2"></i>Reports
                                    </a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-${course.status === 'Active' ? 'warning' : 'success'}" href="#" onclick="toggleCourseStatus('${course.id}')">
                                        <i class="fas fa-${course.status === 'Active' ? 'pause' : 'play'} me-2"></i>${course.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </a></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="deleteCourse('${course.id}')">
                                        <i class="fas fa-trash me-2"></i>Delete
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        this.updatePagination();
        this.updateBulkActionVisibility();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
        const pagination = document.getElementById('courses-pagination');

        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.innerHTML = '';
            return;
        }

        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;

        // Update results info
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredCourses.length);
        const resultsInfo = document.getElementById('courses-results-info');
        if (resultsInfo) {
            resultsInfo.textContent = `Showing ${startIndex}-${endIndex} of ${this.filteredCourses.length} courses`;
        }
    }

    handleSearch(event) {
        this.filters.search = event.target.value.toLowerCase();
        this.applyFilters();
    }

    handleFilterChange(event) {
        const filterName = event.target.id.replace('-filter', '').replace('-', '');
        this.filters[filterName] = event.target.value;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredCourses = this.courses.filter(course => {
            const matchesSearch = !this.filters.search ||
                course.name.toLowerCase().includes(this.filters.search) ||
                course.code.toLowerCase().includes(this.filters.search) ||
                course.instructor.name.toLowerCase().includes(this.filters.search) ||
                course.department.toLowerCase().includes(this.filters.search);

            const matchesStatus = !this.filters.status || course.status === this.filters.status;
            const matchesDepartment = !this.filters.department || course.department === this.filters.department;
            const matchesSemester = !this.filters.semester || course.semester === this.filters.semester;
            const matchesInstructor = !this.filters.instructor || course.instructor.name === this.filters.instructor;
            const matchesCampus = !this.filters.campus || course.campus === this.filters.campus;
            const matchesCredits = !this.filters.credits || course.credits.toString() === this.filters.credits;

            return matchesSearch && matchesStatus && matchesDepartment &&
                matchesSemester && matchesInstructor && matchesCampus && matchesCredits;
        });

        this.currentPage = 1;
        this.applySorting();
        this.renderCoursesTable();
        this.updateStatistics();
    }

    handleSort(event) {
        const field = event.target.dataset.sort || event.target.closest('[data-sort]').dataset.sort;

        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        this.applySorting();
        this.renderCoursesTable();
        this.updateSortIndicators();
    }

    applySorting() {
        this.filteredCourses.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'code':
                    aValue = a.code.toLowerCase();
                    bValue = b.code.toLowerCase();
                    break;
                case 'instructor':
                    aValue = a.instructor.name.toLowerCase();
                    bValue = b.instructor.name.toLowerCase();
                    break;
                case 'credits':
                    aValue = a.credits;
                    bValue = b.credits;
                    break;
                case 'enrollment':
                    aValue = a.currentEnrollment / a.enrollmentLimit;
                    bValue = b.currentEnrollment / b.enrollmentLimit;
                    break;
                case 'status':
                    aValue = a.status.toLowerCase();
                    bValue = b.status.toLowerCase();
                    break;
                default:
                    aValue = a[this.sortField];
                    bValue = b[this.sortField];
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            const sortField = header.dataset.sort;
            if (sortField === this.sortField) {
                header.classList.add(`sort-${this.sortDirection}`);
            }
        });
    }

    handleSelectAll(event) {
        const isChecked = event.target.checked;
        const checkboxes = document.querySelectorAll('.course-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            if (isChecked) {
                this.selectedCourses.add(checkbox.value);
            } else {
                this.selectedCourses.delete(checkbox.value);
            }
        });

        this.updateBulkActionVisibility();
    }

    updateBulkActionVisibility() {
        // Update selection from checkboxes
        this.selectedCourses.clear();
        document.querySelectorAll('.course-checkbox:checked').forEach(checkbox => {
            this.selectedCourses.add(checkbox.value);
        });

        const bulkActionBar = document.getElementById('bulk-action-bar');
        const selectedCount = document.getElementById('selected-count');

        if (bulkActionBar && selectedCount) {
            if (this.selectedCourses.size > 0) {
                bulkActionBar.style.display = 'flex';
                selectedCount.textContent = this.selectedCourses.size;
            } else {
                bulkActionBar.style.display = 'none';
            }
        }

        // Update select all checkbox state
        const selectAllCheckbox = document.getElementById('select-all-courses');
        if (selectAllCheckbox) {
            const checkboxes = document.querySelectorAll('.course-checkbox');
            const checkedCheckboxes = document.querySelectorAll('.course-checkbox:checked');

            if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = false;
            } else if (checkedCheckboxes.length === checkboxes.length) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = true;
            } else {
                selectAllCheckbox.indeterminate = true;
            }
        }
    }

    handleBulkAction(event) {
        const action = event.target.id || event.target.closest('button').id;
        const selectedCourseIds = Array.from(this.selectedCourses);

        if (selectedCourseIds.length === 0) {
            this.showNotification('Please select courses first', 'warning');
            return;
        }

        switch (action) {
            case 'bulk-activate':
                this.bulkUpdateStatus(selectedCourseIds, 'Active');
                break;
            case 'bulk-deactivate':
                this.bulkUpdateStatus(selectedCourseIds, 'Inactive');
                break;
            case 'bulk-delete':
                this.bulkDeleteCourses(selectedCourseIds);
                break;
            case 'bulk-export':
                this.bulkExportCourses(selectedCourseIds);
                break;
        }
    }

    bulkUpdateStatus(courseIds, status) {
        if (confirm(`Are you sure you want to ${status.toLowerCase()} ${courseIds.length} course(s)?`)) {
            courseIds.forEach(id => {
                const course = this.courses.find(c => c.id === id);
                if (course) {
                    course.status = status;
                    course.updatedAt = new Date().toISOString();
                }
            });

            this.selectedCourses.clear();
            this.renderCoursesTable();
            this.updateStatistics();
            this.showNotification(`Successfully ${status.toLowerCase()}d ${courseIds.length} course(s)`, 'success');
        }
    }

    bulkDeleteCourses(courseIds) {
        if (confirm(`Are you sure you want to delete ${courseIds.length} course(s)? This action cannot be undone.`)) {
            this.courses = this.courses.filter(course => !courseIds.includes(course.id));
            this.selectedCourses.clear();
            this.applyFilters();
            this.showNotification(`Successfully deleted ${courseIds.length} course(s)`, 'success');
        }
    }

    bulkExportCourses(courseIds) {
        const selectedCourses = this.courses.filter(course => courseIds.includes(course.id));
        this.exportToCSV(selectedCourses, 'selected_courses.csv');
        this.showNotification(`Exported ${courseIds.length} course(s)`, 'success');
    }

    exportToCSV(courses, filename) {
        const headers = ['Course Code', 'Course Name', 'Department', 'Instructor', 'Credits', 'Status', 'Enrollment', 'Campus', 'Semester'];
        const csvContent = [
            headers.join(','),
            ...courses.map(course => [
                course.code,
                `"${course.name}"`,
                course.department,
                `"${course.instructor.name}"`,
                course.credits,
                course.status,
                `${course.currentEnrollment}/${course.enrollmentLimit}`,
                course.campus,
                course.semester
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    updateStatistics() {
        const stats = {
            total: this.courses.length,
            active: this.courses.filter(c => c.status === 'Active').length,
            inactive: this.courses.filter(c => c.status === 'Inactive').length,
            planned: this.courses.filter(c => c.status === 'Planned').length,
            totalEnrollment: this.courses.reduce((sum, c) => sum + c.currentEnrollment, 0),
            averageEnrollment: 0
        };

        if (stats.total > 0) {
            stats.averageEnrollment = Math.round(stats.totalEnrollment / stats.total);
        }

        // Update stat cards
        this.updateStatCard('total-courses', stats.total);
        this.updateStatCard('active-courses', stats.active);
        this.updateStatCard('total-enrollment', stats.totalEnrollment);
        this.updateStatCard('average-enrollment', stats.averageEnrollment);
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }

    setupAdvancedFilters() {
        // Populate filter dropdowns with unique values
        this.populateFilterDropdown('department-filter', 'department');
        this.populateFilterDropdown('semester-filter', 'semester');
        this.populateFilterDropdown('instructor-filter', 'instructor', 'name');
        this.populateFilterDropdown('campus-filter', 'campus');
        this.populateFilterDropdown('credits-filter', 'credits');
    }

    populateFilterDropdown(elementId, field, subField = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let values = [...new Set(this.courses.map(course => {
            if (subField && course[field] && course[field][subField]) {
                return course[field][subField];
            }
            return course[field];
        }))].sort();

        const currentValue = element.value;
        element.innerHTML = `<option value="">All ${field.charAt(0).toUpperCase() + field.slice(1)}s</option>`;

        values.forEach(value => {
            if (value) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                element.appendChild(option);
            }
        });

        element.value = currentValue;
    }

    getStatusClass(status) {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            case 'Planned': return 'info';
            default: return 'primary';
        }
    }

    getEnrollmentClass(percentage) {
        if (percentage >= 90) return 'danger';
        if (percentage >= 75) return 'warning';
        return 'success';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Add to page
        const container = document.querySelector('.main-content .container-fluid');
        if (container) {
            container.insertBefore(notification, container.firstChild);
        }

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public methods for external access
    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    addCourse(courseData) {
        const newCourse = {
            ...courseData,
            id: this.generateCourseId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.courses.push(newCourse);
        this.applyFilters();
        this.showNotification('Course added successfully', 'success');
        return newCourse;
    }

    updateCourse(id, courseData) {
        const courseIndex = this.courses.findIndex(course => course.id === id);
        if (courseIndex !== -1) {
            this.courses[courseIndex] = {
                ...this.courses[courseIndex],
                ...courseData,
                updatedAt: new Date().toISOString()
            };
            this.applyFilters();
            this.showNotification('Course updated successfully', 'success');
            return this.courses[courseIndex];
        }
        return null;
    }

    deleteCourse(id) {
        const courseIndex = this.courses.findIndex(course => course.id === id);
        if (courseIndex !== -1) {
            this.courses.splice(courseIndex, 1);
            this.applyFilters();
            this.showNotification('Course deleted successfully', 'success');
            return true;
        }
        return false;
    }

    generateCourseId() {
        return 'COURSE_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}

// Global functions for button handlers
window.addNewCourse = function () {
    if (window.CourseModals) {
        window.CourseModals.showAddModal();
    }
};

window.viewCourse = function (courseId) {
    if (window.CourseModals) {
        window.CourseModals.showViewModal(courseId);
    }
};

window.editCourse = function (courseId) {
    if (window.CourseModals) {
        window.CourseModals.showEditModal(courseId);
    }
};

window.deleteCourse = function (courseId) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        window.coursesManager.deleteCourse(courseId);
    }
};

window.toggleCourseStatus = function (courseId) {
    const course = window.coursesManager.getCourseById(courseId);
    if (course) {
        const newStatus = course.status === 'Active' ? 'Inactive' : 'Active';
        window.coursesManager.updateCourse(courseId, { status: newStatus });
    }
};

window.duplicateCourse = function (courseId) {
    const course = window.coursesManager.getCourseById(courseId);
    if (course) {
        const duplicatedCourse = {
            ...course,
            name: course.name + ' (Copy)',
            code: course.code + '_COPY',
            currentEnrollment: 0,
            status: 'Planned'
        };
        delete duplicatedCourse.id;
        window.coursesManager.addCourse(duplicatedCourse);
    }
};

window.exportCourseData = function (courseId) {
    const course = window.coursesManager.getCourseById(courseId);
    if (course) {
        window.coursesManager.exportToCSV([course], `${course.code}_data.csv`);
    }
};

window.manageCourseEnrollment = function (courseId) {
    if (window.CourseEnrollment) {
        window.CourseEnrollment.showEnrollmentModal(courseId);
    }
};

window.viewCourseSchedule = function (courseId) {
    if (window.CourseSchedule) {
        window.CourseSchedule.showScheduleModal(courseId);
    }
};

window.viewCourseReports = function (courseId) {
    if (window.CourseReports) {
        window.CourseReports.showReportsModal(courseId);
    }
};

window.exportAllCourses = function () {
    window.coursesManager.exportToCSV(window.coursesManager.filteredCourses, 'all_courses.csv');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.coursesManager = new CoursesManager();
    }
});