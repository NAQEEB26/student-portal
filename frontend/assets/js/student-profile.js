/**
 * Student Profile Management
 * Handles student profile display, editing, and management
 */

class StudentProfile {
    constructor() {
        this.currentStudent = null;
        this.gpaChart = null;
        this.init();
    }

    init() {
        this.loadStudentProfile();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Photo upload preview
        const photoInput = document.getElementById('edit-photo');
        if (photoInput) {
            photoInput.addEventListener('change', this.handlePhotoPreview.bind(this));
        }

        // Auto-save form data on input
        const formInputs = document.querySelectorAll('#editProfileForm input, #editProfileForm select, #editProfileForm textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', this.autoSaveFormData.bind(this));
        });
    }

    loadStudentProfile() {
        // Get student ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');

        if (studentId) {
            this.loadStudentById(studentId);
        } else {
            // If no ID provided, load demo data or redirect
            this.loadDemoStudent();
        }
    }

    loadStudentById(studentId) {
        // In a real application, this would fetch from an API
        const students = this.getMockStudents();
        const student = students.find(s => s.id === studentId);

        if (student) {
            this.currentStudent = student;
            this.displayStudentInfo(student);
            this.loadAcademicPerformance(student);
            this.loadRecentActivities(student);
            this.loadEnrolledCourses(student);
        } else {
            this.showError('Student not found');
        }
    }

    loadDemoStudent() {
        // Load a demo student for testing
        const demoStudent = {
            id: 'STU2024001',
            name: 'Emma Johnson',
            email: 'emma.johnson@university.edu',
            phone: '+1 (555) 123-4567',
            photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
            dob: '1998-03-15',
            gender: 'Female',
            bloodGroup: 'B+',
            address: '123 University Street, College Town, CT 06511',
            course: 'Computer Science',
            specialization: 'Artificial Intelligence',
            year: '3rd Year',
            status: 'Active',
            admissionDate: '2022-09-01',
            expectedGraduation: '2026-06-15',
            gpa: 3.85,
            emergencyContact: {
                name: 'Robert Johnson',
                relation: 'Father',
                phone: '+1 (555) 987-6543'
            }
        };

        this.currentStudent = demoStudent;
        this.displayStudentInfo(demoStudent);
        this.loadAcademicPerformance(demoStudent);
        this.loadRecentActivities(demoStudent);
        this.loadEnrolledCourses(demoStudent);
    }

    displayStudentInfo(student) {
        // Update profile header
        this.updateElement('profile-photo', 'src', student.photo);
        this.updateElement('profile-name', 'textContent', student.name);
        this.updateElement('profile-student-id', 'textContent', student.id);
        this.updateElement('profile-course', 'textContent', student.course);
        this.updateElement('profile-year', 'textContent', student.year);

        // Update status badge
        const statusBadge = document.getElementById('profile-status-badge');
        if (statusBadge) {
            statusBadge.className = `badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`;
            statusBadge.innerHTML = `<i class="fas ${student.status === 'Active' ? 'fa-check-circle' : 'fa-pause-circle'} me-1"></i>${student.status}`;
        }

        // Update personal information
        this.updateElement('info-full-name', 'textContent', student.name);
        this.updateElement('info-email', 'textContent', student.email);
        this.updateElement('info-phone', 'textContent', student.phone);
        this.updateElement('info-dob', 'textContent', this.formatDate(student.dob));
        this.updateElement('info-gender', 'textContent', student.gender);
        this.updateElement('info-blood-group', 'textContent', student.bloodGroup);
        this.updateElement('info-address', 'textContent', student.address);

        // Update emergency contact
        this.updateElement('emergency-name', 'textContent', student.emergencyContact.name);
        this.updateElement('emergency-relation', 'textContent', student.emergencyContact.relation);
        this.updateElement('emergency-phone', 'textContent', student.emergencyContact.phone);

        // Update academic information
        this.updateElement('academic-student-id', 'textContent', student.id);
        this.updateElement('academic-course', 'textContent', student.course);
        this.updateElement('academic-specialization', 'textContent', student.specialization);
        this.updateElement('academic-year', 'textContent', student.year);
        this.updateElement('academic-admission-date', 'textContent', this.formatDate(student.admissionDate));
        this.updateElement('academic-graduation-date', 'textContent', this.formatDate(student.expectedGraduation));
        this.updateElement('academic-status', 'textContent', student.status);
        this.updateElement('academic-gpa', 'textContent', student.gpa.toFixed(2));

        // Update page title
        document.title = `${student.name} - Student Portal`;
    }

    loadAcademicPerformance(student) {
        // Mock GPA data over semesters
        const gpaData = {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
                label: 'GPA',
                data: [3.2, 3.4, 3.6, 3.7, 3.8, 3.85],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        };

        const ctx = document.getElementById('gpaChart');
        if (ctx) {
            this.gpaChart = new Chart(ctx, {
                type: 'line',
                data: gpaData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 2.0,
                            max: 4.0,
                            ticks: {
                                stepSize: 0.5
                            }
                        }
                    }
                }
            });
        }
    }

    loadRecentActivities(student) {
        const activities = [
            {
                icon: 'fa-book',
                text: 'Completed Assignment: Data Structures',
                time: '2 hours ago',
                color: 'success'
            },
            {
                icon: 'fa-calendar-check',
                text: 'Attended Lecture: Machine Learning',
                time: '1 day ago',
                color: 'info'
            },
            {
                icon: 'fa-certificate',
                text: 'Quiz Submitted: Algorithms',
                time: '2 days ago',
                color: 'warning'
            },
            {
                icon: 'fa-user-friends',
                text: 'Joined Study Group: AI Ethics',
                time: '3 days ago',
                color: 'primary'
            },
            {
                icon: 'fa-download',
                text: 'Downloaded Course Material',
                time: '1 week ago',
                color: 'secondary'
            }
        ];

        const timeline = document.getElementById('activity-timeline');
        if (timeline) {
            timeline.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon bg-${activity.color}">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.text}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    loadEnrolledCourses(student) {
        const courses = [
            {
                code: 'CS301',
                name: 'Data Structures & Algorithms',
                credits: 4,
                instructor: 'Dr. Sarah Wilson',
                grade: 'A',
                status: 'In Progress'
            },
            {
                code: 'CS401',
                name: 'Machine Learning',
                credits: 3,
                instructor: 'Prof. Michael Chen',
                grade: 'A-',
                status: 'In Progress'
            },
            {
                code: 'CS302',
                name: 'Database Systems',
                credits: 3,
                instructor: 'Dr. Jennifer Lee',
                grade: 'B+',
                status: 'Completed'
            },
            {
                code: 'CS350',
                name: 'Software Engineering',
                credits: 4,
                instructor: 'Prof. David Brown',
                grade: 'A',
                status: 'In Progress'
            },
            {
                code: 'MATH201',
                name: 'Discrete Mathematics',
                credits: 3,
                instructor: 'Dr. Lisa Garcia',
                grade: 'B+',
                status: 'Completed'
            }
        ];

        const tbody = document.getElementById('enrolled-courses');
        if (tbody) {
            tbody.innerHTML = courses.map(course => {
                const statusClass = course.status === 'Completed' ? 'success' : 'primary';
                const gradeClass = this.getGradeClass(course.grade);

                return `
                    <tr>
                        <td><strong>${course.code}</strong></td>
                        <td>${course.name}</td>
                        <td>${course.credits}</td>
                        <td>${course.instructor}</td>
                        <td><span class="badge bg-${gradeClass}">${course.grade}</span></td>
                        <td><span class="badge bg-${statusClass}">${course.status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }

    getGradeClass(grade) {
        if (grade.startsWith('A')) return 'success';
        if (grade.startsWith('B')) return 'info';
        if (grade.startsWith('C')) return 'warning';
        return 'danger';
    }

    updateElement(id, property, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined && value !== null) {
            element[property] = value;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    handlePhotoPreview(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profilePhoto = document.getElementById('profile-photo');
                if (profilePhoto) {
                    profilePhoto.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    autoSaveFormData() {
        // Auto-save form data to localStorage
        const formData = this.getFormData();
        localStorage.setItem('studentProfileDraft', JSON.stringify(formData));
    }

    getFormData() {
        return {
            fullName: document.getElementById('edit-full-name')?.value || '',
            email: document.getElementById('edit-email')?.value || '',
            phone: document.getElementById('edit-phone')?.value || '',
            dob: document.getElementById('edit-dob')?.value || '',
            gender: document.getElementById('edit-gender')?.value || '',
            bloodGroup: document.getElementById('edit-blood-group')?.value || '',
            address: document.getElementById('edit-address')?.value || '',
            emergencyName: document.getElementById('edit-emergency-name')?.value || '',
            emergencyRelation: document.getElementById('edit-emergency-relation')?.value || '',
            emergencyPhone: document.getElementById('edit-emergency-phone')?.value || ''
        };
    }

    setFormData(data) {
        document.getElementById('edit-full-name').value = data.fullName || '';
        document.getElementById('edit-email').value = data.email || '';
        document.getElementById('edit-phone').value = data.phone || '';
        document.getElementById('edit-dob').value = data.dob || '';
        document.getElementById('edit-gender').value = data.gender || '';
        document.getElementById('edit-blood-group').value = data.bloodGroup || '';
        document.getElementById('edit-address').value = data.address || '';
        document.getElementById('edit-emergency-name').value = data.emergencyName || '';
        document.getElementById('edit-emergency-relation').value = data.emergencyRelation || '';
        document.getElementById('edit-emergency-phone').value = data.emergencyPhone || '';
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(alert, container.firstChild);
        }
    }

    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(alert, container.firstChild);
        }

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    getMockStudents() {
        // Mock student data for testing
        return [
            {
                id: 'STU2024001',
                name: 'Emma Johnson',
                email: 'emma.johnson@university.edu',
                phone: '+1 (555) 123-4567',
                photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
                dob: '1998-03-15',
                gender: 'Female',
                bloodGroup: 'B+',
                address: '123 University Street, College Town, CT 06511',
                course: 'Computer Science',
                specialization: 'Artificial Intelligence',
                year: '3rd Year',
                status: 'Active',
                admissionDate: '2022-09-01',
                expectedGraduation: '2026-06-15',
                gpa: 3.85,
                emergencyContact: {
                    name: 'Robert Johnson',
                    relation: 'Father',
                    phone: '+1 (555) 987-6543'
                }
            }
        ];
    }
}

// Global functions for button handlers
function editProfile() {
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));

    // Load current student data into form
    if (window.studentProfile && window.studentProfile.currentStudent) {
        const student = window.studentProfile.currentStudent;
        window.studentProfile.setFormData({
            fullName: student.name,
            email: student.email,
            phone: student.phone,
            dob: student.dob,
            gender: student.gender,
            bloodGroup: student.bloodGroup,
            address: student.address,
            emergencyName: student.emergencyContact.name,
            emergencyRelation: student.emergencyContact.relation,
            emergencyPhone: student.emergencyContact.phone
        });
    }

    modal.show();
}

function updateProfile(event) {
    event.preventDefault();

    const formData = window.studentProfile.getFormData();

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone) {
        window.studentProfile.showError('Please fill in all required fields.');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        // Update current student data
        if (window.studentProfile.currentStudent) {
            window.studentProfile.currentStudent.name = formData.fullName;
            window.studentProfile.currentStudent.email = formData.email;
            window.studentProfile.currentStudent.phone = formData.phone;
            window.studentProfile.currentStudent.dob = formData.dob;
            window.studentProfile.currentStudent.gender = formData.gender;
            window.studentProfile.currentStudent.bloodGroup = formData.bloodGroup;
            window.studentProfile.currentStudent.address = formData.address;
            window.studentProfile.currentStudent.emergencyContact.name = formData.emergencyName;
            window.studentProfile.currentStudent.emergencyContact.relation = formData.emergencyRelation;
            window.studentProfile.currentStudent.emergencyContact.phone = formData.emergencyPhone;

            // Refresh display
            window.studentProfile.displayStudentInfo(window.studentProfile.currentStudent);
        }

        // Clear draft data
        localStorage.removeItem('studentProfileDraft');

        // Close modal and show success
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();

        window.studentProfile.showSuccess('Profile updated successfully!');
    }, 500);
}

function generateIDCard() {
    if (window.studentProfile && window.studentProfile.currentStudent) {
        if (window.IDCardGenerator) {
            window.IDCardGenerator.generateCard(window.studentProfile.currentStudent);
        } else {
            console.error('ID Card Generator not available');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.studentProfile = new StudentProfile();
});