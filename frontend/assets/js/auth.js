// ================================
// AUTHENTICATION JAVASCRIPT
// ================================

// Authentication Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot Password Form Handler
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
});

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Get form values
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        rememberMe: formData.get('rememberMe') === 'on',
        backend: StudentPortal.config.backend
    };

    // Validate form
    const validationRules = {
        email: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' }
        ],
        password: [
            { type: 'required', message: 'Password is required' }
        ]
    };

    const errors = Validator.validateForm(form, validationRules);

    if (Object.keys(errors).length > 0) {
        Validator.showErrors(form, errors);
        return;
    }

    // Show loading state
    Utils.showLoading(submitBtn, true);
    form.classList.add('loading');

    try {
        // Simulate API call based on backend
        const result = await authenticateUser(loginData);

        if (result.success) {
            // Store user data
            Auth.setCurrentUser(result.user);

            if (loginData.rememberMe) {
                Storage.set('rememberMe', true);
            }

            Utils.showToast('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                const redirectUrl = getRedirectUrl(result.user.role);
                window.location.href = redirectUrl;
            }, 1500);

        } else {
            throw new Error(result.message || 'Login failed');
        }

    } catch (error) {
        console.error('Login error:', error);
        Utils.showToast(error.message || 'Login failed. Please try again.', 'danger');

        // Reset form state
        Utils.showLoading(submitBtn, false);
        form.classList.remove('loading');
    }
}

// Handle Registration
async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Get form values
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role'),
        campus: formData.get('campus'),
        acceptTerms: formData.get('acceptTerms') === 'on',
        backend: StudentPortal.config.backend
    };

    // Validate form
    const validationRules = {
        firstName: [
            { type: 'required', message: 'First name is required' },
            { type: 'minLength', value: 2, message: 'First name must be at least 2 characters' }
        ],
        lastName: [
            { type: 'required', message: 'Last name is required' },
            { type: 'minLength', value: 2, message: 'Last name must be at least 2 characters' }
        ],
        email: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' }
        ],
        phone: [
            { type: 'required', message: 'Phone number is required' },
            { type: 'phone', message: 'Please enter a valid phone number' }
        ],
        password: [
            { type: 'required', message: 'Password is required' },
            { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' }
        ]
    };

    // Add campus validation for campus managers
    if (registerData.role === 'campus_manager') {
        validationRules.campus = [
            { type: 'required', message: 'Campus selection is required for Campus Managers' }
        ];
    }

    const errors = Validator.validateForm(form, validationRules);

    // Check password match
    if (registerData.password !== registerData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Check terms acceptance
    if (!registerData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
        Validator.showErrors(form, errors);
        return;
    }

    // Show loading state
    Utils.showLoading(submitBtn, true);
    form.classList.add('loading');

    try {
        // Simulate API call based on backend
        const result = await registerUser(registerData);

        if (result.success) {
            Utils.showToast('Registration successful! Please check your email for verification.', 'success');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            throw new Error(result.message || 'Registration failed');
        }

    } catch (error) {
        console.error('Registration error:', error);
        Utils.showToast(error.message || 'Registration failed. Please try again.', 'danger');

        // Reset form state
        Utils.showLoading(submitBtn, false);
        form.classList.remove('loading');
    }
}

// Handle Forgot Password
async function handleForgotPassword(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    const email = formData.get('email');

    // Validate email
    if (!email || !Utils.isValidEmail(email)) {
        Utils.showToast('Please enter a valid email address', 'danger');
        return;
    }

    // Show loading state
    Utils.showLoading(submitBtn, true);

    try {
        // Simulate API call
        const result = await resetPassword(email);

        if (result.success) {
            Utils.showToast('Password reset instructions sent to your email', 'success');
            form.reset();
        } else {
            throw new Error(result.message || 'Failed to send reset email');
        }

    } catch (error) {
        console.error('Password reset error:', error);
        Utils.showToast(error.message || 'Failed to send reset email', 'danger');
    } finally {
        Utils.showLoading(submitBtn, false);
    }
}

// Simulate Authentication (will be replaced with actual backend calls)
async function authenticateUser(loginData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock users database
    const mockUsers = [
        {
            id: '1',
            email: 'admin@studentportal.com',
            password: 'admin123',
            role: 'superadmin',
            name: 'Super Admin',
            campus: null
        },
        {
            id: '2',
            email: 'manager@studentportal.com',
            password: 'manager123',
            role: 'campus_manager',
            name: 'Campus Manager',
            campus: 'main-campus'
        },
        {
            id: '3',
            email: 'student@studentportal.com',
            password: 'student123',
            role: 'student',
            name: 'John Doe',
            campus: 'main-campus',
            studentId: 'STU2025-001'
        }
    ];

    // Find user by email and password (in real app, password would be hashed)
    const user = mockUsers.find(u =>
        u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                campus: user.campus,
                studentId: user.studentId || null,
                loginTime: new Date().toISOString()
            }
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }
}

// Simulate User Registration
async function registerUser(registerData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if email already exists (mock check)
    const existingEmails = ['admin@studentportal.com', 'manager@studentportal.com', 'student@studentportal.com'];

    if (existingEmails.includes(registerData.email)) {
        return {
            success: false,
            message: 'Email already exists'
        };
    }

    // Simulate successful registration
    return {
        success: true,
        message: 'Registration successful',
        user: {
            id: Utils.generateId('USR'),
            email: registerData.email,
            name: `${registerData.firstName} ${registerData.lastName}`,
            role: registerData.role,
            campus: registerData.campus,
            phone: registerData.phone,
            status: 'pending_verification'
        }
    };
}

// Simulate Password Reset
async function resetPassword(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful password reset
    return {
        success: true,
        message: 'Password reset email sent'
    };
}

// Get redirect URL based on user role
function getRedirectUrl(role) {
    switch (role) {
        case 'superadmin':
            return 'dashboard.html?view=admin';
        case 'campus_manager':
            return 'dashboard.html?view=manager';
        case 'student':
            return 'dashboard.html?view=student';
        default:
            return 'dashboard.html';
    }
}

// Auto-fill demo credentials (for testing)
function fillDemoCredentials(role = 'admin') {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    if (!emailField || !passwordField) return;

    const credentials = {
        admin: { email: 'admin@studentportal.com', password: 'admin123' },
        manager: { email: 'manager@studentportal.com', password: 'manager123' },
        student: { email: 'student@studentportal.com', password: 'student123' }
    };

    const cred = credentials[role];
    if (cred) {
        emailField.value = cred.email;
        passwordField.value = cred.password;
        Utils.showToast(`Demo credentials filled for ${role}`, 'info');
    }
}

// Add demo buttons (for development/testing)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm && window.location.hostname === 'localhost') {
        const demoButtons = document.createElement('div');
        demoButtons.className = 'text-center mb-3';
        demoButtons.innerHTML = `
            <small class="text-muted d-block mb-2">Demo Credentials:</small>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="fillDemoCredentials('admin')">
                    Admin
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="fillDemoCredentials('manager')">
                    Manager
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="fillDemoCredentials('student')">
                    Student
                </button>
            </div>
        `;

        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.parentNode.insertBefore(demoButtons, submitButton);
    }
});

// Export functions for global access
window.fillDemoCredentials = fillDemoCredentials;