/**
 * Advanced Filtering System
 * Global filtering system that works across all management modules
 */

class AdvancedFilterSystem {
    constructor() {
        this.activeFilters = {};
        this.savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '{}');
        this.filterPresets = this.getDefaultPresets();
        this.currentModule = null;
        this.filterConfigs = this.getFilterConfigurations();
        this.init();
    }

    init() {
        this.createFilterInterface();
        this.setupEventListeners();
        this.loadSavedFilters();
    }

    getFilterConfigurations() {
        return {
            students: {
                name: 'Students',
                icon: 'fas fa-user-graduate',
                fields: {
                    name: { type: 'text', label: 'Name', placeholder: 'Search by name...' },
                    studentId: { type: 'text', label: 'Student ID', placeholder: 'Enter student ID...' },
                    email: { type: 'text', label: 'Email', placeholder: 'Search by email...' },
                    program: {
                        type: 'select',
                        label: 'Program',
                        options: ['Computer Science', 'Engineering', 'Business', 'Mathematics', 'Biology', 'Psychology']
                    },
                    year: {
                        type: 'select',
                        label: 'Year',
                        options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
                    },
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: ['Active', 'Inactive', 'Graduated', 'Suspended', 'On Leave']
                    },
                    gpa: {
                        type: 'range',
                        label: 'GPA Range',
                        min: 0.0,
                        max: 4.0,
                        step: 0.1
                    },
                    dateEnrolled: { type: 'daterange', label: 'Enrollment Date' },
                    campus: {
                        type: 'select',
                        label: 'Campus',
                        options: ['Main Campus', 'North Campus', 'Medical Campus']
                    }
                }
            },
            faculty: {
                name: 'Faculty',
                icon: 'fas fa-user-tie',
                fields: {
                    name: { type: 'text', label: 'Name', placeholder: 'Search by name...' },
                    employeeId: { type: 'text', label: 'Employee ID', placeholder: 'Enter employee ID...' },
                    email: { type: 'text', label: 'Email', placeholder: 'Search by email...' },
                    department: {
                        type: 'select',
                        label: 'Department',
                        options: ['Computer Science', 'Mathematics', 'Biology', 'Engineering', 'Psychology', 'Business', 'Physics', 'Chemistry']
                    },
                    position: {
                        type: 'select',
                        label: 'Position',
                        options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct']
                    },
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: ['Active', 'On Leave', 'Sabbatical']
                    },
                    rating: {
                        type: 'range',
                        label: 'Rating Range',
                        min: 0.0,
                        max: 5.0,
                        step: 0.1
                    },
                    hireDate: { type: 'daterange', label: 'Hire Date' },
                    campus: {
                        type: 'select',
                        label: 'Campus',
                        options: ['Main Campus', 'North Campus', 'Medical Campus']
                    },
                    publications: {
                        type: 'range',
                        label: 'Publications Count',
                        min: 0,
                        max: 100,
                        step: 1
                    }
                }
            },
            courses: {
                name: 'Courses',
                icon: 'fas fa-book',
                fields: {
                    name: { type: 'text', label: 'Course Name', placeholder: 'Search by course name...' },
                    courseCode: { type: 'text', label: 'Course Code', placeholder: 'Enter course code...' },
                    instructor: { type: 'text', label: 'Instructor', placeholder: 'Search by instructor...' },
                    department: {
                        type: 'select',
                        label: 'Department',
                        options: ['Computer Science', 'Mathematics', 'Biology', 'Engineering', 'Psychology', 'Business', 'Physics', 'Chemistry']
                    },
                    level: {
                        type: 'select',
                        label: 'Level',
                        options: ['Undergraduate', 'Graduate', 'Doctorate']
                    },
                    semester: {
                        type: 'select',
                        label: 'Semester',
                        options: ['Fall 2024', 'Spring 2024', 'Summer 2024']
                    },
                    credits: {
                        type: 'range',
                        label: 'Credits',
                        min: 1,
                        max: 6,
                        step: 1
                    },
                    capacity: {
                        type: 'range',
                        label: 'Capacity',
                        min: 10,
                        max: 500,
                        step: 10
                    },
                    enrollment: {
                        type: 'range',
                        label: 'Current Enrollment',
                        min: 0,
                        max: 500,
                        step: 5
                    },
                    schedule: { type: 'text', label: 'Schedule', placeholder: 'Search by schedule...' }
                }
            },
            campus: {
                name: 'Campus',
                icon: 'fas fa-university',
                fields: {
                    name: { type: 'text', label: 'Campus Name', placeholder: 'Search by campus name...' },
                    type: {
                        type: 'select',
                        label: 'Campus Type',
                        options: ['Main', 'Branch', 'Satellite', 'Medical', 'Research']
                    },
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: ['Active', 'Under Construction', 'Maintenance', 'Closed']
                    },
                    capacity: {
                        type: 'range',
                        label: 'Student Capacity',
                        min: 500,
                        max: 50000,
                        step: 500
                    },
                    buildings: {
                        type: 'range',
                        label: 'Number of Buildings',
                        min: 1,
                        max: 100,
                        step: 1
                    },
                    established: { type: 'daterange', label: 'Established Date' },
                    location: { type: 'text', label: 'Location', placeholder: 'Search by location...' }
                }
            }
        };
    }

    getDefaultPresets() {
        return {
            students: {
                'Active Students': { status: 'Active' },
                'Honor Students': { gpa: { min: 3.5, max: 4.0 }, status: 'Active' },
                'New Students': { year: '1st Year', status: 'Active' },
                'Graduating Students': { year: '4th Year', status: 'Active' },
                'CS Students': { program: 'Computer Science', status: 'Active' }
            },
            faculty: {
                'Active Faculty': { status: 'Active' },
                'Professors': { position: 'Professor', status: 'Active' },
                'High Rated Faculty': { rating: { min: 4.0, max: 5.0 }, status: 'Active' },
                'CS Department': { department: 'Computer Science', status: 'Active' },
                'New Hires': { hireDate: { from: '2023-01-01' } }
            },
            courses: {
                'Current Semester': { semester: 'Fall 2024' },
                'Undergraduate Courses': { level: 'Undergraduate' },
                'CS Courses': { department: 'Computer Science' },
                'High Capacity': { capacity: { min: 100, max: 500 } },
                'Nearly Full': { enrollment: { min: 80 } }
            },
            campus: {
                'Active Campuses': { status: 'Active' },
                'Main Campuses': { type: 'Main' },
                'Large Campuses': { capacity: { min: 10000, max: 50000 } },
                'Established Campuses': { established: { from: '1900-01-01', to: '2000-12-31' } }
            }
        };
    }

    createFilterInterface() {
        const filterContainer = document.createElement('div');
        filterContainer.id = 'advanced-filter-system';
        filterContainer.className = 'advanced-filter-system';
        filterContainer.innerHTML = `
            <!-- Filter Toggle Button -->
            <button type="button" class="btn btn-outline-primary mb-3" id="toggle-advanced-filters">
                <i class="fas fa-filter me-2"></i>Advanced Filters
                <i class="fas fa-chevron-down ms-2 toggle-icon"></i>
            </button>

            <!-- Filter Panel -->
            <div class="filter-panel collapse" id="advanced-filter-panel">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">
                                <i class="fas fa-filter me-2"></i>Advanced Filters
                            </h6>
                            <div class="filter-actions">
                                <button type="button" class="btn btn-sm btn-outline-secondary me-2" id="save-filter">
                                    <i class="fas fa-save me-1"></i>Save
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-info me-2" id="load-filter">
                                    <i class="fas fa-folder-open me-1"></i>Load
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-warning me-2" id="reset-filters">
                                    <i class="fas fa-refresh me-1"></i>Reset
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-success" id="apply-filters">
                                    <i class="fas fa-check me-1"></i>Apply
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- Module Selector -->
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="filter-module" class="form-label">Filter Module</label>
                                <select class="form-select" id="filter-module">
                                    <option value="">Select Module...</option>
                                    <option value="students">Students</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="courses">Courses</option>
                                    <option value="campus">Campus</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="filter-preset" class="form-label">Quick Presets</label>
                                <select class="form-select" id="filter-preset">
                                    <option value="">Select Preset...</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="saved-filter" class="form-label">Saved Filters</label>
                                <select class="form-select" id="saved-filter">
                                    <option value="">Load Saved Filter...</option>
                                </select>
                            </div>
                        </div>

                        <!-- Filter Fields Container -->
                        <div id="filter-fields-container">
                            <div class="text-muted text-center py-4">
                                <i class="fas fa-filter fa-2x mb-2"></i>
                                <p>Select a module to configure filters</p>
                            </div>
                        </div>

                        <!-- Active Filters Display -->
                        <div id="active-filters-display" class="mt-3">
                            <!-- Active filters will be displayed here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save Filter Modal -->
            <div class="modal fade" id="saveFilterModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Save Filter</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="filter-name" class="form-label">Filter Name</label>
                                <input type="text" class="form-control" id="filter-name" placeholder="Enter filter name...">
                            </div>
                            <div class="mb-3">
                                <label for="filter-description" class="form-label">Description (Optional)</label>
                                <textarea class="form-control" id="filter-description" rows="3" placeholder="Describe this filter..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirm-save-filter">Save Filter</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert filter interface at the beginning of each module's content area
        this.insertFilterInterface(filterContainer);
        this.addFilterStyles();
    }

    insertFilterInterface(filterContainer) {
        // We'll insert this dynamically when a module is activated
        document.body.appendChild(filterContainer);
    }

    addFilterStyles() {
        const styles = `
            <style>
                .advanced-filter-system {
                    margin-bottom: 1rem;
                }

                .filter-panel .card {
                    border: 1px solid #e3e6f0;
                    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
                }

                .filter-field {
                    background: #f8f9fc;
                    border: 1px solid #e3e6f0;
                    border-radius: 0.35rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }

                .filter-field-header {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .filter-field-title {
                    font-weight: 600;
                    color: #5a5c69;
                    margin: 0;
                }

                .remove-filter-field {
                    background: none;
                    border: none;
                    color: #e74a3b;
                    cursor: pointer;
                    padding: 0.25rem;
                }

                .remove-filter-field:hover {
                    color: #c0392b;
                }

                .active-filter-tag {
                    display: inline-block;
                    background: #4e73df;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    margin: 0.25rem;
                }

                .active-filter-tag .remove-tag {
                    background: none;
                    border: none;
                    color: white;
                    margin-left: 0.5rem;
                    cursor: pointer;
                    font-size: 0.75rem;
                }

                .active-filter-tag .remove-tag:hover {
                    color: #f8f9fc;
                }

                .filter-range-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .filter-range-container input {
                    flex: 1;
                }

                .filter-range-separator {
                    color: #6c757d;
                    font-weight: 500;
                }

                .date-range-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .date-range-container input {
                    flex: 1;
                }

                .toggle-icon {
                    transition: transform 0.3s ease;
                }

                .toggle-icon.rotated {
                    transform: rotate(180deg);
                }

                @media (max-width: 768px) {
                    .filter-actions {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .filter-actions .btn {
                        width: 100%;
                        margin: 0 !important;
                    }
                }
            </style>
        `;

        if (!document.querySelector('#advanced-filter-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'advanced-filter-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Toggle advanced filters
            if (e.target.closest('#toggle-advanced-filters')) {
                this.toggleFilterPanel();
            }

            // Save filter
            if (e.target.closest('#save-filter')) {
                this.showSaveFilterModal();
            }

            // Load filter
            if (e.target.closest('#load-filter')) {
                this.loadFilterFromSelect();
            }

            // Reset filters
            if (e.target.closest('#reset-filters')) {
                this.resetFilters();
            }

            // Apply filters
            if (e.target.closest('#apply-filters')) {
                this.applyFilters();
            }

            // Confirm save filter
            if (e.target.closest('#confirm-save-filter')) {
                this.saveCurrentFilter();
            }

            // Remove filter field
            if (e.target.closest('.remove-filter-field')) {
                this.removeFilterField(e.target.closest('.filter-field'));
            }

            // Remove active filter tag
            if (e.target.closest('.remove-tag')) {
                this.removeActiveFilter(e.target.closest('.active-filter-tag'));
            }
        });

        document.addEventListener('change', (e) => {
            // Module selector change
            if (e.target.id === 'filter-module') {
                this.onModuleChange(e.target.value);
            }

            // Preset selector change
            if (e.target.id === 'filter-preset') {
                this.loadPreset(e.target.value);
            }

            // Saved filter selector change
            if (e.target.id === 'saved-filter') {
                this.loadSavedFilter(e.target.value);
            }

            // Filter field changes
            if (e.target.closest('.filter-field')) {
                this.updateActiveFilters();
            }
        });

        // Listen for input events on filter fields
        document.addEventListener('input', (e) => {
            if (e.target.closest('.filter-field')) {
                this.updateActiveFilters();
            }
        });
    }

    toggleFilterPanel() {
        const panel = document.getElementById('advanced-filter-panel');
        const toggleIcon = document.querySelector('#toggle-advanced-filters .toggle-icon');

        if (panel) {
            const bsCollapse = new bootstrap.Collapse(panel, { toggle: true });

            panel.addEventListener('shown.bs.collapse', () => {
                if (toggleIcon) toggleIcon.classList.add('rotated');
            });

            panel.addEventListener('hidden.bs.collapse', () => {
                if (toggleIcon) toggleIcon.classList.remove('rotated');
            });
        }
    }

    onModuleChange(module) {
        this.currentModule = module;
        this.renderFilterFields();
        this.updatePresetOptions();
        this.updateSavedFilterOptions();
    }

    renderFilterFields() {
        const container = document.getElementById('filter-fields-container');
        if (!container || !this.currentModule) return;

        const config = this.filterConfigs[this.currentModule];
        if (!config) return;

        container.innerHTML = `
            <div class="module-header mb-3">
                <h6>
                    <i class="${config.icon} me-2"></i>${config.name} Filters
                </h6>
            </div>
            <div class="row">
                ${Object.entries(config.fields).map(([key, field]) =>
            this.renderFilterField(key, field)
        ).join('')}
            </div>
        `;
    }

    renderFilterField(key, field) {
        let inputHTML = '';

        switch (field.type) {
            case 'text':
                inputHTML = `
                    <input type="text" class="form-control" id="filter-${key}" 
                           placeholder="${field.placeholder || ''}" data-field="${key}">
                `;
                break;

            case 'select':
                inputHTML = `
                    <select class="form-select" id="filter-${key}" data-field="${key}">
                        <option value="">All</option>
                        ${field.options.map(option =>
                    `<option value="${option}">${option}</option>`
                ).join('')}
                    </select>
                `;
                break;

            case 'range':
                inputHTML = `
                    <div class="filter-range-container">
                        <input type="number" class="form-control" id="filter-${key}-min" 
                               placeholder="Min" min="${field.min}" max="${field.max}" 
                               step="${field.step}" data-field="${key}" data-range="min">
                        <span class="filter-range-separator">to</span>
                        <input type="number" class="form-control" id="filter-${key}-max" 
                               placeholder="Max" min="${field.min}" max="${field.max}" 
                               step="${field.step}" data-field="${key}" data-range="max">
                    </div>
                `;
                break;

            case 'daterange':
                inputHTML = `
                    <div class="date-range-container">
                        <input type="date" class="form-control" id="filter-${key}-from" 
                               data-field="${key}" data-range="from">
                        <span class="filter-range-separator">to</span>
                        <input type="date" class="form-control" id="filter-${key}-to" 
                               data-field="${key}" data-range="to">
                    </div>
                `;
                break;
        }

        return `
            <div class="col-md-6 mb-3">
                <div class="filter-field">
                    <div class="filter-field-header">
                        <label class="filter-field-title">${field.label}</label>
                        <button type="button" class="remove-filter-field" title="Remove Filter">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ${inputHTML}
                </div>
            </div>
        `;
    }

    updatePresetOptions() {
        const presetSelect = document.getElementById('filter-preset');
        if (!presetSelect || !this.currentModule) return;

        const presets = this.filterPresets[this.currentModule] || {};
        presetSelect.innerHTML = `
            <option value="">Select Preset...</option>
            ${Object.keys(presets).map(name =>
            `<option value="${name}">${name}</option>`
        ).join('')}
        `;
    }

    updateSavedFilterOptions() {
        const savedSelect = document.getElementById('saved-filter');
        if (!savedSelect || !this.currentModule) return;

        const saved = this.savedFilters[this.currentModule] || {};
        savedSelect.innerHTML = `
            <option value="">Load Saved Filter...</option>
            ${Object.keys(saved).map(name =>
            `<option value="${name}">${name}</option>`
        ).join('')}
        `;
    }

    loadPreset(presetName) {
        if (!presetName || !this.currentModule) return;

        const preset = this.filterPresets[this.currentModule]?.[presetName];
        if (!preset) return;

        this.applyFilterValues(preset);
        this.updateActiveFilters();
    }

    loadSavedFilter(filterName) {
        if (!filterName || !this.currentModule) return;

        const saved = this.savedFilters[this.currentModule]?.[filterName];
        if (!saved) return;

        this.applyFilterValues(saved.filters);
        this.updateActiveFilters();
    }

    applyFilterValues(filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // Handle range filters
                if (value.min !== undefined) {
                    const minInput = document.getElementById(`filter-${key}-min`);
                    if (minInput) minInput.value = value.min;
                }
                if (value.max !== undefined) {
                    const maxInput = document.getElementById(`filter-${key}-max`);
                    if (maxInput) maxInput.value = value.max;
                }
                if (value.from !== undefined) {
                    const fromInput = document.getElementById(`filter-${key}-from`);
                    if (fromInput) fromInput.value = value.from;
                }
                if (value.to !== undefined) {
                    const toInput = document.getElementById(`filter-${key}-to`);
                    if (toInput) toInput.value = value.to;
                }
            } else {
                // Handle simple filters
                const input = document.getElementById(`filter-${key}`);
                if (input) input.value = value;
            }
        });
    }

    updateActiveFilters() {
        this.activeFilters = this.getCurrentFilterValues();
        this.displayActiveFilters();
    }

    getCurrentFilterValues() {
        const filters = {};
        const container = document.getElementById('filter-fields-container');
        if (!container) return filters;

        container.querySelectorAll('input, select').forEach(input => {
            const field = input.dataset.field;
            const range = input.dataset.range;

            if (!field || !input.value) return;

            if (range) {
                // Handle range inputs
                if (!filters[field]) filters[field] = {};
                filters[field][range] = input.value;
            } else {
                // Handle simple inputs
                filters[field] = input.value;
            }
        });

        return filters;
    }

    displayActiveFilters() {
        const container = document.getElementById('active-filters-display');
        if (!container) return;

        if (Object.keys(this.activeFilters).length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div class="active-filters-header">
                <h6>Active Filters:</h6>
            </div>
            <div class="active-filters-tags">
                ${Object.entries(this.activeFilters).map(([key, value]) => {
            const config = this.filterConfigs[this.currentModule]?.fields[key];
            const label = config?.label || key;

            let displayValue = value;
            if (typeof value === 'object') {
                if (value.min !== undefined && value.max !== undefined) {
                    displayValue = `${value.min} - ${value.max}`;
                } else if (value.from !== undefined && value.to !== undefined) {
                    displayValue = `${value.from} to ${value.to}`;
                } else if (value.min !== undefined) {
                    displayValue = `≥ ${value.min}`;
                } else if (value.max !== undefined) {
                    displayValue = `≤ ${value.max}`;
                }
            }

            return `
                        <span class="active-filter-tag" data-field="${key}">
                            ${label}: ${displayValue}
                            <button type="button" class="remove-tag">×</button>
                        </span>
                    `;
        }).join('')}
            </div>
        `;
    }

    removeActiveFilter(tagElement) {
        const field = tagElement.dataset.field;
        if (field) {
            // Clear the filter inputs
            const inputs = document.querySelectorAll(`[data-field="${field}"]`);
            inputs.forEach(input => input.value = '');

            // Update active filters
            this.updateActiveFilters();
        }
    }

    removeFilterField(fieldElement) {
        fieldElement.style.display = 'none';

        // Clear the field's values
        const inputs = fieldElement.querySelectorAll('input, select');
        inputs.forEach(input => input.value = '');

        this.updateActiveFilters();
    }

    showSaveFilterModal() {
        if (Object.keys(this.activeFilters).length === 0) {
            alert('No active filters to save.');
            return;
        }

        const modal = new bootstrap.Modal(document.getElementById('saveFilterModal'));
        modal.show();
    }

    saveCurrentFilter() {
        const name = document.getElementById('filter-name').value.trim();
        const description = document.getElementById('filter-description').value.trim();

        if (!name) {
            alert('Please enter a filter name.');
            return;
        }

        if (!this.currentModule) {
            alert('Please select a module first.');
            return;
        }

        if (!this.savedFilters[this.currentModule]) {
            this.savedFilters[this.currentModule] = {};
        }

        this.savedFilters[this.currentModule][name] = {
            filters: { ...this.activeFilters },
            description: description,
            created: new Date().toISOString()
        };

        localStorage.setItem('savedFilters', JSON.stringify(this.savedFilters));
        this.updateSavedFilterOptions();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('saveFilterModal')).hide();

        // Clear form
        document.getElementById('filter-name').value = '';
        document.getElementById('filter-description').value = '';

        alert('Filter saved successfully!');
    }

    resetFilters() {
        // Clear all filter inputs
        const container = document.getElementById('filter-fields-container');
        if (container) {
            container.querySelectorAll('input, select').forEach(input => {
                input.value = '';
            });
        }

        // Clear active filters
        this.activeFilters = {};
        this.displayActiveFilters();

        // Reset selects
        const presetSelect = document.getElementById('filter-preset');
        const savedSelect = document.getElementById('saved-filter');
        if (presetSelect) presetSelect.value = '';
        if (savedSelect) savedSelect.value = '';
    }

    applyFilters() {
        if (!this.currentModule) {
            alert('Please select a module first.');
            return;
        }

        // Get the current manager for the module
        const managerMap = {
            students: window.studentsManager,
            faculty: window.facultyManager,
            courses: window.coursesManager,
            campus: window.campusManager
        };

        const manager = managerMap[this.currentModule];
        if (manager && typeof manager.applyAdvancedFilters === 'function') {
            manager.applyAdvancedFilters(this.activeFilters);
        } else {
            console.warn(`Advanced filtering not implemented for ${this.currentModule} module`);
        }

        // Collapse the filter panel
        const panel = document.getElementById('advanced-filter-panel');
        if (panel && panel.classList.contains('show')) {
            bootstrap.Collapse.getInstance(panel).hide();
        }
    }

    loadSavedFilters() {
        this.savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '{}');
    }

    // Public method to activate filter for a specific module
    activateForModule(module) {
        this.currentModule = module;
        const moduleSelect = document.getElementById('filter-module');
        if (moduleSelect) {
            moduleSelect.value = module;
            this.onModuleChange(module);
        }
    }

    // Public method to get current filters
    getCurrentFilters() {
        return { ...this.activeFilters };
    }

    // Public method to set filters programmatically
    setFilters(filters) {
        this.applyFilterValues(filters);
        this.updateActiveFilters();
    }
}

// Initialize the advanced filter system
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.advancedFilterSystem = new AdvancedFilterSystem();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFilterSystem;
}