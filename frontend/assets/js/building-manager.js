/**
 * Building Management System
 * Handles building infrastructure within campuses
 */

class BuildingManager {
    constructor() {
        this.buildings = [];
        this.filteredBuildings = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.filters = {
            search: '',
            campus: '',
            type: '',
            status: ''
        };
        this.init();
    }

    init() {
        this.loadMockData();
    }

    loadMockData() {
        this.buildings = [
            {
                id: 'building_001',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                name: 'Academic Building A',
                code: 'ABA',
                type: 'Academic',
                floors: 4,
                totalRooms: 45,
                capacity: 1500,
                currentOccupancy: 1200,
                status: 'Active',
                yearBuilt: 1970,
                lastRenovated: 2018,
                area: '15000 sq ft',
                description: 'Main academic building with lecture halls and classrooms',
                facilities: ['Elevators', 'WiFi', 'AC', 'Projectors', 'Fire Safety'],
                accessibility: true,
                maintenanceSchedule: 'Monthly',
                coordinates: { x: 100, y: 150, floor: 1 },
                emergencyExits: 6,
                parkingSpaces: 20
            },
            {
                id: 'building_002',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                name: 'Library Building',
                code: 'LIB',
                type: 'Library',
                floors: 6,
                totalRooms: 25,
                capacity: 800,
                currentOccupancy: 600,
                status: 'Active',
                yearBuilt: 1980,
                lastRenovated: 2020,
                area: '12000 sq ft',
                description: 'Central library with study areas and computer labs',
                facilities: ['Study Rooms', 'Computer Lab', 'WiFi', 'AC', 'Silent Zones'],
                accessibility: true,
                maintenanceSchedule: 'Bi-weekly',
                coordinates: { x: 200, y: 200, floor: 1 },
                emergencyExits: 8,
                parkingSpaces: 15
            },
            {
                id: 'building_003',
                campusId: 'campus_001',
                campusName: 'Main Campus',
                name: 'Science Laboratory Complex',
                code: 'SLC',
                type: 'Laboratory',
                floors: 3,
                totalRooms: 30,
                capacity: 600,
                currentOccupancy: 480,
                status: 'Active',
                yearBuilt: 1995,
                lastRenovated: 2021,
                area: '10000 sq ft',
                description: 'State-of-the-art science laboratories for various disciplines',
                facilities: ['Lab Equipment', 'Fume Hoods', 'Safety Showers', 'WiFi', 'AC'],
                accessibility: true,
                maintenanceSchedule: 'Weekly',
                coordinates: { x: 150, y: 100, floor: 1 },
                emergencyExits: 4,
                parkingSpaces: 10
            },
            {
                id: 'building_004',
                campusId: 'campus_002',
                campusName: 'North Campus',
                name: 'Engineering Block',
                code: 'ENG',
                type: 'Engineering',
                floors: 5,
                totalRooms: 60,
                capacity: 2000,
                currentOccupancy: 1700,
                status: 'Active',
                yearBuilt: 1985,
                lastRenovated: 2019,
                area: '20000 sq ft',
                description: 'Engineering building with workshops and design studios',
                facilities: ['Workshops', 'Design Studios', 'CAD Labs', 'WiFi', 'AC'],
                accessibility: true,
                maintenanceSchedule: 'Monthly',
                coordinates: { x: 300, y: 250, floor: 1 },
                emergencyExits: 10,
                parkingSpaces: 50
            },
            {
                id: 'building_005',
                campusId: 'campus_003',
                campusName: 'Medical Campus',
                name: 'Medical Education Center',
                code: 'MEC',
                type: 'Medical',
                floors: 4,
                totalRooms: 35,
                capacity: 800,
                currentOccupancy: 720,
                status: 'Active',
                yearBuilt: 1998,
                lastRenovated: 2022,
                area: '14000 sq ft',
                description: 'Medical education facility with simulation labs',
                facilities: ['Simulation Labs', 'Anatomy Labs', 'WiFi', 'AC', 'Medical Equipment'],
                accessibility: true,
                maintenanceSchedule: 'Bi-weekly',
                coordinates: { x: 180, y: 120, floor: 1 },
                emergencyExits: 6,
                parkingSpaces: 25
            }
        ];

        this.applyFilters();
    }

    renderBuildingInterface() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 class="mb-1">Building Management</h5>
                    <p class="text-muted mb-0">Manage campus buildings and infrastructure</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="addBuilding()">
                        <i class="fas fa-plus me-2"></i>Add Building
                    </button>
                    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-cog me-2"></i>Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="exportBuildingData()">
                            <i class="fas fa-download me-2"></i>Export Data
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="generateBuildingReport()">
                            <i class="fas fa-chart-bar me-2"></i>Generate Report
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="buildingMaintenanceSchedule()">
                            <i class="fas fa-wrench me-2"></i>Maintenance Schedule
                        </a></li>
                    </ul>
                </div>
            </div>

