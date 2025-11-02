/**
 * Role-Based Access Control (RBAC) System
 * Comprehensive permission management and interface customization
 */

class RBACSystem {
    constructor() {
        this.currentUser = null;
        this.userRoles = {};
        this.permissions = {};
        this.roleHierarchy = this.getDefaultRoleHierarchy();
        this.permissionGroups = this.getDefaultPermissionGroups();
        this.uiElements = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupPermissions();
        this.createRBACInterface();
        this.enforcePermissions();
        this.setupEventListeners();
    }

    getDefaultRoleHierarchy() {
        return {
            'Super Admin': {
                level: 100,
                description: 'Full system access with all permissions',
                inherits: [],
                color: '#dc3545',
                icon: 'fas fa-crown'
            },
            'Admin': {
                level: 80,
                description: 'Administrative access to all modules',
                inherits: ['Faculty', 'Staff'],
                color: '#fd7e14',
                icon: 'fas fa-user-shield'
            },
            'Faculty': {
                level: 60,
                description: 'Faculty members with course and student management',
                inherits: ['Student'],
                color: '#198754',
                icon: 'fas fa-user-tie'
            },
            'Staff': {
                level: 50,
                description: 'Staff members with limited administrative access',
                inherits: ['Student'],
                color: '#0d6efd',
                icon: 'fas fa-user-cog'
            },
            'Student': {
                level: 20,
                description: 'Student access to personal information and courses',
                inherits: [],
                color: '#6f42c1',
                icon: 'fas fa-user-graduate'
            },
            'Guest': {
                level: 10,
                description: 'Read-only access to public information',
                inherits: [],
                color: '#6c757d',
                icon: 'fas fa-user'
            }
        };
    }

    getDefaultPermissionGroups() {
        return {
            'System Administration': {
                icon: 'fas fa-cogs',
                permissions: [
                    'system.manage',
                    'users.create',
                    'users.edit',
                    'users.delete',
                    'users.view',
                    'roles.manage',
                    'permissions.manage',
                    'settings.manage',
                    'logs.view',
                    'backup.create',
                    'backup.restore'
                ]
            },
            'Student Management': {
                icon: 'fas fa-user-graduate',
                permissions: [
                    'students.create',
                    'students.edit',
                    'students.delete',
                    'students.view',
                    'students.export',
                    'students.import',
                    'students.bulk_operations',
                    'student_records.edit',
                    'student_records.view',
                    'id_cards.generate'
                ]
            },
            'Faculty Management': {
                icon: 'fas fa-user-tie',
                permissions: [
                    'faculty.create',
                    'faculty.edit',
                    'faculty.delete',
                    'faculty.view',
                    'faculty.export',
                    'faculty.performance_review',
                    'faculty.schedule_manage',
                    'faculty.workload_assign'
                ]
            },
            'Course Management': {
                icon: 'fas fa-book',
                permissions: [
                    'courses.create',
                    'courses.edit',
                    'courses.delete',
                    'courses.view',
                    'courses.enroll_students',
                    'courses.grade_students',
                    'courses.schedule_manage',
                    'courses.reports_generate',
                    'courses.export'
                ]
            },
            'Campus Management': {
                icon: 'fas fa-university',
                permissions: [
                    'campus.create',
                    'campus.edit',
                    'campus.delete',
                    'campus.view',
                    'buildings.manage',
                    'rooms.manage',
                    'facilities.manage',
                    'maintenance.schedule',
                    'utilization.view'
                ]
            },
            'Reports & Analytics': {
                icon: 'fas fa-chart-bar',
                permissions: [
                    'reports.view',
                    'reports.generate',
                    'reports.export',
                    'analytics.view',
                    'analytics.advanced',
                    'dashboards.customize',
                    'data.export'
                ]
            },
            'Communication': {
                icon: 'fas fa-envelope',
                permissions: [
                    'notifications.send',
                    'notifications.broadcast',
                    'messages.send',
                    'announcements.create',
                    'announcements.edit',
                    'email.send'
                ]
            },
            'Financial': {
                icon: 'fas fa-dollar-sign',
                permissions: [
                    'fees.view',
                    'fees.manage',
                    'payments.view',
                    'payments.process',
                    'financial_reports.view',
                    'billing.manage'
                ]
            }
        };
    }

