/**
 * Campus Modals System
 * Handles all modal interactions for campus management
 */

class CampusModals {
    constructor() {
        this.currentCampus = null;
        this.init();
    }

    init() {
        this.createModalsHTML();
        this.setupEventListeners();
    }

    createModalsHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Add Campus Modal -->
            <div class="modal fade" id="addCampusModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-university me-2"></i>Add New Campus
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="addCampusForm">
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-name" class="form-label">Campus Name *</label>
                                        <input type="text" class="form-control" id="add-campus-name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-code" class="form-label">Campus Code *</label>
                                        <input type="text" class="form-control" id="add-campus-code" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-type" class="form-label">Campus Type *</label>
                                        <select class="form-select" id="add-campus-type" required>
                                            <option value="">Select Type</option>
                                            <option value="Primary">Primary</option>
                                            <option value="Satellite">Satellite</option>
                                            <option value="Specialized">Specialized</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-status" class="form-label">Status *</label>
                                        <select class="form-select" id="add-campus-status" required>
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Maintenance">Under Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="add-campus-address" class="form-label">Address *</label>
                                    <textarea class="form-control" id="add-campus-address" rows="2" required></textarea>
                                </div>

                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-established" class="form-label">Established Year</label>
                                        <input type="number" class="form-control" id="add-campus-established" min="1800" max="2025">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-area" class="form-label">Total Area</label>
                                        <input type="text" class="form-control" id="add-campus-area" placeholder="e.g. 150 acres">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-capacity" class="form-label">Total Capacity</label>
                                        <input type="number" class="form-control" id="add-campus-capacity" min="0">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="add-campus-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="add-campus-description" rows="3"></textarea>
                                </div>

                                <!-- Contact Information -->
                                <h6 class="border-bottom pb-2 mb-3">Contact Information</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-phone" class="form-label">Phone</label>
                                        <input type="tel" class="form-control" id="add-campus-phone">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="add-campus-email">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="add-campus-website" class="form-label">Website</label>
                                        <input type="url" class="form-control" id="add-campus-website">
                                    </div>
                                </div>

                                <!-- Facilities -->
                                <h6 class="border-bottom pb-2 mb-3">Available Facilities</h6>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="facility-checkboxes">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-library">
                                                        <label class="form-check-label" for="facility-library">Library</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-sports">
                                                        <label class="form-check-label" for="facility-sports">Sports Complex</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-cafeteria">
                                                        <label class="form-check-label" for="facility-cafeteria">Cafeteria</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-parking">
                                                        <label class="form-check-label" for="facility-parking">Parking</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-medical">
                                                        <label class="form-check-label" for="facility-medical">Medical Center</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-labs">
                                                        <label class="form-check-label" for="facility-labs">Laboratories</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-workshop">
                                                        <label class="form-check-label" for="facility-workshop">Workshop</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="facility-auditorium">
                                                        <label class="form-check-label" for="facility-auditorium">Auditorium</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Location Coordinates -->
                                <h6 class="border-bottom pb-2 mb-3">Location Coordinates</h6>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-latitude" class="form-label">Latitude</label>
                                        <input type="number" class="form-control" id="add-campus-latitude" step="any" placeholder="e.g. 40.7128">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="add-campus-longitude" class="form-label">Longitude</label>
                                        <input type="number" class="form-control" id="add-campus-longitude" step="any" placeholder="e.g. -74.0060">
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Add Campus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Edit Campus Modal -->
            <div class="modal fade" id="editCampusModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-edit me-2"></i>Edit Campus
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="editCampusForm">
                            <div class="modal-body">
                                <!-- Same form structure as add modal but with edit- prefixed IDs -->
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="edit-campus-name" class="form-label">Campus Name *</label>
                                        <input type="text" class="form-control" id="edit-campus-name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="edit-campus-code" class="form-label">Campus Code *</label>
                                        <input type="text" class="form-control" id="edit-campus-code" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="edit-campus-type" class="form-label">Campus Type *</label>
                                        <select class="form-select" id="edit-campus-type" required>
                                            <option value="">Select Type</option>
                                            <option value="Primary">Primary</option>
                                            <option value="Satellite">Satellite</option>
                                            <option value="Specialized">Specialized</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="edit-campus-status" class="form-label">Status *</label>
                                        <select class="form-select" id="edit-campus-status" required>
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Maintenance">Under Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="edit-campus-address" class="form-label">Address *</label>
                                    <textarea class="form-control" id="edit-campus-address" rows="2" required></textarea>
                                </div>

                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-established" class="form-label">Established Year</label>
                                        <input type="number" class="form-control" id="edit-campus-established" min="1800" max="2025">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-area" class="form-label">Total Area</label>
                                        <input type="text" class="form-control" id="edit-campus-area">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-capacity" class="form-label">Total Capacity</label>
                                        <input type="number" class="form-control" id="edit-campus-capacity" min="0">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="edit-campus-description" class="form-label">Description</label>
                                    <textarea class="form-control" id="edit-campus-description" rows="3"></textarea>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3">Contact Information</h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-phone" class="form-label">Phone</label>
                                        <input type="tel" class="form-control" id="edit-campus-phone">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="edit-campus-email">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="edit-campus-website" class="form-label">Website</label>
                                        <input type="url" class="form-control" id="edit-campus-website">
                                    </div>
                                </div>

