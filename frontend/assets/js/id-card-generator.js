// ================================
// ID CARD GENERATOR JAVASCRIPT
// ================================

const IDCardGenerator = {
    // Generate ID Card for a student
    generateCard: function (studentId) {
        const student = StudentsManager.students.find(s => s.id === studentId);
        if (!student) {
            Utils.showToast('Student not found', 'danger');
            return;
        }

        // Show loading
        Utils.showToast('Generating ID Card...', 'info');

        // Generate QR code data
        const qrData = this.generateQRData(student);

        // Create ID card modal
        this.showIDCardModal(student, qrData);
    },

    // Generate QR code data
    generateQRData: function (student) {
        const baseUrl = window.location.origin;
        const profileUrl = `${baseUrl}/student-profile.html?id=${student.id}`;

        return {
            url: profileUrl,
            data: {
                studentId: student.studentId,
                name: student.name,
                campus: student.campusName,
                batch: student.batch,
                email: student.email,
                phone: student.phone
            }
        };
    },

    // Show ID Card modal
    showIDCardModal: function (student, qrData) {
        // Remove existing modal
        const existingModal = document.getElementById('idCardModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal fade" id="idCardModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-id-card me-2"></i>Student ID Card
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <div id="idCardContainer" class="id-card-container">
                                ${this.generateIDCardHTML(student, qrData)}
                            </div>
                            <div class="mt-3">
                                <canvas id="qrCodeCanvas" style="display: none;"></canvas>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>Close
                            </button>
                            <button type="button" class="btn btn-primary" onclick="IDCardGenerator.downloadPDF('${student.id}')">
                                <i class="fas fa-download me-2"></i>Download PDF
                            </button>
                            <button type="button" class="btn btn-outline-primary" onclick="IDCardGenerator.printCard()">
                                <i class="fas fa-print me-2"></i>Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Generate QR code
        this.generateQRCode(qrData.url);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('idCardModal'));
        modal.show();
    },

    // Generate ID Card HTML
    generateIDCardHTML: function (student, qrData) {
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

        return `
            <div class="id-card" id="idCard">
                <!-- Front Side -->
                <div class="id-card-front">
                    <div class="id-card-header">
                        <div class="institution-logo">
                            <i class="fas fa-graduation-cap fa-3x text-primary"></i>
                        </div>
                        <div class="institution-info">
                            <h5 class="mb-0 fw-bold">Student Portal</h5>
                            <p class="mb-0 small">Educational Institution</p>
                            <p class="mb-0 small text-muted">Student Identity Card</p>
                        </div>
                    </div>

                    <div class="id-card-body">
                        <div class="student-photo">
                            <img src="${student.photoUrl}" alt="${student.name}" 
                                 onerror="this.src='https://via.placeholder.com/120x150/6c757d/ffffff?text=${student.name.charAt(0)}'">
                        </div>
                        
                        <div class="student-info">
                            <div class="info-row">
                                <span class="label">Name:</span>
                                <span class="value">${student.name}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Student ID:</span>
                                <span class="value">${student.studentId}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Campus:</span>
                                <span class="value">${student.campusName}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Batch:</span>
                                <span class="value">${student.batch}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Status:</span>
                                <span class="value status-${student.status}">${student.status.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="id-card-footer">
                        <div class="validity-info">
                            <div class="validity-row">
                                <span class="label">Valid From:</span>
                                <span class="value">${Utils.formatDate(currentDate)}</span>
                            </div>
                            <div class="validity-row">
                                <span class="label">Valid Until:</span>
                                <span class="value">${Utils.formatDate(expiryDate)}</span>
                            </div>
                        </div>
                        
                        <div class="qr-code-container">
                            <div id="qrCodePlaceholder" class="qr-code">
                                <canvas id="qrCodeForCard" width="80" height="80"></canvas>
                            </div>
                            <p class="qr-label">Scan for Profile</p>
                        </div>
                    </div>

                    <div class="id-card-signature">
                        <div class="signature-line">
                            <span>Authorized Signature</span>
                        </div>
                    </div>
                </div>

                <!-- Back Side -->
                <div class="id-card-back">
                    <div class="back-header">
                        <h6 class="mb-2">Important Instructions</h6>
                    </div>
                    
                    <div class="back-content">
                        <ul class="instructions-list">
                            <li>This card is the property of the institution</li>
                            <li>Report immediately if lost or stolen</li>
                            <li>Present this card when requested</li>
                            <li>Card must be renewed annually</li>
                            <li>Not transferable to another person</li>
                        </ul>

                        <div class="contact-info mt-4">
                            <h6>Contact Information</h6>
                            <p class="mb-1"><i class="fas fa-phone"></i> +1-555-STUDENT</p>
                            <p class="mb-1"><i class="fas fa-envelope"></i> info@studentportal.edu</p>
                            <p class="mb-1"><i class="fas fa-globe"></i> www.studentportal.edu</p>
                        </div>

                        <div class="emergency-contact mt-3">
                            <h6>Emergency Contact</h6>
                            <p class="mb-1">Campus Security: +1-555-HELP</p>
                            <p class="mb-1">Admin Office: +1-555-ADMIN</p>
                        </div>
                    </div>

                    <div class="back-footer">
                        <div class="barcode-area">
                            <div class="barcode-placeholder">
                                <div class="barcode-lines">
                                    ${this.generateBarcodeLines(student.studentId)}
                                </div>
                                <div class="barcode-text">${student.studentId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Generate barcode lines
    generateBarcodeLines: function (studentId) {
        const lines = [];
        for (let i = 0; i < 20; i++) {
            const width = Math.random() > 0.5 ? 2 : 1;
            lines.push(`<div class="barcode-line" style="width: ${width}px;"></div>`);
        }
        return lines.join('');
    },

    // Generate QR Code
    generateQRCode: function (data) {
        // Simple QR code placeholder - in production, use a proper QR code library
        const canvas = document.getElementById('qrCodeCanvas');
        const cardCanvas = document.getElementById('qrCodeForCard');

        if (canvas && cardCanvas) {
            this.drawQRCodePlaceholder(canvas, data, 200);
            this.drawQRCodePlaceholder(cardCanvas, data, 80);
        }
    },

    // Draw QR code placeholder
    drawQRCodePlaceholder: function (canvas, data, size) {
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // Draw border
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, size, size);

        // Draw white background
        ctx.fillStyle = '#fff';
        ctx.fillRect(5, 5, size - 10, size - 10);

        // Draw pattern (simplified QR-like pattern)
        ctx.fillStyle = '#000';
        const blockSize = (size - 10) / 21; // 21x21 grid

        for (let i = 0; i < 21; i++) {
            for (let j = 0; j < 21; j++) {
                // Create a pseudo-random pattern based on data
                const hash = this.simpleHash(data + i + j);
                if (hash % 2 === 0) {
                    ctx.fillRect(5 + i * blockSize, 5 + j * blockSize, blockSize, blockSize);
                }
            }
        }

        // Draw corner squares
        this.drawCornerSquare(ctx, 5, 5, blockSize * 7);
        this.drawCornerSquare(ctx, 5 + blockSize * 14, 5, blockSize * 7);
        this.drawCornerSquare(ctx, 5, 5 + blockSize * 14, blockSize * 7);
    },

    // Draw corner square for QR code
    drawCornerSquare: function (ctx, x, y, size) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, size, size);

        ctx.fillStyle = '#fff';
        ctx.fillRect(x + size / 7, y + size / 7, size * 5 / 7, size * 5 / 7);

        ctx.fillStyle = '#000';
        ctx.fillRect(x + size * 2 / 7, y + size * 2 / 7, size * 3 / 7, size * 3 / 7);
    },

    // Simple hash function for QR pattern
    simpleHash: function (str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    },

    // Download PDF
    downloadPDF: function (studentId) {
        const student = StudentsManager.students.find(s => s.id === studentId);
        if (!student) return;

        Utils.showToast('Generating PDF...', 'info');

        // In a real application, you would use a PDF library like jsPDF
        // For now, we'll simulate the process
        setTimeout(() => {
            // Create a link to download the ID card as image for now
            this.downloadAsImage(student);
        }, 1500);
    },

    // Download as image (fallback for PDF)
    downloadAsImage: function (student) {
        const idCard = document.getElementById('idCard');
        if (!idCard) return;

        // Use html2canvas library in production for better results
        // For now, we'll create a simple download
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 380;

        // Simple card representation
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 380);

        ctx.fillStyle = '#0d6efd';
        ctx.fillRect(0, 0, 600, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Student Portal - ID Card', 20, 35);

        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.fillText(`Name: ${student.name}`, 20, 100);
        ctx.fillText(`Student ID: ${student.studentId}`, 20, 130);
        ctx.fillText(`Campus: ${student.campusName}`, 20, 160);
        ctx.fillText(`Batch: ${student.batch}`, 20, 190);
        ctx.fillText(`Status: ${student.status.toUpperCase()}`, 20, 220);

        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${student.studentId}_ID_Card.png`;
            a.click();
            URL.revokeObjectURL(url);

            Utils.showToast('ID Card downloaded successfully!', 'success');
        });
    },

    // Print card
    printCard: function () {
        const printWindow = window.open('', '_blank');
        const idCard = document.getElementById('idCard');

        if (idCard && printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Student ID Card</title>
                    <style>
                        ${this.getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${idCard.outerHTML}
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();

            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    },

    // Get print styles
    getPrintStyles: function () {
        return `
            @media print {
                body { margin: 0; padding: 20px; }
                .id-card { 
                    width: 8.5cm; 
                    height: 5.4cm; 
                    margin: 0 auto;
                    page-break-inside: avoid;
                }
                .id-card-front, .id-card-back {
                    width: 100%;
                    height: 100%;
                    border: 2px solid #000;
                    border-radius: 8px;
                    padding: 10px;
                    box-sizing: border-box;
                    page-break-inside: avoid;
                    margin-bottom: 1cm;
                }
            }
            
            .id-card {
                font-family: Arial, sans-serif;
                background: white;
                color: #000;
            }
            
            .id-card-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 2px solid #0d6efd;
            }
            
            .institution-logo {
                margin-right: 10px;
            }
            
            .institution-info h5 {
                margin: 0;
                color: #0d6efd;
            }
            
            .institution-info p {
                margin: 0;
                font-size: 12px;
            }
            
            .id-card-body {
                display: flex;
                margin-bottom: 15px;
            }
            
            .student-photo {
                width: 80px;
                height: 100px;
                margin-right: 15px;
                border: 2px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .student-photo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .student-info {
                flex: 1;
            }
            
            .info-row {
                display: flex;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .info-row .label {
                font-weight: bold;
                width: 80px;
                flex-shrink: 0;
            }
            
            .info-row .value {
                flex: 1;
            }
            
            .status-active {
                color: #28a745;
                font-weight: bold;
            }
            
            .status-inactive {
                color: #6c757d;
                font-weight: bold;
            }
            
            .id-card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #ddd;
                padding-top: 8px;
                margin-bottom: 10px;
            }
            
            .validity-info {
                font-size: 12px;
            }
            
            .validity-row {
                display: flex;
                margin-bottom: 3px;
            }
            
            .validity-row .label {
                font-weight: bold;
                margin-right: 5px;
            }
            
            .qr-code-container {
                text-align: center;
            }
            
            .qr-code {
                width: 60px;
                height: 60px;
                border: 1px solid #ddd;
                margin: 0 auto 5px;
            }
            
            .qr-label {
                font-size: 10px;
                margin: 0;
            }
            
            .id-card-signature {
                text-align: right;
                font-size: 12px;
                border-top: 1px solid #000;
                padding-top: 5px;
                margin-top: 10px;
            }
            
            .id-card-back {
                background: #f8f9fa;
            }
            
            .back-header {
                text-align: center;
                margin-bottom: 15px;
                color: #0d6efd;
            }
            
            .instructions-list {
                font-size: 12px;
                padding-left: 15px;
                margin-bottom: 15px;
            }
            
            .instructions-list li {
                margin-bottom: 3px;
            }
            
            .contact-info, .emergency-contact {
                font-size: 11px;
                margin-bottom: 10px;
            }
            
            .contact-info h6, .emergency-contact h6 {
                margin: 0 0 5px 0;
                color: #0d6efd;
            }
            
            .contact-info p, .emergency-contact p {
                margin: 0 0 2px 0;
            }
            
            .barcode-area {
                text-align: center;
                margin-top: 15px;
                border-top: 1px solid #ddd;
                padding-top: 8px;
            }
            
            .barcode-lines {
                display: flex;
                justify-content: center;
                align-items: end;
                height: 20px;
                margin-bottom: 3px;
            }
            
            .barcode-line {
                background: #000;
                height: 100%;
                margin-right: 1px;
            }
            
            .barcode-text {
                font-size: 10px;
                font-family: monospace;
            }
        `;
    }
};

// Extend StudentsManager with ID card functionality
StudentsManager.generateIdCard = function (studentId) {
    IDCardGenerator.generateCard(studentId);
};

// Extend StudentModals with ID card functionality
StudentModals.generateIdCard = function (studentId) {
    IDCardGenerator.generateCard(studentId);
};

// Export for global access
window.IDCardGenerator = IDCardGenerator;