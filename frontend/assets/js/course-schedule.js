/**
 * Course Schedule Management
 * Handles course scheduling, calendar integration, and room management
 */

class CourseSchedule {
    constructor() {
        this.currentCourse = null;
        this.calendar = null;
        this.scheduleEvents = [];
        this.init();
    }

    init() {
        this.createScheduleModalHTML();
        this.setupEventListeners();
    }

    createScheduleModalHTML() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <!-- Course Schedule Modal -->
            <div class="modal fade" id="courseScheduleModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-calendar me-2"></i>Course Schedule Management
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Course Info Header -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-info text-white">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-md-8">
                                                    <h5 class="card-title mb-1" id="schedule-course-name">Course Name</h5>
                                                    <p class="card-text mb-0">
                                                        <span id="schedule-course-code">COURSE001</span> | 
                                                        <span id="schedule-instructor">Instructor Name</span> | 
                                                        <span id="schedule-room">Room Location</span>
                                                    </p>
                                                </div>
                                                <div class="col-md-4 text-end">
                                                    <div class="schedule-summary">
                                                        <div class="h6 mb-0" id="schedule-time-display">Time Display</div>
                                                        <small id="schedule-days-display">Days Display</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Schedule Tabs -->
                            <ul class="nav nav-tabs" id="scheduleTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="calendar-tab" data-bs-toggle="tab" 
                                        data-bs-target="#calendar-pane" type="button" role="tab">
                                        <i class="fas fa-calendar-alt me-2"></i>Calendar View
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="schedule-settings-tab" data-bs-toggle="tab" 
                                        data-bs-target="#schedule-settings-pane" type="button" role="tab">
                                        <i class="fas fa-cog me-2"></i>Schedule Settings
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="conflicts-tab" data-bs-toggle="tab" 
                                        data-bs-target="#conflicts-pane" type="button" role="tab">
                                        <i class="fas fa-exclamation-triangle me-2"></i>Conflicts 
                                        <span class="badge bg-danger ms-2" id="conflicts-count">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="room-booking-tab" data-bs-toggle="tab" 
                                        data-bs-target="#room-booking-pane" type="button" role="tab">
                                        <i class="fas fa-door-open me-2"></i>Room Booking
                                    </button>
                                </li>
                            </ul>