                                <h6 class="border-bottom pb-2 mb-3">Current Statistics</h6>
                                <div class="row">
                                    <div class="col-md-3 mb-3">
                                        <label for="edit-campus-buildings" class="form-label">Buildings Count</label>
                                        <input type="number" class="form-control" id="edit-campus-buildings" min="0">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="edit-campus-rooms" class="form-label">Total Rooms</label>
                                        <input type="number" class="form-control" id="edit-campus-rooms" min="0">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="edit-campus-occupancy" class="form-label">Current Occupancy</label>
                                        <input type="number" class="form-control" id="edit-campus-occupancy" min="0">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Occupancy Rate</label>
                                        <div class="form-control" id="edit-occupancy-rate">0%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Update Campus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- View Campus Modal -->
            <div class="modal fade" id="viewCampusModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-university me-2"></i>Campus Details
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Campus Header Info -->
                            <div class="row mb-4">
                                <div class="col-md-8">
                                    <h3 id="view-campus-name">Campus Name</h3>
                                    <p class="text-muted mb-2" id="view-campus-description">Campus description</p>
                                    <div class="campus-badges mb-3">
                                        <span class="badge bg-secondary me-2" id="view-campus-code">CODE</span>
                                        <span class="badge bg-primary me-2" id="view-campus-type">Type</span>
                                        <span class="badge bg-success" id="view-campus-status">Status</span>
                                    </div>
                                </div>
                                <div class="col-md-4 text-end">
                                    <div class="btn-group">
                                        <button class="btn btn-outline-primary" onclick="editCurrentCampus()">
                                            <i class="fas fa-edit me-2"></i>Edit
                                        </button>
                                        <button class="btn btn-outline-info" onclick="generateCampusReport()">
                                            <i class="fas fa-chart-bar me-2"></i>Report
                                        </button>
                                        <button class="btn btn-outline-secondary" onclick="exportCampusDetails()">
                                            <i class="fas fa-download me-2"></i>Export
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Campus Statistics -->
                            <div class="row mb-4">
                                <div class="col-md-3">
                                    <div class="card border-left-primary h-100">
                                        <div class="card-body">
                                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Buildings
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="view-campus-buildings">0</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-left-success h-100">
                                        <div class="card-body">
                                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                Total Rooms
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="view-campus-rooms">0</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-left-info h-100">
                                        <div class="card-body">
                                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                Capacity
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="view-campus-capacity">0</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-left-warning h-100">
                                        <div class="card-body">
                                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                Occupancy
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="view-campus-occupancy-rate">0%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Campus Details Tabs -->
                            <ul class="nav nav-tabs" id="campusDetailsTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="general-info-tab" data-bs-toggle="tab" 
                                        data-bs-target="#general-info-pane" type="button" role="tab">
                                        <i class="fas fa-info-circle me-2"></i>General Info
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="facilities-info-tab" data-bs-toggle="tab" 
                                        data-bs-target="#facilities-info-pane" type="button" role="tab">
                                        <i class="fas fa-tools me-2"></i>Facilities
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="contact-info-tab" data-bs-toggle="tab" 
                                        data-bs-target="#contact-info-pane" type="button" role="tab">
                                        <i class="fas fa-address-book me-2"></i>Contact
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="location-info-tab" data-bs-toggle="tab" 
                                        data-bs-target="#location-info-pane" type="button" role="tab">
                                        <i class="fas fa-map-marker-alt me-2"></i>Location
                                    </button>
                                </li>
                            </ul>

