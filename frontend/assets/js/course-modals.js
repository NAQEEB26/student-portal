/**
 * Course Modals Management
 * Handles all course-related modal operations (Add, Edit, View, Enrollment, Schedule)
 */

class CourseModals {
    constructor() {
        this.currentCourse = null;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Add/Edit Course Modal -->
            <div class="modal fade" id="courseModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="courseModalTitle">
                                <i class="fas fa-book me-2"></i>Add Course
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="courseForm" onsubmit="CourseModals.submitCourse(event)">
                            <div class="modal-body">
                                <div class="row">
                                    <!-- Basic Information -->
                                    <div class="col-lg-6">
                                        <h6 class="text-primary mb-3">
                                            <i class="fas fa-info-circle me-2"></i>Basic Information
                                        </h6>
                                        <div class="mb-3">
                                            <label class="form-label">Course Code *</label>
                                            <input type="text" class="form-control" id="course-code" required>
                                            <div class="form-text">Unique identifier for the course (e.g., CS101)</div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Course Name *</label>
                                            <input type="text" class="form-control" id="course-name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Department *</label>
                                            <select class="form-select" id="course-department" required>
                                                <option value="">Select Department</option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">Chemistry</option>
                                                <option value="Biology">Biology</option>
                                                <option value="English">English</option>
                                                <option value="History">History</option>
                                                <option value="Business">Business</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Psychology">Psychology</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Credits *</label>
                                            <select class="form-select" id="course-credits" required>
                                                <option value="">Select Credits</option>
                                                <option value="1">1 Credit</option>
                                                <option value="2">2 Credits</option>
                                                <option value="3">3 Credits</option>
                                                <option value="4">4 Credits</option>
                                                <option value="5">5 Credits</option>
                                                <option value="6">6 Credits</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Course Description</label>
                                            <textarea class="form-control" id="course-description" rows="3" 
                                                placeholder="Brief description of the course content and objectives"></textarea>
                                        </div>
                                    </div>

                                    <!-- Instructor & Schedule -->
                                    <div class="col-lg-6">
                                        <h6 class="text-primary mb-3">
                                            <i class="fas fa-chalkboard-teacher me-2"></i>Instructor & Schedule
                                        </h6>
                                        <div class="mb-3">
                                            <label class="form-label">Instructor *</label>
                                            <select class="form-select" id="course-instructor" required>
                                                <option value="">Select Instructor</option>
                                                <option value="FAC001" data-name="Dr. Sarah Wilson" data-email="sarah.wilson@university.edu">Dr. Sarah Wilson</option>
                                                <option value="FAC002" data-name="Prof. Michael Chen" data-email="michael.chen@university.edu">Prof. Michael Chen</option>
                                                <option value="FAC003" data-name="Dr. Jennifer Martinez" data-email="jennifer.martinez@university.edu">Dr. Jennifer Martinez</option>
                                                <option value="FAC004" data-name="Dr. Robert Thompson" data-email="robert.thompson@university.edu">Dr. Robert Thompson</option>
                                                <option value="FAC005" data-name="Prof. Lisa Anderson" data-email="lisa.anderson@university.edu">Prof. Lisa Anderson</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Campus *</label>
                                            <select class="form-select" id="course-campus" required>
                                                <option value="">Select Campus</option>
                                                <option value="Main Campus">Main Campus</option>
                                                <option value="North Campus">North Campus</option>
                                                <option value="South Campus">South Campus</option>
                                                <option value="Business Campus">Business Campus</option>
                                                <option value="Medical Campus">Medical Campus</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Semester *</label>
                                            <select class="form-select" id="course-semester" required>
                                                <option value="">Select Semester</option>
                                                <option value="Fall 2025">Fall 2025</option>
                                                <option value="Spring 2026">Spring 2026</option>
                                                <option value="Summer 2026">Summer 2026</option>
                                                <option value="Fall 2026">Fall 2026</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Status *</label>
                                            <select class="form-select" id="course-status" required>
                                                <option value="Active">Active</option>
                                                <option value="Planned">Planned</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Class Days *</label>
                                            <div class="row">
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Monday" id="day-monday">
                                                        <label class="form-check-label" for="day-monday">Monday</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Tuesday" id="day-tuesday">
                                                        <label class="form-check-label" for="day-tuesday">Tuesday</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Wednesday" id="day-wednesday">
                                                        <label class="form-check-label" for="day-wednesday">Wednesday</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Thursday" id="day-thursday">
                                                        <label class="form-check-label" for="day-thursday">Thursday</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Friday" id="day-friday">
                                                        <label class="form-check-label" for="day-friday">Friday</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="Saturday" id="day-saturday">
                                                        <label class="form-check-label" for="day-saturday">Saturday</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <!-- Schedule Details -->
                                    <div class="col-lg-6">
                                        <h6 class="text-primary mb-3">
                                            <i class="fas fa-clock me-2"></i>Schedule Details
                                        </h6>
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Start Time *</label>
                                                    <input type="time" class="form-control" id="course-start-time" required>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="mb-3">
                                                    <label class="form-label">End Time *</label>
                                                    <input type="time" class="form-control" id="course-end-time" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Room/Location *</label>
                                            <input type="text" class="form-control" id="course-room" required 
                                                placeholder="e.g., Science Building - Room 101">
                                        </div>
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Start Date *</label>
                                                    <input type="date" class="form-control" id="course-start-date" required>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="mb-3">
                                                    <label class="form-label">End Date *</label>
                                                    <input type="date" class="form-control" id="course-end-date" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Enrollment & Prerequisites -->
                                    <div class="col-lg-6">
                                        <h6 class="text-primary mb-3">
                                            <i class="fas fa-users me-2"></i>Enrollment & Prerequisites
                                        </h6>
                                        <div class="mb-3">
                                            <label class="form-label">Enrollment Limit *</label>
                                            <input type="number" class="form-control" id="course-enrollment-limit" 
                                                min="1" max="200" required>
                                            <div class="form-text">Maximum number of students that can enroll</div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Prerequisites</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control" id="prerequisite-input" 
                                                    placeholder="Enter course code (e.g., CS101)">
                                                <button type="button" class="btn btn-outline-secondary" onclick="CourseModals.addPrerequisite()">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <div id="prerequisites-list" class="mt-2"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Advanced Settings -->
                                <div class="row">
                                    <div class="col-12">
                                        <div class="accordion" id="advancedSettingsAccordion">
                                            <!-- Course Materials -->
                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                                        data-bs-target="#materialsCollapse">
                                                        <i class="fas fa-book-open me-2"></i>Course Materials
                                                    </button>
                                                </h2>
                                                <div id="materialsCollapse" class="accordion-collapse collapse" 
                                                    data-bs-parent="#advancedSettingsAccordion">
                                                    <div class="accordion-body">
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <input type="text" class="form-control" id="material-title" 
                                                                    placeholder="Material title">
                                                            </div>
                                                            <div class="col-md-3">
                                                                <select class="form-select" id="material-type">
                                                                    <option value="Textbook">Textbook</option>
                                                                    <option value="Software">Software</option>
                                                                    <option value="Lab Equipment">Lab Equipment</option>
                                                                    <option value="Calculator">Calculator</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" id="material-required">
                                                                    <label class="form-check-label" for="material-required">
                                                                        Required
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-2">
                                                                <button type="button" class="btn btn-primary btn-sm" 
                                                                    onclick="CourseModals.addMaterial()">
                                                                    <i class="fas fa-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div id="materials-list" class="mt-3"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Assessments -->
                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                                        data-bs-target="#assessmentsCollapse">
                                                        <i class="fas fa-chart-bar me-2"></i>Assessments & Grading
                                                    </button>
                                                </h2>
                                                <div id="assessmentsCollapse" class="accordion-collapse collapse" 
                                                    data-bs-parent="#advancedSettingsAccordion">
                                                    <div class="accordion-body">
                                                        <div class="row">
                                                            <div class="col-md-3">
                                                                <input type="text" class="form-control" id="assessment-type" 
                                                                    placeholder="Assessment type">
                                                            </div>
                                                            <div class="col-md-3">
                                                                <input type="number" class="form-control" id="assessment-weight" 
                                                                    placeholder="Weight %" min="0" max="100">
                                                            </div>
                                                            <div class="col-md-4">
                                                                <input type="date" class="form-control" id="assessment-date">
                                                            </div>
                                                            <div class="col-md-2">
                                                                <button type="button" class="btn btn-primary btn-sm" 
                                                                    onclick="CourseModals.addAssessment()">
                                                                    <i class="fas fa-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div id="assessments-list" class="mt-3"></div>
                                                        <div class="mt-3">
                                                            <div class="alert alert-info">
                                                                <i class="fas fa-info-circle me-2"></i>
                                                                Total weight should equal 100%. Current: <span id="total-weight">0</span>%
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
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary" id="submit-course-btn">
                                    <i class="fas fa-save me-2"></i>Save Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- View Course Modal -->
            <div class="modal fade" id="viewCourseModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-eye me-2"></i>Course Details
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="viewCourseContent">
                            <!-- Content will be dynamically loaded -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onclick="CourseModals.editFromView()">
                                <i class="fas fa-edit me-2"></i>Edit Course
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
    }

