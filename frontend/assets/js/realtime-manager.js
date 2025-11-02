/**
 * Real-time Features and Performance Optimization for Student Portal
 * Handles real-time subscriptions, notifications, triggers, and performance monitoring
 */

class RealTimeManager {
    constructor() {
        this.supabase = window.supabaseService?.supabase;
        this.subscriptions = new Map();
        this.performanceMetrics = {
            queryTimes: [],
            errorCounts: {},
            cacheHits: 0,
            cacheMisses: 0
        };
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Initialize real-time system
    async initialize() {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not initialized');
            }

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            // Setup automatic cleanup
            this.setupCacheCleanup();

            // Setup connection monitoring
            this.setupConnectionMonitoring();

            console.log('✅ Real-time Manager initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Real-time Manager:', error);
            return false;
        }
    }

    // =============================================
    // REAL-TIME SUBSCRIPTIONS
    // =============================================

    // Subscribe to table changes
    subscribeToTable(table, callback, filter = null, subscriptionId = null) {
        const id = subscriptionId || `${table}_${Date.now()}`;

        try {
            let subscription = this.supabase
                .channel(`${table}_changes_${id}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: table,
                    filter: filter
                }, (payload) => {
                    this.handleRealtimeEvent(table, payload, callback);
                });

            subscription.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`✅ Subscribed to ${table} changes`);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error(`❌ Error subscribing to ${table}:`, status);
                    this.handleSubscriptionError(id, table);
                }
            });

            this.subscriptions.set(id, {
                subscription,
                table,
                callback,
                filter,
                createdAt: Date.now()
            });

            return id;
        } catch (error) {
            console.error(`❌ Failed to subscribe to ${table}:`, error);
            return null;
        }
    }

    // Subscribe to student enrollments
    subscribeToEnrollments(callback, studentId = null) {
        const filter = studentId ? `student_id=eq.${studentId}` : null;
        return this.subscribeToTable('enrollments', callback, filter, 'enrollments_subscription');
    }

    // Subscribe to notifications
    subscribeToNotifications(userId, callback) {
        const filter = `recipient_id=eq.${userId}`;
        return this.subscribeToTable('notifications', callback, filter, `notifications_${userId}`);
    }

    // Subscribe to course offerings
    subscribeToOfferingsChanges(callback, campusId = null) {
        const filter = campusId ? `campus_id=eq.${campusId}` : null;
        return this.subscribeToTable('course_offerings', callback, filter, 'course_offerings_subscription');
    }

    // Subscribe to attendance changes
    subscribeToAttendance(callback, courseOfferingId = null) {
        const filter = courseOfferingId ? `course_offering_id=eq.${courseOfferingId}` : null;
        return this.subscribeToTable('attendance', callback, filter, 'attendance_subscription');
    }

    // Subscribe to grade updates
    subscribeToGrades(callback, studentId = null) {
        const filter = studentId ? `student_id=eq.${studentId}` : null;
        return this.subscribeToTable('grades', callback, filter, `grades_${studentId || 'all'}`);
    }

    // Handle real-time events
    handleRealtimeEvent(table, payload, callback) {
        try {
            // Clear cache for affected data
            this.invalidateCache(table, payload.new?.id || payload.old?.id);

            // Update performance metrics
            this.recordRealtimeEvent(table, payload.eventType);

            // Call the provided callback
            if (typeof callback === 'function') {
                callback(payload);
            }

            // Trigger global event
            this.triggerGlobalEvent('realtimeUpdate', {
                table,
                eventType: payload.eventType,
                new: payload.new,
                old: payload.old
            });

        } catch (error) {
            console.error(`❌ Error handling real-time event for ${table}:`, error);
        }
    }

    // Handle subscription errors
    handleSubscriptionError(subscriptionId, table) {
        console.warn(`⚠️ Subscription error for ${table}, attempting to reconnect...`);

        // Remove failed subscription
        this.unsubscribe(subscriptionId);

        // Attempt to reconnect after delay
        setTimeout(() => {
            const subscription = this.subscriptions.get(subscriptionId);
            if (subscription) {
                this.subscribeToTable(
                    subscription.table,
                    subscription.callback,
                    subscription.filter,
                    subscriptionId
                );
            }
        }, 5000);
    }

    // Unsubscribe from updates
    unsubscribe(subscriptionId) {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
            subscription.subscription.unsubscribe();
            this.subscriptions.delete(subscriptionId);
            console.log(`✅ Unsubscribed from ${subscription.table}`);
        }
    }

    // Unsubscribe from all
    unsubscribeAll() {
        this.subscriptions.forEach((subscription, id) => {
            this.unsubscribe(id);
        });
        console.log('✅ Unsubscribed from all real-time updates');
    }

    // =============================================
    // CACHING SYSTEM
    // =============================================

    // Set cache
    setCache(key, data, timeout = this.cacheTimeout) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            timeout
        });
    }

    // Get from cache
    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) {
            this.performanceMetrics.cacheMisses++;
            return null;
        }

        // Check if expired
        if (Date.now() - cached.timestamp > cached.timeout) {
            this.cache.delete(key);
            this.performanceMetrics.cacheMisses++;
            return null;
        }

        this.performanceMetrics.cacheHits++;
        return cached.data;
    }

    // Invalidate cache
    invalidateCache(table, recordId = null) {
        if (recordId) {
            // Invalidate specific record
            const keys = Array.from(this.cache.keys()).filter(key =>
                key.includes(table) && key.includes(recordId)
            );
            keys.forEach(key => this.cache.delete(key));
        } else {
            // Invalidate all cache for table
            const keys = Array.from(this.cache.keys()).filter(key => key.includes(table));
            keys.forEach(key => this.cache.delete(key));
        }
    }

    // Clear all cache
    clearCache() {
        this.cache.clear();
        console.log('✅ Cache cleared');
    }

    // Setup cache cleanup
    setupCacheCleanup() {
        setInterval(() => {
            const now = Date.now();
            const keysToDelete = [];

            this.cache.forEach((value, key) => {
                if (now - value.timestamp > value.timeout) {
                    keysToDelete.push(key);
                }
            });

            keysToDelete.forEach(key => this.cache.delete(key));

            if (keysToDelete.length > 0) {
                console.log(`🧹 Cleaned ${keysToDelete.length} expired cache entries`);
            }
        }, 60000); // Clean every minute
    }

    // =============================================
    // PERFORMANCE MONITORING
    // =============================================

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Supabase queries
        if (this.supabase) {
            const originalQuery = this.supabase.from.bind(this.supabase);
            this.supabase.from = (table) => {
                const startTime = performance.now();
                const query = originalQuery(table);

                // Wrap query methods to measure performance
                const wrapMethod = (method) => {
                    const original = query[method].bind(query);
                    return function (...args) {
                        const result = original(...args);
                        if (result && typeof result.then === 'function') {
                            return result.then(response => {
                                const endTime = performance.now();
                                window.RealTimeManager.recordQueryTime(table, method, endTime - startTime);
                                return response;
                            }).catch(error => {
                                window.RealTimeManager.recordError(table, method, error);
                                throw error;
                            });
                        }
                        return result;
                    };
                };

                ['select', 'insert', 'update', 'delete', 'upsert'].forEach(method => {
                    if (query[method]) {
                        query[method] = wrapMethod(method);
                    }
                });

                return query;
            };
        }

        // Setup performance data collection
        setInterval(() => {
            this.collectPerformanceMetrics();
        }, 30000); // Every 30 seconds
    }

    // Record query time
    recordQueryTime(table, method, time) {
        this.performanceMetrics.queryTimes.push({
            table,
            method,
            time,
            timestamp: Date.now()
        });

        // Keep only last 100 queries
        if (this.performanceMetrics.queryTimes.length > 100) {
            this.performanceMetrics.queryTimes.shift();
        }
    }

    // Record error
    recordError(table, method, error) {
        const key = `${table}_${method}`;
        this.performanceMetrics.errorCounts[key] = (this.performanceMetrics.errorCounts[key] || 0) + 1;

        console.error(`❌ Query error for ${table}.${method}:`, error);
    }

    // Record real-time event
    recordRealtimeEvent(table, eventType) {
        const key = `realtime_${table}_${eventType}`;
        this.performanceMetrics.errorCounts[key] = (this.performanceMetrics.errorCounts[key] || 0) + 1;
    }

    // Collect performance metrics
    collectPerformanceMetrics() {
        const metrics = {
            timestamp: Date.now(),
            averageQueryTime: this.getAverageQueryTime(),
            cacheHitRate: this.getCacheHitRate(),
            activeSubscriptions: this.subscriptions.size,
            cacheSize: this.cache.size,
            recentErrors: this.getRecentErrors(),
            memoryUsage: this.getMemoryUsage()
        };

        // Store metrics (could be sent to analytics service)
        this.storeMetrics(metrics);

        return metrics;
    }

    // Get average query time
    getAverageQueryTime() {
        const recentQueries = this.performanceMetrics.queryTimes.filter(
            query => Date.now() - query.timestamp < 300000 // Last 5 minutes
        );

        if (recentQueries.length === 0) return 0;

        const totalTime = recentQueries.reduce((sum, query) => sum + query.time, 0);
        return totalTime / recentQueries.length;
    }

    // Get cache hit rate
    getCacheHitRate() {
        const total = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
        return total > 0 ? (this.performanceMetrics.cacheHits / total) * 100 : 0;
    }

    // Get recent errors
    getRecentErrors() {
        return Object.entries(this.performanceMetrics.errorCounts)
            .filter(([key, count]) => count > 0)
            .map(([key, count]) => ({ operation: key, count }));
    }

    // Get memory usage
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    // Store metrics
    storeMetrics(metrics) {
        // Could send to analytics service or store locally
        localStorage.setItem('portal_performance_metrics', JSON.stringify(metrics));

        // Trigger performance event
        this.triggerGlobalEvent('performanceUpdate', metrics);
    }

    // =============================================
    // CONNECTION MONITORING
    // =============================================

    // Setup connection monitoring
    setupConnectionMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
            this.handleConnectionRestore();
        });

        window.addEventListener('offline', () => {
            console.log('📡 Connection lost');
            this.handleConnectionLoss();
        });

        // Monitor Supabase connection
        this.monitorSupabaseConnection();
    }

    // Handle connection restore
    handleConnectionRestore() {
        // Reestablish subscriptions
        this.reestablishSubscriptions();

        // Clear cache to get fresh data
        this.clearCache();

        // Trigger connection restored event
        this.triggerGlobalEvent('connectionRestored');
    }

    // Handle connection loss
    handleConnectionLoss() {
        // Trigger connection lost event
        this.triggerGlobalEvent('connectionLost');
    }

    // Reestablish subscriptions
    reestablishSubscriptions() {
        const subscriptionsToReestablish = Array.from(this.subscriptions.entries());

        // Clear existing subscriptions
        this.unsubscribeAll();

        // Reestablish each subscription
        subscriptionsToReestablish.forEach(([id, subscription]) => {
            setTimeout(() => {
                this.subscribeToTable(
                    subscription.table,
                    subscription.callback,
                    subscription.filter,
                    id
                );
            }, 1000);
        });
    }

    // Monitor Supabase connection
    monitorSupabaseConnection() {
        setInterval(async () => {
            try {
                const { data, error } = await this.supabase
                    .from('system_settings')
                    .select('setting_key')
                    .limit(1);

                if (error) {
                    throw error;
                }

                // Connection is working
                if (!this.isConnected) {
                    this.isConnected = true;
                    this.handleConnectionRestore();
                }
            } catch (error) {
                if (this.isConnected) {
                    this.isConnected = false;
                    console.warn('⚠️ Supabase connection issue:', error);
                }
            }
        }, 30000); // Check every 30 seconds
    }

    // =============================================
    // UTILITY FUNCTIONS
    // =============================================

    // Trigger global event
    triggerGlobalEvent(eventName, data = null) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Get performance summary
    getPerformanceSummary() {
        return {
            averageQueryTime: this.getAverageQueryTime(),
            cacheHitRate: this.getCacheHitRate(),
            activeSubscriptions: this.subscriptions.size,
            cacheSize: this.cache.size,
            isConnected: this.isConnected || navigator.onLine,
            recentErrors: this.getRecentErrors(),
            memoryUsage: this.getMemoryUsage()
        };
    }

    // Optimize performance
    optimizePerformance() {
        // Clear old cache entries
        this.clearCache();

        // Reset performance metrics
        this.performanceMetrics.queryTimes = [];
        this.performanceMetrics.cacheHits = 0;
        this.performanceMetrics.cacheMisses = 0;

        // Garbage collection hint
        if (window.gc) {
            window.gc();
        }

        console.log('⚡ Performance optimization completed');
    }

    // Create performance dashboard
    createPerformanceDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = this.getPerformanceSummary();

        container.innerHTML = `
            <div class="performance-dashboard">
                <h4>Real-time Performance Dashboard</h4>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${summary.averageQueryTime.toFixed(2)}ms</div>
                        <div class="metric-label">Avg Query Time</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${summary.cacheHitRate.toFixed(1)}%</div>
                        <div class="metric-label">Cache Hit Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${summary.activeSubscriptions}</div>
                        <div class="metric-label">Active Subscriptions</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${summary.isConnected ? '🟢' : '🔴'}</div>
                        <div class="metric-label">Connection Status</div>
                    </div>
                </div>
                <div class="actions">
                    <button onclick="window.RealTimeManager.optimizePerformance()" class="btn btn-primary btn-sm">
                        Optimize Performance
                    </button>
                    <button onclick="window.RealTimeManager.clearCache()" class="btn btn-secondary btn-sm">
                        Clear Cache
                    </button>
                </div>
            </div>
        `;

        // Auto-refresh dashboard
        setInterval(() => {
            this.updatePerformanceDashboard(containerId);
        }, 5000);
    }

    // Update performance dashboard
    updatePerformanceDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = this.getPerformanceSummary();
        const metrics = container.querySelectorAll('.metric-value');

        if (metrics.length >= 4) {
            metrics[0].textContent = `${summary.averageQueryTime.toFixed(2)}ms`;
            metrics[1].textContent = `${summary.cacheHitRate.toFixed(1)}%`;
            metrics[2].textContent = summary.activeSubscriptions;
            metrics[3].textContent = summary.isConnected ? '🟢' : '🔴';
        }
    }
}

// Initialize Real-time Manager
window.RealTimeManager = new RealTimeManager();

// Auto-initialize when Supabase is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseService) {
        window.RealTimeManager.initialize();
    } else {
        // Wait for Supabase to be ready
        const checkSupabase = setInterval(() => {
            if (window.supabaseService) {
                window.RealTimeManager.initialize();
                clearInterval(checkSupabase);
            }
        }, 100);
    }
});

// Add CSS styles for performance dashboard
const styles = `
    .performance-dashboard {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
    }

    .performance-dashboard h4 {
        margin: 0 0 15px 0;
        color: #333;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .metric-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        padding: 15px;
        text-align: center;
    }

    .metric-value {
        font-size: 24px;
        font-weight: bold;
        color: #007bff;
        margin-bottom: 5px;
    }

    .metric-label {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
    }

    .actions {
        display: flex;
        gap: 10px;
        justify-content: center;
    }

    .actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .btn-primary {
        background-color: #007bff;
        color: white;
    }

    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }

    .btn:hover {
        opacity: 0.9;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);