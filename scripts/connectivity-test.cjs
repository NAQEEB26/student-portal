/**
 * Simple Connectivity Test for Supabase Project
 * Tests basic network connectivity and project existence
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Configuration from supabase_details.txt
const SUPABASE_CONFIG = {
    url: 'https://pamkllweipcafpylvsdf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbWtsbHdlaXBjYWZweWx2c2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzI0OTYsImV4cCI6MjA3NzYwODQ5Nn0.z5-L-lTHMREompTZ8b4RdslpoX8XknnCR_-GbxSYHZA',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbWtsbHdlaXBjYWZweWx2c2RmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAzMjQ5NiwiZXhwIjoyMDc3NjA4NDk2fQ.rtj1T3By28PoRJk8pS07IeqG9xQ-QEENfiUKWhVihqg'
};

class ConnectivityTester {
    async runTests() {
        console.log('🔍 SUPABASE CONNECTIVITY DIAGNOSTIC');
        console.log('='.repeat(50));
        console.log(`Testing: ${SUPABASE_CONFIG.url}`);
        console.log('='.repeat(50));

        await this.testDNSResolution();
        await this.testHTTPSConnectivity();
        await this.testSupabaseAPIEndpoint();
        await this.testSupabaseClient();

        console.log('\n' + '='.repeat(50));
        console.log('DIAGNOSTIC COMPLETE');
        console.log('='.repeat(50));
    }

    testDNSResolution() {
        return new Promise((resolve) => {
            console.log('\n🌐 Testing DNS Resolution...');

            const dns = require('dns');
            const hostname = 'pamkllweipcafpylvsdf.supabase.co';

            dns.lookup(hostname, (err, address, family) => {
                if (err) {
                    console.log(`❌ DNS Resolution FAILED: ${err.message}`);
                    console.log('   This indicates the Supabase project may not exist or URL is incorrect');
                } else {
                    console.log(`✅ DNS Resolution SUCCESS: ${hostname} -> ${address}`);
                }
                resolve();
            });
        });
    }

    testHTTPSConnectivity() {
        return new Promise((resolve) => {
            console.log('\n📡 Testing HTTPS Connectivity...');

            const req = https.request(SUPABASE_CONFIG.url, { method: 'HEAD', timeout: 10000 }, (res) => {
                console.log(`✅ HTTPS Connection SUCCESS: Status ${res.statusCode}`);
                resolve();
            });

            req.on('error', (err) => {
                console.log(`❌ HTTPS Connection FAILED: ${err.message}`);
                resolve();
            });

            req.on('timeout', () => {
                console.log(`❌ HTTPS Connection TIMEOUT`);
                req.destroy();
                resolve();
            });

            req.end();
        });
    }

    testSupabaseAPIEndpoint() {
        return new Promise((resolve) => {
            console.log('\n🔌 Testing Supabase API Endpoint...');

            const apiUrl = `${SUPABASE_CONFIG.url}/rest/v1/`;
            const req = https.request(apiUrl, {
                method: 'GET',
                timeout: 10000,
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }, (res) => {
                console.log(`✅ Supabase API Endpoint: Status ${res.statusCode}`);
                resolve();
            });

            req.on('error', (err) => {
                console.log(`❌ Supabase API Endpoint FAILED: ${err.message}`);
                resolve();
            });

            req.on('timeout', () => {
                console.log(`❌ Supabase API Endpoint TIMEOUT`);
                req.destroy();
                resolve();
            });

            req.end();
        });
    }

    async testSupabaseClient() {
        console.log('\n🧪 Testing Supabase Client...');

        try {
            const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

            // Test basic client creation
            console.log('✅ Supabase client created successfully');

            // Test a simple operation
            const { data, error } = await supabase.from('_non_existent_table_').select('*').limit(1);

            if (error) {
                if (error.message.includes('relation') || error.message.includes('does not exist')) {
                    console.log('✅ Supabase API responding (table not found is expected)');
                } else {
                    console.log(`⚠️ Supabase API Error: ${error.message}`);
                }
            } else {
                console.log('✅ Supabase API responding successfully');
            }

        } catch (err) {
            console.log(`❌ Supabase Client FAILED: ${err.message}`);
        }
    }
}

// Run diagnostics
const tester = new ConnectivityTester();
tester.runTests().catch(console.error);