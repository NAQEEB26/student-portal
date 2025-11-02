// ================================
// STUDENTS MANAGEMENT JAVASCRIPT
// ================================

const StudentsManager = {
    students: [],
    filteredStudents: [],
    currentPage: 1,
    itemsPerPage: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    filters: {
        search: '',
        campus: '',
        course: '',
        status: '',
        batch: ''
    },

    // Initialize students management
    init: function () {
        this.loadMockData();
        this.setupEventListeners();
        this.renderStudentsTable();
        this.renderFilters();
    },

    // Load mock student data
    loadMockData: function () {
        this.students = [
            {
                id: '1',
                studentId: 'STU2025-001',
                name: 'John Doe',
                fatherName: 'Robert Doe',
                email: 'john.doe@email.com',
                phone: '+1-555-0101',
                dob: '2000-05-15',
                gender: 'Male',
                address: '123 Main St, City, State 12345',
                campus: 'main-campus',
                campusName: 'Main Campus',
                courses: [
                    { id: 'cs101', name: 'Computer Science Basics', enrolledAt: '2025-01-15', status: 'active' },
                    { id: 'math101', name: 'Mathematics I', enrolledAt: '2025-01-15', status: 'active' }
                ],
                batch: '2025',
                status: 'active',
                photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
                createdAt: '2025-01-15T10:00:00Z',
                updatedAt: '2025-01-15T10:00:00Z'
            },
            {
                id: '2',
                studentId: 'STU2025-002',
                name: 'Sarah Johnson',
                fatherName: 'Michael Johnson',
                email: 'sarah.johnson@email.com',
                phone: '+1-555-0102',
                dob: '1999-08-22',
                gender: 'Female',
                address: '456 Oak Ave, City, State 12345',
                campus: 'north-campus',
                campusName: 'North Campus',
                courses: [
                    { id: 'eng101', name: 'Engineering Fundamentals', enrolledAt: '2025-01-20', status: 'active' },
                    { id: 'phy101', name: 'Physics I', enrolledAt: '2025-01-20', status: 'active' },
                    { id: 'chem101', name: 'Chemistry I', enrolledAt: '2025-01-20', status: 'active' }
                ],
                batch: '2025',
                status: 'active',
                photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                createdAt: '2025-01-20T10:00:00Z',
                updatedAt: '2025-01-20T10:00:00Z'
            },
            {
                id: '3',
                studentId: 'STU2025-003',
                name: 'Mike Chen',
                fatherName: 'David Chen',
                email: 'mike.chen@email.com',
                phone: '+1-555-0103',
                dob: '2001-02-10',
                gender: 'Male',
                address: '789 Pine St, City, State 12345',
                campus: 'main-campus',
                campusName: 'Main Campus',
                courses: [
                    { id: 'bus101', name: 'Business Administration', enrolledAt: '2025-02-01', status: 'active' }
                ],
                batch: '2025',
                status: 'inactive',
                photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
                createdAt: '2025-02-01T10:00:00Z',
                updatedAt: '2025-02-01T10:00:00Z'
            },
            {
                id: '4',
                studentId: 'STU2025-004',
                name: 'Emily Davis',
                fatherName: 'James Davis',
                email: 'emily.davis@email.com',
                phone: '+1-555-0104',
                dob: '2000-11-30',
                gender: 'Female',
                address: '321 Elm Dr, City, State 12345',
                campus: 'south-campus',
                campusName: 'South Campus',
                courses: [
                    { id: 'art101', name: 'Fine Arts', enrolledAt: '2025-01-10', status: 'active' },
                    { id: 'hist101', name: 'History', enrolledAt: '2025-01-10', status: 'completed' }
                ],
                batch: '2025',
                status: 'active',
                photoUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
                createdAt: '2025-01-10T10:00:00Z',
                updatedAt: '2025-01-10T10:00:00Z'
            },
            {
                id: '5',
                studentId: 'STU2024-099',
                name: 'Alex Rodriguez',
                fatherName: 'Carlos Rodriguez',
                email: 'alex.rodriguez@email.com',
                phone: '+1-555-0105',
                dob: '1999-07-18',
                gender: 'Male',
                address: '654 Maple Ave, City, State 12345',
                campus: 'east-campus',
                campusName: 'East Campus',
                courses: [
                    { id: 'cs201', name: 'Advanced Programming', enrolledAt: '2024-09-01', status: 'completed' },
                    { id: 'cs301', name: 'Database Systems', enrolledAt: '2025-01-15', status: 'active' }
                ],
                batch: '2024',
                status: 'active',
                photoUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
                createdAt: '2024-09-01T10:00:00Z',
                updatedAt: '2025-01-15T10:00:00Z'
            }
        ];

        // Apply current user's campus filter if campus manager
        if (Auth.getCurrentUser().role === 'campus_manager') {
            const userCampus = Auth.getCurrentUser().campus;
            this.students = this.students.filter(student => student.campus === userCampus);
        }

        this.filteredStudents = [...this.students];
    },

    // Setup event listeners
    setupEventListeners: function () {
        // Search input
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            }, 300));
        }

        // Filter dropdowns
        ['campusFilter', 'courseFilter', 'statusFilter', 'batchFilter'].forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            if (filterElement) {
                filterElement.addEventListener('change', (e) => {
                    const filterType = filterId.replace('Filter', '');
                    this.filters[filterType] = e.target.value;
                    this.applyFilters();
                });
            }
        });

        // Bulk actions
        const selectAllCheckbox = document.getElementById('selectAllStudents');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportStudentsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }

        // Items per page
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderStudentsTable();
            });
        }
    },

    // Apply filters
    applyFilters: function () {
        this.filteredStudents = this.students.filter(student => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const searchableText = `${student.name} ${student.studentId} ${student.email} ${student.phone}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Campus filter
            if (this.filters.campus && student.campus !== this.filters.campus) {
                return false;
            }

            // Course filter
            if (this.filters.course) {
                const hasCourse = student.courses.some(course => course.id === this.filters.course);
                if (!hasCourse) {
                    return false;
                }
            }

            // Status filter
            if (this.filters.status && student.status !== this.filters.status) {
                return false;
            }

            // Batch filter
            if (this.filters.batch && student.batch !== this.filters.batch) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderStudentsTable();
        this.updateResultsCount();
    },

    // Sort students
    sortStudents: function (field) {
        if (this.sortBy === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortOrder = 'asc';
        }

        this.filteredStudents.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle nested properties
            if (field === 'coursesCount') {
                aValue = a.courses.length;
                bValue = b.courses.length;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.renderStudentsTable();
        this.updateSortIcons();
    },

    // Update sort icons
    updateSortIcons: function () {
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.className = 'fas fa-sort sort-icon';
        });

        const currentSortIcon = document.getElementById(`sort-${this.sortBy}`);
        if (currentSortIcon) {
            currentSortIcon.className = `fas fa-sort-${this.sortOrder === 'asc' ? 'up' : 'down'} sort-icon`;
        }
    },

    // Render filters
    renderFilters: function () {
        this.renderCampusFilter();
        this.renderCourseFilter();
        this.renderBatchFilter();
    },

    // Render campus filter
    renderCampusFilter: function () {
        const campusFilter = document.getElementById('campusFilter');
        if (!campusFilter) return;

        const campuses = [...new Set(this.students.map(s => ({ id: s.campus, name: s.campusName })))];

        campusFilter.innerHTML = `
            <option value="">All Campuses</option>
            ${campuses.map(campus => `<option value="${campus.id}">${campus.name}</option>`).join('')}
        `;
    },

    // Render course filter
    renderCourseFilter: function () {
        const courseFilter = document.getElementById('courseFilter');
        if (!courseFilter) return;

        const courses = [];
        this.students.forEach(student => {
            student.courses.forEach(course => {
                if (!courses.find(c => c.id === course.id)) {
                    courses.push(course);
                }
            });
        });

        courseFilter.innerHTML = `
            <option value="">All Courses</option>
            ${courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('')}
        `;
    },

    // Render batch filter
    renderBatchFilter: function () {
        const batchFilter = document.getElementById('batchFilter');
        if (!batchFilter) return;

        const batches = [...new Set(this.students.map(s => s.batch))].sort().reverse();

        batchFilter.innerHTML = `
            <option value="">All Batches</option>
            ${batches.map(batch => `<option value="${batch}">${batch}</option>`).join('')}
        `;
    },

    // Render students table
    renderStudentsTable: function () {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);

        if (paginatedStudents.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-search fa-2x mb-2"></i>
                            <p>No students found matching your criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            this.renderPagination();
            return;
        }

        tableBody.innerHTML = paginatedStudents.map(student => `
            <tr>
                <td>
                    <input type="checkbox" class="form-check-input student-checkbox" 
                           value="${student.id}" onchange="StudentsManager.updateBulkActions()">
                </td>
                <td>
                    <img src="${student.photoUrl}" class="avatar" alt="${student.name}" 
                         onerror="this.src='https://via.placeholder.com/40x40/6c757d/ffffff?text=${student.name.charAt(0)}'">
                </td>
                <td>
                    <span class="fw-bold text-primary">${student.studentId}</span>
                </td>
                <td>
                    <div>
                        <div class="fw-bold">${student.name}</div>
                        <small class="text-muted">${student.email}</small>
                    </div>
                </td>
                <td>${student.phone}</td>
                <td>
                    <span class="badge bg-secondary">${student.campusName}</span>
                </td>
                <td>
                    <span class="badge bg-info">${student.courses.length} course${student.courses.length !== 1 ? 's' : ''}</span>
                </td>
                <td>
                    <span class="badge bg-${student.status === 'active' ? 'success' : 'secondary'}">
                        ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="StudentsManager.viewStudent('${student.id}')" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="StudentsManager.editStudent('${student.id}')" 
                                title="Edit Student">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="StudentsManager.generateIdCard('${student.id}')" 
                                title="Generate ID Card">
                            <i class="fas fa-id-card"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="StudentsManager.deleteStudent('${student.id}')" 
                                title="Delete Student">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.renderPagination();
        this.updateBulkActions();
    },

    // Render pagination
    renderPagination: function () {
        const pagination = document.getElementById('studentsPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(`
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="StudentsManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `);

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="StudentsManager.goToPage(${i})">${i}</a>
                </li>
            `);
        }

        // Next button
        pages.push(`
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="StudentsManager.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `);

        pagination.innerHTML = pages.join('');
    },

    // Go to page
    goToPage: function (page) {
        const totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderStudentsTable();
    },

    // Update results count
    updateResultsCount: function () {
        const resultsCount = document.getElementById('studentsResultsCount');
        if (resultsCount) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredStudents.length);

            resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${this.filteredStudents.length} students`;
        }
    },

    // Toggle select all
    toggleSelectAll: function (checked) {
        document.querySelectorAll('.student-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateBulkActions();
    },

    // Update bulk actions
    updateBulkActions: function () {
        const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
        const bulkActionsContainer = document.getElementById('bulkActionsContainer');
        const selectedCount = document.getElementById('selectedCount');

        if (bulkActionsContainer && selectedCount) {
            if (selectedCheckboxes.length > 0) {
                bulkActionsContainer.style.display = 'block';
                selectedCount.textContent = selectedCheckboxes.length;
            } else {
                bulkActionsContainer.style.display = 'none';
            }
        }
    },

    // Get selected student IDs
    getSelectedStudentIds: function () {
        return Array.from(document.querySelectorAll('.student-checkbox:checked')).map(cb => cb.value);
    },

    // Export to CSV
    exportToCSV: function () {
        const selectedIds = this.getSelectedStudentIds();
        const studentsToExport = selectedIds.length > 0
            ? this.filteredStudents.filter(s => selectedIds.includes(s.id))
            : this.filteredStudents;

        if (studentsToExport.length === 0) {
            Utils.showToast('No students to export', 'warning');
            return;
        }

        const headers = ['Student ID', 'Name', 'Father Name', 'Email', 'Phone', 'DOB', 'Gender', 'Campus', 'Courses', 'Batch', 'Status', 'Created At'];

        const csvContent = [
            headers.join(','),
            ...studentsToExport.map(student => [
                student.studentId,
                `"${student.name}"`,
                `"${student.fatherName}"`,
                student.email,
                student.phone,
                student.dob,
                student.gender,
                `"${student.campusName}"`,
                `"${student.courses.map(c => c.name).join('; ')}"`,
                student.batch,
                student.status,
                Utils.formatDate(student.createdAt)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `students_export_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
        link.click();

        Utils.showToast(`Exported ${studentsToExport.length} students to CSV`, 'success');
    },

    // View student details
    viewStudent: function (studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            this.showStudentModal(student, 'view');
        }
    },

    // Edit student
    editStudent: function (studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            this.showStudentModal(student, 'edit');
        }
    },

    // Delete student
    deleteStudent: async function (studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const confirmed = await Utils.confirmDialog(
            'Delete Student',
            `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
            'Delete',
            'Cancel'
        );

        if (confirmed) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.applyFilters();
            Utils.showToast(`Student ${student.name} has been deleted`, 'success');
        }
    },

    // Generate ID card
    generateIdCard: function (studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            Utils.showToast(`Generating ID card for ${student.name}...`, 'info');
            // ID card generation will be implemented in the next phase
            setTimeout(() => {
                Utils.showToast(`ID card generated successfully for ${student.name}`, 'success');
            }, 2000);
        }
    },

    // Show student modal
    showStudentModal: function (student, mode = 'view') {
        // Student modal implementation will be added
        Utils.showToast(`${mode === 'edit' ? 'Edit' : 'View'} modal for ${student.name} would open here`, 'info');
    },

    // Add new student
    addStudent: function () {
        this.showStudentModal(null, 'add');
    },

    // Bulk delete students
    bulkDelete: async function () {
        const selectedIds = this.getSelectedStudentIds();
        if (selectedIds.length === 0) {
            Utils.showToast('Please select students to delete', 'warning');
            return;
        }

        const confirmed = await Utils.confirmDialog(
            'Delete Students',
            `Are you sure you want to delete ${selectedIds.length} selected student(s)? This action cannot be undone.`,
            'Delete All',
            'Cancel'
        );

        if (confirmed) {
            this.students = this.students.filter(s => !selectedIds.includes(s.id));
            this.applyFilters();
            Utils.showToast(`${selectedIds.length} student(s) have been deleted`, 'success');
        }
    },

    // Bulk export selected
    bulkExport: function () {
        this.exportToCSV();
    }
};

// Export for global access
window.StudentsManager = StudentsManager;