/* js/export.js */
// Handles Excel Integration and Printing logic

const ExportUtils = {
    // Export Table Data to Excel
    exportTableToExcel(tableId, filename = 'exported_data.xlsx') {
        const table = document.getElementById(tableId);
        if (!table) {
            Components.notify('Tabel tidak ditemukan', 'error');
            return;
        }

        // Using SheetJS
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, filename);
        Components.notify('File Excel berhasil diunduh', 'success');
    },

    // Export Array to Excel
    exportDataToExcel(dataArray, headers, filename = 'data.xlsx') {
        const ws = XLSX.utils.json_to_sheet(dataArray, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, filename);
        Components.notify('File Excel berhasil diunduh', 'success');
    },

    // Download Student Import Template
    downloadStudentTemplate() {
        const headers = ["NIS", "Nama Lengkap", "Kelas", "Jenis Kelamin"];
        const data = [
            { "NIS": "123456", "Nama Lengkap": "Contoh Siswa 1", "Kelas": "7A", "Jenis Kelamin": "L" },
            { "NIS": "123457", "Nama Lengkap": "Contoh Siswa 2", "Kelas": "8B", "Jenis Kelamin": "P" }
        ];
        this.exportDataToExcel(data, headers, 'Template_Impor_Siswa.xlsx');
    },

    // Mass Import Students via Excel
    importStudentsFromExcel(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const json = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    Components.notify('File Excel kosong atau format tidak sesuai', 'error');
                    return;
                }

                // Pass the data to store
                const addedCount = Store.saveMassStudents(json);
                Components.notify(`Berhasil mengimpor ${addedCount} data siswa`, 'success');

                if (typeof callback === 'function') callback();
            } catch (err) {
                console.error(err);
                Components.notify('Gagal membaca file Excel', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    },

    // Trigger Print for a specific section
    printSection(title, contentHtml) {
        const settings = Store.getAppSettings();
        const user = JSON.parse(localStorage.getItem('session') || 'null');
        const printWindow = window.open('', '_blank');

        // Basic styling for the print window to make it look professional
        const styles = `
            <style>
                body { font-family: 'Arial', sans-serif; padding: 20px; line-height: 1.5; color: #000; }
                .header { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 10px; line-height: 1.0; }
                .header-logo { width: 2cm; height: 2cm; object-fit: contain; flex-shrink: 0; }
                .header-logo-placeholder { width: 2cm; height: 2cm; flex-shrink: 0; }
                .header-text { flex: 1; text-align: center; }
                h1, h2, p { margin: 3px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 50px; display: flex; justify-content: space-between; padding: 0 40px; }
                .signature { text-align: center; width: 220px; }
            </style>
        `;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                ${styles}
            </head>
            <body>
                <div class="header">
                    ${settings.logo ? `<img class="header-logo" src="${settings.logo}">` : '<div class="header-logo-placeholder"></div>'}
                    <div class="header-text">
                        <p style="font-size: 16pt; font-weight: bold; letter-spacing: 0.5px;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</p>
                        <h1 style="font-size: 14pt; font-weight: 900; margin: 4px 0; letter-spacing: 1px;">${settings.schoolName.toUpperCase()}</h1>
                        <p style="font-size: 10pt; white-space: pre-line;">${settings.address}</p>
                        ${settings.website ? `<p style="font-size: 9pt; font-style: italic;">website : ${settings.website}</p>` : ''}
                    </div>
                </div>
                
                <h3>${title}</h3>
                
                ${contentHtml}
                
                <div class="footer">
                    <div class="signature">
                        <p>Mengetahui,</p>
                        <p>Kepala Madrasah</p>
                        <br><br><br><br>
                        <p>_______________________</p>
                        <p><strong>${settings.headmaster || 'Nama Kepala Madrasah'}</strong></p>
                    </div>
                    <div class="signature">
                        <p>&nbsp;</p>
                        <p>Guru Mata Pelajaran</p>
                        <br><br><br><br>
                        <p>_______________________</p>
                        <p><strong>${user ? user.name : (settings.headmaster || 'Guru Pengampu')}</strong></p>
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    }
};