            <!-- Building Statistics -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card border-left-primary h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Total Buildings
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.buildings.length}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-success h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Total Rooms
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getTotalRooms()}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-info h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                Total Capacity
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getTotalCapacity().toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-left-warning h-100">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Average Occupancy
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${this.getAverageOccupancy()}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Building Filters -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="building-search" placeholder="Search buildings...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="building-campus-filter">
                        <option value="">All Campuses</option>
                        ${this.getCampusOptions()}
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="building-type-filter">
                        <option value="">All Types</option>
                        <option value="Academic">Academic</option>
                        <option value="Library">Library</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medical">Medical</option>
                        <option value="Administrative">Administrative</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="building-status-filter">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="building-sort">
                        <option value="name">Sort by Name</option>
                        <option value="campus">Campus</option>
                        <option value="type">Type</option>
                        <option value="capacity">Capacity</option>
                        <option value="yearBuilt">Year Built</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-secondary" onclick="resetBuildingFilters()" title="Reset Filters">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>

            <!-- Buildings Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Building</th>
                            <th>Campus</th>
                            <th>Type</th>
                            <th>Floors</th>
                            <th>Rooms</th>
                            <th>Capacity</th>
                            <th>Occupancy</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="building-table-body">
                        ${this.renderBuildingRows()}
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                    Showing ${this.getDisplayInfo()} of ${this.filteredBuildings.length} buildings
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            </div>
        `;
    }

    renderBuildingRows() {
        return this.getPaginatedBuildings().map(building => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="building-icon me-3">
                            <i class="fas fa-building text-primary"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${building.name}</div>
                            <small class="text-muted">${building.code} • Built ${building.yearBuilt}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">${building.campusName}</span>
                </td>
                <td>
                    <span class="badge bg-${this.getTypeBadgeClass(building.type)}">${building.type}</span>
                </td>
                <td>${building.floors}</td>
                <td>${building.totalRooms}</td>
                <td>${building.capacity.toLocaleString()}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${(building.currentOccupancy / building.capacity * 100)}%">
                            ${Math.round(building.currentOccupancy / building.capacity * 100)}%
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusBadgeClass(building.status)}">${building.status}</span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewBuilding('${building.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="editBuilding('${building.id}')" title="Edit Building">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="manageBuildingRooms('${building.id}')" title="Manage Rooms">
                            <i class="fas fa-door-open"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="buildingMaintenance('${building.id}')" title="Maintenance">
                            <i class="fas fa-wrench"></i>
                        </button>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="generateBuildingFloorPlan('${building.id}')">
                                    <i class="fas fa-map me-2"></i>Floor Plan
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="buildingUtilization('${building.id}')">
                                    <i class="fas fa-chart-pie me-2"></i>Utilization Report
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deleteBuilding('${building.id}')">
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
    getTotalRooms() {
        return this.buildings.reduce((total, building) => total + building.totalRooms, 0);
    }

    getTotalCapacity() {
        return this.buildings.reduce((total, building) => total + building.capacity, 0);
    }

    getAverageOccupancy() {
        if (this.buildings.length === 0) return 0;
        const totalOccupancy = this.buildings.reduce((total, building) =>
            total + (building.currentOccupancy / building.capacity * 100), 0);
        return Math.round(totalOccupancy / this.buildings.length);
    }

    getCampusOptions() {
        const campuses = [...new Set(this.buildings.map(building => building.campusName))];
        return campuses.map(campus => `<option value="${campus}">${campus}</option>`).join('');
    }

    getTypeBadgeClass(type) {
        const classes = {
            'Academic': 'primary',
            'Library': 'info',
            'Laboratory': 'warning',
            'Engineering': 'success',
            'Medical': 'danger',
            'Administrative': 'secondary'
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

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('building-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filter dropdowns
        const filterSelects = ['building-campus-filter', 'building-type-filter', 'building-status-filter'];
        filterSelects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', this.handleFilterChange.bind(this));
            }
        });

        // Sort functionality
        const sortSelect = document.getElementById('building-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSort.bind(this));
        }
    }

    handleSearch(event) {
        this.filters.search = event.target.value;
        this.applyFilters();
        this.updateBuildingTable();
    }

    handleFilterChange(event) {
        const filterId = event.target.id;
        const value = event.target.value;

        switch (filterId) {
            case 'building-campus-filter':
                this.filters.campus = value;
                break;
            case 'building-type-filter':
                this.filters.type = value;
                break;
            case 'building-status-filter':
                this.filters.status = value;
                break;
        }

        this.applyFilters();
        this.updateBuildingTable();
    }

    handleSort(event) {
        this.sortBy = event.target.value;
        this.applyFilters();
        this.updateBuildingTable();
    }

    applyFilters() {
        this.filteredBuildings = this.buildings.filter(building => {
            const matchesSearch = this.filters.search === '' ||
                building.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                building.code.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                building.description.toLowerCase().includes(this.filters.search.toLowerCase());

            const matchesCampus = this.filters.campus === '' || building.campusName === this.filters.campus;
            const matchesType = this.filters.type === '' || building.type === this.filters.type;
            const matchesStatus = this.filters.status === '' || building.status === this.filters.status;

            return matchesSearch && matchesCampus && matchesType && matchesStatus;
        });

        this.sortBuildings();
    }

    sortBuildings() {
        this.filteredBuildings.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (this.sortBy === 'campus') {
                aValue = a.campusName;
                bValue = b.campusName;
            }

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

    getPaginatedBuildings() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredBuildings.slice(startIndex, endIndex);
    }

    updateBuildingTable() {
        const tableBody = document.getElementById('building-table-body');
        if (tableBody) {
            tableBody.innerHTML = this.renderBuildingRows();
        }

        // Update pagination and display info
        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const paginationContainer = document.querySelector('#building-table-body')?.closest('.table-responsive')?.nextElementSibling;
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <div class="text-muted">
                    Showing ${this.getDisplayInfo()} of ${this.filteredBuildings.length} buildings
                </div>
                <nav>
                    ${this.renderPagination()}
                </nav>
            `;
        }
    }

    getDisplayInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredBuildings.length);
        return `${start}-${end}`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredBuildings.length / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let pagination = '<ul class="pagination pagination-sm mb-0">';

        // Previous button
        pagination += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="buildingManager.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="buildingManager.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        pagination += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="buildingManager.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination += '</ul>';
        return pagination;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredBuildings.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateBuildingTable();
        }
    }

    // Building CRUD operations
    getBuildingById(id) {
        return this.buildings.find(building => building.id === id);
    }

    addBuilding(buildingData) {
        const newBuilding = {
            id: 'building_' + Date.now(),
            ...buildingData,
            createdAt: new Date().toISOString()
        };
        this.buildings.push(newBuilding);
        this.applyFilters();
        this.updateBuildingTable();
        return newBuilding;
    }

    updateBuilding(id, updates) {
        const index = this.buildings.findIndex(building => building.id === id);
        if (index !== -1) {
            this.buildings[index] = { ...this.buildings[index], ...updates };
            this.applyFilters();
            this.updateBuildingTable();
            return this.buildings[index];
        }
        return null;
    }

    deleteBuilding(id) {
        const index = this.buildings.findIndex(building => building.id === id);
        if (index !== -1) {
            this.buildings.splice(index, 1);
            this.applyFilters();
            this.updateBuildingTable();
            return true;
        }
        return false;
    }

    exportToCSV(buildings = this.filteredBuildings, filename = 'buildings.csv') {
        const headers = ['Name', 'Code', 'Campus', 'Type', 'Floors', 'Rooms', 'Capacity', 'Occupancy Rate', 'Year Built', 'Status'];
        const csvContent = [
            headers.join(','),
            ...buildings.map(building => [
                `"${building.name}"`,
                building.code,
                building.campusName,
                building.type,
                building.floors,
                building.totalRooms,
                building.capacity,
                Math.round(building.currentOccupancy / building.capacity * 100) + '%',
                building.yearBuilt,
                building.status
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

// Global functions for building management
window.addBuilding = function () {
    console.log('Add new building');
};

window.editBuilding = function (buildingId) {
    console.log('Edit building:', buildingId);
};

window.viewBuilding = function (buildingId) {
    console.log('View building:', buildingId);
};

window.deleteBuilding = function (buildingId) {
    if (confirm('Are you sure you want to delete this building? This action cannot be undone.')) {
        window.buildingManager.deleteBuilding(buildingId);
    }
};

window.manageBuildingRooms = function (buildingId) {
    console.log('Manage rooms for building:', buildingId);
};

window.buildingMaintenance = function (buildingId) {
    console.log('Building maintenance for:', buildingId);
};

window.generateBuildingFloorPlan = function (buildingId) {
    console.log('Generate floor plan for:', buildingId);
};

window.buildingUtilization = function (buildingId) {
    console.log('Building utilization report for:', buildingId);
};

window.resetBuildingFilters = function () {
    document.getElementById('building-search').value = '';
    document.getElementById('building-campus-filter').value = '';
    document.getElementById('building-type-filter').value = '';
    document.getElementById('building-status-filter').value = '';

    window.buildingManager.filters = {
        search: '',
        campus: '',
        type: '',
        status: ''
    };

    window.buildingManager.applyFilters();
    window.buildingManager.updateBuildingTable();
};

window.exportBuildingData = function () {
    window.buildingManager.exportToCSV();
};

window.generateBuildingReport = function () {
    console.log('Generate building report');
};

window.buildingMaintenanceSchedule = function () {
    console.log('View building maintenance schedule');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.buildingManager = new BuildingManager();
    }
});