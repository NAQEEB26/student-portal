/**
 * Filter Integration Helper
 * Helps integrate the advanced filter system with existing management modules
 */

class FilterIntegration {
    constructor() {
        this.moduleContainers = {
            students: '#students-content',
            faculty: '#faculty-content',
            courses: '#courses-content',
            campus: '#campus-content'
        };
        this.init();
    }

    init() {
        // Wait for advanced filter system to be ready
        this.waitForFilterSystem();
    }

    waitForFilterSystem() {
        if (window.advancedFilterSystem) {
            this.setupIntegrations();
        } else {
            setTimeout(() => this.waitForFilterSystem(), 100);
        }
    }

    setupIntegrations() {
        // Listen for tab changes to inject filter interface
        document.addEventListener('shown.bs.tab', (e) => {
            const targetId = e.target.getAttribute('data-bs-target');
            this.handleTabChange(targetId);
        });

        // Listen for navigation changes
        this.observeModuleActivation();
    }

    handleTabChange(targetId) {
        const moduleMap = {
            '#students': 'students',
            '#faculty': 'faculty',
            '#courses': 'courses',
            '#campus': 'campus'
        };

        const module = moduleMap[targetId];
        if (module && window.advancedFilterSystem) {
            this.injectFilterInterface(module);
            window.advancedFilterSystem.activateForModule(module);
        }
    }

    injectFilterInterface(module) {
        const containerSelector = this.moduleContainers[module];
        const container = document.querySelector(containerSelector);

        if (!container) return;

        // Check if filter interface already exists
        if (container.querySelector('#advanced-filter-system')) return;

        // Get the filter system element
        const filterSystem = document.getElementById('advanced-filter-system');
        if (!filterSystem) return;

        // Clone and insert at the beginning of the module content
        const filterClone = filterSystem.cloneNode(true);
        filterClone.id = `advanced-filter-system-${module}`;

        // Insert after the module header but before the main content
        const moduleHeader = container.querySelector('.d-flex.justify-content-between') ||
            container.querySelector('.module-header') ||
            container.firstElementChild;

        if (moduleHeader) {
            moduleHeader.insertAdjacentElement('afterend', filterClone);
        } else {
            container.insertBefore(filterClone, container.firstElementChild);
        }

        // Initialize events for this specific filter instance
        this.setupModuleFilterEvents(filterClone, module);
    }

    setupModuleFilterEvents(filterElement, module) {
        // Toggle filter panel
        const toggleBtn = filterElement.querySelector('#toggle-advanced-filters');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                const panel = filterElement.querySelector('#advanced-filter-panel');
                if (panel) {
                    const bsCollapse = new bootstrap.Collapse(panel, { toggle: true });
                    const toggleIcon = toggleBtn.querySelector('.toggle-icon');

                    panel.addEventListener('shown.bs.collapse', () => {
                        if (toggleIcon) toggleIcon.classList.add('rotated');
                    });

                    panel.addEventListener('hidden.bs.collapse', () => {
                        if (toggleIcon) toggleIcon.classList.remove('rotated');
                    });
                }
            };
        }

        // Set the module automatically
        const moduleSelect = filterElement.querySelector('#filter-module');
        if (moduleSelect) {
            moduleSelect.value = module;
            moduleSelect.disabled = true; // Lock to current module

            // Trigger change event to load fields
            if (window.advancedFilterSystem) {
                window.advancedFilterSystem.onModuleChange(module);
            }
        }
    }

    observeModuleActivation() {
        // Watch for dynamic content loading
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if a module content area was added
                        Object.entries(this.moduleContainers).forEach(([module, selector]) => {
                            if (node.matches && node.matches(selector.substring(1))) {
                                setTimeout(() => this.injectFilterInterface(module), 100);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Method to extend existing managers with advanced filtering capability
    static extendManagerWithFiltering(manager, module) {
        if (!manager || typeof manager !== 'object') return manager;

        // Add advanced filtering method
        manager.applyAdvancedFilters = function (filters) {
            this.currentAdvancedFilters = filters;

            // Apply filters to current data
            if (this.allData && Array.isArray(this.allData)) {
                this.filteredData = this.filterDataWithAdvancedFilters(this.allData, filters);
            } else if (this.data && Array.isArray(this.data)) {
                this.filteredData = this.filterDataWithAdvancedFilters(this.data, filters);
            }

            // Re-render the display
            if (typeof this.displayData === 'function') {
                this.displayData();
            } else if (typeof this.render === 'function') {
                this.render();
            } else if (typeof this.updateDisplay === 'function') {
                this.updateDisplay();
            }
        };

        // Add advanced filter logic
        manager.filterDataWithAdvancedFilters = function (data, filters) {
            return data.filter(item => {
                return Object.entries(filters).every(([field, value]) => {
                    if (!value || (typeof value === 'string' && value.trim() === '')) return true;

                    const itemValue = this.getNestedValue(item, field);

                    if (typeof value === 'object' && value !== null) {
                        // Handle range filters
                        if (value.min !== undefined || value.max !== undefined) {
                            const numValue = parseFloat(itemValue);
                            if (isNaN(numValue)) return false;

                            if (value.min !== undefined && numValue < parseFloat(value.min)) return false;
                            if (value.max !== undefined && numValue > parseFloat(value.max)) return false;
                            return true;
                        }

                        // Handle date range filters
                        if (value.from !== undefined || value.to !== undefined) {
                            const itemDate = new Date(itemValue);
                            if (isNaN(itemDate.getTime())) return false;

                            if (value.from !== undefined && itemDate < new Date(value.from)) return false;
                            if (value.to !== undefined && itemDate > new Date(value.to)) return false;
                            return true;
                        }
                    } else {
                        // Handle string/select filters
                        if (typeof itemValue === 'string') {
                            return itemValue.toLowerCase().includes(value.toLowerCase());
                        } else {
                            return String(itemValue).toLowerCase() === String(value).toLowerCase();
                        }
                    }

                    return true;
                });
            });
        };

        // Helper to get nested values from objects
        manager.getNestedValue = function (obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : '';
            }, obj);
        };

        // Add method to clear advanced filters
        manager.clearAdvancedFilters = function () {
            this.currentAdvancedFilters = {};
            this.filteredData = null;

            if (typeof this.displayData === 'function') {
                this.displayData();
            } else if (typeof this.render === 'function') {
                this.render();
            } else if (typeof this.updateDisplay === 'function') {
                this.updateDisplay();
            }
        };

        return manager;
    }

    // Static method to initialize filtering for all managers
    static initializeAllManagers() {
        // Extend all available managers
        const managers = [
            { instance: window.studentsManager, module: 'students' },
            { instance: window.facultyManager, module: 'faculty' },
            { instance: window.coursesManager, module: 'courses' },
            { instance: window.campusManager, module: 'campus' }
        ];

        managers.forEach(({ instance, module }) => {
            if (instance) {
                FilterIntegration.extendManagerWithFiltering(instance, module);
            }
        });
    }
}

// Initialize filter integration when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for all managers to be initialized
    setTimeout(() => {
        if (typeof window !== 'undefined') {
            window.filterIntegration = new FilterIntegration();
            FilterIntegration.initializeAllManagers();
        }
    }, 500);
});

// Re-initialize when managers are loaded
document.addEventListener('managersLoaded', function () {
    FilterIntegration.initializeAllManagers();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterIntegration;
}