    loadUserData() {
        // Load current user from authentication system
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.currentUser = {
            id: userData.id || 'admin',
            username: userData.username || 'admin',
            name: userData.name || 'Administrator',
            email: userData.email || 'admin@university.edu',
            role: userData.role || 'Admin',
            permissions: userData.permissions || [],
            avatar: userData.avatar || 'assets/images/default-avatar.png',
            lastLogin: userData.lastLogin || new Date().toISOString(),
            isActive: userData.isActive !== false
        };

        // Load user roles configuration
        this.userRoles = JSON.parse(localStorage.getItem('userRoles') || '{}');

        // Load custom permissions
        this.permissions = JSON.parse(localStorage.getItem('customPermissions') || '{}');
    }

    setupPermissions() {
        // Set up default role permissions
        this.setupDefaultRolePermissions();

        // Apply current user permissions
        this.applyUserPermissions();
    }

    setupDefaultRolePermissions() {
        const defaultRolePermissions = {
            'Super Admin': Object.values(this.permissionGroups)
                .flatMap(group => group.permissions),

            'Admin': [
                // Student Management
                'students.create', 'students.edit', 'students.view', 'students.export',
                'student_records.edit', 'student_records.view', 'id_cards.generate',
                // Faculty Management
                'faculty.create', 'faculty.edit', 'faculty.view', 'faculty.export',
                'faculty.performance_review', 'faculty.schedule_manage',
                // Course Management
                'courses.create', 'courses.edit', 'courses.view', 'courses.schedule_manage',
                'courses.reports_generate', 'courses.export',
                // Campus Management
                'campus.view', 'buildings.manage', 'rooms.manage', 'facilities.manage',
                // Reports
                'reports.view', 'reports.generate', 'reports.export', 'analytics.view',
                // Communication
                'notifications.send', 'announcements.create', 'announcements.edit',
                // Users
                'users.view', 'users.edit'
            ],

            'Faculty': [
                // Student Management (limited)
                'students.view', 'student_records.view',
                // Course Management
                'courses.view', 'courses.enroll_students', 'courses.grade_students',
                'courses.schedule_manage', 'courses.reports_generate',
                // Basic reports
                'reports.view', 'analytics.view',
                // Communication
                'notifications.send', 'messages.send'
            ],

            'Staff': [
                // Student Management (limited)
                'students.view', 'students.edit', 'student_records.edit', 'student_records.view',
                // Basic campus info
                'campus.view', 'rooms.manage',
                // Reports
                'reports.view',
                // Communication
                'messages.send'
            ],

            'Student': [
                // Own records only
                'student_records.view',
                'courses.view',
                'reports.view'
            ],

            'Guest': [
                'campus.view'
            ]
        };

        // Save default permissions
        Object.entries(defaultRolePermissions).forEach(([role, permissions]) => {
            if (!this.userRoles[role]) {
                this.userRoles[role] = {
                    ...this.roleHierarchy[role],
                    permissions: permissions
                };
            }
        });

        localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
    }

    applyUserPermissions() {
        if (!this.currentUser.role || !this.userRoles[this.currentUser.role]) {
            console.warn('Invalid user role:', this.currentUser.role);
            return;
        }

        const rolePermissions = this.userRoles[this.currentUser.role].permissions || [];
        const inheritedPermissions = this.getInheritedPermissions(this.currentUser.role);
        const userCustomPermissions = this.currentUser.permissions || [];

        this.currentUser.effectivePermissions = [
            ...new Set([
                ...rolePermissions,
                ...inheritedPermissions,
                ...userCustomPermissions
            ])
        ];
    }

    getInheritedPermissions(role) {
        const roleConfig = this.roleHierarchy[role];
        if (!roleConfig || !roleConfig.inherits) return [];

        let inherited = [];
        roleConfig.inherits.forEach(inheritedRole => {
            const inheritedRolePermissions = this.userRoles[inheritedRole]?.permissions || [];
            inherited = [...inherited, ...inheritedRolePermissions];
            inherited = [...inherited, ...this.getInheritedPermissions(inheritedRole)];
        });

        return [...new Set(inherited)];
    }

