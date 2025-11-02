// ================================
// STUDENT PORTAL - MAIN JAVASCRIPT
// ================================

// Global Variables
const StudentPortal = {
    currentUser: null,
    userRole: null,
    selectedCampus: null,
    apiEndpoint: 'http://localhost:3000/api', // Will be configured based on backend choice
    config: {
        backend: 'firebase', // 'firebase' or 'supabase'
        itemsPerPage: 10,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss'
    }
};

// Utility Functions
const Utils = {
    // Format date
    formatDate: (date, format = 'YYYY-MM-DD') => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    // Generate unique ID
    generateId: (prefix = 'STU') => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${year}-${random}`;
    },

    // Validate email
    isValidEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Validate phone
    isValidPhone: (phone) => {
        const regex = /^[\+]?[1-9][\d]{0,15}$/;
        return regex.test(phone.replace(/\s/g, ''));
    },

    // Format file size
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show toast notification
    showToast: (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container') || Utils.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },

    // Create toast container
    createToastContainer: () => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    },

    // Show loading spinner
    showLoading: (element, show = true) => {
        if (!element) return;

        if (show) {
            element.disabled = true;
            const originalText = element.innerHTML;
            element.setAttribute('data-original-text', originalText);
            element.innerHTML = `
                <span class="loading-spinner me-2"></span>
                Loading...
            `;
        } else {
            element.disabled = false;
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.innerHTML = originalText;
                element.removeAttribute('data-original-text');
            }
        }
    },

    // Confirm dialog
    confirmDialog: (title, message, confirmText = 'Confirm', cancelText = 'Cancel') => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
                            <button type="button" class="btn btn-danger" id="confirm-btn">${confirmText}</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);

            modal.querySelector('#confirm-btn').addEventListener('click', () => {
                bsModal.hide();
                resolve(true);
            });

            modal.addEventListener('hidden.bs.modal', () => {
                modal.remove();
                resolve(false);
            });

            bsModal.show();
        });
    }
};

// Local Storage Management
const Storage = {
    // Set item
    set: (key, value) => {
        try {
            localStorage.setItem(`sp_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    // Get item
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`sp_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    // Remove item
    remove: (key) => {
        try {
            localStorage.removeItem(`sp_${key}`);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    // Clear all
    clear: () => {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('sp_'));
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// Form Validation
const Validator = {
    // Validate required fields
    required: (value) => {
        return value && value.toString().trim().length > 0;
    },

    // Validate email
    email: (value) => {
        return Utils.isValidEmail(value);
    },

    // Validate phone
    phone: (value) => {
        return Utils.isValidPhone(value);
    },

    // Validate minimum length
    minLength: (value, min) => {
        return value && value.toString().length >= min;
    },

    // Validate maximum length
    maxLength: (value, max) => {
        return value && value.toString().length <= max;
    },

    // Validate date
    date: (value) => {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    },

    // Validate age (minimum)
    minAge: (birthdate, minAge) => {
        const today = new Date();
        const birth = new Date(birthdate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age >= minAge;
    },

    // Validate form
    validateForm: (form, rules) => {
        const errors = {};

        Object.keys(rules).forEach(field => {
            const element = form.querySelector(`[name="${field}"]`);
            const value = element ? element.value : '';
            const fieldRules = rules[field];

            fieldRules.forEach(rule => {
                if (rule.type === 'required' && !Validator.required(value)) {
                    errors[field] = rule.message || `${field} is required`;
                } else if (rule.type === 'email' && value && !Validator.email(value)) {
                    errors[field] = rule.message || 'Invalid email format';
                } else if (rule.type === 'phone' && value && !Validator.phone(value)) {
                    errors[field] = rule.message || 'Invalid phone format';
                } else if (rule.type === 'minLength' && value && !Validator.minLength(value, rule.value)) {
                    errors[field] = rule.message || `Minimum length is ${rule.value}`;
                } else if (rule.type === 'maxLength' && value && !Validator.maxLength(value, rule.value)) {
                    errors[field] = rule.message || `Maximum length is ${rule.value}`;
                }
            });
        });

        return errors;
    },

    // Show field errors
    showErrors: (form, errors) => {
        // Clear previous errors
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });

        // Show new errors
        Object.keys(errors).forEach(field => {
            const element = form.querySelector(`[name="${field}"]`);
            if (element) {
                element.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = errors[field];
                element.parentNode.appendChild(feedback);
            }
        });
    }
};

// Authentication Helper
const Auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        return Storage.get('currentUser') !== null;
    },

    // Get current user
    getCurrentUser: () => {
        return Storage.get('currentUser');
    },

    // Set current user
    setCurrentUser: (user) => {
        Storage.set('currentUser', user);
        StudentPortal.currentUser = user;
        StudentPortal.userRole = user.role;
    },

    // Logout
    logout: () => {
        Storage.clear();
        StudentPortal.currentUser = null;
        StudentPortal.userRole = null;
        window.location.href = '/index.html';
    },

    // Check permission
    hasPermission: (permission) => {
        const user = Auth.getCurrentUser();
        if (!user) return false;

        const permissions = {
            'superadmin': ['*'],
            'campus_manager': ['students_read', 'students_create', 'students_update', 'students_delete', 'courses_read'],
            'student': ['profile_read', 'profile_update', 'id_card_download']
        };

        const userPermissions = permissions[user.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    },

    // Redirect if not authorized
    requireAuth: (requiredRole = null) => {
        if (!Auth.isLoggedIn()) {
            window.location.href = '/pages/login.html';
            return false;
        }

        if (requiredRole && !Auth.hasPermission(requiredRole)) {
            Utils.showToast('You do not have permission to access this page', 'danger');
            window.location.href = '/pages/dashboard.html';
            return false;
        }

        return true;
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // Set current user if logged in
    const currentUser = Storage.get('currentUser');
    if (currentUser) {
        StudentPortal.currentUser = currentUser;
        StudentPortal.userRole = currentUser.role;
    }

    // Add loading states to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                Utils.showLoading(submitBtn, true);

                // Reset loading state after 5 seconds (fallback)
                setTimeout(() => {
                    Utils.showLoading(submitBtn, false);
                }, 5000);
            }
        });
    });

    // Handle file input changes
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size
                if (file.size > StudentPortal.config.maxFileSize) {
                    Utils.showToast(`File size must be less than ${Utils.formatFileSize(StudentPortal.config.maxFileSize)}`, 'danger');
                    e.target.value = '';
                    return;
                }

                // Validate file type for image inputs
                if (input.accept && input.accept.includes('image/')) {
                    if (!StudentPortal.config.allowedImageTypes.includes(file.type)) {
                        Utils.showToast('Please select a valid image file (JPEG, JPG, PNG)', 'danger');
                        e.target.value = '';
                        return;
                    }
                }

                // Show file info
                const fileInfo = document.querySelector(`[data-file-info="${input.name}"]`);
                if (fileInfo) {
                    fileInfo.textContent = `${file.name} (${Utils.formatFileSize(file.size)})`;
                }
            }
        });
    });

    console.log('Student Portal initialized successfully');
});

// Export for use in other files
window.StudentPortal = StudentPortal;
window.Utils = Utils;
window.Storage = Storage;
window.Validator = Validator;
window.Auth = Auth;