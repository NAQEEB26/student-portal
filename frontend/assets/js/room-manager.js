/**
 * Room Management System
 * Handles individual room management within buildings
 */

class RoomManager {
    constructor() {
        this.rooms = [];
        this.filteredRooms = [];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.filters = {
            search: '',
            building: '',
            type: '',
            status: '',
            capacity: ''
        };
        this.init();
    }

    init() {
        this.loadMockData();
    }

    loadMockData() {
        this.rooms = [
            {
                id: 'room_001',
                buildingId: 'building_001',
                buildingName: 'Academic Building A',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                number: '101A',
                name: 'Lecture Hall A',
                type: 'Lecture Hall',
                capacity: 150,
                floor: 1,
                status: 'Available',
                bookingStatus: 'Available',
                area: '200 sq ft',
                equipment: ['Projector', 'Sound System', 'Whiteboard', 'WiFi', 'Microphone'],
                features: ['Air Conditioning', 'Natural Light', 'Wheelchair Accessible'],
                accessibility: true,
                currentBooking: null,
                nextBooking: {
                    course: 'CS 101',
                    instructor: 'Dr. Smith',
                    time: '14:00-16:00',
                    date: '2025-11-03'
                },
                maintenanceSchedule: 'Monthly',
                lastMaintenance: '2025-10-15',
                utilizationRate: 85
            },
            {
                id: 'room_002',
                buildingId: 'building_001',
                buildingName: 'Academic Building A',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                number: '102B',
                name: 'Computer Lab 1',
                type: 'Computer Lab',
                capacity: 40,
                floor: 1,
                status: 'Occupied',
                bookingStatus: 'Occupied',
                area: '150 sq ft',
                equipment: ['30 Computers', 'Projector', 'WiFi', 'Printer', 'Whiteboard'],
                features: ['Air Conditioning', 'Backup Power', 'Security Cameras'],
                accessibility: true,
                currentBooking: {
                    course: 'CS 201',
                    instructor: 'Prof. Johnson',
                    time: '10:00-12:00',
                    studentsPresent: 35
                },
                nextBooking: {
                    course: 'CS 301',
                    instructor: 'Dr. Williams',
                    time: '14:00-16:00',
                    date: '2025-11-03'
                },
                maintenanceSchedule: 'Weekly',
                lastMaintenance: '2025-10-28',
                utilizationRate: 92
            },
            {
                id: 'room_003',
                buildingId: 'building_002',
                buildingName: 'Library Building',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                number: 'L201',
                name: 'Study Room 1',
                type: 'Study Room',
                capacity: 8,
                floor: 2,
                status: 'Available',
                bookingStatus: 'Available',
                area: '80 sq ft',
                equipment: ['Whiteboard', 'WiFi', 'Table', 'Chairs'],
                features: ['Silent Zone', 'Natural Light', 'Climate Control'],
                accessibility: true,
                currentBooking: null,
                nextBooking: null,
                maintenanceSchedule: 'Bi-weekly',
                lastMaintenance: '2025-10-20',
                utilizationRate: 65
            },
            {
                id: 'room_004',
                buildingId: 'building_003',
                buildingName: 'Science Laboratory Complex',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                number: 'S301',
                name: 'Chemistry Lab 1',
                type: 'Laboratory',
                capacity: 25,
                floor: 3,
                status: 'Maintenance',
                bookingStatus: 'Unavailable',
                area: '180 sq ft',
                equipment: ['Lab Benches', 'Fume Hoods', 'Safety Showers', 'Emergency Kit', 'Gas Outlets'],
                features: ['Ventilation System', 'Safety Equipment', 'Chemical Storage'],
                accessibility: true,
                currentBooking: null,
                nextBooking: null,
                maintenanceSchedule: 'Weekly',
                lastMaintenance: '2025-11-01',
                utilizationRate: 78
            },
            {
                id: 'room_005',
                buildingId: 'building_004',
                buildingName: 'Engineering Block',
                campusId: 'campus_002',
                campusName: 'North Campus',
                number: 'E405',
                name: 'Design Studio A',
                type: 'Design Studio',
                capacity: 30,
                floor: 4,
                status: 'Available',
                bookingStatus: 'Reserved',
                area: '220 sq ft',
                equipment: ['Drawing Tables', 'CAD Computers', 'Plotters', 'WiFi', 'Projector'],
                features: ['Natural Light', 'Adjustable Tables', 'Storage Units'],
                accessibility: true,
                currentBooking: null,
                nextBooking: {
                    course: 'ENG 301',
                    instructor: 'Prof. Anderson',
                    time: '13:00-17:00',
                    date: '2025-11-03'
                },
                maintenanceSchedule: 'Monthly',
                lastMaintenance: '2025-10-10',
                utilizationRate: 88
            }
        ];

        this.applyFilters();
    }

