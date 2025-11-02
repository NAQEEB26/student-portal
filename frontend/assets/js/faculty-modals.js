/**
 * Faculty Modals System
 * Handles all modal interactions for faculty management
 */

class FacultyModals {
    constructor() {
        this.currentFaculty = null;
        this.init();
    }

    init() {
        this.createModalsHTML();
        this.setupEventListeners();
    }

    createModalsHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Add Faculty Modal -->
            <div class="modal fade" id="addFacultyModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-user-tie me-2"></i>Add New Faculty Member
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="addFacultyForm">
                            <div class="modal-body">
                                <!-- Personal Information -->
                                <h6 class="border-bottom pb-2 mb-3">Personal Information</h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-name" class="form-label">Full Name *</label>
                                        <input type="text" class="form-control" id="add-faculty-name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-employee-id" class="form-label">Employee ID *</label>
                                        <input type="text" class="form-control" id="add-faculty-employee-id" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-email" class="form-label">Email Address *</label>
                                        <input type="email" class="form-control" id="add-faculty-email" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="add-faculty-phone">
                                    </div>
                                </div>

                                <!-- Academic Information -->
                                <h6 class="border-bottom pb-2 mb-3 mt-4">Academic Information</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-department" class="form-label">Department *</label>
                                        <select class="form-select" id="add-faculty-department" required>
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Biology">Biology</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Psychology">Psychology</option>
                                            <option value="Business">Business</option>
                                            <option value="Physics">Physics</option>
                                            <option value="Chemistry">Chemistry</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-position" class="form-label">Position *</label>
                                        <select class="form-select" id="add-faculty-position" required>
                                            <option value="">Select Position</option>
                                            <option value="Professor">Professor</option>
                                            <option value="Associate Professor">Associate Professor</option>
                                            <option value="Assistant Professor">Assistant Professor</option>
                                            <option value="Lecturer">Lecturer</option>
                                            <option value="Adjunct">Adjunct</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-status" class="form-label">Status *</label>
                                        <select class="form-select" id="add-faculty-status" required>
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="On Leave">On Leave</option>
                                            <option value="Sabbatical">Sabbatical</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-campus" class="form-label">Campus *</label>
                                        <select class="form-select" id="add-faculty-campus" required>
                                            <option value="">Select Campus</option>
                                            <option value="Main Campus">Main Campus</option>
                                            <option value="North Campus">North Campus</option>
                                            <option value="Medical Campus">Medical Campus</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-hire-date" class="form-label">Hire Date *</label>
                                        <input type="date" class="form-control" id="add-faculty-hire-date" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-office" class="form-label">Office Location</label>
                                        <input type="text" class="form-control" id="add-faculty-office" placeholder="Building, Room Number">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-faculty-office-hours" class="form-label">Office Hours</label>
                                        <input type="text" class="form-control" id="add-faculty-office-hours" placeholder="e.g., Mon-Wed-Fri 2:00-4:00 PM">
                                    </div>
                                </div>

                                <!-- Education -->
                                <h6 class="border-bottom pb-2 mb-3 mt-4">Education</h6>
                                <div id="education-container">
                                    <div class="education-entry row mb-3">
                                        <div class="col-md-4">
                                            <label class="form-label">Degree</label>
                                            <input type="text" class="form-control education-degree" placeholder="e.g., Ph.D. Computer Science">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Institution</label>
                                            <input type="text" class="form-control education-institution" placeholder="University Name">
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Year</label>
                                            <input type="number" class="form-control education-year" min="1950" max="2025">
                                        </div>
                                        <div class="col-md-1 d-flex align-items-end">
                                            <button type="button" class="btn btn-outline-danger" onclick="removeEducationEntry(this)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-primary" onclick="addEducationEntry()">
                                    <i class="fas fa-plus me-2"></i>Add Education
                                </button>