    setupEventListeners() {
        // Form validation
        const form = document.getElementById('courseForm');
        if (form) {
            form.addEventListener('input', this.validateForm.bind(this));
        }

        // Time validation
        const startTime = document.getElementById('course-start-time');
        const endTime = document.getElementById('course-end-time');
        if (startTime && endTime) {
            startTime.addEventListener('change', this.validateTimeRange.bind(this));
            endTime.addEventListener('change', this.validateTimeRange.bind(this));
        }

        // Date validation
        const startDate = document.getElementById('course-start-date');
        const endDate = document.getElementById('course-end-date');
        if (startDate && endDate) {
            startDate.addEventListener('change', this.validateDateRange.bind(this));
            endDate.addEventListener('change', this.validateDateRange.bind(this));
        }

        // Instructor change handler
        const instructorSelect = document.getElementById('course-instructor');
        if (instructorSelect) {
            instructorSelect.addEventListener('change', this.handleInstructorChange.bind(this));
        }
    }

    showAddModal() {
        this.currentCourse = null;
        this.resetForm();
        document.getElementById('courseModalTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add Course';
        document.getElementById('submit-course-btn').innerHTML = '<i class="fas fa-save me-2"></i>Add Course';

        const modal = new bootstrap.Modal(document.getElementById('courseModal'));
        modal.show();
    }

    showEditModal(courseId) {
        const course = window.coursesManager.getCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.populateForm(course);
        document.getElementById('courseModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Course';
        document.getElementById('submit-course-btn').innerHTML = '<i class="fas fa-save me-2"></i>Update Course';

        const modal = new bootstrap.Modal(document.getElementById('courseModal'));
        modal.show();
    }

    showViewModal(courseId) {
        const course = window.coursesManager.getCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.populateViewContent(course);

        const modal = new bootstrap.Modal(document.getElementById('viewCourseModal'));
        modal.show();
    }

    populateForm(course) {
        document.getElementById('course-code').value = course.code || '';
        document.getElementById('course-name').value = course.name || '';
        document.getElementById('course-department').value = course.department || '';
        document.getElementById('course-credits').value = course.credits || '';
        document.getElementById('course-description').value = course.description || '';
        document.getElementById('course-instructor').value = course.instructor?.id || '';
        document.getElementById('course-campus').value = course.campus || '';
        document.getElementById('course-semester').value = course.semester || '';
        document.getElementById('course-status').value = course.status || '';
        document.getElementById('course-room').value = course.schedule?.room || '';
        document.getElementById('course-start-date').value = course.startDate || '';
        document.getElementById('course-end-date').value = course.endDate || '';
        document.getElementById('course-enrollment-limit').value = course.enrollmentLimit || '';

        // Set schedule time
        if (course.schedule?.time) {
            const timeRange = course.schedule.time.split(' - ');
            if (timeRange.length === 2) {
                document.getElementById('course-start-time').value = this.convertToMilitaryTime(timeRange[0]);
                document.getElementById('course-end-time').value = this.convertToMilitaryTime(timeRange[1]);
            }
        }

        // Set schedule days
        document.querySelectorAll('input[type="checkbox"][id^="day-"]').forEach(checkbox => {
            checkbox.checked = course.schedule?.days?.includes(checkbox.value) || false;
        });

        // Populate prerequisites
        this.populatePrerequisites(course.prerequisites || []);

        // Populate materials
        this.populateMaterials(course.materials || []);

        // Populate assessments
        this.populateAssessments(course.assessments || []);
    }

    populateViewContent(course) {
        const content = document.getElementById('viewCourseContent');
        const enrollmentPercentage = Math.round((course.currentEnrollment / course.enrollmentLimit) * 100);

        content.innerHTML = `
            <div class="row">
                <div class="col-lg-6">
                    <h6 class="text-primary mb-3">Basic Information</h6>
                    <table class="table table-borderless">
                        <tr>
                            <td><strong>Course Code:</strong></td>
                            <td>${course.code}</td>
                        </tr>
                        <tr>
                            <td><strong>Course Name:</strong></td>
                            <td>${course.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Department:</strong></td>
                            <td>${course.department}</td>
                        </tr>
                        <tr>
                            <td><strong>Credits:</strong></td>
                            <td>${course.credits}</td>
                        </tr>
                        <tr>
                            <td><strong>Status:</strong></td>
                            <td><span class="badge bg-${this.getStatusClass(course.status)}">${course.status}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Campus:</strong></td>
                            <td>${course.campus}</td>
                        </tr>
                        <tr>
                            <td><strong>Semester:</strong></td>
                            <td>${course.semester}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-lg-6">
                    <h6 class="text-primary mb-3">Schedule & Enrollment</h6>
                    <table class="table table-borderless">
                        <tr>
                            <td><strong>Instructor:</strong></td>
                            <td>${course.instructor.name}<br><small class="text-muted">${course.instructor.email}</small></td>
                        </tr>
                        <tr>
                            <td><strong>Days:</strong></td>
                            <td>${course.schedule.days.join(', ')}</td>
                        </tr>
                        <tr>
                            <td><strong>Time:</strong></td>
                            <td>${course.schedule.time}</td>
                        </tr>
                        <tr>
                            <td><strong>Room:</strong></td>
                            <td>${course.schedule.room}</td>
                        </tr>
                        <tr>
                            <td><strong>Enrollment:</strong></td>
                            <td>
                                ${course.currentEnrollment}/${course.enrollmentLimit} (${enrollmentPercentage}%)
                                <div class="progress mt-1" style="height: 6px;">
                                    <div class="progress-bar" style="width: ${enrollmentPercentage}%"></div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Duration:</strong></td>
                            <td>${this.formatDate(course.startDate)} - ${this.formatDate(course.endDate)}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            ${course.description ? `
                <div class="row">
                    <div class="col-12">
                        <h6 class="text-primary mb-3">Description</h6>
                        <p>${course.description}</p>
                    </div>
                </div>
            ` : ''}
            
            ${course.prerequisites && course.prerequisites.length > 0 ? `
                <div class="row">
                    <div class="col-12">
                        <h6 class="text-primary mb-3">Prerequisites</h6>
                        <div>
                            ${course.prerequisites.map(prereq => `<span class="badge bg-secondary me-2">${prereq}</span>`).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${course.materials && course.materials.length > 0 ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6 class="text-primary mb-3">Course Materials</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Title</th>
                                        <th>Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${course.materials.map(material => `
                                        <tr>
                                            <td><span class="badge bg-info">${material.type}</span></td>
                                            <td>${material.title}</td>
                                            <td>${material.required ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-muted"></i>'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${course.assessments && course.assessments.length > 0 ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6 class="text-primary mb-3">Assessments & Grading</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Assessment Type</th>
                                        <th>Weight</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${course.assessments.map(assessment => `
                                        <tr>
                                            <td>${assessment.type}</td>
                                            <td>${assessment.weight}%</td>
                                            <td>${assessment.date ? this.formatDate(assessment.date) : 'Ongoing'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    resetForm() {
        document.getElementById('courseForm').reset();
        document.getElementById('prerequisites-list').innerHTML = '';
        document.getElementById('materials-list').innerHTML = '';
        document.getElementById('assessments-list').innerHTML = '';
        this.updateTotalWeight();
    }

    static submitCourse(event) {
        event.preventDefault();

        const instance = window.CourseModals;
        const formData = instance.getFormData();

        if (!instance.validateFormData(formData)) {
            return;
        }

        if (instance.currentCourse) {
            // Update existing course
            window.coursesManager.updateCourse(instance.currentCourse.id, formData);
        } else {
            // Add new course
            window.coursesManager.addCourse(formData);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
        modal.hide();
    }

    getFormData() {
        // Get basic form data
        const formData = {
            code: document.getElementById('course-code').value,
            name: document.getElementById('course-name').value,
            department: document.getElementById('course-department').value,
            credits: parseInt(document.getElementById('course-credits').value),
            description: document.getElementById('course-description').value,
            campus: document.getElementById('course-campus').value,
            semester: document.getElementById('course-semester').value,
            status: document.getElementById('course-status').value,
            enrollmentLimit: parseInt(document.getElementById('course-enrollment-limit').value),
            currentEnrollment: this.currentCourse?.currentEnrollment || 0,
            startDate: document.getElementById('course-start-date').value,
            endDate: document.getElementById('course-end-date').value
        };

        // Get instructor data
        const instructorSelect = document.getElementById('course-instructor');
        const selectedOption = instructorSelect.selectedOptions[0];
        if (selectedOption) {
            formData.instructor = {
                id: selectedOption.value,
                name: selectedOption.dataset.name,
                email: selectedOption.dataset.email
            };
        }

        // Get schedule data
        const selectedDays = Array.from(document.querySelectorAll('input[type="checkbox"][id^="day-"]:checked'))
            .map(checkbox => checkbox.value);

        const startTime = document.getElementById('course-start-time').value;
        const endTime = document.getElementById('course-end-time').value;

        formData.schedule = {
            days: selectedDays,
            time: this.formatTimeRange(startTime, endTime),
            room: document.getElementById('course-room').value
        };

        // Get prerequisites
        formData.prerequisites = this.getPrerequisites();

        // Get materials
        formData.materials = this.getMaterials();

        // Get assessments
        formData.assessments = this.getAssessments();

        return formData;
    }

    validateFormData(formData) {
        const errors = [];

        if (!formData.code) errors.push('Course code is required');
        if (!formData.name) errors.push('Course name is required');
        if (!formData.department) errors.push('Department is required');
        if (!formData.credits) errors.push('Credits is required');
        if (!formData.instructor?.id) errors.push('Instructor is required');
        if (!formData.campus) errors.push('Campus is required');
        if (!formData.semester) errors.push('Semester is required');
        if (!formData.enrollmentLimit) errors.push('Enrollment limit is required');
        if (!formData.startDate) errors.push('Start date is required');
        if (!formData.endDate) errors.push('End date is required');
        if (!formData.schedule.days.length) errors.push('At least one class day is required');
        if (!formData.schedule.time) errors.push('Class time is required');
        if (!formData.schedule.room) errors.push('Room/location is required');

        if (errors.length > 0) {
            alert('Please correct the following errors:\n\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    static addPrerequisite() {
        const input = document.getElementById('prerequisite-input');
        const prerequisite = input.value.trim();

        if (prerequisite) {
            const list = document.getElementById('prerequisites-list');
            const tag = document.createElement('span');
            tag.className = 'badge bg-secondary me-2 mb-2';
            tag.innerHTML = `
                ${prerequisite}
                <button type="button" class="btn-close btn-close-white ms-2" 
                    onclick="this.parentElement.remove()"></button>
            `;
            tag.dataset.prerequisite = prerequisite;
            list.appendChild(tag);
            input.value = '';
        }
    }

    static addMaterial() {
        const title = document.getElementById('material-title').value.trim();
        const type = document.getElementById('material-type').value;
        const required = document.getElementById('material-required').checked;

        if (title && type) {
            const list = document.getElementById('materials-list');
            const item = document.createElement('div');
            item.className = 'material-item d-flex justify-content-between align-items-center p-2 border rounded mb-2';
            item.innerHTML = `
                <div>
                    <span class="badge bg-info me-2">${type}</span>
                    <span>${title}</span>
                    ${required ? '<span class="badge bg-danger ms-2">Required</span>' : '<span class="badge bg-secondary ms-2">Optional</span>'}
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            item.dataset.material = JSON.stringify({ title, type, required });
            list.appendChild(item);

            // Clear inputs
            document.getElementById('material-title').value = '';
            document.getElementById('material-type').value = 'Textbook';
            document.getElementById('material-required').checked = false;
        }
    }

    static addAssessment() {
        const type = document.getElementById('assessment-type').value.trim();
        const weight = parseInt(document.getElementById('assessment-weight').value);
        const date = document.getElementById('assessment-date').value;

        if (type && weight) {
            const list = document.getElementById('assessments-list');
            const item = document.createElement('div');
            item.className = 'assessment-item d-flex justify-content-between align-items-center p-2 border rounded mb-2';
            item.innerHTML = `
                <div>
                    <strong>${type}</strong> - ${weight}% 
                    ${date ? `<small class="text-muted">(${window.CourseModals.formatDate(date)})</small>` : '<small class="text-muted">(Ongoing)</small>'}
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove(); window.CourseModals.updateTotalWeight();">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            item.dataset.assessment = JSON.stringify({ type, weight, date });
            list.appendChild(item);

            // Clear inputs
            document.getElementById('assessment-type').value = '';
            document.getElementById('assessment-weight').value = '';
            document.getElementById('assessment-date').value = '';

            window.CourseModals.updateTotalWeight();
        }
    }

    static updateTotalWeight() {
        const assessments = Array.from(document.querySelectorAll('.assessment-item'));
        const totalWeight = assessments.reduce((sum, item) => {
            const data = JSON.parse(item.dataset.assessment || '{}');
            return sum + (data.weight || 0);
        }, 0);

        const totalElement = document.getElementById('total-weight');
        if (totalElement) {
            totalElement.textContent = totalWeight;
            totalElement.className = totalWeight === 100 ? 'text-success' : 'text-warning';
        }
    }

    getPrerequisites() {
        return Array.from(document.querySelectorAll('#prerequisites-list [data-prerequisite]'))
            .map(tag => tag.dataset.prerequisite);
    }

    getMaterials() {
        return Array.from(document.querySelectorAll('#materials-list [data-material]'))
            .map(item => JSON.parse(item.dataset.material));
    }

    getAssessments() {
        return Array.from(document.querySelectorAll('#assessments-list [data-assessment]'))
            .map(item => JSON.parse(item.dataset.assessment));
    }

    populatePrerequisites(prerequisites) {
        const list = document.getElementById('prerequisites-list');
        list.innerHTML = '';
        prerequisites.forEach(prereq => {
            const tag = document.createElement('span');
            tag.className = 'badge bg-secondary me-2 mb-2';
            tag.innerHTML = `
                ${prereq}
                <button type="button" class="btn-close btn-close-white ms-2" 
                    onclick="this.parentElement.remove()"></button>
            `;
            tag.dataset.prerequisite = prereq;
            list.appendChild(tag);
        });
    }

    populateMaterials(materials) {
        const list = document.getElementById('materials-list');
        list.innerHTML = '';
        materials.forEach(material => {
            const item = document.createElement('div');
            item.className = 'material-item d-flex justify-content-between align-items-center p-2 border rounded mb-2';
            item.innerHTML = `
                <div>
                    <span class="badge bg-info me-2">${material.type}</span>
                    <span>${material.title}</span>
                    ${material.required ? '<span class="badge bg-danger ms-2">Required</span>' : '<span class="badge bg-secondary ms-2">Optional</span>'}
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            item.dataset.material = JSON.stringify(material);
            list.appendChild(item);
        });
    }

    populateAssessments(assessments) {
        const list = document.getElementById('assessments-list');
        list.innerHTML = '';
        assessments.forEach(assessment => {
            const item = document.createElement('div');
            item.className = 'assessment-item d-flex justify-content-between align-items-center p-2 border rounded mb-2';
            item.innerHTML = `
                <div>
                    <strong>${assessment.type}</strong> - ${assessment.weight}% 
                    ${assessment.date ? `<small class="text-muted">(${this.formatDate(assessment.date)})</small>` : '<small class="text-muted">(Ongoing)</small>'}
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove(); window.CourseModals.updateTotalWeight();">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            item.dataset.assessment = JSON.stringify(assessment);
            list.appendChild(item);
        });
        this.updateTotalWeight();
    }

    validateForm() {
        // Real-time validation logic
        const form = document.getElementById('courseForm');
        const submitBtn = document.getElementById('submit-course-btn');

        const isValid = form.checkValidity();
        submitBtn.disabled = !isValid;
    }

    validateTimeRange() {
        const startTime = document.getElementById('course-start-time').value;
        const endTime = document.getElementById('course-end-time').value;

        if (startTime && endTime && startTime >= endTime) {
            document.getElementById('course-end-time').setCustomValidity('End time must be after start time');
        } else {
            document.getElementById('course-end-time').setCustomValidity('');
        }
    }

    validateDateRange() {
        const startDate = document.getElementById('course-start-date').value;
        const endDate = document.getElementById('course-end-date').value;

        if (startDate && endDate && startDate >= endDate) {
            document.getElementById('course-end-date').setCustomValidity('End date must be after start date');
        } else {
            document.getElementById('course-end-date').setCustomValidity('');
        }
    }

    handleInstructorChange() {
        // Could implement instructor availability checking here
    }

    editFromView() {
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewCourseModal'));
        viewModal.hide();

        setTimeout(() => {
            this.showEditModal(this.currentCourse.id);
        }, 300);
    }

    convertToMilitaryTime(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    }

    formatTimeRange(startTime, endTime) {
        if (!startTime || !endTime) return '';

        const formatTime = (time) => {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        };

        return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getStatusClass(status) {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            case 'Planned': return 'info';
            default: return 'primary';
        }
    }

    static updateTotalWeight() {
        const instance = window.CourseModals;
        if (instance) {
            instance.updateTotalWeight();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.CourseModals = new CourseModals();
});