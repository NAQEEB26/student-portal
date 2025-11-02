/**
 * File Storage and Media Management System for Student Portal
 * Handles secure file uploads, downloads, and management using Supabase Storage
 */

class FileStorageManager {
    constructor() {
        this.supabase = window.supabaseService?.supabase;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = {
            images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            presentations: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
        };

        this.buckets = {
            'student-photos': { public: true, maxSize: 5 * 1024 * 1024 },
            'faculty-photos': { public: true, maxSize: 5 * 1024 * 1024 },
            'documents': { public: false, maxSize: 10 * 1024 * 1024 },
            'transcripts': { public: false, maxSize: 10 * 1024 * 1024 },
            'id-cards': { public: false, maxSize: 5 * 1024 * 1024 }
        };
    }

    // Initialize file storage system
    async initialize() {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not initialized');
            }

            // Check bucket accessibility
            const { data: buckets, error } = await this.supabase.storage.listBuckets();
            if (error) throw error;

            const availableBuckets = buckets.map(b => b.name);
            const requiredBuckets = Object.keys(this.buckets);
            const missingBuckets = requiredBuckets.filter(b => !availableBuckets.includes(b));

            if (missingBuckets.length > 0) {
                console.warn('Missing storage buckets:', missingBuckets);
            }

            this.setupFileUploadHandlers();
            console.log('✅ File Storage Manager initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize File Storage Manager:', error);
            return false;
        }
    }

    // Setup file upload event handlers
    setupFileUploadHandlers() {
        // Global file input handler
        document.addEventListener('change', (event) => {
            if (event.target.type === 'file' && event.target.hasAttribute('data-upload-bucket')) {
                this.handleFileInput(event.target);
            }
        });

        // Drag and drop handlers
        document.addEventListener('dragover', (event) => {
            if (event.target.hasAttribute('data-drop-zone')) {
                event.preventDefault();
                event.target.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (event) => {
            if (event.target.hasAttribute('data-drop-zone')) {
                event.target.classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', (event) => {
            if (event.target.hasAttribute('data-drop-zone')) {
                event.preventDefault();
                event.target.classList.remove('drag-over');
                this.handleFileDrop(event.target, event.dataTransfer.files);
            }
        });
    }

    // Handle file input change
    async handleFileInput(input) {
        const files = Array.from(input.files);
        const bucket = input.getAttribute('data-upload-bucket');
        const userId = input.getAttribute('data-user-id') || window.StudentPortal?.state?.currentUser?.id;
        const category = input.getAttribute('data-category') || 'general';

        if (!bucket) {
            this.showError('Upload bucket not specified');
            return;
        }

        for (const file of files) {
            await this.uploadFile(file, bucket, userId, category, input);
        }
    }

    // Handle drag and drop
    async handleFileDrop(dropZone, files) {
        const bucket = dropZone.getAttribute('data-upload-bucket');
        const userId = dropZone.getAttribute('data-user-id') || window.StudentPortal?.state?.currentUser?.id;
        const category = dropZone.getAttribute('data-category') || 'general';

        if (!bucket) {
            this.showError('Upload bucket not specified');
            return;
        }

        for (const file of files) {
            await this.uploadFile(file, bucket, userId, category, dropZone);
        }
    }

    // Validate file before upload
    validateFile(file, bucket) {
        const errors = [];

        // Check file size
        const maxSize = this.buckets[bucket]?.maxSize || this.maxFileSize;
        if (file.size > maxSize) {
            errors.push(`File size exceeds maximum allowed size (${this.formatFileSize(maxSize)})`);
        }

        // Check file type based on bucket
        let allowedTypes = [];
        switch (bucket) {
            case 'student-photos':
            case 'faculty-photos':
                allowedTypes = this.allowedTypes.images;
                break;
            case 'documents':
            case 'transcripts':
                allowedTypes = [...this.allowedTypes.documents, ...this.allowedTypes.spreadsheets, ...this.allowedTypes.presentations];
                break;
            case 'id-cards':
                allowedTypes = [...this.allowedTypes.images, ...this.allowedTypes.documents];
                break;
            default:
                allowedTypes = Object.values(this.allowedTypes).flat();
        }

        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }

        return errors;
    }

    // Upload file to Supabase Storage
    async uploadFile(file, bucket, userId, category = 'general', element = null) {
        try {
            // Validate file
            const validationErrors = this.validateFile(file, bucket);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('; '));
            }

            // Show upload progress
            const progressId = this.showUploadProgress(file.name, element);

            // Generate file path
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const fileName = `${timestamp}_${this.sanitizeFileName(file.name)}`;
            const filePath = `${userId}/${category}/${fileName}`;

            // Upload file with progress tracking
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    onUploadProgress: (progress) => {
                        this.updateUploadProgress(progressId, (progress.loaded / progress.total) * 100);
                    }
                });

            if (error) throw error;

            // Get file URL
            const fileUrl = this.buckets[bucket].public
                ? this.supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl
                : await this.getSignedUrl(bucket, filePath);

            // Save file metadata to database
            const fileRecord = await this.saveFileMetadata({
                bucket,
                file_path: filePath,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                category,
                uploaded_by: userId,
                url: fileUrl
            });

            this.hideUploadProgress(progressId);
            this.showSuccess(`File "${file.name}" uploaded successfully`);

            // Trigger custom event
            this.triggerFileUploadEvent(element, {
                file: fileRecord,
                url: fileUrl,
                bucket,
                filePath
            });

            return {
                success: true,
                file: fileRecord,
                url: fileUrl,
                path: filePath
            };

        } catch (error) {
            this.hideUploadProgress(progressId);
            this.showError(`Failed to upload "${file.name}": ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Save file metadata to database
    async saveFileMetadata(metadata) {
        const { data, error } = await this.supabase
            .from('file_uploads')
            .insert({
                ...metadata,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get signed URL for private files
    async getSignedUrl(bucket, filePath, expiresIn = 3600) {
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    }

    // Download file
    async downloadFile(bucket, filePath, fileName = null) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .download(filePath);

            if (error) throw error;

            // Create download link
            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            this.showError(`Failed to download file: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Delete file
    async deleteFile(bucket, filePath, fileId = null) {
        try {
            // Delete from storage
            const { error: storageError } = await this.supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (storageError) throw storageError;

            // Delete metadata from database
            if (fileId) {
                const { error: dbError } = await this.supabase
                    .from('file_uploads')
                    .delete()
                    .eq('id', fileId);

                if (dbError) throw dbError;
            }

            this.showSuccess('File deleted successfully');
            return { success: true };
        } catch (error) {
            this.showError(`Failed to delete file: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // Get user files
    async getUserFiles(userId, bucket = null, category = null) {
        try {
            let query = this.supabase
                .from('file_uploads')
                .select('*')
                .eq('uploaded_by', userId)
                .order('created_at', { ascending: false });

            if (bucket) {
                query = query.eq('bucket', bucket);
            }

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get file info
    async getFileInfo(bucket, filePath) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .list(filePath.split('/').slice(0, -1).join('/'), {
                    search: filePath.split('/').pop()
                });

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create file upload component
    createFileUploadComponent(config) {
        const {
            containerId,
            bucket,
            category = 'general',
            multiple = false,
            accept = '',
            dragDrop = true,
            preview = true
        } = config;

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        const userId = window.StudentPortal?.state?.currentUser?.id;

        const html = `
            <div class="file-upload-component">
                <div class="upload-area ${dragDrop ? 'drop-zone' : ''}" 
                     ${dragDrop ? 'data-drop-zone="true"' : ''}
                     data-upload-bucket="${bucket}"
                     data-user-id="${userId}"
                     data-category="${category}">
                    <div class="upload-content">
                        <i class="fas fa-cloud-upload-alt upload-icon"></i>
                        <p class="upload-text">
                            ${dragDrop ? 'Drag and drop files here or' : ''}
                            <label for="file-input-${containerId}" class="file-input-label">click to browse</label>
                        </p>
                        <input type="file" 
                               id="file-input-${containerId}"
                               class="file-input"
                               data-upload-bucket="${bucket}"
                               data-user-id="${userId}"
                               data-category="${category}"
                               ${multiple ? 'multiple' : ''}
                               ${accept ? `accept="${accept}"` : ''}
                               style="display: none;">
                    </div>
                </div>
                <div class="upload-progress-container" style="display: none;"></div>
                ${preview ? '<div class="file-preview-container"></div>' : ''}
            </div>
        `;

        container.innerHTML = html;

        // Setup click handler for label
        const label = container.querySelector('.file-input-label');
        const input = container.querySelector('.file-input');
        label.addEventListener('click', () => input.click());

        return container;
    }

    // Show upload progress
    showUploadProgress(fileName, element) {
        const progressId = `progress-${Date.now()}`;
        const progressHtml = `
            <div id="${progressId}" class="upload-progress-item">
                <div class="progress-info">
                    <span class="file-name">${fileName}</span>
                    <span class="progress-percentage">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        let container = element?.closest('.file-upload-component')?.querySelector('.upload-progress-container');
        if (!container) {
            container = document.getElementById('global-upload-progress') || this.createGlobalProgressContainer();
        }

        container.style.display = 'block';
        container.insertAdjacentHTML('beforeend', progressHtml);

        return progressId;
    }

    // Update upload progress
    updateUploadProgress(progressId, percentage) {
        const progressElement = document.getElementById(progressId);
        if (progressElement) {
            const fill = progressElement.querySelector('.progress-fill');
            const text = progressElement.querySelector('.progress-percentage');
            fill.style.width = `${percentage}%`;
            text.textContent = `${Math.round(percentage)}%`;
        }
    }

    // Hide upload progress
    hideUploadProgress(progressId) {
        setTimeout(() => {
            const progressElement = document.getElementById(progressId);
            if (progressElement) {
                progressElement.remove();
            }
        }, 2000);
    }

    // Create global progress container
    createGlobalProgressContainer() {
        const container = document.createElement('div');
        container.id = 'global-upload-progress';
        container.className = 'global-upload-progress';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 300px;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    // Trigger file upload event
    triggerFileUploadEvent(element, data) {
        const event = new CustomEvent('fileUploaded', {
            detail: data,
            bubbles: true
        });
        (element || document).dispatchEvent(event);
    }

    // Utility functions
    sanitizeFileName(fileName) {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        if (window.StudentPortal) {
            window.StudentPortal.showError(message);
        } else {
            console.error(message);
        }
    }

    showSuccess(message) {
        if (window.StudentPortal) {
            window.StudentPortal.showSuccess(message);
        } else {
            console.log(message);
        }
    }
}

// Initialize file storage manager
window.FileStorageManager = new FileStorageManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseService) {
        window.FileStorageManager.initialize();
    } else {
        // Wait for Supabase to be ready
        const checkSupabase = setInterval(() => {
            if (window.supabaseService) {
                window.FileStorageManager.initialize();
                clearInterval(checkSupabase);
            }
        }, 100);
    }
});

// Add CSS styles
const styles = `
    .file-upload-component {
        margin: 20px 0;
    }

    .upload-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 40px 20px;
        text-align: center;
        background-color: #fafafa;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .upload-area:hover, .upload-area.drag-over {
        border-color: #007bff;
        background-color: #f0f8ff;
    }

    .upload-icon {
        font-size: 3em;
        color: #007bff;
        margin-bottom: 15px;
    }

    .upload-text {
        margin: 0;
        color: #666;
        font-size: 16px;
    }

    .file-input-label {
        color: #007bff;
        text-decoration: underline;
        cursor: pointer;
    }

    .upload-progress-item {
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
    }

    .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .progress-bar {
        height: 6px;
        background-color: #e9ecef;
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #007bff;
        transition: width 0.3s ease;
    }

    .file-preview-container {
        margin-top: 15px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .file-preview-item {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        text-align: center;
        background-color: white;
    }

    .file-preview-image {
        max-width: 100%;
        max-height: 100px;
        object-fit: cover;
        border-radius: 4px;
    }

    .global-upload-progress {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);