                                <!-- Specializations -->
                                <h6 class="border-bottom pb-2 mb-3 mt-4">Specializations & Research</h6>
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label for="add-faculty-specializations" class="form-label">Specializations (comma-separated)</label>
                                        <input type="text" class="form-control" id="add-faculty-specializations" 
                                               placeholder="e.g., Machine Learning, Data Science, AI Ethics">
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label for="add-faculty-research" class="form-label">Research Interests (comma-separated)</label>
                                        <input type="text" class="form-control" id="add-faculty-research" 
                                               placeholder="e.g., Artificial Intelligence, Natural Language Processing">
                                    </div>
                                </div>

                                <!-- Employment Details -->
                                <h6 class="border-bottom pb-2 mb-3 mt-4">Employment Details</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-contract-type" class="form-label">Contract Type</label>
                                        <select class="form-select" id="add-faculty-contract-type">
                                            <option value="">Select Type</option>
                                            <option value="Tenure Track">Tenure Track</option>
                                            <option value="Tenured">Tenured</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Part-time">Part-time</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-salary" class="form-label">Annual Salary</label>
                                        <input type="number" class="form-control" id="add-faculty-salary" min="0">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-publications" class="form-label">Publications Count</label>
                                        <input type="number" class="form-control" id="add-faculty-publications" min="0" value="0">
                                    </div>
                                </div>

                                <!-- Workload Distribution -->
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-teaching-load" class="form-label">Teaching Load (%)</label>
                                        <input type="number" class="form-control workload-input" id="add-faculty-teaching-load" 
                                               min="0" max="100" value="60">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-research-load" class="form-label">Research Load (%)</label>
                                        <input type="number" class="form-control workload-input" id="add-faculty-research-load" 
                                               min="0" max="100" value="30">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-faculty-service-load" class="form-label">Service Load (%)</label>
                                        <input type="number" class="form-control workload-input" id="add-faculty-service-load" 
                                               min="0" max="100" value="10">
                                    </div>
                                </div>
                                <div class="alert alert-info" id="workload-total">
                                    <small>Total workload: 100%</small>
                                </div>

                                <!-- Bio -->
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label for="add-faculty-bio" class="form-label">Biography</label>
                                        <textarea class="form-control" id="add-faculty-bio" rows="4" 
                                                  placeholder="Brief professional biography..."></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Add Faculty Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- View Faculty Modal -->
            <div class="modal fade" id="viewFacultyModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-user-tie me-2"></i>Faculty Profile
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Faculty Header -->
                            <div class="row mb-4">
                                <div class="col-md-3 text-center">
                                    <img id="view-faculty-photo" src="" alt="Faculty Photo" class="rounded-circle mb-3" 
                                         style="width: 150px; height: 150px; object-fit: cover;"
                                         onerror="this.src='assets/images/default-avatar.png'">
                                    <div class="rating-display mb-2">
                                        <div id="view-faculty-rating" class="h4 text-warning">0.0</div>
                                        <div id="view-faculty-stars" class="rating-stars"></div>
                                        <small class="text-muted">Teaching Rating</small>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 id="view-faculty-name">Faculty Name</h3>
                                            <p class="text-muted mb-2" id="view-faculty-title">Position • Department</p>
                                            <div class="faculty-badges mb-3">
                                                <span class="badge bg-primary me-2" id="view-faculty-position">Position</span>
                                                <span class="badge bg-success me-2" id="view-faculty-status">Status</span>
                                                <span class="badge bg-secondary" id="view-faculty-campus">Campus</span>
                                            </div>
                                        </div>
                                        <div class="btn-group">
                                            <button class="btn btn-outline-primary" onclick="editCurrentFaculty()">
                                                <i class="fas fa-edit me-2"></i>Edit
                                            </button>
                                            <button class="btn btn-outline-info" onclick="facultyPerformanceReport()">
                                                <i class="fas fa-chart-line me-2"></i>Performance
                                            </button>
                                            <button class="btn btn-outline-secondary" onclick="exportFacultyProfile()">
                                                <i class="fas fa-download me-2"></i>Export
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Key Stats -->
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="stat-item text-center">
                                                <div class="h4 text-primary" id="view-faculty-students">0</div>
                                                <small class="text-muted">Students</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item text-center">
                                                <div class="h4 text-success" id="view-faculty-publications">0</div>
                                                <small class="text-muted">Publications</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item text-center">
                                                <div class="h4 text-info" id="view-faculty-courses">0</div>
                                                <small class="text-muted">Courses</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item text-center">
                                                <div class="h4 text-warning" id="view-faculty-years">0</div>
                                                <small class="text-muted">Years</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Faculty Details Tabs -->
                            <ul class="nav nav-tabs" id="facultyDetailsTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="general-tab" data-bs-toggle="tab" 
                                        data-bs-target="#general-pane" type="button" role="tab">
                                        <i class="fas fa-info-circle me-2"></i>General
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="education-tab" data-bs-toggle="tab" 
                                        data-bs-target="#education-pane" type="button" role="tab">
                                        <i class="fas fa-graduation-cap me-2"></i>Education
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="research-tab" data-bs-toggle="tab" 
                                        data-bs-target="#research-pane" type="button" role="tab">
                                        <i class="fas fa-flask me-2"></i>Research
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="courses-tab" data-bs-toggle="tab" 
                                        data-bs-target="#courses-pane" type="button" role="tab">
                                        <i class="fas fa-book me-2"></i>Courses
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="performance-tab" data-bs-toggle="tab" 
                                        data-bs-target="#performance-pane" type="button" role="tab">
                                        <i class="fas fa-chart-bar me-2"></i>Performance
                                    </button>
                                </li>
                            </ul>

