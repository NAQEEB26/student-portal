# CampusFlow - Supabase Backend Setup Guide

This guide will help you set up the complete Supabase backend for CampusFlow.

## Prerequisites

- Node.js (v16 or higher)
- Supabase CLI
- A Supabase account

## Installation Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: Student Portal
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users

### 3. Initialize Supabase Locally

```bash
# Navigate to your project directory
cd Student_Portal

# Initialize Supabase
supabase init

# Link to your remote project
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy Database Schema

```bash
# Apply the database schema
supabase db push

# Or if you prefer to run the SQL files manually:
supabase db reset --db-url "YOUR_DATABASE_URL"
```

### 5. Deploy Edge Functions

```bash
# Deploy all Edge Functions
supabase functions deploy student-management
supabase functions deploy faculty-management
supabase functions deploy course-management

# Set environment variables for Edge Functions
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 6. Configure Authentication

1. In Supabase Dashboard → Authentication → Settings:
   - Enable Email authentication
   - Set Site URL to your frontend URL
   - Configure redirect URLs

2. Add custom claims for role-based access:
   ```sql
   -- In SQL Editor
   CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
   RETURNS jsonb
   LANGUAGE plpgsql
   AS $$
   DECLARE
     claims jsonb;
     user_role text;
   BEGIN
     SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;
     
     claims := event->'claims';
     claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
     event := jsonb_set(event, '{claims}', claims);
     
     RETURN event;
   END;
   $$;
   
   GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
   ```

### 7. Set Up Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('student-photos', 'student-photos', true),
('documents', 'documents', false),
('transcripts', 'transcripts', false),
('id-cards', 'id-cards', false);

-- Set up storage policies
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'student-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'student-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 8. Configure Frontend Integration

1. Update your frontend configuration with Supabase credentials:

```javascript
// In your main JavaScript file, replace the existing configuration
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

2. Include the Supabase integration file in your HTML:

```html
<!-- Add before closing </body> tag -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/js/supabase-integration.js"></script>
```

## Configuration Details

### Environment Variables

Create a `.env` file in your project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Configuration

The system includes the following tables:
- **profiles**: User profiles and authentication
- **campuses**: Campus information
- **departments**: Academic departments
- **academic_programs**: Degree programs
- **courses**: Course catalog
- **course_offerings**: Scheduled courses
- **students**: Student records
- **faculty**: Faculty records
- **enrollments**: Student enrollments
- **grades**: Grade records
- **rooms**: Classroom information
- **notifications**: System notifications
- **audit_logs**: System audit trail

### Row Level Security (RLS)

The system implements comprehensive RLS policies:
- **Role-based access**: Students, Faculty, Admin, Super Admin
- **Campus-based isolation**: Users can only access data from their campus
- **Hierarchical permissions**: Admins can manage their campus, Super Admins can manage all

### Edge Functions

Three main Edge Functions handle business logic:

1. **student-management**: Student CRUD operations, enrollment, GPA calculation
2. **faculty-management**: Faculty management, course assignments, workload tracking
3. **course-management**: Course creation, scheduling, analytics

## Testing the Setup

### 1. Verify Database Connection

```bash
supabase db status
```

### 2. Test Edge Functions

```bash
# Test student management
curl -X POST 'YOUR_SUPABASE_URL/functions/v1/student-management' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"action": "test"}'
```

### 3. Seed Test Data

```bash
# Run the seed script
supabase db reset --db-url "YOUR_DATABASE_URL"
```

## Production Deployment

### 1. Security Checklist

- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up backup schedule
- [ ] Enable database encryption
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts

### 2. Performance Optimization

- [ ] Configure connection pooling
- [ ] Set up read replicas (if needed)
- [ ] Optimize database indexes
- [ ] Configure caching
- [ ] Set up CDN for static files

### 3. Monitoring Setup

1. Enable Supabase monitoring
2. Set up custom alerts for:
   - High database load
   - Edge function errors
   - Authentication failures
   - Storage quota limits

## Common Issues and Solutions

### 1. Edge Function Deployment Fails

**Problem**: Function deployment timeout
**Solution**: 
```bash
supabase functions deploy --no-verify-jwt function-name
```

### 2. RLS Policies Too Restrictive

**Problem**: Users can't access their own data
**Solution**: Check and update RLS policies in `supabase/rls-policies.sql`

### 3. Authentication Issues

**Problem**: Users can't sign in
**Solution**: 
- Verify Site URL in Supabase Dashboard
- Check email confirmation settings
- Ensure custom claims function is properly deployed

### 4. Storage Upload Fails

**Problem**: File uploads return 403 errors
**Solution**: 
- Verify storage policies
- Check bucket permissions
- Ensure proper file path structure

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Monitor database performance
   - Review error logs
   - Check storage usage

2. **Monthly**:
   - Update dependencies
   - Review security policies
   - Backup verification

3. **Quarterly**:
   - Performance optimization review
   - Security audit
   - Capacity planning

### Getting Help

- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- Project Repository: [Your repository URL]

## Advanced Features

### Real-time Subscriptions

The system supports real-time updates for:
- New enrollments
- Grade updates
- Notification delivery
- Course schedule changes

### File Management

Secure file handling for:
- Student photos
- Academic documents
- Transcripts
- ID cards

### Analytics and Reporting

Built-in analytics for:
- Enrollment trends
- Course performance
- Faculty workload
- Campus statistics

---

**Note**: This backend system is designed to scale with your institution's needs. The modular architecture allows for easy extension and customization based on specific requirements.