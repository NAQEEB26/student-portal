/**
 * Campus Management System
 * Comprehensive campus infrastructure and facility management
 */

class CampusManager {
    constructor() {
        this.campuses = [];
        this.buildings = [];
        this.rooms = [];
        this.facilities = [];
        this.filteredCampuses = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.filters = {
            search: '',
            status: '',
            type: '',
            capacity: ''
        };
        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.renderCampusInterface();
    }

    loadMockData() {
        // Mock campus data
        this.campuses = [
            {
                id: 'campus_001',
                name: 'Main Campus',
                code: 'MAIN',
                address: '123 University Ave, City, State 12345',
                establishedYear: 1965,
                totalArea: '150 acres',
                status: 'Active',
                type: 'Primary',
                description: 'Primary campus with main academic buildings',
                contactInfo: {
                    phone: '(555) 123-4567',
                    email: 'main.campus@university.edu',
                    website: 'www.university.edu/main'
                },
                facilities: ['Library', 'Sports Complex', 'Cafeteria', 'Parking', 'Medical Center'],
                buildings: 12,
                totalRooms: 450,
                totalCapacity: 15000,
                currentOccupancy: 12500,
                coordinates: { lat: 40.7128, lng: -74.0060 }
            },
            {
                id: 'campus_002',
                name: 'North Campus',
                code: 'NORTH',
                address: '456 College Road, City, State 12346',
                establishedYear: 1985,
                totalArea: '80 acres',
                status: 'Active',
                type: 'Satellite',
                description: 'Engineering and technology focused campus',
                contactInfo: {
                    phone: '(555) 987-6543',
                    email: 'north.campus@university.edu',
                    website: 'www.university.edu/north'
                },
                facilities: ['Engineering Labs', 'Computer Center', 'Workshop', 'Parking'],
                buildings: 6,
                totalRooms: 180,
                totalCapacity: 5000,
                currentOccupancy: 4200,
                coordinates: { lat: 40.7580, lng: -73.9855 }
            },
            {
                id: 'campus_003',
                name: 'Medical Campus',
                code: 'MED',
                address: '789 Health Sciences Blvd, City, State 12347',
                establishedYear: 1998,
                totalArea: '45 acres',
                status: 'Active',
                type: 'Specialized',
                description: 'Medical and health sciences campus',
                contactInfo: {
                    phone: '(555) 456-7890',
                    email: 'medical.campus@university.edu',
                    website: 'www.university.edu/medical'
                },
                facilities: ['Hospital', 'Research Labs', 'Simulation Center', 'Library'],
                buildings: 4,
                totalRooms: 120,
                totalCapacity: 2500,
                currentOccupancy: 2200,
                coordinates: { lat: 40.6892, lng: -74.0445 }
            }
        ];

        // Mock building data
        this.buildings = [
            {
                id: 'building_001',
                campusId: 'campus_001',
                name: 'Academic Building A',
                code: 'ABA',
                type: 'Academic',
                floors: 4,
                totalRooms: 45,
                capacity: 1500,
                status: 'Active',
                yearBuilt: 1970,
                lastRenovated: 2018,
                facilities: ['Elevators', 'WiFi', 'AC', 'Projectors'],
                accessibility: true,
                coordinates: { floor: 1, x: 100, y: 150 }
            },
            {
                id: 'building_002',
                campusId: 'campus_001',
                name: 'Library Building',
                code: 'LIB',
                type: 'Library',
                floors: 6,
                totalRooms: 25,
                capacity: 800,
                status: 'Active',
                yearBuilt: 1980,
                lastRenovated: 2020,
                facilities: ['Study Rooms', 'Computer Lab', 'WiFi', 'AC'],
                accessibility: true,
                coordinates: { floor: 1, x: 200, y: 200 }
            }
        ];

        // Mock room data
        this.rooms = [
            {
                id: 'room_001',
                buildingId: 'building_001',
                campusId: 'campus_001',
                number: '101A',
                name: 'Lecture Hall A',
                type: 'Lecture Hall',
                capacity: 150,
                floor: 1,
                status: 'Available',
                equipment: ['Projector', 'Sound System', 'Whiteboard', 'WiFi'],
                accessibility: true,
                bookingStatus: 'Available',
                currentBooking: null,
                area: '200 sq ft',
                features: ['Air Conditioning', 'Natural Light']
            },
            {
                id: 'room_002',
                buildingId: 'building_001',
                campusId: 'campus_001',
                number: '102B',
                name: 'Computer Lab 1',
                type: 'Computer Lab',
                capacity: 40,
                floor: 1,
                status: 'Available',
                equipment: ['30 Computers', 'Projector', 'WiFi', 'Printer'],
                accessibility: true,
                bookingStatus: 'Occupied',
                currentBooking: {
                    course: 'CS 101',
                    instructor: 'Dr. Smith',
                    time: '09:00-11:00'
                },
                area: '150 sq ft',
                features: ['Air Conditioning', 'Backup Power']
            }
        ];

        this.applyFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('campus-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filter dropdowns
        const filterSelects = ['campus-status-filter', 'campus-type-filter', 'campus-capacity-filter'];
        filterSelects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', this.handleFilterChange.bind(this));
            }
        });

        // Sort functionality
        const sortSelect = document.getElementById('campus-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSort.bind(this));
        }

        // Items per page
        const itemsPerPageSelect = document.getElementById('campus-items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', this.handleItemsPerPageChange.bind(this));
        }
    }

    renderCampusInterface() {
        const campusContent = `
            <!-- Campus Management Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="h3 mb-0">Campus Management</h2>
                    <p class="text-muted">Manage campus facilities and infrastructure</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="addCampus()">
                        <i class="fas fa-plus me-2"></i>Add Campus
                    </button>
                    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-cog me-2"></i>Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="exportCampusData()">
                            <i class="fas fa-download me-2"></i>Export Data
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="generateCampusReport()">
                            <i class="fas fa-chart-bar me-2"></i>Generate Report
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="campusSettings()">
                            <i class="fas fa-cog me-2"></i>Settings
                        </a></li>
                    </ul>
                </div>
            </div>

            <!-- Campus Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card border-left-primary h-100">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Campuses
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.campuses.length}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-university fa-2x text-gray-300"></i>
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
                                        Total Buildings
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getTotalBuildings()}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-building fa-2x text-gray-300"></i>
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
                                        Total Rooms
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getTotalRooms()}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-door-open fa-2x text-gray-300"></i>
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
                                        Occupancy Rate
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getOccupancyRate()}%</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-chart-pie fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campus Management Tabs -->
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs" id="campusManagementTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="campuses-tab" data-bs-toggle="tab" 
                                data-bs-target="#campuses-pane" type="button" role="tab">
                                <i class="fas fa-university me-2"></i>Campuses
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="buildings-tab" data-bs-toggle="tab" 
                                data-bs-target="#buildings-pane" type="button" role="tab">
                                <i class="fas fa-building me-2"></i>Buildings
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="rooms-tab" data-bs-toggle="tab" 
                                data-bs-target="#rooms-pane" type="button" role="tab">
                                <i class="fas fa-door-open me-2"></i>Rooms
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="facilities-tab" data-bs-toggle="tab" 
                                data-bs-target="#facilities-pane" type="button" role="tab">
                                <i class="fas fa-tools me-2"></i>Facilities
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="maps-tab" data-bs-toggle="tab" 
                                data-bs-target="#maps-pane" type="button" role="tab">
                                <i class="fas fa-map me-2"></i>Campus Maps
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="campusTabContent">
                        <!-- Campuses Tab -->
                        <div class="tab-pane fade show active" id="campuses-pane" role="tabpanel">
                            ${this.renderCampusesTab()}
                        </div>
                        
                        <!-- Buildings Tab -->
                        <div class="tab-pane fade" id="buildings-pane" role="tabpanel">
                            ${this.renderBuildingsTab()}
                        </div>
                        
                        <!-- Rooms Tab -->
                        <div class="tab-pane fade" id="rooms-pane" role="tabpanel">
                            ${this.renderRoomsTab()}
                        </div>
                        
                        <!-- Facilities Tab -->
                        <div class="tab-pane fade" id="facilities-pane" role="tabpanel">
                            ${this.renderFacilitiesTab()}
                        </div>
                        
                        <!-- Maps Tab -->
                        <div class="tab-pane fade" id="maps-pane" role="tabpanel">
                            ${this.renderMapsTab()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('main-content') || document.getElementById('campus-management-container');
        if (container) {
            container.innerHTML = campusContent;
            this.setupTabEventListeners();
        }
    }

    renderCampusesTab() {
        return `
            <!-- Campus Filters and Controls -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="campus-search" placeholder="Search campuses...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="campus-status-filter">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="campus-type-filter">
                        <option value="">All Types</option>
                        <option value="Primary">Primary</option>
                        <option value="Satellite">Satellite</option>
                        <option value="Specialized">Specialized</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="campus-sort">
                        <option value="name">Sort by Name</option>
                        <option value="established">Established Year</option>
                        <option value="capacity">Capacity</option>
                        <option value="buildings">Buildings</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="campus-items-per-page">
                        <option value="10">10 per page</option>
                        <option value="25">25 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-secondary" onclick="resetCampusFilters()" title="Reset Filters">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>

            <!-- Campus Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Campus</th>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Buildings</th>
                            <th>Capacity</th>
                            <th>Occupancy</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="campus-table-body">
                        ${this.renderCampusRows()}
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                    Showing ${this.getDisplayInfo()} of ${this.filteredCampuses.length} campuses
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            </div>
        `;
    }

    renderBuildingsTab() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Building Management</h5>
                <button class="btn btn-primary" onclick="addBuilding()">
                    <i class="fas fa-plus me-2"></i>Add Building
                </button>
            </div>
            <div id="buildings-content">
                <!-- Buildings content will be loaded here -->
                <p class="text-muted">Building management interface will be loaded here...</p>
            </div>
        `;
    }

    renderRoomsTab() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Room Management</h5>
                <button class="btn btn-primary" onclick="addRoom()">
                    <i class="fas fa-plus me-2"></i>Add Room
                </button>
            </div>
            <div id="rooms-content">
                <!-- Rooms content will be loaded here -->
                <p class="text-muted">Room management interface will be loaded here...</p>
            </div>
        `;
    }

    renderFacilitiesTab() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Facilities Management</h5>
                <button class="btn btn-primary" onclick="addFacility()">
                    <i class="fas fa-plus me-2"></i>Add Facility
                </button>
            </div>
            <div id="facilities-content">
                <!-- Facilities content will be loaded here -->
                <p class="text-muted">Facilities management interface will be loaded here...</p>
            </div>
        `;
    }

    renderMapsTab() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Campus Maps & Navigation</h5>
                <div class="btn-group">
                    <button class="btn btn-outline-primary" onclick="generateCampusMap()">
                        <i class="fas fa-map-marked-alt me-2"></i>Generate Map
                    </button>
                    <button class="btn btn-outline-secondary" onclick="exportMapData()">
                        <i class="fas fa-download me-2"></i>Export
                    </button>
                </div>
            </div>
            <div id="campus-map-container">
                <!-- Campus map will be loaded here -->
                <div class="text-center py-5">
                    <i class="fas fa-map fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Campus map visualization will be displayed here</p>
                </div>
            </div>
        `;
    }

    renderCampusRows() {
        return this.getPaginatedCampuses().map(campus => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="campus-icon me-3">
                            <i class="fas fa-university text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${campus.name}</div>
                            <small class="text-muted">${campus.address}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary">${campus.code}</span></td>
                <td>
                    <span class="badge bg-${this.getTypeBadgeClass(campus.type)}">${campus.type}</span>
                </td>
                <td>${campus.buildings}</td>
                <td>${campus.totalCapacity.toLocaleString()}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${(campus.currentOccupancy / campus.totalCapacity * 100)}%">
                            ${Math.round(campus.currentOccupancy / campus.totalCapacity * 100)}%
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusBadgeClass(campus.status)}">${campus.status}</span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewCampus('${campus.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="editCampus('${campus.id}')" title="Edit Campus">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="manageCampusBuildings('${campus.id}')" title="Manage Buildings">
                            <i class="fas fa-building"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="viewCampusMap('${campus.id}')" title="View Map">
                            <i class="fas fa-map"></i>
                        </button>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="duplicateCampus('${campus.id}')">
                                    <i class="fas fa-copy me-2"></i>Duplicate
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="generateCampusReport('${campus.id}')">
                                    <i class="fas fa-chart-bar me-2"></i>Analytics
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deleteCampus('${campus.id}')">
                                    <i class="fas fa-trash me-2"></i>Delete
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Helper methods
    getTotalBuildings() {
        return this.campuses.reduce((total, campus) => total + campus.buildings, 0);
    }

    getTotalRooms() {
        return this.campuses.reduce((total, campus) => total + campus.totalRooms, 0);
    }

    getOccupancyRate() {
        const totalCapacity = this.campuses.reduce((total, campus) => total + campus.totalCapacity, 0);
        const totalOccupancy = this.campuses.reduce((total, campus) => total + campus.currentOccupancy, 0);
        return totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    }

    getTypeBadgeClass(type) {
        const classes = {
            'Primary': 'primary',
            'Satellite': 'info',
            'Specialized': 'warning'
        };
        return classes[type] || 'secondary';
    }

    getStatusBadgeClass(status) {
        const classes = {
            'Active': 'success',
            'Inactive': 'secondary',
            'Maintenance': 'warning'
        };
        return classes[status] || 'secondary';
    }

    // Event handlers
    handleSearch(event) {
        this.filters.search = event.target.value;
        this.applyFilters();
        this.updateCampusTable();
    }

    handleFilterChange(event) {
        const filterId = event.target.id;
        const value = event.target.value;

        switch (filterId) {
            case 'campus-status-filter':
                this.filters.status = value;
                break;
            case 'campus-type-filter':
                this.filters.type = value;
                break;
            case 'campus-capacity-filter':
                this.filters.capacity = value;
                break;
        }

        this.applyFilters();
        this.updateCampusTable();
    }

    handleSort(event) {
        const [field, order] = event.target.value.split('_');
        this.sortBy = field;
        this.sortOrder = order || 'asc';
        this.applyFilters();
        this.updateCampusTable();
    }

    handleItemsPerPageChange(event) {
        this.itemsPerPage = parseInt(event.target.value);
        this.currentPage = 1;
        this.updateCampusTable();
    }

    applyFilters() {
        this.filteredCampuses = this.campuses.filter(campus => {
            const matchesSearch = this.filters.search === '' ||
                campus.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                campus.code.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                campus.address.toLowerCase().includes(this.filters.search.toLowerCase());

            const matchesStatus = this.filters.status === '' || campus.status === this.filters.status;
            const matchesType = this.filters.type === '' || campus.type === this.filters.type;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.sortCampuses();
    }

    sortCampuses() {
        this.filteredCampuses.sort((a, b) => {
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

    getPaginatedCampuses() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredCampuses.slice(startIndex, endIndex);
    }

    updateCampusTable() {
        const tableBody = document.getElementById('campus-table-body');
        if (tableBody) {
            tableBody.innerHTML = this.renderCampusRows();
        }

        // Update pagination and display info
        const paginationContainer = tableBody?.closest('.table-responsive')?.nextElementSibling;
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <div class="text-muted">
                    Showing ${this.getDisplayInfo()} of ${this.filteredCampuses.length} campuses
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            `;
        }
    }

    getDisplayInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredCampuses.length);
        return `${start}-${end}`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredCampuses.length / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let pagination = '<ul class="pagination pagination-sm mb-0">';

        // Previous button
        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="campusManager.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="campusManager.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="campusManager.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul>';
        return pagination;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredCampuses.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateCampusTable();
        }
    }

    setupTabEventListeners() {
        // Tab change events
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                const targetPane = event.target.getAttribute('data-bs-target');
                this.handleTabChange(targetPane);
            });
        });
    }

    handleTabChange(targetPane) {
        switch (targetPane) {
            case '#buildings-pane':
                this.loadBuildingsContent();
                break;
            case '#rooms-pane':
                this.loadRoomsContent();
                break;
            case '#facilities-pane':
                this.loadFacilitiesContent();
                break;
            case '#maps-pane':
                this.loadMapsContent();
                break;
        }
    }

    loadBuildingsContent() {
        // Load buildings management interface
        const buildingsContainer = document.getElementById('buildings-content');
        if (buildingsContainer && window.buildingManager) {
            buildingsContainer.innerHTML = window.buildingManager.renderBuildingInterface();
            window.buildingManager.setupEventListeners();
        }
    }

    loadRoomsContent() {
        // Load rooms management interface
        const roomsContainer = document.getElementById('rooms-content');
        if (roomsContainer && window.roomManager) {
            roomsContainer.innerHTML = window.roomManager.renderRoomInterface();
            window.roomManager.setupEventListeners();
        }
    }

    loadFacilitiesContent() {
        // Load facilities management interface
        console.log('Loading facilities content...');
    }

    loadMapsContent() {
        // Load campus maps interface
        console.log('Loading maps content...');
    }

    // Campus CRUD operations
    getCampusById(id) {
        return this.campuses.find(campus => campus.id === id);
    }

    addCampus(campusData) {
        const newCampus = {
            id: 'campus_' + Date.now(),
            ...campusData,
            createdAt: new Date().toISOString()
        };
        this.campuses.push(newCampus);
        this.applyFilters();
        this.updateCampusTable();
        return newCampus;
    }

    updateCampus(id, updates) {
        const index = this.campuses.findIndex(campus => campus.id === id);
        if (index !== -1) {
            this.campuses[index] = { ...this.campuses[index], ...updates };
            this.applyFilters();
            this.updateCampusTable();
            return this.campuses[index];
        }
        return null;
    }

    deleteCampus(id) {
        const index = this.campuses.findIndex(campus => campus.id === id);
        if (index !== -1) {
            this.campuses.splice(index, 1);
            this.applyFilters();
            this.updateCampusTable();
            return true;
        }
        return false;
    }

    exportToCSV(campuses = this.filteredCampuses, filename = 'campuses.csv') {
        const headers = ['Name', 'Code', 'Type', 'Status', 'Buildings', 'Total Capacity', 'Current Occupancy', 'Address'];
        const csvContent = [
            headers.join(','),
            ...campuses.map(campus => [
                `"${campus.name}"`,
                campus.code,
                campus.type,
                campus.status,
                campus.buildings,
                campus.totalCapacity,
                campus.currentOccupancy,
                `"${campus.address}"`
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

// Global functions for campus management
window.addCampus = function () {
    if (window.campusModals) {
        window.campusModals.showAddModal();
    }
};

window.editCampus = function (campusId) {
    if (window.campusModals) {
        window.campusModals.showEditModal(campusId);
    }
};

window.viewCampus = function (campusId) {
    if (window.campusModals) {
        window.campusModals.showViewModal(campusId);
    }
};

window.deleteCampus = function (campusId) {
    if (confirm('Are you sure you want to delete this campus? This action cannot be undone.')) {
        window.campusManager.deleteCampus(campusId);
    }
};

window.manageCampusBuildings = function (campusId) {
    console.log('Manage buildings for campus:', campusId);
};

window.viewCampusMap = function (campusId) {
    console.log('View map for campus:', campusId);
};

window.duplicateCampus = function (campusId) {
    const campus = window.campusManager.getCampusById(campusId);
    if (campus) {
        const duplicated = {
            ...campus,
            name: campus.name + ' (Copy)',
            code: campus.code + '_COPY',
            id: undefined
        };
        window.campusManager.addCampus(duplicated);
    }
};

window.generateCampusReport = function (campusId) {
    console.log('Generate report for campus:', campusId);
};

window.resetCampusFilters = function () {
    document.getElementById('campus-search').value = '';
    document.getElementById('campus-status-filter').value = '';
    document.getElementById('campus-type-filter').value = '';

    window.campusManager.filters = {
        search: '',
        status: '',
        type: '',
        capacity: ''
    };

    window.campusManager.applyFilters();
    window.campusManager.updateCampusTable();
};

window.exportCampusData = function () {
    window.campusManager.exportToCSV();
};

window.campusSettings = function () {
    console.log('Open campus settings');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.campusManager = new CampusManager();
    }
});