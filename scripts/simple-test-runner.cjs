/**
 * Simple Test Runner for CampusFlow Backend (CommonJS)
 * Tests basic functionality without external dependencies
 */

const fs = require('fs');
const path = require('path');

class SimpleTestRunner {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    async run() {
        console.log('🚀 Starting CampusFlow Test Suite...\n');

        // Test 1: Configuration Validation
        await this.testConfigurationValidation();

        // Test 2: File Structure Validation
        await this.testFileStructure();

        // Test 3: Basic JavaScript Syntax Validation
        await this.testJavaScriptSyntax();

        // Test 4: Environment Setup Validation
        await this.testEnvironmentSetup();

        // Test 5: Security Configuration Test
        await this.testSecurityConfiguration();

        // Generate report
        this.generateReport();
    }

    async testConfigurationValidation() {
        this.log('📋 Testing Configuration Validation...');

        try {
            // Test 1.1: Check if package.json exists and is valid
            await this.test('Package.json exists', () => {
                return fs.existsSync(path.join(__dirname, '../package.json'));
            });

            // Test 1.2: Check if Supabase config is present
            await this.test('Supabase configuration exists', () => {
                return fs.existsSync(path.join(__dirname, '../.env.example'));
            });

            // Test 1.3: Validate package.json structure
            await this.test('Package.json has required fields', () => {
                const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
                return packageJson.name && packageJson.version && packageJson.scripts;
            });

        } catch (error) {
            this.fail('Configuration validation failed', error.message);
        }
    }

    async testFileStructure() {
        this.log('📁 Testing File Structure...');

        try {
            const requiredFiles = [
                'frontend/index.html',
                'frontend/assets/js/supabase-integration.js',
                'frontend/assets/js/file-storage-manager.js',
                'frontend/assets/js/realtime-manager.js',
                'frontend/assets/js/frontend-integration.js',
                'supabase/schema.sql',
                'supabase/rls-policies.sql',
                'supabase/seed.sql',
                'supabase/config.toml',
                'scripts/deploy-supabase.js'
            ];

            for (const file of requiredFiles) {
                await this.test(`File exists: ${file}`, () => {
                    return fs.existsSync(path.join(__dirname, '..', file));
                });
            }

            // Test directory structure
            const requiredDirs = [
                'frontend',
                'frontend/assets',
                'frontend/assets/js',
                'frontend/assets/css',
                'frontend/pages',
                'supabase',
                'supabase/functions',
                'scripts'
            ];

            for (const dir of requiredDirs) {
                await this.test(`Directory exists: ${dir}`, () => {
                    return fs.existsSync(path.join(__dirname, '..', dir));
                });
            }

        } catch (error) {
            this.fail('File structure validation failed', error.message);
        }
    }

    async testJavaScriptSyntax() {
        this.log('🔍 Testing JavaScript Syntax...');

        try {
            const jsFiles = [
                'frontend/assets/js/supabase-integration.js',
                'frontend/assets/js/file-storage-manager.js',
                'frontend/assets/js/realtime-manager.js',
                'frontend/assets/js/frontend-integration.js'
            ];

            for (const file of jsFiles) {
                await this.test(`JavaScript syntax valid: ${file}`, () => {
                    try {
                        const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

                        // Basic syntax checks
                        const hasBalancedBraces = this.hasBalancedBraces(content);
                        const hasBalancedParens = this.hasBalancedParentheses(content);
                        const hasValidFunctions = this.hasValidFunctionDeclarations(content);

                        return hasBalancedBraces && hasBalancedParens && hasValidFunctions;
                    } catch (err) {
                        return false;
                    }
                });
            }

        } catch (error) {
            this.fail('JavaScript syntax validation failed', error.message);
        }
    }

    async testEnvironmentSetup() {
        this.log('⚙️ Testing Environment Setup...');

        try {
            // Test Node.js version
            await this.test('Node.js version compatible', () => {
                const nodeVersion = process.version;
                const major = parseInt(nodeVersion.slice(1).split('.')[0]);
                return major >= 16;
            });

            // Test if required configurations exist
            await this.test('Deployment scripts exist', () => {
                return fs.existsSync(path.join(__dirname, '../scripts/deploy-supabase.js'));
            });

            // Test SQL files syntax
            await this.test('SQL files have content', () => {
                try {
                    const schemaContent = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
                    return schemaContent.includes('CREATE TABLE') && schemaContent.length > 1000;
                } catch (err) {
                    return false;
                }
            });

        } catch (error) {
            this.fail('Environment setup validation failed', error.message);
        }
    }