                            <!-- Tab Content -->
                            <div class="tab-content mt-3" id="scheduleTabContent">
                                <!-- Calendar View Tab -->
                                <div class="tab-pane fade show active" id="calendar-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <div class="card">
                                                <div class="card-header d-flex justify-content-between align-items-center">
                                                    <h6 class="card-title mb-0">Course Calendar</h6>
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary" onclick="CourseSchedule.exportSchedule()">
                                                            <i class="fas fa-download me-1"></i>Export
                                                        </button>
                                                        <button class="btn btn-sm btn-primary" onclick="CourseSchedule.addScheduleEvent()">
                                                            <i class="fas fa-plus me-1"></i>Add Event
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="card-body">
                                                    <div id="course-calendar" style="height: 500px;">
                                                        <!-- Calendar will be rendered here -->
                                                        <div class="d-flex justify-content-center align-items-center h-100">
                                                            <div class="text-center">
                                                                <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                                                                <p class="text-muted">Course calendar will be displayed here</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Quick Info</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="schedule-info-item mb-3">
                                                        <label class="form-label">Total Sessions</label>
                                                        <div class="h5 text-primary" id="total-sessions">0</div>
                                                    </div>
                                                    <div class="schedule-info-item mb-3">
                                                        <label class="form-label">Completed</label>
                                                        <div class="h5 text-success" id="completed-sessions">0</div>
                                                    </div>
                                                    <div class="schedule-info-item mb-3">
                                                        <label class="form-label">Remaining</label>
                                                        <div class="h5 text-warning" id="remaining-sessions">0</div>
                                                    </div>
                                                    <div class="schedule-info-item mb-3">
                                                        <label class="form-label">Next Session</label>
                                                        <div class="small" id="next-session">Loading...</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="card mt-3">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Upcoming Events</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div id="upcoming-events-list">
                                                        <!-- Upcoming events will be listed here -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Schedule Settings Tab -->
                                <div class="tab-pane fade" id="schedule-settings-pane" role="tabpanel">
                                    <form id="scheduleSettingsForm">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h6 class="text-primary mb-3">Basic Schedule</h6>
                                                <div class="mb-3">
                                                    <label class="form-label">Meeting Days</label>
                                                    <div class="row">
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Monday" id="settings-day-monday">
                                                                <label class="form-check-label" for="settings-day-monday">Mon</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Tuesday" id="settings-day-tuesday">
                                                                <label class="form-check-label" for="settings-day-tuesday">Tue</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Wednesday" id="settings-day-wednesday">
                                                                <label class="form-check-label" for="settings-day-wednesday">Wed</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Thursday" id="settings-day-thursday">
                                                                <label class="form-check-label" for="settings-day-thursday">Thu</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Friday" id="settings-day-friday">
                                                                <label class="form-check-label" for="settings-day-friday">Fri</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-4">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="Saturday" id="settings-day-saturday">
                                                                <label class="form-check-label" for="settings-day-saturday">Sat</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-6">
                                                        <div class="mb-3">
                                                            <label class="form-label">Start Time</label>
                                                            <input type="time" class="form-control" id="settings-start-time">
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Time</label>
                                                            <input type="time" class="form-control" id="settings-end-time">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Room/Location</label>
                                                    <input type="text" class="form-control" id="settings-room" placeholder="e.g., Science Building - Room 101">
                                                </div>
                                                <div class="row">
                                                    <div class="col-6">
                                                        <div class="mb-3">
                                                            <label class="form-label">Start Date</label>
                                                            <input type="date" class="form-control" id="settings-start-date">
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="mb-3">
                                                            <label class="form-label">End Date</label>
                                                            <input type="date" class="form-control" id="settings-end-date">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <h6 class="text-primary mb-3">Advanced Settings</h6>
                                                <div class="mb-3">
                                                    <label class="form-label">Recurrence Pattern</label>
                                                    <select class="form-select" id="settings-recurrence">
                                                        <option value="weekly">Weekly</option>
                                                        <option value="biweekly">Bi-weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Break Periods</label>
                                                    <textarea class="form-control" id="settings-breaks" rows="3" 
                                                        placeholder="Enter dates when classes will not meet (one per line)"></textarea>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Special Sessions</label>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="settings-makeup-sessions">
                                                        <label class="form-check-label" for="settings-makeup-sessions">
                                                            Allow makeup sessions
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="settings-virtual-sessions">
                                                        <label class="form-check-label" for="settings-virtual-sessions">
                                                            Include virtual sessions
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Notification Settings</label>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="settings-notify-students">
                                                        <label class="form-check-label" for="settings-notify-students">
                                                            Notify students of schedule changes
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="settings-notify-instructor">
                                                        <label class="form-check-label" for="settings-notify-instructor">
                                                            Notify instructor of conflicts
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <button type="button" class="btn btn-primary" onclick="CourseSchedule.updateSchedule()">
                                                    <i class="fas fa-save me-2"></i>Update Schedule
                                                </button>
                                                <button type="button" class="btn btn-secondary ms-2" onclick="CourseSchedule.previewSchedule()">
                                                    <i class="fas fa-eye me-2"></i>Preview Changes
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <!-- Conflicts Tab -->
                                <div class="tab-pane fade" id="conflicts-pane" role="tabpanel">
                                    <div class="alert alert-warning">
                                        <i class="fas fa-exclamation-triangle me-2"></i>
                                        <strong>Schedule Conflicts Detected</strong> - Review and resolve the following conflicts:
                                    </div>
                                    <div id="conflicts-list">
                                        <!-- Conflicts will be listed here -->
                                    </div>
                                </div>