                            <div class="tab-content mt-3" id="campusDetailsTabContent">
                                <!-- General Info Tab -->
                                <div class="tab-pane fade show active" id="general-info-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <table class="table table-borderless">
                                                <tr>
                                                    <td class="fw-bold">Campus Code:</td>
                                                    <td id="view-detail-code">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Established Year:</td>
                                                    <td id="view-detail-established">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Total Area:</td>
                                                    <td id="view-detail-area">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Campus Type:</td>
                                                    <td id="view-detail-type">-</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <table class="table table-borderless">
                                                <tr>
                                                    <td class="fw-bold">Current Status:</td>
                                                    <td id="view-detail-status">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Total Capacity:</td>
                                                    <td id="view-detail-capacity">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Current Occupancy:</td>
                                                    <td id="view-detail-occupancy">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Occupancy Rate:</td>
                                                    <td id="view-detail-occupancy-rate">-</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <h6>Description</h6>
                                            <p id="view-detail-description" class="text-muted">No description available.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Facilities Tab -->
                                <div class="tab-pane fade" id="facilities-info-pane" role="tabpanel">
                                    <h6>Available Facilities</h6>
                                    <div id="view-facilities-list" class="row">
                                        <!-- Facilities will be loaded here -->
                                    </div>
                                </div>

                                <!-- Contact Tab -->
                                <div class="tab-pane fade" id="contact-info-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <h6><i class="fas fa-phone me-2"></i>Phone</h6>
                                            <p id="view-contact-phone" class="text-muted">Not provided</p>
                                        </div>
                                        <div class="col-md-4">
                                            <h6><i class="fas fa-envelope me-2"></i>Email</h6>
                                            <p id="view-contact-email" class="text-muted">Not provided</p>
                                        </div>
                                        <div class="col-md-4">
                                            <h6><i class="fas fa-globe me-2"></i>Website</h6>
                                            <p id="view-contact-website" class="text-muted">Not provided</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <h6><i class="fas fa-map-marker-alt me-2"></i>Address</h6>
                                            <p id="view-contact-address" class="text-muted">Not provided</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Location Tab -->
                                <div class="tab-pane fade" id="location-info-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>Coordinates</h6>
                                            <table class="table table-borderless">
                                                <tr>
                                                    <td class="fw-bold">Latitude:</td>
                                                    <td id="view-location-lat">-</td>
                                                </tr>
                                                <tr>
                                                    <td class="fw-bold">Longitude:</td>
                                                    <td id="view-location-lng">-</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>Map Preview</h6>
                                            <div class="campus-map-preview bg-light rounded p-3 text-center">
                                                <i class="fas fa-map fa-3x text-muted mb-2"></i>
                                                <p class="text-muted mb-0">Map integration available</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <div class="btn-group">
                                <button type="button" class="btn btn-primary" onclick="editCurrentCampus()">
                                    <i class="fas fa-edit me-2"></i>Edit Campus
                                </button>
                                <button type="button" class="btn btn-info" onclick="manageCampusBuildings()">
                                    <i class="fas fa-building me-2"></i>Manage Buildings
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
        // Add Campus Form
        const addForm = document.getElementById('addCampusForm');
        if (addForm) {
            addForm.addEventListener('submit', this.handleAddCampus.bind(this));
        }

        // Edit Campus Form
        const editForm = document.getElementById('editCampusForm');
        if (editForm) {
            editForm.addEventListener('submit', this.handleEditCampus.bind(this));
        }