    createRBACInterface() {
        // Only show RBAC interface to users with permission management rights
        if (!this.hasPermission('permissions.manage')) return;

        const rbacContainer = document.createElement('div');
        rbacContainer.id = 'rbac-management-interface';
        rbacContainer.innerHTML = `
            <!-- RBAC Management Panel -->
            <div class="rbac-panel d-none">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-shield-alt me-2"></i>Role-Based Access Control
                            </h5>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="close-rbac-panel">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- RBAC Tabs -->
                        <ul class="nav nav-tabs mb-3" id="rbac-tabs">
                            <li class="nav-item">
                                <button class="nav-link active" id="roles-tab" data-bs-toggle="tab" data-bs-target="#roles-pane">
                                    <i class="fas fa-users-cog me-2"></i>Roles
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="permissions-tab" data-bs-toggle="tab" data-bs-target="#permissions-pane">
                                    <i class="fas fa-key me-2"></i>Permissions
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-pane">
                                    <i class="fas fa-users me-2"></i>Users
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <!-- Roles Tab -->
                            <div class="tab-pane fade show active" id="roles-pane">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6>System Roles</h6>
                                    <button type="button" class="btn btn-sm btn-primary" id="add-role">
                                        <i class="fas fa-plus me-2"></i>Add Role
                                    </button>
                                </div>
                                <div id="roles-list">
                                    <!-- Roles will be populated here -->
                                </div>
                            </div>

                            <!-- Permissions Tab -->
                            <div class="tab-pane fade" id="permissions-pane">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6>Permission Groups</h6>
                                    <button type="button" class="btn btn-sm btn-primary" id="add-permission-group">
                                        <i class="fas fa-plus me-2"></i>Add Group
                                    </button>
                                </div>
                                <div id="permissions-list">
                                    <!-- Permissions will be populated here -->
                                </div>
                            </div>

                            <!-- Users Tab -->
                            <div class="tab-pane fade" id="users-pane">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6>User Role Assignments</h6>
                                    <button type="button" class="btn btn-sm btn-primary" id="assign-user-role">
                                        <i class="fas fa-user-plus me-2"></i>Assign Role
                                    </button>
                                </div>
                                <div id="user-roles-list">
                                    <!-- User roles will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RBAC Toggle Button -->
            <button type="button" class="btn btn-outline-primary position-fixed rbac-toggle" 
                    id="toggle-rbac-panel" style="top: 20px; right: 20px; z-index: 1050;">
                <i class="fas fa-shield-alt me-2"></i>RBAC
            </button>
        `;

        document.body.appendChild(rbacContainer);
        this.populateRBACInterface();
        this.addRBACStyles();
    }

    populateRBACInterface() {
        this.populateRolesList();
        this.populatePermissionsList();
        this.populateUserRolesList();
    }