                            <div class="tab-content mt-3" id="facultyDetailsTabContent">
                                <!-- General Tab -->
                                <div class="tab-pane fade show active" id="general-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>Contact Information</h6>
                                            <table class="table table-borderless">
                                                <tr>
                                                    <td class="fw-bold">Email:</td>
                                                    <td id="view-faculty-email">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Phone:</td>
                                                    <td id="view-faculty-phone">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Office:</td>
                                                    <td id="view-faculty-office">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Office Hours:</td>
                                                    <td id="view-faculty-office-hours">-</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>Employment Details</h6>
                                            <table class="table table-borderless">
                                                <tr>
                                                    <td class="fw-bold">Employee ID:</td>
                                                    <td id="view-faculty-employee-id">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Hire Date:</td>
                                                    <td id="view-faculty-hire-date">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Contract Type:</td>
                                                    <td id="view-faculty-contract-type">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Current Status:</td>
                                                    <td id="view-faculty-current-status">-</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <h6>Biography</h6>
                                            <p id="view-faculty-bio" class="text-muted">No biography available.</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Workload Distribution -->
                                    <div class="row">
                                        <div class="col-12">
                                            <h6>Workload Distribution</h6>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <div class="workload-item">
                                                        <label class="form-label">Teaching</label>
                                                        <div class="progress mb-2">
                                                            <div class="progress-bar bg-primary" id="view-teaching-progress" style="width: 0%"></div>
                                                        </div>
                                                        <small id="view-teaching-percent" class="text-muted">0%</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="workload-item">
                                                        <label class="form-label">Research</label>
                                                        <div class="progress mb-2">
                                                            <div class="progress-bar bg-success" id="view-research-progress" style="width: 0%"></div>
                                                        </div>
                                                        <small id="view-research-percent" class="text-muted">0%</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="workload-item">
                                                        <label class="form-label">Service</label>
                                                        <div class="progress mb-2">
                                                            <div class="progress-bar bg-info" id="view-service-progress" style="width: 0%"></div>
                                                        </div>
                                                        <small id="view-service-percent" class="text-muted">0%</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Education Tab -->
                                <div class="tab-pane fade" id="education-pane" role="tabpanel">
                                    <h6>Educational Background</h6>
                                    <div id="view-education-list">
                                        <!-- Education details will be loaded here -->
                                    </div>
                                </div>