        // Update occupancy rate calculation in edit form
        const editCapacity = document.getElementById('edit-campus-capacity');
        const editOccupancy = document.getElementById('edit-campus-occupancy');
        if (editCapacity && editOccupancy) {
            [editCapacity, editOccupancy].forEach(input => {
                input.addEventListener('input', this.updateOccupancyRate.bind(this));
            });
        }
    }

    showAddModal() {
        this.resetForm('addCampusForm');
        const modal = new bootstrap.Modal(document.getElementById('addCampusModal'));
        modal.show();
    }

    showEditModal(campusId) {
        const campus = window.campusManager?.getCampusById(campusId);
        if (!campus) return;

        this.currentCampus = campus;
        this.populateEditForm(campus);

        const modal = new bootstrap.Modal(document.getElementById('editCampusModal'));
        modal.show();
    }

    showViewModal(campusId) {
        const campus = window.campusManager?.getCampusById(campusId);
        if (!campus) return;

        this.currentCampus = campus;
        this.populateViewModal(campus);

        const modal = new bootstrap.Modal(document.getElementById('viewCampusModal'));
        modal.show();
    }

    populateEditForm(campus) {
        document.getElementById('edit-campus-name').value = campus.name || '';
        document.getElementById('edit-campus-code').value = campus.code || '';
        document.getElementById('edit-campus-type').value = campus.type || '';
        document.getElementById('edit-campus-status').value = campus.status || '';
        document.getElementById('edit-campus-address').value = campus.address || '';
        document.getElementById('edit-campus-established').value = campus.establishedYear || '';
        document.getElementById('edit-campus-area').value = campus.totalArea || '';
        document.getElementById('edit-campus-capacity').value = campus.totalCapacity || '';
        document.getElementById('edit-campus-description').value = campus.description || '';
        document.getElementById('edit-campus-buildings').value = campus.buildings || '';
        document.getElementById('edit-campus-rooms').value = campus.totalRooms || '';
        document.getElementById('edit-campus-occupancy').value = campus.currentOccupancy || '';

        // Contact info
        if (campus.contactInfo) {
            document.getElementById('edit-campus-phone').value = campus.contactInfo.phone || '';
            document.getElementById('edit-campus-email').value = campus.contactInfo.email || '';
            document.getElementById('edit-campus-website').value = campus.contactInfo.website || '';
        }

        this.updateOccupancyRate();
    }

    populateViewModal(campus) {
        // Header info
        document.getElementById('view-campus-name').textContent = campus.name;
        document.getElementById('view-campus-description').textContent = campus.description || 'No description available';
        document.getElementById('view-campus-code').textContent = campus.code;
        document.getElementById('view-campus-type').textContent = campus.type;
        document.getElementById('view-campus-status').textContent = campus.status;

        // Statistics
        document.getElementById('view-campus-buildings').textContent = campus.buildings;
        document.getElementById('view-campus-rooms').textContent = campus.totalRooms;
        document.getElementById('view-campus-capacity').textContent = campus.totalCapacity.toLocaleString();

        const occupancyRate = campus.totalCapacity > 0 ?
            Math.round((campus.currentOccupancy / campus.totalCapacity) * 100) : 0;
        document.getElementById('view-campus-occupancy-rate').textContent = `${occupancyRate}%`;

        // General info tab
        document.getElementById('view-detail-code').textContent = campus.code;
        document.getElementById('view-detail-established').textContent = campus.establishedYear;
        document.getElementById('view-detail-area').textContent = campus.totalArea;
        document.getElementById('view-detail-type').textContent = campus.type;
        document.getElementById('view-detail-status').textContent = campus.status;
        document.getElementById('view-detail-capacity').textContent = campus.totalCapacity.toLocaleString();
        document.getElementById('view-detail-occupancy').textContent = campus.currentOccupancy.toLocaleString();
        document.getElementById('view-detail-occupancy-rate').textContent = `${occupancyRate}%`;
        document.getElementById('view-detail-description').textContent = campus.description || 'No description available';

        // Facilities
        this.populateFacilitiesList(campus.facilities || []);

        // Contact info
        if (campus.contactInfo) {
            document.getElementById('view-contact-phone').textContent = campus.contactInfo.phone || 'Not provided';
            document.getElementById('view-contact-email').textContent = campus.contactInfo.email || 'Not provided';
            document.getElementById('view-contact-website').textContent = campus.contactInfo.website || 'Not provided';
        }
        document.getElementById('view-contact-address').textContent = campus.address || 'Not provided';

        // Location
        if (campus.coordinates) {
            document.getElementById('view-location-lat').textContent = campus.coordinates.lat || '-';
            document.getElementById('view-location-lng').textContent = campus.coordinates.lng || '-';
        }
    }

    populateFacilitiesList(facilities) {
        const container = document.getElementById('view-facilities-list');
        if (!container) return;

        if (facilities.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted">No facilities listed</p></div>';
            return;
        }

        container.innerHTML = facilities.map(facility => `
            <div class="col-md-4 col-sm-6 mb-2">
                <div class="d-flex align-items-center">
                    <i class="fas fa-check-circle text-success me-2"></i>
                    <span>${facility}</span>
                </div>
            </div>
        `).join('');
    }

    handleAddCampus(event) {
        event.preventDefault();

        const formData = this.getFormData('add');
        if (!this.validateCampusData(formData)) return;

        const newCampus = window.campusManager?.addCampus(formData);
        if (newCampus) {
            bootstrap.Modal.getInstance(document.getElementById('addCampusModal')).hide();
            this.showSuccessMessage('Campus added successfully!');
        }
    }

    handleEditCampus(event) {
        event.preventDefault();

        if (!this.currentCampus) return;

        const formData = this.getFormData('edit');
        if (!this.validateCampusData(formData)) return;

        const updated = window.campusManager?.updateCampus(this.currentCampus.id, formData);
        if (updated) {
            bootstrap.Modal.getInstance(document.getElementById('editCampusModal')).hide();
            this.showSuccessMessage('Campus updated successfully!');
        }
    }

    getFormData(prefix) {
        const facilities = [];
        document.querySelectorAll('.facility-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
            facilities.push(checkbox.nextElementSibling.textContent);
        });

        return {
            name: document.getElementById(`${prefix}-campus-name`).value,
            code: document.getElementById(`${prefix}-campus-code`).value,
            type: document.getElementById(`${prefix}-campus-type`).value,
            status: document.getElementById(`${prefix}-campus-status`).value,
            address: document.getElementById(`${prefix}-campus-address`).value,
            establishedYear: parseInt(document.getElementById(`${prefix}-campus-established`).value) || null,
            totalArea: document.getElementById(`${prefix}-campus-area`).value,
            totalCapacity: parseInt(document.getElementById(`${prefix}-campus-capacity`).value) || 0,
            description: document.getElementById(`${prefix}-campus-description`).value,
            contactInfo: {
                phone: document.getElementById(`${prefix}-campus-phone`).value,
                email: document.getElementById(`${prefix}-campus-email`).value,
                website: document.getElementById(`${prefix}-campus-website`).value
            },
            facilities: facilities,
            coordinates: {
                lat: parseFloat(document.getElementById(`${prefix}-campus-latitude`).value) || null,
                lng: parseFloat(document.getElementById(`${prefix}-campus-longitude`).value) || null
            },
            ...(prefix === 'edit' && {
                buildings: parseInt(document.getElementById('edit-campus-buildings').value) || 0,
                totalRooms: parseInt(document.getElementById('edit-campus-rooms').value) || 0,
                currentOccupancy: parseInt(document.getElementById('edit-campus-occupancy').value) || 0
            })
        };
    }

    validateCampusData(data) {
        if (!data.name.trim()) {
            this.showErrorMessage('Campus name is required');
            return false;
        }

        if (!data.code.trim()) {
            this.showErrorMessage('Campus code is required');
            return false;
        }

        if (!data.type) {
            this.showErrorMessage('Campus type is required');
            return false;
        }

        if (!data.status) {
            this.showErrorMessage('Campus status is required');
            return false;
        }

        if (!data.address.trim()) {
            this.showErrorMessage('Campus address is required');
            return false;
        }

        return true;
    }

    updateOccupancyRate() {
        const capacity = parseInt(document.getElementById('edit-campus-capacity').value) || 0;
        const occupancy = parseInt(document.getElementById('edit-campus-occupancy').value) || 0;
        const rate = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;

        const rateElement = document.getElementById('edit-occupancy-rate');
        if (rateElement) {
            rateElement.textContent = `${rate}%`;
        }
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            // Uncheck all facility checkboxes
            form.querySelectorAll('.facility-checkboxes input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    }

    showSuccessMessage(message) {
        // Simple success message - could be enhanced with toast notifications
        alert(message);
    }

    showErrorMessage(message) {
        // Simple error message - could be enhanced with toast notifications
        alert(message);
    }
}

// Global functions for modal access
window.editCurrentCampus = function () {
    if (window.campusModals && window.campusModals.currentCampus) {
        bootstrap.Modal.getInstance(document.getElementById('viewCampusModal')).hide();
        setTimeout(() => {
            window.campusModals.showEditModal(window.campusModals.currentCampus.id);
        }, 300);
    }
};

window.generateCampusReport = function () {
    console.log('Generate campus report');
};

window.exportCampusDetails = function () {
    if (window.campusModals && window.campusModals.currentCampus) {
        const campus = window.campusModals.currentCampus;
        const csvContent = [
            'Campus Details',
            `Name: ${campus.name}`,
            `Code: ${campus.code}`,
            `Type: ${campus.type}`,
            `Status: ${campus.status}`,
            `Address: ${campus.address}`,
            `Established: ${campus.establishedYear}`,
            `Total Area: ${campus.totalArea}`,
            `Buildings: ${campus.buildings}`,
            `Total Capacity: ${campus.totalCapacity}`,
            `Current Occupancy: ${campus.currentOccupancy}`
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${campus.code}_details.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.campusModals = new CampusModals();
    }
});