    populateRolesList() {
        const container = document.getElementById('roles-list');
        if (!container) return;

        container.innerHTML = Object.entries(this.roleHierarchy).map(([roleName, roleConfig]) => `
            <div class="role-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="role-info">
                        <div class="d-flex align-items-center mb-2">
                            <i class="${roleConfig.icon} me-2" style="color: ${roleConfig.color}"></i>
                            <h6 class="mb-0">${roleName}</h6>
                            <span class="badge ms-2" style="background-color: ${roleConfig.color}">
                                Level ${roleConfig.level}
                            </span>
                        </div>
                        <p class="text-muted mb-2">${roleConfig.description}</p>
                        ${roleConfig.inherits.length > 0 ? `
                            <small class="text-info">
                                Inherits from: ${roleConfig.inherits.join(', ')}
                            </small>
                        ` : ''}
                    </div>
                    <div class="role-actions">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="editRole('${roleName}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-info" 
                                onclick="manageRolePermissions('${roleName}')">
                            <i class="fas fa-key"></i>
                        </button>
                        ${roleName !== 'Super Admin' ? `
                            <button type="button" class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteRole('${roleName}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="permissions-count mt-2">
                    <small class="text-muted">
                        ${(this.userRoles[roleName]?.permissions || []).length} permissions assigned
                    </small>
                </div>
            </div>
        `).join('');
    }

    populatePermissionsList() {
        const container = document.getElementById('permissions-list');
        if (!container) return;

        container.innerHTML = Object.entries(this.permissionGroups).map(([groupName, groupConfig]) => `
            <div class="permission-group mb-3">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">
                                <i class="${groupConfig.icon} me-2"></i>${groupName}
                            </h6>
                            <button type="button" class="btn btn-sm btn-outline-primary" 
                                    onclick="editPermissionGroup('${groupName}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${groupConfig.permissions.map(permission => `
                                <div class="col-md-6 mb-2">
                                    <span class="badge bg-light text-dark">${permission}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    populateUserRolesList() {
        const container = document.getElementById('user-roles-list');
        if (!container) return;

        // Mock user data for demonstration
        const users = [
            {
                id: 'admin',
                name: 'Administrator',
                email: 'admin@university.edu',
                role: 'Admin',
                isActive: true
            },
            {
                id: 'faculty1',
                name: 'Dr. John Smith',
                email: 'john.smith@university.edu',
                role: 'Faculty',
                isActive: true
            },
            {
                id: 'staff1',
                name: 'Jane Doe',
                email: 'jane.doe@university.edu',
                role: 'Staff',
                isActive: true
            }
        ];

        container.innerHTML = users.map(user => `
            <div class="user-role-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user-info">
                        <div class="d-flex align-items-center mb-1">
                            <img src="assets/images/default-avatar.png" alt="Avatar" 
                                 class="rounded-circle me-2" style="width: 32px; height: 32px;">
                            <div>
                                <h6 class="mb-0">${user.name}</h6>
                                <small class="text-muted">${user.email}</small>
                            </div>
                        </div>
                    </div>
                    <div class="role-assignment">
                        <select class="form-select form-select-sm" onchange="changeUserRole('${user.id}', this.value)">
                            ${Object.keys(this.roleHierarchy).map(role => `
                                <option value="${role}" ${user.role === role ? 'selected' : ''}>
                                    ${role}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="user-status">
                        <span class="badge ${user.isActive ? 'bg-success' : 'bg-danger'}">
                            ${user.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addRBACStyles() {
        const styles = `
            <style>
                .rbac-toggle {
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border-radius: 25px;
                }

                .rbac-panel {
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    z-index: 1040;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                }

                .role-item {
                    transition: all 0.3s ease;
                }

                .role-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .permission-group .card {
                    border: 1px solid #e3e6f0;
                }

                .user-role-item {
                    transition: all 0.3s ease;
                }

                .user-role-item:hover {
                    background-color: #f8f9fc;
                }

                @media (max-width: 768px) {
                    .rbac-panel {
                        width: calc(100vw - 40px);
                        right: 20px;
                        left: 20px;
                    }
                }
            </style>
        `;

        if (!document.querySelector('#rbac-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'rbac-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Toggle RBAC panel
            if (e.target.closest('#toggle-rbac-panel')) {
                this.toggleRBACPanel();
            }

            // Close RBAC panel
            if (e.target.closest('#close-rbac-panel')) {
                this.hideRBACPanel();
            }
        });
    }

    toggleRBACPanel() {
        const panel = document.querySelector('.rbac-panel');
        if (panel) {
            panel.classList.toggle('d-none');
        }
    }

    hideRBACPanel() {
        const panel = document.querySelector('.rbac-panel');
        if (panel) {
            panel.classList.add('d-none');
        }
    }

    enforcePermissions() {
        // Hide/show navigation items based on permissions
        this.enforceNavigationPermissions();

        // Hide/show buttons and features based on permissions
        this.enforceUIPermissions();

        // Customize dashboard based on role
        this.customizeDashboardForRole();
    }

    enforceNavigationPermissions() {
        const navigationItems = {
            '#students-tab': ['students.view'],
            '#faculty-tab': ['faculty.view'],
            '#courses-tab': ['courses.view'],
            '#campus-tab': ['campus.view']
        };

        Object.entries(navigationItems).forEach(([selector, requiredPermissions]) => {
            const element = document.querySelector(selector);
            if (element) {
                const hasAccess = requiredPermissions.some(permission =>
                    this.hasPermission(permission)
                );

                if (!hasAccess) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }
            }
        });
    }

    enforceUIPermissions() {
        // Define UI elements and their required permissions
        const uiPermissions = {
            '.btn-add-student': ['students.create'],
            '.btn-edit-student': ['students.edit'],
            '.btn-delete-student': ['students.delete'],
            '.btn-add-faculty': ['faculty.create'],
            '.btn-edit-faculty': ['faculty.edit'],
            '.btn-delete-faculty': ['faculty.delete'],
            '.btn-add-course': ['courses.create'],
            '.btn-edit-course': ['courses.edit'],
            '.btn-delete-course': ['courses.delete'],
            '.btn-export': ['reports.export']
        };

        Object.entries(uiPermissions).forEach(([selector, requiredPermissions]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const hasAccess = requiredPermissions.some(permission =>
                    this.hasPermission(permission)
                );

                if (!hasAccess) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }
            });
        });
    }

    customizeDashboardForRole() {
        const role = this.currentUser.role;
        const roleConfig = this.roleHierarchy[role];

        if (!roleConfig) return;

        // Update user info display
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');

        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name;
        }

        if (userRoleElement) {
            userRoleElement.innerHTML = `
                <i class="${roleConfig.icon} me-1" style="color: ${roleConfig.color}"></i>
                ${role}
            `;
        }

        // Customize dashboard cards based on permissions
        this.customizeDashboardCards();
    }

    customizeDashboardCards() {
        const dashboardCards = {
            '.students-card': ['students.view'],
            '.faculty-card': ['faculty.view'],
            '.courses-card': ['courses.view'],
            '.campus-card': ['campus.view']
        };

        Object.entries(dashboardCards).forEach(([selector, requiredPermissions]) => {
            const card = document.querySelector(selector);
            if (card) {
                const hasAccess = requiredPermissions.some(permission =>
                    this.hasPermission(permission)
                );

                if (!hasAccess) {
                    card.style.display = 'none';
                }
            }
        });
    }

    hasPermission(permission) {
        if (!this.currentUser.effectivePermissions) return false;
        return this.currentUser.effectivePermissions.includes(permission);
    }

    hasAnyPermission(permissions) {
        return permissions.some(permission => this.hasPermission(permission));
    }

    hasAllPermissions(permissions) {
        return permissions.every(permission => this.hasPermission(permission));
    }

    // Public methods for role management
    changeUserRole(userId, newRole) {
        console.log(`Changing user ${userId} role to ${newRole}`);
        // Implementation would update user role in database
    }

    editRole(roleName) {
        console.log(`Editing role: ${roleName}`);
        // Implementation would show role edit modal
    }

    manageRolePermissions(roleName) {
        console.log(`Managing permissions for role: ${roleName}`);
        // Implementation would show permission management modal
    }

    deleteRole(roleName) {
        if (confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            delete this.roleHierarchy[roleName];
            delete this.userRoles[roleName];
            this.populateRolesList();
        }
    }

    editPermissionGroup(groupName) {
        console.log(`Editing permission group: ${groupName}`);
        // Implementation would show permission group edit modal
    }

    // Method to check if current interface should be restricted
    checkModuleAccess(module) {
        const modulePermissions = {
            'students': ['students.view'],
            'faculty': ['faculty.view'],
            'courses': ['courses.view'],
            'campus': ['campus.view']
        };

        const requiredPermissions = modulePermissions[module] || [];
        return this.hasAnyPermission(requiredPermissions);
    }

    // Method to apply role-based filtering to data
    applyRoleBasedFiltering(data, module) {
        const role = this.currentUser.role;

        // Students can only see their own data
        if (role === 'Student') {
            return data.filter(item => {
                return item.studentId === this.currentUser.id ||
                    item.userId === this.currentUser.id ||
                    item.id === this.currentUser.id;
            });
        }

        // Faculty can see students in their courses
        if (role === 'Faculty' && module === 'students') {
            // Implementation would filter based on faculty's courses
            return data;
        }

        // Admin and higher roles see everything
        return data;
    }
}

// Global functions for RBAC management
window.changeUserRole = function (userId, newRole) {
    if (window.rbacSystem) {
        window.rbacSystem.changeUserRole(userId, newRole);
    }
};

window.editRole = function (roleName) {
    if (window.rbacSystem) {
        window.rbacSystem.editRole(roleName);
    }
};

window.manageRolePermissions = function (roleName) {
    if (window.rbacSystem) {
        window.rbacSystem.manageRolePermissions(roleName);
    }
};

window.deleteRole = function (roleName) {
    if (window.rbacSystem) {
        window.rbacSystem.deleteRole(roleName);
    }
};

window.editPermissionGroup = function (groupName) {
    if (window.rbacSystem) {
        window.rbacSystem.editPermissionGroup(groupName);
    }
};

// Initialize RBAC system when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    if (typeof window !== 'undefined') {
        window.rbacSystem = new RBACSystem();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RBACSystem;
}