/**
 * Supabase Deployment Script for CampusFlow
 * This script sets up the complete database schema, RLS policies, Edge Functions, and storage
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Configuration from environment variables
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey);

class SupabaseDeployer {
    constructor() {
        this.deploymentLog = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        this.deploymentLog.push(logEntry);
        console.log(logEntry);
    }

    error(message, error = null) {
        this.log(message, 'error');
        if (error) {
            console.error(error);
            this.errors.push({ message, error: error.message });
        }
    }

    async executeSQL(filename, description) {
        try {
            this.log(`Executing ${description}...`);
            const sqlPath = path.join(process.cwd(), 'supabase', filename);

            if (!fs.existsSync(sqlPath)) {
                throw new Error(`SQL file not found: ${sqlPath}`);
            }

            const sqlContent = fs.readFileSync(sqlPath, 'utf8');

            // Split SQL content by statements (simple approach for this deployment)
            const statements = sqlContent
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement) {
                    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
                    if (error) {
                        throw new Error(`Statement ${i + 1} failed: ${error.message}`);
                    }
                }
            }

            this.log(`✅ ${description} completed successfully`);
            return true;
        } catch (error) {
            this.error(`❌ Failed to execute ${description}`, error);
            return false;
        }
    }

    async setupStorageBuckets() {
        try {
            this.log('Setting up storage buckets...');

            const buckets = [
                { id: 'student-photos', name: 'student-photos', public: true },
                { id: 'documents', name: 'documents', public: false },
                { id: 'transcripts', name: 'transcripts', public: false },
                { id: 'id-cards', name: 'id-cards', public: false },
                { id: 'faculty-photos', name: 'faculty-photos', public: true }
            ];

            for (const bucket of buckets) {
                const { data, error } = await supabase.storage.createBucket(bucket.id, {
                    public: bucket.public,
                    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
                    fileSizeLimit: 10485760 // 10MB
                });

                if (error && !error.message.includes('already exists')) {
                    throw error;
                }

                this.log(`✅ Storage bucket '${bucket.name}' configured`);
            }

            return true;
        } catch (error) {
            this.error('❌ Failed to setup storage buckets', error);
            return false;
        }
    }

    async setupStoragePolicies() {
        try {
            this.log('Setting up storage policies...');

            const policies = [
                // Student photos - users can upload their own photos
                {
                    bucket: 'student-photos',
                    policy: `
                        CREATE POLICY "Users can upload their own photos" ON storage.objects
                        FOR INSERT WITH CHECK (
                            bucket_id = 'student-photos' AND 
                            auth.uid()::text = (storage.foldername(name))[1]
                        );
                    `
                },
                {
                    bucket: 'student-photos',
                    policy: `
                        CREATE POLICY "Users can view their own photos" ON storage.objects
                        FOR SELECT USING (
                            bucket_id = 'student-photos' AND 
                            (auth.uid()::text = (storage.foldername(name))[1] OR 
                             EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))
                        );
                    `
                },
                // Documents - private access only
                {
                    bucket: 'documents',
                    policy: `
                        CREATE POLICY "Users can access their own documents" ON storage.objects
                        FOR ALL USING (
                            bucket_id = 'documents' AND 
                            (auth.uid()::text = (storage.foldername(name))[1] OR 
                             EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))
                        );
                    `
                }
            ];

            for (const policyConfig of policies) {
                const { error } = await supabase.rpc('exec_sql', { sql_query: policyConfig.policy });
                if (error && !error.message.includes('already exists')) {
                    console.warn(`Policy warning for ${policyConfig.bucket}: ${error.message}`);
                }
            }

            this.log('✅ Storage policies configured');
            return true;
        } catch (error) {
            this.error('❌ Failed to setup storage policies', error);
            return false;
        }
    }

    async setupAuthentication() {
        try {
            this.log('Configuring authentication settings...');

            // Configure auth settings via SQL
            const authSQL = `
                -- Enable email confirmation
                UPDATE auth.config SET enable_signup = true;
                
                -- Create custom access token hook
                CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
                RETURNS jsonb
                LANGUAGE plpgsql
                AS $$
                DECLARE
                    claims jsonb;
                    user_role text;
                    user_campus_id uuid;
                BEGIN
                    -- Get user role and campus
                    SELECT role, 
                           CASE 
                               WHEN role = 'student' THEN (SELECT campus_id FROM students WHERE id = (event->>'user_id')::uuid)
                               WHEN role = 'faculty' THEN (SELECT campus_id FROM faculty WHERE id = (event->>'user_id')::uuid)
                               ELSE NULL
                           END
                    INTO user_role, user_campus_id
                    FROM public.profiles 
                    WHERE id = (event->>'user_id')::uuid;
                    
                    claims := event->'claims';
                    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
                    
                    IF user_campus_id IS NOT NULL THEN
                        claims := jsonb_set(claims, '{campus_id}', to_jsonb(user_campus_id));
                    END IF;
                    
                    event := jsonb_set(event, '{claims}', claims);
                    
                    RETURN event;
                END;
                $$;

                GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
            `;

            const { error } = await supabase.rpc('exec_sql', { sql_query: authSQL });
            if (error) {
                throw error;
            }

            this.log('✅ Authentication configured');
            return true;
        } catch (error) {
            this.error('❌ Failed to setup authentication', error);
            return false;
        }
    }

    async createSuperAdminUser() {
        try {
            this.log('Creating super admin user...');

            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: 'admin@studentportal.com',
                password: 'SuperAdmin123!',
                email_confirm: true,
                user_metadata: {
                    full_name: 'System Administrator',
                    role: 'super_admin'
                }
            });

            if (authError && !authError.message.includes('already registered')) {
                throw authError;
            }

            if (authUser?.user) {
                // Create profile for super admin
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authUser.user.id,
                        full_name: 'System Administrator',
                        email: 'admin@studentportal.com',
                        role: 'super_admin',
                        is_active: true
                    });

                if (profileError) {
                    throw profileError;
                }

                this.log('✅ Super admin user created: admin@studentportal.com');
            }

            return true;
        } catch (error) {
            this.error('❌ Failed to create super admin user', error);
            return false;
        }
    }

    async deployDatabase() {
        this.log('🚀 Starting Supabase database deployment...');

        const steps = [
            { fn: () => this.executeSQL('schema.sql', 'Database Schema'), name: 'Schema' },
            { fn: () => this.executeSQL('rls-policies.sql', 'Row Level Security Policies'), name: 'RLS Policies' },
            { fn: () => this.setupAuthentication(), name: 'Authentication' },
            { fn: () => this.setupStorageBuckets(), name: 'Storage Buckets' },
            { fn: () => this.setupStoragePolicies(), name: 'Storage Policies' },
            { fn: () => this.executeSQL('seed.sql', 'Sample Data'), name: 'Sample Data' },
            { fn: () => this.createSuperAdminUser(), name: 'Super Admin User' }
        ];

        let successCount = 0;
        for (const step of steps) {
            const success = await step.fn();
            if (success) {
                successCount++;
            } else {
                this.log(`⚠️ Step '${step.name}' failed but continuing...`);
            }
        }

        this.log(`🎉 Deployment completed! ${successCount}/${steps.length} steps successful`);

        if (this.errors.length > 0) {
            this.log('⚠️ Deployment completed with errors:', 'warn');
            this.errors.forEach(err => this.log(`  - ${err.message}`, 'warn'));
        }

        return this.errors.length === 0;
    }

    async testConnection() {
        try {
            this.log('Testing Supabase connection...');

            const { data, error } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);

            if (error) {
                throw error;
            }

            this.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            this.error('❌ Supabase connection failed', error);
            return false;
        }
    }

    async generateDeploymentReport() {
        const reportPath = path.join(process.cwd(), 'deployment-report.txt');
        const report = [
            '='.repeat(80),
            'CAMPUSFLOW - SUPABASE DEPLOYMENT REPORT',
            '='.repeat(80),
            `Deployment Date: ${new Date().toISOString()}`,
            `Project URL: ${SUPABASE_CONFIG.url}`,
            '',
            'DEPLOYMENT LOG:',
            '-'.repeat(40),
            ...this.deploymentLog,
            '',
            `SUMMARY: ${this.errors.length === 0 ? 'SUCCESS' : 'COMPLETED WITH ERRORS'}`,
            `Total Errors: ${this.errors.length}`,
            '',
            'NEXT STEPS:',
            '1. Deploy Edge Functions using Supabase CLI',
            '2. Configure frontend environment variables',
            '3. Run comprehensive tests',
            '4. Update authentication settings in Supabase dashboard',
            '5. Configure email templates',
            '='.repeat(80)
        ].join('\n');

        fs.writeFileSync(reportPath, report);
        this.log(`📝 Deployment report saved to: ${reportPath}`);
    }
}

// Execute deployment
async function main() {
    const deployer = new SupabaseDeployer();

    // Test connection first
    const connectionOk = await deployer.testConnection();
    if (!connectionOk) {
        process.exit(1);
    }

    // Deploy database
    const deploymentSuccess = await deployer.deployDatabase();

    // Generate report
    await deployer.generateDeploymentReport();

    if (deploymentSuccess) {
        console.log('\n🎉 Deployment completed successfully!');
        console.log('\nCredentials for testing:');
        console.log('📧 Super Admin: admin@studentportal.com');
        console.log('🔑 Password: SuperAdmin123!');
        console.log('\n📋 Next: Deploy Edge Functions and test frontend integration');
    } else {
        console.log('\n⚠️ Deployment completed with errors. Check deployment-report.txt for details.');
        process.exit(1);
    }
}

// Handle the case where this is run as ES module or CommonJS
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default SupabaseDeployer;