    renderRoomInterface() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 class="mb-1">Room Management</h5>
                    <p class="text-muted mb-0">Manage individual rooms and their utilization</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="addRoom()">
                        <i class="fas fa-plus me-2"></i>Add Room
                    </button>
                    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-cog me-2"></i>Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="exportRoomData()">
                            <i class="fas fa-download me-2"></i>Export Data
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="generateRoomReport()">
                            <i class="fas fa-chart-bar me-2"></i>Utilization Report
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="roomBookingCalendar()">
                            <i class="fas fa-calendar me-2"></i>Booking Calendar
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="roomMaintenanceSchedule()">
                            <i class="fas fa-wrench me-2"></i>Maintenance Schedule
                        </a></li>
                    </ul>
                </div>
            </div>

            <!-- Room Statistics -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card border-left-primary h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Rooms
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.rooms.length}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-success h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Available Rooms
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getAvailableRoomsCount()}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-warning h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Occupied Rooms
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getOccupiedRoomsCount()}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-info h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Avg. Utilization
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getAverageUtilization()}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Room Filters -->
            <div class="row mb-3">
                <div class="col-md-2">
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="room-search" placeholder="Search rooms...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="room-building-filter">
                        <option value="">All Buildings</option>
                        ${this.getBuildingOptions()}
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="room-type-filter">
                        <option value="">All Types</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Computer Lab">Computer Lab</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Study Room">Study Room</option>
                        <option value="Design Studio">Design Studio</option>
                        <option value="Conference Room">Conference Room</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="room-status-filter">
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Reserved">Reserved</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="room-capacity-filter">
                        <option value="">All Capacities</option>
                        <option value="small">Small (1-15)</option>
                        <option value="medium">Medium (16-50)</option>
                        <option value="large">Large (51-100)</option>
                        <option value="xlarge">X-Large (100+)</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="room-sort">
                        <option value="name">Sort by Name</option>
                        <option value="building">Building</option>
                        <option value="type">Type</option>
                        <option value="capacity">Capacity</option>
                        <option value="utilization">Utilization</option>
                    </select>
                </div>
            </div>

            <!-- Room Grid View Toggle -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <span class="text-muted">Showing ${this.getDisplayInfo()} of ${this.filteredRooms.length} rooms</span>
                </div>
                <div class="btn-group" role="group">
                    <input type="radio" class="btn-check" name="room-view" id="room-table-view" checked>
                    <label class="btn btn-outline-primary" for="room-table-view">
                        <i class="fas fa-list"></i>
                    </label>
                    <input type="radio" class="btn-check" name="room-view" id="room-grid-view">
                    <label class="btn btn-outline-primary" for="room-grid-view">
                        <i class="fas fa-th"></i>
                    </label>
                </div>
            </div>

            <!-- Room Content Container -->
            <div id="room-content-container">
                ${this.renderRoomTable()}
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                    Total rooms: ${this.filteredRooms.length}
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            </div>
        `;
    }

    renderRoomTable() {
        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Room</th>
                            <th>Building</th>
                            <th>Type</th>
                            <th>Floor</th>
                            <th>Capacity</th>
                            <th>Current Status</th>
                            <th>Utilization</th>
                            <th>Next Booking</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="room-table-body">
                        ${this.renderRoomRows()}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderRoomRows() {
        return this.getPaginatedRooms().map(room => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="room-icon me-3">
                            <i class="fas fa-door-open text-${this.getStatusColor(room.status)}"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${room.name}</div>
                            <small class="text-muted">${room.number} • ${room.area}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <div class="small fw-bold">${room.buildingName}</div>
                        <small class="text-muted">${room.campusName}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getTypeBadgeClass(room.type)}">${room.type}</span>
                </td>
                <td>Floor ${room.floor}</td>
                <td>
                    <span class="fw-bold">${room.capacity}</span>
                    <small class="text-muted">seats</small>
                </td>
                <td>
                    <div>
                        <span class="badge bg-${this.getStatusBadgeClass(room.status)}">${room.status}</span>
                        ${room.currentBooking ? `
                            <div class="small text-muted mt-1">
                                ${room.currentBooking.course} - ${room.currentBooking.time}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar bg-${this.getUtilizationColor(room.utilizationRate)}" 
                             role="progressbar" style="width: ${room.utilizationRate}%">
                            ${room.utilizationRate}%
                        </div>
                    </div>
                </td>
                <td>
                    ${room.nextBooking ? `
                        <div class="small">
                            <div class="fw-bold">${room.nextBooking.course}</div>
                            <div class="text-muted">${room.nextBooking.time}</div>
                        </div>
                    ` : '<span class="text-muted">No booking</span>'}
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewRoom('${room.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="editRoom('${room.id}')" title="Edit Room">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="bookRoom('${room.id}')" title="Book Room">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="roomSchedule('${room.id}')">
                                    <i class="fas fa-calendar me-2"></i>Schedule
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="roomMaintenance('${room.id}')">
                                    <i class="fas fa-wrench me-2"></i>Maintenance
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="roomUtilization('${room.id}')">
                                    <i class="fas fa-chart-bar me-2"></i>Utilization
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deleteRoom('${room.id}')">
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
    getAvailableRoomsCount() {
        return this.rooms.filter(room => room.status === 'Available').length;
    }

    getOccupiedRoomsCount() {
        return this.rooms.filter(room => room.status === 'Occupied').length;
    }

    getAverageUtilization() {
        if (this.rooms.length === 0) return 0;
        const totalUtilization = this.rooms.reduce((total, room) => total + room.utilizationRate, 0);
        return Math.round(totalUtilization / this.rooms.length);
    }

    getBuildingOptions() {
        const buildings = [...new Set(this.rooms.map(room => room.buildingName))];
        return buildings.map(building => `<option value="${building}">${building}</option>`).join('');
    }

    getStatusColor(status) {
        const colors = {
            'Available': 'success',
            'Occupied': 'warning',
            'Maintenance': 'danger',
            'Reserved': 'info'
        };
        return colors[status] || 'secondary';
    }

    getTypeBadgeClass(type) {
        const classes = {
            'Lecture Hall': 'primary',
            'Computer Lab': 'info',
            'Laboratory': 'warning',
            'Study Room': 'success',
            'Design Studio': 'secondary',
            'Conference Room': 'dark'
        };
        return classes[type] || 'secondary';
    }

    getStatusBadgeClass(status) {
        const classes = {
            'Available': 'success',
            'Occupied': 'warning',
            'Maintenance': 'danger',
            'Reserved': 'info'
        };
        return classes[status] || 'secondary';
    }

    getUtilizationColor(rate) {
        if (rate >= 90) return 'danger';
        if (rate >= 70) return 'warning';
        if (rate >= 50) return 'info';
        return 'success';
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('room-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filter dropdowns
        const filterSelects = ['room-building-filter', 'room-type-filter', 'room-status-filter', 'room-capacity-filter'];
        filterSelects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', this.handleFilterChange.bind(this));
            }
        });

        // Sort functionality
        const sortSelect = document.getElementById('room-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSort.bind(this));
        }

        // View toggle
        const viewToggle = document.querySelectorAll('input[name="room-view"]');
        viewToggle.forEach(toggle => {
            toggle.addEventListener('change', this.handleViewToggle.bind(this));
        });
    }

    handleSearch(event) {
        this.filters.search = event.target.value;
        this.applyFilters();
        this.updateRoomDisplay();
    }

    handleFilterChange(event) {
        const filterId = event.target.id;
        const value = event.target.value;

        switch (filterId) {
            case 'room-building-filter':
                this.filters.building = value;
                break;
            case 'room-type-filter':
                this.filters.type = value;
                break;
            case 'room-status-filter':
                this.filters.status = value;
                break;
            case 'room-capacity-filter':
                this.filters.capacity = value;
                break;
        }

        this.applyFilters();
        this.updateRoomDisplay();
    }

    handleSort(event) {
        this.sortBy = event.target.value;
        this.applyFilters();
        this.updateRoomDisplay();
    }

    handleViewToggle(event) {
        const isGridView = event.target.id === 'room-grid-view';
        this.updateRoomDisplay(isGridView);
    }

    applyFilters() {
        this.filteredRooms = this.rooms.filter(room => {
            const matchesSearch = this.filters.search === '' ||
                room.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                room.number.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                room.buildingName.toLowerCase().includes(this.filters.search.toLowerCase());

            const matchesBuilding = this.filters.building === '' || room.buildingName === this.filters.building;
            const matchesType = this.filters.type === '' || room.type === this.filters.type;
            const matchesStatus = this.filters.status === '' || room.status === this.filters.status;

            let matchesCapacity = true;
            if (this.filters.capacity) {
                switch (this.filters.capacity) {
                    case 'small':
                        matchesCapacity = room.capacity <= 15;
                        break;
                    case 'medium':
                        matchesCapacity = room.capacity >= 16 && room.capacity <= 50;
                        break;
                    case 'large':
                        matchesCapacity = room.capacity >= 51 && room.capacity <= 100;
                        break;
                    case 'xlarge':
                        matchesCapacity = room.capacity > 100;
                        break;
                }
            }

            return matchesSearch && matchesBuilding && matchesType && matchesStatus && matchesCapacity;
        });

        this.sortRooms();
    }

    sortRooms() {
        this.filteredRooms.sort((a, b) => {
            let aValue = a[this.sortBy === 'building' ? 'buildingName' :
                this.sortBy === 'utilization' ? 'utilizationRate' : this.sortBy];
            let bValue = b[this.sortBy === 'building' ? 'buildingName' :
                this.sortBy === 'utilization' ? 'utilizationRate' : this.sortBy];

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

    getPaginatedRooms() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredRooms.slice(startIndex, endIndex);
    }

    updateRoomDisplay(isGridView = false) {
        const container = document.getElementById('room-content-container');
        if (container) {
            if (isGridView) {
                container.innerHTML = this.renderRoomGrid();
            } else {
                container.innerHTML = this.renderRoomTable();
            }
        }

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const paginationContainer = document.querySelector('#room-content-container')?.closest('div')?.querySelector('.d-flex.justify-content-between.align-items-center.mt-3');
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <div class="text-muted">
                    Total rooms: ${this.filteredRooms.length}
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            `;
        }
    }

    getDisplayInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredRooms.length);
        return `${start}-${end}`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredRooms.length / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let pagination = '<ul class="pagination pagination-sm mb-0">';

        // Previous button
        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="roomManager.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="roomManager.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="roomManager.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul>';
        return pagination;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredRooms.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateRoomDisplay();
        }
    }

    // Room CRUD operations
    getRoomById(id) {
        return this.rooms.find(room => room.id === id);
    }

    exportToCSV(rooms = this.filteredRooms, filename = 'rooms.csv') {
        const headers = ['Room Number', 'Name', 'Building', 'Campus', 'Type', 'Floor', 'Capacity', 'Status', 'Utilization Rate'];
        const csvContent = [
            headers.join(','),
            ...rooms.map(room => [
                room.number,
                `"${room.name}"`,
                room.buildingName,
                room.campusName,
                room.type,
                room.floor,
                room.capacity,
                room.status,
                room.utilizationRate + '%'
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

// Global functions for room management
window.addRoom = function () {
    console.log('Add new room');
};

window.editRoom = function (roomId) {
    console.log('Edit room:', roomId);
};

window.viewRoom = function (roomId) {
    console.log('View room:', roomId);
};

window.deleteRoom = function (roomId) {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        console.log('Delete room:', roomId);
    }
};

window.bookRoom = function (roomId) {
    console.log('Book room:', roomId);
};

window.roomSchedule = function (roomId) {
    console.log('Room schedule for:', roomId);
};

window.roomMaintenance = function (roomId) {
    console.log('Room maintenance for:', roomId);
};

window.roomUtilization = function (roomId) {
    console.log('Room utilization for:', roomId);
};

window.exportRoomData = function () {
    window.roomManager.exportToCSV();
};

window.generateRoomReport = function () {
    console.log('Generate room report');
};

window.roomBookingCalendar = function () {
    console.log('Room booking calendar');
};

window.roomMaintenanceSchedule = function () {
    console.log('Room maintenance schedule');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.roomManager = new RoomManager();
    }
});