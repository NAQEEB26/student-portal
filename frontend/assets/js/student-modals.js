// ================================
// STUDENT MODALS JAVASCRIPT
// ================================

const StudentModals = {
    currentStudent: null,
    currentMode: 'view', // 'view', 'edit', 'add'

    // Show student modal
    showModal: function (student = null, mode = 'view') {
        this.currentStudent = student;
        this.currentMode = mode;

        // Create modal if it doesn't exist
        this.createModal();

        // Populate modal content
        this.populateModal();

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
    },

    // Create modal HTML
    createModal: function () {
        let existingModal = document.getElementById('studentModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal fade" id="studentModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="studentModalTitle">
                                <i class="fas fa-user me-2"></i>Student Details
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="studentModalBody">
                            <!-- Content will be populated dynamically -->
                        </div>
                        <div class="modal-footer" id="studentModalFooter">
                            <!-- Footer will be populated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Populate modal content
    populateModal: function () {
        const title = document.getElementById('studentModalTitle');
        const body = document.getElementById('studentModalBody');
        const footer = document.getElementById('studentModalFooter');

        switch (this.currentMode) {
            case 'add':
                title.innerHTML = '<i class="fas fa-plus me-2"></i>Add New Student';
                body.innerHTML = this.getAddStudentForm();
                footer.innerHTML = this.getAddStudentFooter();
                break;
            case 'edit':
                title.innerHTML = '<i class="fas fa-edit me-2"></i>Edit Student Details';
                body.innerHTML = this.getEditStudentForm();
                footer.innerHTML = this.getEditStudentFooter();
                break;
            case 'view':
            default:
                title.innerHTML = '<i class="fas fa-eye me-2"></i>Student Details';
                body.innerHTML = this.getViewStudentContent();
                footer.innerHTML = this.getViewStudentFooter();
                break;
        }

        // Setup form validation if in edit/add mode
        if (this.currentMode === 'add' || this.currentMode === 'edit') {
            setTimeout(() => this.setupFormValidation(), 100);
        }
    },

    // Get view student content
    getViewStudentContent: function () {
        if (!this.currentStudent) return '<div class="alert alert-danger">Student not found</div>';

        const student = this.currentStudent;
        return `
            <div class="row">
                <!-- Left Column - Photo and Basic Info -->
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <img src="${student.photoUrl}" class="avatar-xl mb-3" alt="${student.name}"
                                 onerror="this.src='https://via.placeholder.com/120x120/6c757d/ffffff?text=${student.name.charAt(0)}'">
                            <h5 class="card-title">${student.name}</h5>
                            <p class="text-muted">${student.studentId}</p>
                            <span class="badge bg-${student.status === 'active' ? 'success' : 'secondary'} fs-6">
                                ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                            
                            <hr class="my-3">
                            
                            <!-- Quick Actions -->
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-sm" onclick="StudentModals.generateIdCard('${student.id}')">
                                    <i class="fas fa-id-card me-2"></i>Generate ID Card
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="StudentModals.editStudent('${student.id}')">
                                    <i class="fas fa-edit me-2"></i>Edit Details
                                </button>
                                <button class="btn btn-outline-info btn-sm" onclick="StudentModals.exportStudent('${student.id}')">
                                    <i class="fas fa-download me-2"></i>Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Detailed Information -->
                <div class="col-lg-8">
                    <div class="row g-3">
                        <!-- Personal Information -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fas fa-user me-2"></i>Personal Information</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Full Name</label>
                                            <p class="mb-0">${student.name}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Father's Name</label>
                                            <p class="mb-0">${student.fatherName}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Date of Birth</label>
                                            <p class="mb-0">${Utils.formatDate(student.dob)}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Gender</label>
                                            <p class="mb-0">${student.gender}</p>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-bold">Address</label>
                                            <p class="mb-0">${student.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fas fa-phone me-2"></i>Contact Information</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Email</label>
                                            <p class="mb-0">
                                                <a href="mailto:${student.email}" class="text-decoration-none">
                                                    ${student.email}
                                                </a>
                                            </p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Phone</label>
                                            <p class="mb-0">
                                                <a href="tel:${student.phone}" class="text-decoration-none">
                                                    ${student.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Academic Information -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fas fa-graduation-cap me-2"></i>Academic Information</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Campus</label>
                                            <p class="mb-0">
                                                <span class="badge bg-secondary">${student.campusName}</span>
                                            </p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Batch</label>
                                            <p class="mb-0">${student.batch}</p>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-bold">Enrolled Courses (${student.courses.length})</label>
                                            <div class="d-flex flex-wrap gap-2">
                                                ${student.courses.map(course => `
                                                    <span class="badge bg-${course.status === 'active' ? 'primary' : course.status === 'completed' ? 'success' : 'secondary'}">
                                                        ${course.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- System Information -->
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>System Information</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Created At</label>
                                            <p class="mb-0">${Utils.formatDate(student.createdAt, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Last Updated</label>
                                            <p class="mb-0">${Utils.formatDate(student.updatedAt, 'YYYY-MM-DD HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get add student form
    getAddStudentForm: function () {
        return `
            <form id="addStudentForm" novalidate>
                <div class="row g-3">
                    <!-- Photo Upload -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-camera me-2"></i>Photo Upload</h6>
                            </div>
                            <div class="card-body text-center">
                                <div class="photo-upload-container">
                                    <img id="photoPreview" src="https://via.placeholder.com/150x150/dee2e6/6c757d?text=Photo" 
                                         class="avatar-xl mb-3" alt="Photo Preview">
                                    <div>
                                        <input type="file" id="photoUpload" name="photo" accept="image/*" class="d-none">
                                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="document.getElementById('photoUpload').click()">
                                            <i class="fas fa-upload me-2"></i>Upload Photo
                                        </button>
                                        <small class="text-muted d-block mt-2">Max size: 5MB (JPG, PNG)</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-user me-2"></i>Personal Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="studentName" class="form-label">Full Name *</label>
                                        <input type="text" class="form-control" id="studentName" name="name" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="fatherName" class="form-label">Father's Name *</label>
                                        <input type="text" class="form-control" id="fatherName" name="fatherName" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="dob" class="form-label">Date of Birth *</label>
                                        <input type="date" class="form-control" id="dob" name="dob" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="gender" class="form-label">Gender *</label>
                                        <select class="form-select" id="gender" name="gender" required>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="address" class="form-label">Address *</label>
                                        <textarea class="form-control" id="address" name="address" rows="3" required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-phone me-2"></i>Contact Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="email" class="form-label">Email Address *</label>
                                        <input type="email" class="form-control" id="email" name="email" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="phone" class="form-label">Phone Number *</label>
                                        <input type="tel" class="form-control" id="phone" name="phone" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Academic Information -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-graduation-cap me-2"></i>Academic Information</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="campus" class="form-label">Campus *</label>
                                        <select class="form-select" id="campus" name="campus" required>
                                            <option value="">Select Campus</option>
                                            <option value="main-campus">Main Campus</option>
                                            <option value="north-campus">North Campus</option>
                                            <option value="south-campus">South Campus</option>
                                            <option value="east-campus">East Campus</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="batch" class="form-label">Batch *</label>
                                        <select class="form-select" id="batch" name="batch" required>
                                            <option value="">Select Batch</option>
                                            <option value="2025">2025</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label for="courses" class="form-label">Courses</label>
                                        <div id="coursesContainer" class="border rounded p-3">
                                            <div class="text-muted text-center">
                                                <i class="fas fa-book mb-2"></i>
                                                <p class="mb-0">Courses can be assigned after student creation</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-toggle-on me-2"></i>Status</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="status" class="form-label">Student Status</label>
                                        <select class="form-select" id="status" name="status">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
    },

    // Get edit student form
    getEditStudentForm: function () {
        const student = this.currentStudent;
        if (!student) return '<div class="alert alert-danger">Student not found</div>';

        // Similar to add form but pre-populated with student data
        return this.getAddStudentForm().replace(
            '<form id="addStudentForm"',
            `<form id="editStudentForm" data-student-id="${student.id}"`
        );
    },

    // Footer buttons for different modes
    getViewStudentFooter: function () {
        return `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>Close
            </button>
            <button type="button" class="btn btn-primary" onclick="StudentModals.editStudent('${this.currentStudent.id}')">
                <i class="fas fa-edit me-2"></i>Edit Student
            </button>
        `;
    },

    getAddStudentFooter: function () {
        return `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="submit" form="addStudentForm" class="btn btn-primary">
                <i class="fas fa-save me-2"></i>Add Student
            </button>
        `;
    },

    getEditStudentFooter: function () {
        return `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="StudentModals.showModal(this.currentStudent, 'view')">
                <i class="fas fa-eye me-2"></i>View Mode
            </button>
            <button type="submit" form="editStudentForm" class="btn btn-primary">
                <i class="fas fa-save me-2"></i>Save Changes
            </button>
        `;
    },

    // Setup form validation
    setupFormValidation: function () {
        const form = document.querySelector('#addStudentForm, #editStudentForm');
        if (!form) return;

        // Photo upload preview
        const photoUpload = document.getElementById('photoUpload');
        const photoPreview = document.getElementById('photoPreview');

        if (photoUpload && photoPreview) {
            photoUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        photoPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Pre-populate form if editing
        if (this.currentMode === 'edit' && this.currentStudent) {
            this.populateEditForm();
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });
    },

    // Populate edit form with student data
    populateEditForm: function () {
        const student = this.currentStudent;
        if (!student) return;

        // Populate form fields
        const fields = {
            'studentName': student.name,
            'fatherName': student.fatherName,
            'dob': student.dob,
            'gender': student.gender,
            'address': student.address,
            'email': student.email,
            'phone': student.phone,
            'campus': student.campus,
            'batch': student.batch,
            'status': student.status
        };

        Object.keys(fields).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.value = fields[fieldName];
            }
        });

        // Set photo preview
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview && student.photoUrl) {
            photoPreview.src = student.photoUrl;
        }
    },

    // Handle form submission
    handleFormSubmit: function (e) {
        const form = e.target;
        const formData = new FormData(form);
        const studentData = Object.fromEntries(formData.entries());

        // Validate form
        if (!this.validateForm(form, studentData)) {
            return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        Utils.showLoading(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            if (this.currentMode === 'add') {
                this.addStudent(studentData);
            } else if (this.currentMode === 'edit') {
                this.updateStudent(studentData);
            }

            Utils.showLoading(submitBtn, false);
        }, 1500);
    },

    // Validate form
    validateForm: function (form, data) {
        const requiredFields = ['name', 'fatherName', 'dob', 'gender', 'address', 'email', 'phone', 'campus', 'batch'];
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

        requiredFields.forEach(field => {
            const element = form.querySelector(`[name="${field}"]`);
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(element, `${field} is required`);
                isValid = false;
            }
        });

        // Email validation
        if (data.email && !Utils.isValidEmail(data.email)) {
            this.showFieldError(form.querySelector('[name="email"]'), 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        if (data.phone && !Utils.isValidPhone(data.phone)) {
            this.showFieldError(form.querySelector('[name="phone"]'), 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    },

    // Show field error
    showFieldError: function (element, message) {
        if (!element) return;

        element.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        element.parentNode.appendChild(feedback);
    },

    // Add new student
    addStudent: function (studentData) {
        const newStudent = {
            id: Utils.generateId('STU'),
            studentId: Utils.generateId('STU'),
            name: studentData.name,
            fatherName: studentData.fatherName,
            email: studentData.email,
            phone: studentData.phone,
            dob: studentData.dob,
            gender: studentData.gender,
            address: studentData.address,
            campus: studentData.campus,
            campusName: this.getCampusName(studentData.campus),
            courses: [],
            batch: studentData.batch,
            status: studentData.status || 'active',
            photoUrl: 'https://via.placeholder.com/120x120/6c757d/ffffff?text=' + studentData.name.charAt(0),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to students array
        StudentsManager.students.push(newStudent);
        StudentsManager.applyFilters();

        Utils.showToast(`Student ${newStudent.name} added successfully!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
    },

    // Update student
    updateStudent: function (studentData) {
        const studentIndex = StudentsManager.students.findIndex(s => s.id === this.currentStudent.id);
        if (studentIndex === -1) return;

        // Update student data
        const updatedStudent = {
            ...StudentsManager.students[studentIndex],
            name: studentData.name,
            fatherName: studentData.fatherName,
            email: studentData.email,
            phone: studentData.phone,
            dob: studentData.dob,
            gender: studentData.gender,
            address: studentData.address,
            campus: studentData.campus,
            campusName: this.getCampusName(studentData.campus),
            batch: studentData.batch,
            status: studentData.status,
            updatedAt: new Date().toISOString()
        };

        StudentsManager.students[studentIndex] = updatedStudent;
        StudentsManager.applyFilters();

        Utils.showToast(`Student ${updatedStudent.name} updated successfully!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
    },

    // Helper methods
    getCampusName: function (campusId) {
        const campusMap = {
            'main-campus': 'Main Campus',
            'north-campus': 'North Campus',
            'south-campus': 'South Campus',
            'east-campus': 'East Campus'
        };
        return campusMap[campusId] || campusId;
    },

    // Action methods
    editStudent: function (studentId) {
        const student = StudentsManager.students.find(s => s.id === studentId);
        if (student) {
            this.showModal(student, 'edit');
        }
    },

    generateIdCard: function (studentId) {
        Utils.showToast('ID Card generation feature will be implemented in the next phase', 'info');
    },

    exportStudent: function (studentId) {
        const student = StudentsManager.students.find(s => s.id === studentId);
        if (student) {
            StudentsManager.filteredStudents = [student];
            StudentsManager.exportToCSV();
            StudentsManager.applyFilters(); // Reset filters
        }
    }
};

// Extend StudentsManager with modal functionality
StudentsManager.addStudent = function () {
    StudentModals.showModal(null, 'add');
};

StudentsManager.viewStudent = function (studentId) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
        StudentModals.showModal(student, 'view');
    }
};

StudentsManager.editStudent = function (studentId) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
        StudentModals.showModal(student, 'edit');
    }
};

// Export for global access
window.StudentModals = StudentModals;