                                <!-- Room Booking Tab -->
                                <div class="tab-pane fade" id="room-booking-pane" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Available Rooms</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="mb-3">
                                                        <input type="text" class="form-control" id="room-search" 
                                                            placeholder="Search rooms by name, building, capacity...">
                                                    </div>
                                                    <div id="available-rooms-list" style="max-height: 400px; overflow-y: auto;">
                                                        <!-- Available rooms will be listed here -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="card-title mb-0">Room Details</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div id="room-details">
                                                        <div class="text-center text-muted">
                                                            <i class="fas fa-door-open fa-3x mb-3"></i>
                                                            <p>Select a room to view details and availability</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="CourseSchedule.saveScheduleChanges()">
                                <i class="fas fa-save me-2"></i>Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
    }

    setupEventListeners() {
        // Room search
        const roomSearch = document.getElementById('room-search');
        if (roomSearch) {
            roomSearch.addEventListener('input', this.handleRoomSearch.bind(this));
        }
    }

    showScheduleModal(courseId) {
        const course = window.coursesManager?.getCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;
        this.populateScheduleInfo(course);
        this.loadScheduleData(course);
        this.loadRoomData();
        this.checkScheduleConflicts();

        const modal = new bootstrap.Modal(document.getElementById('courseScheduleModal'));
        modal.show();
    }

    populateScheduleInfo(course) {
        document.getElementById('schedule-course-name').textContent = course.name;
        document.getElementById('schedule-course-code').textContent = course.code;
        document.getElementById('schedule-instructor').textContent = course.instructor.name;
        document.getElementById('schedule-room').textContent = course.schedule.room;
        document.getElementById('schedule-time-display').textContent = course.schedule.time;
        document.getElementById('schedule-days-display').textContent = course.schedule.days.join(', ');
    }

    loadScheduleData(course) {
        // Populate schedule settings form
        this.populateScheduleForm(course);

        // Load session statistics
        this.loadSessionStats();

        // Load upcoming events
        this.loadUpcomingEvents();
    }

    populateScheduleForm(course) {
        // Set meeting days
        course.schedule.days.forEach(day => {
            const checkbox = document.getElementById(`settings-day-${day.toLowerCase()}`);
            if (checkbox) checkbox.checked = true;
        });

        // Set times
        if (course.schedule.time) {
            const timeRange = course.schedule.time.split(' - ');
            if (timeRange.length === 2) {
                document.getElementById('settings-start-time').value = this.convertToMilitaryTime(timeRange[0]);
                document.getElementById('settings-end-time').value = this.convertToMilitaryTime(timeRange[1]);
            }
        }

        // Set other fields
        document.getElementById('settings-room').value = course.schedule.room || '';
        document.getElementById('settings-start-date').value = course.startDate || '';
        document.getElementById('settings-end-date').value = course.endDate || '';
    }

    loadSessionStats() {
        // Mock session statistics
        document.getElementById('total-sessions').textContent = '45';
        document.getElementById('completed-sessions').textContent = '12';
        document.getElementById('remaining-sessions').textContent = '33';
        document.getElementById('next-session').textContent = 'Monday, Nov 4, 2025 at 9:00 AM';
    }

    loadUpcomingEvents() {
        const upcomingEvents = [
            {
                title: 'Regular Class',
                date: '2025-11-04',
                time: '09:00 AM',
                type: 'class'
            },
            {
                title: 'Midterm Exam',
                date: '2025-11-08',
                time: '09:00 AM',
                type: 'exam'
            },
            {
                title: 'Guest Lecture',
                date: '2025-11-11',
                time: '09:00 AM',
                type: 'special'
            }
        ];

        const container = document.getElementById('upcoming-events-list');
        container.innerHTML = upcomingEvents.map(event => `
            <div class="event-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div>
                    <div class="fw-bold">${event.title}</div>
                    <small class="text-muted">${this.formatDate(event.date)} at ${event.time}</small>
                </div>
                <span class="badge bg-${this.getEventTypeBadge(event.type)}">${event.type}</span>
            </div>
        `).join('');
    }

    loadRoomData() {
        const availableRooms = [
            {
                id: 'ROOM001',
                name: 'Science Building - Room 101',
                building: 'Science Building',
                capacity: 30,
                features: ['Projector', 'Whiteboard', 'Computer'],
                availability: 'Available'
            },
            {
                id: 'ROOM002',
                name: 'Liberal Arts - Room 205',
                building: 'Liberal Arts',
                capacity: 25,
                features: ['Projector', 'Audio System'],
                availability: 'Available'
            },
            {
                id: 'ROOM003',
                name: 'Computer Lab - Room 301',
                building: 'Technology Center',
                capacity: 20,
                features: ['Computers', 'Projector', 'Internet'],
                availability: 'Occupied'
            }
        ];

        const container = document.getElementById('available-rooms-list');
        container.innerHTML = availableRooms.map(room => `
            <div class="room-item card mb-2 ${room.availability === 'Available' ? '' : 'bg-light'}" 
                data-room-id="${room.id}" onclick="CourseSchedule.selectRoom('${room.id}')">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="card-title mb-1">${room.name}</h6>
                            <p class="card-text small text-muted mb-1">Capacity: ${room.capacity} students</p>
                            <div class="features">
                                ${room.features.map(feature => `<span class="badge bg-secondary me-1">${feature}</span>`).join('')}
                            </div>
                        </div>
                        <span class="badge bg-${room.availability === 'Available' ? 'success' : 'danger'}">${room.availability}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    checkScheduleConflicts() {
        const conflicts = [
            {
                type: 'Room Conflict',
                description: 'Room Science Building - Room 101 is already booked for Monday 9:00 AM - 10:00 AM',
                severity: 'high',
                suggestion: 'Consider changing room or time'
            },
            {
                type: 'Instructor Conflict',
                description: 'Dr. Sarah Wilson has another class at the same time',
                severity: 'medium',
                suggestion: 'Coordinate with instructor for schedule adjustment'
            }
        ];

        document.getElementById('conflicts-count').textContent = conflicts.length;

        const container = document.getElementById('conflicts-list');
        container.innerHTML = conflicts.map(conflict => `
            <div class="alert alert-${conflict.severity === 'high' ? 'danger' : 'warning'} d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="alert-heading">${conflict.type}</h6>
                    <p class="mb-1">${conflict.description}</p>
                    <small class="text-muted"><strong>Suggestion:</strong> ${conflict.suggestion}</small>
                </div>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary">Resolve</button>
                    <button class="btn btn-sm btn-outline-secondary">Ignore</button>
                </div>
            </div>
        `).join('');
    }

    handleRoomSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        console.log('Searching rooms for:', searchTerm);
    }

    convertToMilitaryTime(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    getEventTypeBadge(type) {
        switch (type) {
            case 'class': return 'primary';
            case 'exam': return 'danger';
            case 'special': return 'info';
            default: return 'secondary';
        }
    }

    // Static methods for global access
    static selectRoom(roomId) {
        console.log('Selected room:', roomId);
        // Show room details
        const roomDetails = document.getElementById('room-details');
        roomDetails.innerHTML = `
            <h6>Room Details for ${roomId}</h6>
            <p>Detailed information about the selected room will be displayed here.</p>
        `;
    }

    static exportSchedule() {
        console.log('Export schedule');
    }

    static addScheduleEvent() {
        console.log('Add schedule event');
    }

    static updateSchedule() {
        console.log('Update schedule');
    }

    static previewSchedule() {
        console.log('Preview schedule changes');
    }

    static saveScheduleChanges() {
        console.log('Save schedule changes');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.CourseSchedule = new CourseSchedule();
});