                                <!-- Research Tab -->
                                <div class="tab-pane fade" id="research-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>Specializations</h6>
                                            <div id="view-specializations-list">
                                                <!-- Specializations will be loaded here -->
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>Research Interests</h6>
                                            <div id="view-research-interests-list">
                                                <!-- Research interests will be loaded here -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col-12">
                                            <h6>Awards & Recognition</h6>
                                            <div id="view-awards-list">
                                                <!-- Awards will be loaded here -->
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Courses Tab -->
                                <div class="tab-pane fade" id="courses-pane" role="tabpanel">
                                    <h6>Currently Teaching</h6>
                                    <div id="view-current-courses">
                                        <!-- Current courses will be loaded here -->
                                    </div>
                                </div>

                                <!-- Performance Tab -->
                                <div class="tab-pane fade" id="performance-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>Performance Metrics</h6>
                                            <div class="performance-metrics">
                                                <div class="metric-item mb-3">
                                                    <label class="form-label">Teaching Score</label>
                                                    <div class="progress">
                                                        <div class="progress-bar bg-primary" id="view-teaching-score" style="width: 0%"></div>
                                                    </div>
                                                    <small id="view-teaching-score-text" class="text-muted">0.0/5.0</small>
                                                </div>
                                                <div class="metric-item mb-3">
                                                    <label class="form-label">Research Score</label>
                                                    <div class="progress">
                                                        <div class="progress-bar bg-success" id="view-research-score" style="width: 0%"></div>
                                                    </div>
                                                    <small id="view-research-score-text" class="text-muted">0.0/5.0</small>
                                                </div>
                                                <div class="metric-item mb-3">
                                                    <label class="form-label">Service Score</label>
                                                    <div class="progress">
                                                        <div class="progress-bar bg-info" id="view-service-score" style="width: 0%"></div>
                                                    </div>
                                                    <small id="view-service-score-text" class="text-muted">0.0/5.0</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>Overall Performance</h6>
                                            <div class="text-center">
                                                <div class="performance-circle mb-3">
                                                    <div id="view-overall-score" class="h2 text-primary">0.0</div>
                                                    <small class="text-muted">Overall Score</small>
                                                </div>
                                                <div class="performance-status">
                                                    <span id="view-performance-status" class="badge bg-success">Excellent</span>
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
                                <button type="button" class="btn btn-primary" onclick="editCurrentFaculty()">
                                    <i class="fas fa-edit me-2"></i>Edit Faculty
                                </button>
                                <button type="button" class="btn btn-info" onclick="facultyCourses()">
                                    <i class="fas fa-book me-2"></i>Manage Courses
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
        // Add Faculty Form
        const addForm = document.getElementById('addFacultyForm');
        if (addForm) {
            addForm.addEventListener('submit', this.handleAddFaculty.bind(this));
        }

