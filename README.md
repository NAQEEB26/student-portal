# CampusFlow

An open-source campus and student management platform built with HTML5, JavaScript, and Supabase.
Designed for schools, colleges, and universities to manage students, faculty, academics, finance, and campus operations in one modern system.

## 🚀 Live Demo
- **Production URL**: Coming soon after Vercel deployment
- **Backend**: Supabase PostgreSQL Database
- **Status**: Production Ready ✅

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- Role-based access control (Student, Faculty, Admin)
- Row Level Security (RLS) policies
- Secure session management

### 👨‍🎓 Student Management
- Student registration and profiles
- Academic records tracking
- GPA calculation and reporting
- Student ID card generation
- Enrollment management

### 👨‍🏫 Faculty Management
- Faculty profiles and assignments
- Course management
- Student progress tracking
- Department organization

### 📚 Academic Operations
- Course catalog management
- Assignment submission system
- Attendance tracking
- Grade management
- Academic scheduling

### 🏫 Campus Management
- Multi-campus support
- Building and room management
- Department organization
- Resource allocation

### 📊 Reporting & Analytics
- Student performance reports
- Enrollment statistics
- Financial reporting
- Custom analytics dashboard

### 💰 Financial Management
- Fee management and billing
- Payment tracking
- Financial aid administration
- Revenue reporting

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Database**: PostgreSQL with Row Level Security

## 📈 System Status

- **Tests**: 41/41 Passing ✅
- **Security**: RLS Policies Active ✅
- **Performance**: Optimized ✅
- **Production Ready**: Yes ✅

## 🚀 Quick Start

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Deploy the database schema (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
5. Open `frontend/index.html` in your browser
6. Register a new account or login

## 📱 Pages & Features

- **Dashboard**: `index.html` - Main dashboard
- **Authentication**: `pages/login.html`, `pages/register.html`
- **Students**: `pages/students.html` - Student management
- **Faculty**: `pages/faculty.html` - Faculty operations
- **Courses**: `pages/courses.html` - Course management
- **Administration**: `pages/administration.html` - System admin
- **Reports**: `pages/reports.html` - Analytics & reporting
- **Finance**: `pages/finance.html` - Financial management

## 🔧 Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Validate production readiness
npm run validate-production

# Deploy to production
vercel --prod
```

## 📊 Database Schema

- 15+ interconnected tables
- Comprehensive relationships
- Performance-optimized indexes
- Full audit trail capability

## 🔒 Security Features

- Row Level Security (RLS)
- JWT-based authentication
- Encrypted data storage
- Secure file uploads
- Access control policies

## 📞 Support

For technical support or questions about CampusFlow, please refer to the documentation or contact the development team.

---

**Built with ❤️ for educational institutions worldwide | [CampusFlow](https://github.com/NAQEEB26/CampusFlow)**