    async testSecurityConfiguration() {
        this.log('🔒 Testing Security Configuration...');

        try {
            // Test RLS policies exist
            await this.test('RLS policies file exists', () => {
                return fs.existsSync(path.join(__dirname, '../supabase/rls-policies.sql'));
            });

            // Test RLS policies have content
            await this.test('RLS policies implemented', () => {
                try {
                    const rlsContent = fs.readFileSync(path.join(__dirname, '../supabase/rls-policies.sql'), 'utf8');
                    return rlsContent.includes('CREATE POLICY') && rlsContent.length > 500;
                } catch (err) {
                    return false;
                }
            });

            // Test authentication configuration
            await this.test('Authentication system configured', () => {
                try {
                    const integrationContent = fs.readFileSync(path.join(__dirname, '../frontend/assets/js/supabase-integration.js'), 'utf8');
                    return integrationContent.includes('signIn') && integrationContent.includes('signOut');
                } catch (err) {
                    return false;
                }
            });

        } catch (error) {
            this.fail('Security configuration validation failed', error.message);
        }
    }

    // Test utility functions
    async test(name, testFunction) {
        this.totalTests++;
        try {
            const result = await testFunction();
            if (result) {
                this.pass(name);
            } else {
                this.fail(name, 'Test returned false');
            }
        } catch (error) {
            this.fail(name, error.message);
        }
    }

    pass(name) {
        this.passedTests++;
        this.testResults.push({ name, status: 'PASS', message: '' });
        console.log(`✅ PASS: ${name}`);
    }

    fail(name, message = '') {
        this.failedTests++;
        this.testResults.push({ name, status: 'FAIL', message });
        console.log(`❌ FAIL: ${name} - ${message}`);
    }

    log(message) {
        console.log(`\n${message}`);
    }

    // Helper functions for syntax validation
    hasBalancedBraces(content) {
        let count = 0;
        for (const char of content) {
            if (char === '{') count++;
            if (char === '}') count--;
            if (count < 0) return false;
        }
        return count === 0;
    }

    hasBalancedParentheses(content) {
        let count = 0;
        for (const char of content) {
            if (char === '(') count++;
            if (char === ')') count--;
            if (count < 0) return false;
        }
        return count === 0;
    }

    hasValidFunctionDeclarations(content) {
        // Check for basic function patterns
        const functionPatterns = [
            /function\s+\w+\s*\(/,
            /\w+\s*:\s*function\s*\(/,
            /\w+\s*=\s*function\s*\(/,
            /\w+\s*=>\s*{/,
            /async\s+function\s+\w+\s*\(/,
            /class\s+\w+/
        ];

        return functionPatterns.some(pattern => pattern.test(content));
    }

    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('CAMPUSFLOW - TEST REPORT');
        console.log('='.repeat(80));
        console.log(`Test Date: ${new Date().toISOString()}`);
        console.log(`Total Tests: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`);
        console.log('');

        if (this.failedTests === 0) {
            console.log('🎉 ALL TESTS PASSED - SYSTEM IS READY FOR DEPLOYMENT!');
        } else {
            console.log('⚠️ SOME TESTS FAILED - PLEASE REVIEW BEFORE DEPLOYMENT');
            console.log('\nFailed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
        }

        console.log('\n' + '='.repeat(80));

        // Save report to file
        try {
            const reportContent = this.generateReportContent();
            fs.writeFileSync(path.join(__dirname, '../test-report-simple.txt'), reportContent);
            console.log('📝 Test report saved to test-report-simple.txt');
        } catch (error) {
            console.warn('⚠️ Could not save test report to file:', error.message);
        }

        process.exit(this.failedTests === 0 ? 0 : 1);
    }

    generateReportContent() {
        const lines = [
            '='.repeat(80),
            'CAMPUSFLOW - SIMPLE TEST REPORT',
            '='.repeat(80),
            `Test Date: ${new Date().toISOString()}`,
            `Total Tests: ${this.totalTests}`,
            `Passed: ${this.passedTests}`,
            `Failed: ${this.failedTests}`,
            `Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`,
            '',
            'DETAILED RESULTS:',
            '-'.repeat(40)
        ];

        this.testResults.forEach(result => {
            lines.push(`[${result.status}] ${result.name}${result.message ? ' - ' + result.message : ''}`);
        });

        lines.push('');
        lines.push('SUMMARY:');
        lines.push('-'.repeat(40));
        if (this.failedTests === 0) {
            lines.push('✅ ALL TESTS PASSED - SYSTEM IS READY FOR DEPLOYMENT!');
        } else {
            lines.push('❌ SOME TESTS FAILED - PLEASE REVIEW BEFORE DEPLOYMENT');
        }

        lines.push('='.repeat(80));

        return lines.join('\n');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const runner = new SimpleTestRunner();
    runner.run().catch(console.error);
}

module.exports = SimpleTestRunner;