        // Workload calculation
        const workloadInputs = document.querySelectorAll('.workload-input');
        workloadInputs.forEach(input => {
            input.addEventListener('input', this.updateWorkloadTotal.bind(this));
        });
    }

    showAddModal() {
        this.resetForm('addFacultyForm');
        const modal = new bootstrap.Modal(document.getElementById('addFacultyModal'));
        modal.show();
    }

    showEditModal(facultyId) {
        const faculty = window.facultyManager?.getFacultyById(facultyId);
        if (!faculty) return;

        this.currentFaculty = faculty;
        // For now, show view modal - edit modal would be similar to add modal
        this.showViewModal(facultyId);
    }

    showViewModal(facultyId) {
        const faculty = window.facultyManager?.getFacultyById(facultyId);
        if (!faculty) return;

        this.currentFaculty = faculty;
        this.populateViewModal(faculty);

        const modal = new bootstrap.Modal(document.getElementById('viewFacultyModal'));
        modal.show();
    }

    populateViewModal(faculty) {
        // Header info
        document.getElementById('view-faculty-photo').src = faculty.photo || 'assets/images/default-avatar.png';
        document.getElementById('view-faculty-name').textContent = faculty.name;
        document.getElementById('view-faculty-title').textContent = `${faculty.position} • ${faculty.department}`;
        document.getElementById('view-faculty-position').textContent = faculty.position;
        document.getElementById('view-faculty-status').textContent = faculty.status;
        document.getElementById('view-faculty-campus').textContent = faculty.campus;

        // Rating
        document.getElementById('view-faculty-rating').textContent = faculty.rating.toFixed(1);
        document.getElementById('view-faculty-stars').innerHTML = this.renderStars(faculty.rating);

        // Stats
        document.getElementById('view-faculty-students').textContent = faculty.totalStudents;
        document.getElementById('view-faculty-publications').textContent = faculty.publications;
        document.getElementById('view-faculty-courses').textContent = faculty.courses.length;

        const years = new Date().getFullYear() - new Date(faculty.hireDate).getFullYear();
        document.getElementById('view-faculty-years').textContent = years;

        // General tab
        document.getElementById('view-faculty-email').textContent = faculty.email;
        document.getElementById('view-faculty-phone').textContent = faculty.phone || '-';
        document.getElementById('view-faculty-office').textContent = faculty.office || '-';
        document.getElementById('view-faculty-office-hours').textContent = faculty.officeHours || '-';
        document.getElementById('view-faculty-employee-id').textContent = faculty.employeeId;
        document.getElementById('view-faculty-hire-date').textContent = this.formatDate(faculty.hireDate);
        document.getElementById('view-faculty-contract-type').textContent = faculty.contractType || '-';
        document.getElementById('view-faculty-current-status').textContent = faculty.status;
        document.getElementById('view-faculty-bio').textContent = faculty.bio || 'No biography available.';

        // Workload
        if (faculty.workload) {
            this.updateWorkloadDisplay('teaching', faculty.workload.teaching);
            this.updateWorkloadDisplay('research', faculty.workload.research);
            this.updateWorkloadDisplay('service', faculty.workload.service);
        }

        // Education
        this.populateEducationList(faculty.education || []);

        // Research
        this.populateSpecializationsList(faculty.specializations || []);
        this.populateResearchInterestsList(faculty.researchInterests || []);
        this.populateAwardsList(faculty.awards || []);

        // Courses
        this.populateCurrentCourses(faculty.courses || []);

        // Performance
        if (faculty.performance) {
            this.updatePerformanceDisplay(faculty.performance);
        }
    }

    updateWorkloadDisplay(type, percentage) {
        const progressEl = document.getElementById(`view-${type}-progress`);
        const textEl = document.getElementById(`view-${type}-percent`);

        if (progressEl && textEl) {
            progressEl.style.width = `${percentage}%`;
            textEl.textContent = `${percentage}%`;
        }
    }

    populateEducationList(education) {
        const container = document.getElementById('view-education-list');
        if (!container) return;

        if (education.length === 0) {
            container.innerHTML = '<p class="text-muted">No education information available.</p>';
            return;
        }

        container.innerHTML = education.map(edu => `
            <div class="education-item mb-3 p-3 border rounded">
                <h6 class="mb-1">${edu.degree}</h6>
                <div class="text-muted">${edu.institution} • ${edu.year}</div>
            </div>
        `).join('');
    }

    populateSpecializationsList(specializations) {
        const container = document.getElementById('view-specializations-list');
        if (!container) return;

        if (specializations.length === 0) {
            container.innerHTML = '<p class="text-muted">No specializations listed.</p>';
            return;
        }

        container.innerHTML = specializations.map(spec => `
            <span class="badge bg-primary me-2 mb-2">${spec}</span>
        `).join('');
    }

    populateResearchInterestsList(interests) {
        const container = document.getElementById('view-research-interests-list');
        if (!container) return;

        if (interests.length === 0) {
            container.innerHTML = '<p class="text-muted">No research interests listed.</p>';
            return;
        }

        container.innerHTML = interests.map(interest => `
            <span class="badge bg-success me-2 mb-2">${interest}</span>
        `).join('');
    }

    populateAwardsList(awards) {
        const container = document.getElementById('view-awards-list');
        if (!container) return;

        if (awards.length === 0) {
            container.innerHTML = '<p class="text-muted">No awards or recognition listed.</p>';
            return;
        }

        container.innerHTML = awards.map(award => `
            <div class="award-item mb-2">
                <i class="fas fa-award text-warning me-2"></i>
                <span>${award}</span>
            </div>
        `).join('');
    }

    populateCurrentCourses(courses) {
        const container = document.getElementById('view-current-courses');
        if (!container) return;

        if (courses.length === 0) {
            container.innerHTML = '<p class="text-muted">No courses assigned.</p>';
            return;
        }

        container.innerHTML = courses.map(course => `
            <div class="course-item mb-2 p-2 border rounded">
                <span class="badge bg-info">${course}</span>
            </div>
        `).join('');
    }

    updatePerformanceDisplay(performance) {
        // Performance scores
        this.updateScoreDisplay('teaching', performance.teachingScore);
        this.updateScoreDisplay('research', performance.researchScore);
        this.updateScoreDisplay('service', performance.serviceScore);

        // Overall score
        document.getElementById('view-overall-score').textContent = performance.overallScore.toFixed(1);

        const status = performance.overallScore >= 4.5 ? 'Excellent' :
            performance.overallScore >= 4.0 ? 'Very Good' :
                performance.overallScore >= 3.5 ? 'Good' : 'Needs Improvement';

        const statusClass = performance.overallScore >= 4.5 ? 'success' :
            performance.overallScore >= 4.0 ? 'info' :
                performance.overallScore >= 3.5 ? 'warning' : 'danger';

        const statusEl = document.getElementById('view-performance-status');
        statusEl.textContent = status;
        statusEl.className = `badge bg-${statusClass}`;
    }

    updateScoreDisplay(type, score) {
        const progressEl = document.getElementById(`view-${type}-score`);
        const textEl = document.getElementById(`view-${type}-score-text`);

        if (progressEl && textEl) {
            const percentage = (score / 5) * 100;
            progressEl.style.width = `${percentage}%`;
            textEl.textContent = `${score.toFixed(1)}/5.0`;
        }
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

    handleAddFaculty(event) {
        event.preventDefault();

        const formData = this.getFormData('add');
        if (!this.validateFacultyData(formData)) return;

        const newFaculty = window.facultyManager?.addFaculty(formData);
        if (newFaculty) {
            bootstrap.Modal.getInstance(document.getElementById('addFacultyModal')).hide();
            this.showSuccessMessage('Faculty member added successfully!');
        }
    }

    getFormData(prefix) {
        // Get education entries
        const education = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            const degree = entry.querySelector('.education-degree').value;
            const institution = entry.querySelector('.education-institution').value;
            const year = entry.querySelector('.education-year').value;

            if (degree && institution && year) {
                education.push({ degree, institution, year: parseInt(year) });
            }
        });

        // Get specializations and research interests
        const specializations = document.getElementById(`${prefix}-faculty-specializations`).value
            .split(',').map(s => s.trim()).filter(s => s);
        const researchInterests = document.getElementById(`${prefix}-faculty-research`).value
            .split(',').map(s => s.trim()).filter(s => s);

        return {
            name: document.getElementById(`${prefix}-faculty-name`).value,
            employeeId: document.getElementById(`${prefix}-faculty-employee-id`).value,
            email: document.getElementById(`${prefix}-faculty-email`).value,
            phone: document.getElementById(`${prefix}-faculty-phone`).value,
            department: document.getElementById(`${prefix}-faculty-department`).value,
            position: document.getElementById(`${prefix}-faculty-position`).value,
            status: document.getElementById(`${prefix}-faculty-status`).value,
            campus: document.getElementById(`${prefix}-faculty-campus`).value,
            hireDate: document.getElementById(`${prefix}-faculty-hire-date`).value,
            office: document.getElementById(`${prefix}-faculty-office`).value,
            officeHours: document.getElementById(`${prefix}-faculty-office-hours`).value,
            contractType: document.getElementById(`${prefix}-faculty-contract-type`).value,
            salary: parseInt(document.getElementById(`${prefix}-faculty-salary`).value) || 0,
            publications: parseInt(document.getElementById(`${prefix}-faculty-publications`).value) || 0,
            bio: document.getElementById(`${prefix}-faculty-bio`).value,
            education: education,
            specializations: specializations,
            researchInterests: researchInterests,
            workload: {
                teaching: parseInt(document.getElementById(`${prefix}-faculty-teaching-load`).value) || 0,
                research: parseInt(document.getElementById(`${prefix}-faculty-research-load`).value) || 0,
                service: parseInt(document.getElementById(`${prefix}-faculty-service-load`).value) || 0
            },
            courses: [],
            awards: [],
            rating: 4.0,
            totalStudents: 0,
            photo: 'assets/images/default-avatar.png',
            performance: {
                teachingScore: 4.0,
                researchScore: 4.0,
                serviceScore: 4.0,
                overallScore: 4.0
            }
        };
    }

    validateFacultyData(data) {
        if (!data.name.trim()) {
            this.showErrorMessage('Faculty name is required');
            return false;
        }

        if (!data.employeeId.trim()) {
            this.showErrorMessage('Employee ID is required');
            return false;
        }

        if (!data.email.trim()) {
            this.showErrorMessage('Email address is required');
            return false;
        }

        if (!data.department) {
            this.showErrorMessage('Department is required');
            return false;
        }

        if (!data.position) {
            this.showErrorMessage('Position is required');
            return false;
        }

        if (!data.status) {
            this.showErrorMessage('Status is required');
            return false;
        }

        if (!data.campus) {
            this.showErrorMessage('Campus is required');
            return false;
        }

        if (!data.hireDate) {
            this.showErrorMessage('Hire date is required');
            return false;
        }

        // Validate workload totals to 100%
        const totalWorkload = data.workload.teaching + data.workload.research + data.workload.service;
        if (totalWorkload !== 100) {
            this.showErrorMessage('Workload distribution must total 100%');
            return false;
        }

        return true;
    }

    updateWorkloadTotal() {
        const teaching = parseInt(document.getElementById('add-faculty-teaching-load').value) || 0;
        const research = parseInt(document.getElementById('add-faculty-research-load').value) || 0;
        const service = parseInt(document.getElementById('add-faculty-service-load').value) || 0;

        const total = teaching + research + service;
        const totalEl = document.getElementById('workload-total');

        if (totalEl) {
            totalEl.innerHTML = `<small>Total workload: ${total}%</small>`;
            totalEl.className = total === 100 ? 'alert alert-success' : 'alert alert-warning';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();

            // Reset workload total
            const totalEl = document.getElementById('workload-total');
            if (totalEl) {
                totalEl.innerHTML = '<small>Total workload: 100%</small>';
                totalEl.className = 'alert alert-info';
            }
        }
    }

    showSuccessMessage(message) {
        alert(message);
    }

    showErrorMessage(message) {
        alert(message);
    }
}

// Global functions for modal access
window.editCurrentFaculty = function () {
    if (window.facultyModals && window.facultyModals.currentFaculty) {
        console.log('Edit faculty:', window.facultyModals.currentFaculty.id);
    }
};

window.facultyPerformanceReport = function () {
    console.log('Generate faculty performance report');
};

window.exportFacultyProfile = function () {
    if (window.facultyModals && window.facultyModals.currentFaculty) {
        const faculty = window.facultyModals.currentFaculty;
        console.log('Export faculty profile:', faculty.name);
    }
};

window.addEducationEntry = function () {
    const container = document.getElementById('education-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'education-entry row mb-3';
    newEntry.innerHTML = `
        <div class="col-md-4">
            <label class="form-label">Degree</label>
            <input type="text" class="form-control education-degree" placeholder="e.g., Ph.D. Computer Science">
        </div>
        <div class="col-md-4">
            <label class="form-label">Institution</label>
            <input type="text" class="form-control education-institution" placeholder="University Name">
        </div>
        <div class="col-md-3">
            <label class="form-label">Year</label>
            <input type="number" class="form-control education-year" min="1950" max="2025">
        </div>
        <div class="col-md-1 d-flex align-items-end">
            <button type="button" class="btn btn-outline-danger" onclick="removeEducationEntry(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(newEntry);
};

window.removeEducationEntry = function (button) {
    button.closest('.education-entry').remove();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.facultyModals = new FacultyModals();
    }
});