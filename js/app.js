/* js/app.js */

// Application Main Router and Logic

const App = {
    init() {
        if (!Auth.isLoggedIn()) {
            this.renderLogin();
        } else {
            this.renderApp();
            this.navigate('dashboard');
        }
    },

    // --- Rendering Main Layouts --- //

    renderLogin() {
        const settings = Store.getAppSettings();
        const appContainer = document.getElementById('app');
        const bannerSrc = settings.banner || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop';

        appContainer.innerHTML = `
            <div class="login-container" style="background: linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.8)), url('${bannerSrc}'); background-size: cover; background-position: center;">
                <div class="login-card animate-fade-in">
                    <div class="school-logo-placeholder" style="width:166px; height:166px; font-size:4rem;">
                        ${settings.logo ? `<img src="${settings.logo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : '<i class="ph ph-graduation-cap"></i>'}
                    </div>
                    <div class="text-center mb-4">
                        <h2 class="mb-1">${settings.title}</h2>
                        <p class="text-muted">${settings.schoolName}</p>
                    </div>
                    
                    <form id="loginForm" autocomplete="off">
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" id="username" class="form-control" placeholder="Masukkan username" autocomplete="off" required>
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-control" placeholder="Masukkan password" autocomplete="new-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-full justify-center">
                            <i class="ph ph-sign-in"></i> Masuk
                        </button>
                    </form>
                </div>
                <div class="login-footer">
                    &copy; 2026_Developed_Rudi_Hen
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if (Auth.login(user, pass)) {
                window.location.reload();
            } else {
                Components.notify('Username atau password salah', 'error');
            }
        });
    },

    renderApp() {
        const user = Auth.getCurrentUser();
        const settings = Store.getAppSettings();
        const appContainer = document.getElementById('app');

        let profileImage = user.photo ? `<img src="${user.photo}" class="user-avatar" alt="Avatar">`
            : `<div class="user-avatar"><i class="ph ph-user"></i></div>`;

        appContainer.innerHTML = `
            <div class="app-layout">
                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-header">
                        ${settings.logo ? `<img src="${settings.logo}" style="width:60px; height:60px; border-radius:12px; object-fit:cover; margin: 0 auto 0.5rem; display:block;">` : '<i class="ph ph-book-open text-primary" style="font-size: 2.5rem;"></i>'}
                        <h3 class="school-name">${settings.schoolName}</h3>
                    </div>
                    
                    <div class="sidebar-menu">
                        <div class="menu-item active" data-route="dashboard" onclick="App.navigate('dashboard')">
                            <i class="ph ph-squares-four menu-icon"></i> Dashboard
                        </div>
                        <div class="menu-item" data-route="students" onclick="App.navigate('students')">
                            <i class="ph ph-users menu-icon"></i> Data Siswa
                        </div>
                        <div class="menu-item" data-route="daftar-grades" onclick="App.navigate('daftar-grades')">
                            <i class="ph ph-exam menu-icon"></i> Daftar Nilai
                        </div>
                        <div class="menu-item" data-route="attendance" onclick="App.navigate('attendance')">
                            <i class="ph ph-calendar-check menu-icon"></i> Absensi
                        </div>
                        
                        <!-- Dropdown Menu Item -->
                        <div class="menu-item has-dropdown" onclick="App.toggleSubmenu('rekap-menu')">
                            <div style="display:flex; align-items:center; gap:0.75rem;">
                                <i class="ph ph-folder menu-icon"></i> Rekapitulasi
                            </div>
                            <i class="ph ph-caret-down"></i>
                        </div>
                        <div class="dropdown-content" id="rekap-menu">
                            <div class="dropdown-item" data-route="recap-grades" onclick="App.navigate('recap-grades')">Rekap Nilai Bulanan</div>
                            <div class="dropdown-item" data-route="recap-attendance" onclick="App.navigate('recap-attendance')">Rekap Absensi Bulanan</div>
                            <div class="dropdown-item" data-route="recap-yearly-grades" onclick="App.navigate('recap-yearly-grades')">Rekap Nilai Tahunan</div>
                            <div class="dropdown-item" data-route="recap-yearly-attendance" onclick="App.navigate('recap-yearly-attendance')">Rekap Absensi Tahunan</div>
                            <div class="dropdown-item" data-route="journal" onclick="App.navigate('journal')">Jurnal Mengajar</div>
                        </div>

                        <div class="menu-item" data-route="settings" onclick="App.navigate('settings')">
                            <i class="ph ph-gear menu-icon"></i> Pengaturan
                        </div>
                        <div class="menu-item" data-route="users" onclick="App.navigate('users')">
                            <i class="ph ph-user-circle-gear menu-icon"></i> Daftar User
                        </div>
                    </div>    
                    <footer class="app-footer">
                        &copy; 2026_Developed_Rudi_Hen
                    </footer>
                </aside>

                <!-- Topbar & Main Content -->
                <main class="main-content">
                    <header class="topbar">
                        <div class="topbar-left">
                            <button class="btn btn-outline" style="border:none;" onclick="App.toggleSidebar()">
                                <i class="ph ph-list" style="font-size: 1.5rem;"></i>
                            </button>
                            <!-- Searchable Menu Dropdown requirement -->
                            <div id="global-menu-search"></div>
                        </div>
                        
                        <div class="topbar-right">
                            <div class="user-profile-btn" onclick="App.navigate('profile')">
                                ${profileImage}
                                <div style="display: flex; flex-direction: column;">
                                    <span class="font-semibold" style="font-size: 0.875rem;">${user.name}</span>
                                    <span class="text-muted" style="font-size: 0.75rem;">Guru</span>
                                </div>
                            </div>
                            <button class="btn btn-outline" style="border:none; color: var(--danger);" onclick="App.logout()">
                                <i class="ph ph-sign-out" style="font-size: 1.25rem;"></i>
                            </button>
                        </div>
                    </header>
                    
                    <div class="page-content" id="page-content">
                        <!-- Dynamic Content loads here -->
                    </div>
                </main>
            </div>
        `;

        // Initialize Global Menu Search
        const menuOptions = [
            'Dashboard', 'Data Siswa', 'Daftar Nilai', 'Absensi',
            'Rekap Nilai Bulanan', 'Rekap Absensi Bulanan',
            'Rekap Nilai Tahunan', 'Rekap Absensi Tahunan',
            'Jurnal Mengajar', 'Profil Saya', 'Pengaturan'
        ];

        setTimeout(() => {
            Components.createSearchableDropdown('global-menu-search', menuOptions, (selected) => {
                const routeMap = {
                    'Dashboard': 'dashboard',
                    'Data Siswa': 'students',
                    'Daftar Nilai': 'daftar-grades',
                    'Absensi': 'attendance',
                    'Rekap Nilai Bulanan': 'recap-grades',
                    'Rekap Absensi Bulanan': 'recap-attendance',
                    'Rekap Nilai Tahunan': 'recap-yearly-grades',
                    'Rekap Absensi Tahunan': 'recap-yearly-attendance',
                    'Jurnal Mengajar': 'journal',
                    'Pengaturan': 'settings',
                    'Profil Saya': 'profile'
                };
                if (routeMap[selected]) {
                    this.navigate(routeMap[selected]);
                }
            }, "Ketik & cari menu...");
        }, 100);
    },

    // --- Navigation --- //

    toggleSubmenu(id) {
        document.getElementById(id).classList.toggle('show');
    },

    toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('show');
    },

    navigate(route) {
        // Update active menu styling
        document.querySelectorAll('.menu-item, .dropdown-item').forEach(el => el.classList.remove('active'));
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            if (activeLink.classList.contains('dropdown-item')) {
                activeLink.parentElement.classList.add('show');
            }
        }

        const contentArea = document.getElementById('page-content');
        contentArea.innerHTML = '<div class="text-center mt-4"><i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: var(--primary);"></i></div>';

        // Simulating slight loading delay for premium feel
        setTimeout(() => {
            contentArea.classList.remove('animate-fade-in');
            void contentArea.offsetWidth; // trigger reflow
            contentArea.classList.add('animate-fade-in');

            switch (route) {
                case 'dashboard': this.loadDashboard(); break;
                case 'profile': this.loadProfile(); break;
                case 'students': this.loadStudents(); break;
                case 'daftar-grades': this.loadDaftarNilai(); break;
                case 'attendance': this.loadAttendance(); break;
                case 'recap-grades': this.loadRecaps('grades'); break;
                case 'recap-attendance': this.loadRecaps('attendance'); break;
                case 'recap-yearly-grades': this.loadRecapsYearly('grades'); break;
                case 'recap-yearly-attendance': this.loadRecapsYearly('attendance'); break;
                case 'journal': this.loadRecaps('journal'); break;
                case 'settings': this.loadSettings(); break;
                case 'users': this.loadUsers(); break;
                default:
                    this.loadDashboard();
            }
        }, 200);
    },

    logout() {
        Components.confirm('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', () => {
            Auth.logout();
        });
    },

    // --- Page Loaders --- //

    loadDashboard() {
        const user = Auth.getCurrentUser();
        const settings = Store.getAppSettings();
        const stats = {
            totalStudents: Store.getStudents().length,
            classes: Store.getClasses().length,
            subjects: Store.getSubjects().length
        };
        const recentJournal = Store.getJournal().slice(-5).reverse();

        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <p class="text-muted" style="font-size: 16px;">Selamat Datang, <strong>${user.name}</strong></p>
                    <h2 class="page-title">Dashboard</h2>
                    <p class="text-muted" style="font-size: 14px; margin-top: 4px;">
                        Tahun Pelajaran: <strong>${settings.academicYear || '-'}</strong> | Semester: <strong>${settings.semester || '-'}</strong>
                    </p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card" style="cursor: pointer;" onclick="App.navigate('students')">
                    <div class="stat-icon si-primary"><i class="ph ph-users"></i></div>
                    <div class="stat-details">
                        <h3>${stats.totalStudents}</h3>
                        <p>Total Siswa</p>
                    </div>
                </div>
                <div class="stat-card" style="cursor: pointer;" onclick="App.navigate('settings')">
                    <div class="stat-icon si-secondary"><i class="ph ph-door"></i></div>
                    <div class="stat-details">
                        <h3>${stats.classes}</h3>
                        <p>Total Kelas</p>
                    </div>
                </div>
                <div class="stat-card" style="cursor: pointer;" onclick="App.navigate('settings')">
                    <div class="stat-icon si-warning"><i class="ph ph-books"></i></div>
                    <div class="stat-details">
                        <h3>${stats.subjects}</h3>
                        <p>Mata Pelajaran</p>
                    </div>
                </div>
            </div>

            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
                <!-- Akses Cepat -->
                <div class="card h-full">
                    <div class="card-header">
                        <h4>Akses Cepat</h4>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button class="btn btn-outline w-full" style="justify-content: flex-start; padding: 1rem;" onclick="App.openStudentModal()">
                                <i class="ph ph-user-plus" style="font-size: 1.5rem;"></i>
                                <span style="text-align: left;">Tambah Siswa</span>
                            </button>
                            <button class="btn btn-outline w-full" style="justify-content: flex-start; padding: 1rem;" onclick="App.navigate('grades')">
                                <i class="ph ph-file-plus" style="font-size: 1.5rem;"></i>
                                <span style="text-align: left;">Input Nilai</span>
                            </button>
                            <button class="btn btn-outline w-full" style="justify-content: flex-start; padding: 1rem;" onclick="App.navigate('attendance')">
                                <i class="ph ph-calendar-check" style="font-size: 1.5rem;"></i>
                                <span style="text-align: left;">Isi Absensi</span>
                            </button>
                            <button class="btn btn-outline w-full" style="justify-content: flex-start; padding: 1rem;" onclick="App.addJournalEntry()">
                                <i class="ph ph-notebook" style="font-size: 1.5rem;"></i>
                                <span style="text-align: left;">Isi Jurnal</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Jurnal Terakhir -->
                <div class="card h-full">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h4>Jurnal Terakhir</h4>
                        <button class="btn btn-outline btn-sm" onclick="App.navigate('journal')">Lihat Semua</button>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="table" style="font-size: 0.875rem;">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Kelas</th>
                                        <th>Materi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentJournal.length ? recentJournal.map(j => `
                                        <tr>
                                            <td>${j.date}</td>
                                            <td><span class="badge badge-primary">${j.kelas}</span></td>
                                            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${j.materi}</td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="3" class="text-center text-muted" style="padding: 2rem;">Belum ada jurnal</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    loadProfile() {
        const user = Auth.getCurrentUser();

        let profileImage = user.photo
            ? `<img src="${user.photo}" id="preview-photo" alt="Avatar">`
            : `<i class="ph ph-user" style="font-size: 4rem; color: var(--text-muted);" id="preview-icon"></i>`;

        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Profil Guru</h2>
                </div>
            </div>

    <div class="card" style="max-width: 600px;">
        <form id="profile-form">
            <div class="photo-upload-container">
                <div class="photo-preview" id="photo-preview-container">
                    ${profileImage}
                </div>
                <input type="file" id="photo-upload" accept="image/*" style="display: none;">
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('photo-upload').click()">
                        <i class="ph ph-upload-simple"></i> Unggah Foto
                    </button>
            </div>

            <div class="form-group">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" id="prof-name" class="form-control" value="${user.name}" required>
            </div>
            <div class="form-group">
                <label class="form-label">NIP</label>
                <input type="text" id="prof-nip" class="form-control" value="${user.nip}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" id="prof-email" class="form-control" value="${user.email}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Mata Pelajaran</label>
                <input type="text" id="prof-subject" class="form-control" value="${user.subject || ''}" required>
            </div>

            <div class="mt-4" style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary"><i class="ph ph-floppy-disk"></i> Simpan Perubahan</button>
            </div>
        </form>
    </div>
`;

        // Handle Photo Upload Preview
        let currentPhotoDataUrl = user.photo;
        document.getElementById('photo-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentPhotoDataUrl = e.target.result;
                    document.getElementById('photo-preview-container').innerHTML = `< img src = "${currentPhotoDataUrl}" id = "preview-photo" alt = "Avatar" > `;
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle Form Submit
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedData = {
                username: user.username,
                name: document.getElementById('prof-name').value,
                nip: document.getElementById('prof-nip').value,
                email: document.getElementById('prof-email').value,
                subject: document.getElementById('prof-subject').value,
                photo: currentPhotoDataUrl
            };

            if (Store.updateUserProfile(updatedData)) {
                Components.notify('Profil berhasil diperbarui', 'success');
                // Reload profile to reflect changes in header
                setTimeout(() => this.renderApp(), 1000);
            }
        });
    },

    loadStudents() {
        const students = Store.getStudents();
        const classes = Store.getClasses();

        let classOptions = classes.map(c => `<option value="${c}">${c}</option>`).join('');

        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Data Siswa</h2>
                    <p class="text-muted">Kelola data seluruh siswa</p>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-outline" onclick="ExportUtils.downloadStudentTemplate()">
                        <i class="ph ph-download-simple"></i> Unduh Template
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('file-import').click()">
                        <i class="ph ph-upload"></i> Impor Excel
                    </button>
                    <input type="file" id="file-import" accept=".xlsx, .xls" style="display: none;">
                    <button class="btn btn-primary" onclick="App.openStudentModal()">
                        <i class="ph ph-plus"></i> Tambah Siswa
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="form-group mb-0" style="width: 200px;">
                        <input type="text" class="form-control" id="search-student" placeholder="Cari nama siswa...">
                    </div>
                    <div class="form-group mb-0" style="width: 150px;">
                        <select class="form-control" id="filter-class">
                            <option value="">Semua Kelas</option>
                            ${classOptions}
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table" id="studentTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Foto</th>
                                <th>Nama Lengkap</th>
                                <th>L/P</th>
                                <th>Kelas</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="student-tbody">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.renderStudentTable(students);

        // Events
        document.getElementById('search-student').addEventListener('input', () => this.filterStudents());
        document.getElementById('filter-class').addEventListener('change', () => this.filterStudents());

        document.getElementById('file-import').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                ExportUtils.importStudentsFromExcel(e.target.files[0], () => {
                    this.loadStudents(); // reload page
                });
            }
        });
    },

    filterStudents() {
        const search = document.getElementById('search-student').value.toLowerCase();
        const cls = document.getElementById('filter-class').value;
        const students = Store.getStudents();

        const filtered = students.filter(s => {
            const matchName = s.name.toLowerCase().includes(search) || s.nis.toLowerCase().includes(search);
            const matchClass = cls === '' || s.kelas === cls;
            return matchName && matchClass;
        });

        this.renderStudentTable(filtered);
    },

    renderStudentTable(students) {
        const tbody = document.getElementById('student-tbody');
        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada data siswa.</td></tr>`;
            return;
        }

        tbody.innerHTML = students.map((s, index) => {
            const photoEl = s.photo
                ? `<img src="${s.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">`
                : `<div style="width:40px; height:40px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center;"><i class="ph ph-user"></i></div>`;
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${photoEl}</td>
                    <td class="font-semibold">${s.name}</td>
                    <td>${s.jk === 'P' ? 'P' : 'L'}</td>
                    <td><span class="badge badge-primary">${s.kelas}</span></td>
                    <td>
                        <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="App.openStudentModal('${s.id}')"><i class="ph ph-pencil-simple"></i></button>
                        <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; border:none;" onclick="App.deleteStudent('${s.id}')"><i class="ph ph-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openStudentModal(studentId = null) {
        let student = studentId ? Store.getStudents().find(s => s.id === studentId) : { name: '', nis: '', kelas: '7A', jk: 'L', photo: '' };
        const classes = Store.getClasses();
        const classOptions = classes.map(c => `<option value="${c}" ${student.kelas === c ? 'selected' : ''}>${c}</option>`).join('');

        const photoPreview = student.photo
            ? `<img src="${student.photo}" style="width:100%; height:100%; object-fit:cover;">`
            : `<i class="ph ph-user" style="font-size: 3rem; color:var(--text-muted);"></i>`;

        const bodyContent = `
            <form id="student-form">
                <input type="hidden" id="stud-id" value="${studentId || ''}">
                <input type="hidden" id="stud-photo-data" value="${student.photo}">

                <div class="photo-upload-container">
                    <div class="photo-preview" id="stud-photo-preview" style="width: 100px; height: 100px; cursor: pointer;" onclick="document.getElementById('stud-photo-upload').click()">
                        ${photoPreview}
                    </div>
                    <input type="file" id="stud-photo-upload" accept="image/*" style="display: none;">
                    <small class="text-muted">Klik kotak untuk ubah foto</small>
                </div>

                <div class="form-group">
                    <label class="form-label">NIS</label>
                    <input type="text" class="form-control" id="stud-nis" value="${student.nis || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nama Lengkap</label>
                    <input type="text" class="form-control" id="stud-name" value="${student.name}" required>
                </div>
                <div style="display:flex; gap:1rem;">
                    <div class="form-group w-full">
                        <label class="form-label">Jenis Kelamin</label>
                        <select class="form-control" id="stud-jk">
                            <option value="L" ${student.jk === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${student.jk === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group w-full">
                        <label class="form-label">Kelas</label>
                        <select class="form-control" id="stud-kelas">
                            ${classOptions}
                        </select>
                    </div>
                </div>
            </form>
            `;

        const footerContent = `
            <button class="btn btn-outline" onclick="Components.closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="document.getElementById('student-form').dispatchEvent(new Event('submit'))"><i class="ph ph-floppy-disk"></i> Simpan</button>
            `;

        Components.showModal(studentId ? 'Edit Siswa' : 'Tambah Siswa', bodyContent, footerContent);

        // Handle Photo logic inside modal
        document.getElementById('stud-photo-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('stud-photo-data').value = ev.target.result;
                    document.getElementById('stud-photo-preview').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Form Submit
        document.getElementById('student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('stud-id').value;
            const data = {
                nis: document.getElementById('stud-nis').value,
                name: document.getElementById('stud-name').value,
                jk: document.getElementById('stud-jk').value,
                kelas: document.getElementById('stud-kelas').value,
                photo: document.getElementById('stud-photo-data').value
            };

            if (id) {
                Store.updateStudent(id, data);
                Components.notify('Data siswa berhasil diubah', 'success');
            } else {
                Store.addStudent(data);
                Components.notify('Siswa baru berhasil ditambahkan', 'success');
            }

            Components.closeModal();
            this.loadStudents();
        });
    },

    deleteStudent(studentId) {
        Components.confirm('Hapus Siswa', 'Data siswa akan dihapus permanen. Lanjutkan?', () => {
            Store.deleteStudent(studentId);
            Components.notify('Data siswa berhasil dihapus', 'success');
            this.loadStudents();
        });
    },

    // --- Grades Module --- //

    openManualGradeModal() {
        const classes = Store.getClasses().map(c => `<option value="${c}">${c}</option>`).join('');
        const subjects = Store.getSubjects().map(s => `<option value="${s}">${s}</option>`).join('');
        const semesters = ['Ganjil', 'Genap'].map(s => `<option value="${s}">${s}</option>`).join('');

        const bodyContent = `
                <form id="manual-grade-form">
                    <div class="form-group">
                        <label class="form-label">Kelas</label>
                        <select class="form-control" id="mg-kelas" required onchange="App.updateManualStudentList()">
                            <option value="">-- Pilih Kelas --</option>
                            ${classes}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Siswa</label>
                        <select class="form-control" id="mg-student" required>
                            <option value="">-- Pilih Kelas Terlebih Dahulu --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mata Pelajaran</label>
                        <select class="form-control" id="mg-subject" required>
                            ${subjects}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Semester</label>
                        <select class="form-control" id="mg-semester" required>
                            ${semesters}
                        </select>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; max-height: 40vh; overflow-y: auto; padding-right: 10px;">
                        <div class="form-group"><label class="form-label">Tugas 1</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="tugas1" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Tugas 2</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="tugas2" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Tugas 3</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="tugas3" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Tugas 4</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="tugas4" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Praktek 1</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="praktek1" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Praktek 2</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="praktek2" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Praktek 3</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="praktek3" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Praktek 4</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="praktek4" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Praktek 5</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="praktek5" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Nilai UTS</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="uts" oninput="App.calculateManualFinal()"></div>
                        <div class="form-group"><label class="form-label">Nilai UAS</label><input type="number" min="0" max="100" class="form-control mg-val" data-type="uas" oninput="App.calculateManualFinal()"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nilai Akhir</label>
                        <input type="number" readonly class="form-control" id="mg-akhir" style="background-color: var(--surface-hover); font-weight: bold;">
                    </div>
                </form>
                `;

        const footerContent = `
                <button class="btn btn-outline" onclick="Components.closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="document.getElementById('manual-grade-form').dispatchEvent(new Event('submit'))"><i class="ph ph-floppy-disk"></i> Simpan</button>
                `;

        Components.showModal('Tambah Nilai Manual', bodyContent, footerContent);

        document.getElementById('manual-grade-form').addEventListener('submit', (e) => {
            e.preventDefault();
            App.submitManualGrade();
        });
    },

    updateManualStudentList() {
        const cls = document.getElementById('mg-kelas').value;
        const studentSelect = document.getElementById('mg-student');
        if (!cls) {
            studentSelect.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
            return;
        }
        const students = Store.getStudents().filter(s => s.kelas === cls);
        if (students.length === 0) {
            studentSelect.innerHTML = '<option value="">-- Belum ada siswa di kelas ini --</option>';
        } else {
            studentSelect.innerHTML = students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }
    },

    calculateManualFinal() {
        const inputs = Array.from(document.querySelectorAll('.mg-val')).map(inp => parseFloat(inp.value)).filter(v => !isNaN(v));
        let akhir = 0;
        if (inputs.length > 0) akhir = inputs.reduce((a, b) => a + b, 0) / inputs.length;
        document.getElementById('mg-akhir').value = inputs.length > 0 ? Math.round(akhir) : '';
    },

    submitManualGrade() {
        const studentId = document.getElementById('mg-student').value;
        const cls = document.getElementById('mg-kelas').value;
        const subject = document.getElementById('mg-subject').value;
        const semester = document.getElementById('mg-semester').value;

        if (!studentId || !cls) {
            Components.notify('Silakan pilih kelas dan siswa', 'error');
            return;
        }

        const student = Store.getStudents().find(s => s.id === studentId);

        const record = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            studentId, studentName: student.name, kelas: cls, subject, semester,
            date: new Date().toISOString().split('T')[0],
            akhir: document.getElementById('mg-akhir').value
        };

        let hasValue = false;
        document.querySelectorAll('.mg-val').forEach(inp => {
            record[inp.dataset.type] = inp.value;
            if (inp.value) hasValue = true;
        });

        if (!hasValue) {
            Components.notify('Minimal masukkan satu nilai', 'error');
            return;
        }

        let allGrades = Store.getGrades();
        allGrades = allGrades.filter(g => !(g.studentId === studentId && g.subject === subject && g.semester === semester));
        allGrades.push(record);

        Store.saveGrades(allGrades);
        Components.notify('Nilai manual berhasil ditambahkan', 'success');
        Components.closeModal();

        const currentCls = document.getElementById('daftar-class')?.value;
        const currentSubj = document.getElementById('daftar-subject')?.value;
        const currentSem = document.getElementById('daftar-semester')?.value;

        if (currentCls === cls && currentSubj === subject && currentSem === semester) {
            App.renderDaftarNilaiTable();
        }
    },

    // Replaced printGrades with printDaftarNilai

    loadDaftarNilai() {
        const classes = Store.getClasses().map(c => `<option value="${c}">${c}</option>`).join('');
        const subjects = Store.getSubjects().map(s => `<option value="${s}">${s}</option>`).join('');
        const semesters = ['Ganjil', 'Genap'].map(s => `<option value="${s}">${s}</option>`).join('');

        document.getElementById('page-content').innerHTML = `
                <div class="page-header">
                    <div>
                        <h2 class="page-title">Daftar Nilai</h2>
                        <p class="text-muted">Lihat dan cetak nilai akhir siswa per kelas</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="App.openManualGradeModal()">
                            <i class="ph ph-plus"></i> Tambah Manual
                        </button>
                        <button class="btn btn-secondary" onclick="ExportUtils.exportTableToExcel('daftarGradesTable', 'Daftar_Nilai.xlsx')">
                            <i class="ph ph-microsoft-excel-logo"></i> Unduh Excel
                        </button>
                        <button class="btn btn-outline" onclick="App.printDaftarNilai()">
                            <i class="ph ph-printer"></i> Cetak
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <div class="form-group mb-0">
                                <label class="form-label mb-1" style="font-size:0.75rem;">Kelas</label>
                                <select class="form-control" id="daftar-class" onchange="App.renderDaftarNilaiTable()">
                                    <option value="">-- Pilih Kelas --</option>
                                    ${classes}
                                </select>
                            </div>
                            <div class="form-group mb-0">
                                <label class="form-label mb-1" style="font-size:0.75rem;">Mata Pelajaran</label>
                                <select class="form-control" id="daftar-subject" onchange="App.renderDaftarNilaiTable()">
                                    ${subjects}
                                </select>
                            </div>
                            <div class="form-group mb-0">
                                <label class="form-label mb-1" style="font-size:0.75rem;">Semester</label>
                                <select class="form-control" id="daftar-semester" onchange="App.renderDaftarNilaiTable()">
                                    ${semesters}
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" id="btn-save-grades" onclick="App.saveGrades()" style="display:none;">
                            <i class="ph ph-floppy-disk"></i> Simpan Nilai
                        </button>
                    </div>

                    <div class="table-responsive">
                        <table class="table" id="daftarGradesTable">
                            <thead>
                                <tr>
                                    <th style="width: 50px;">No</th>
                                    <th>Foto</th>
                                    <th>Nama Siswa</th>
                                    <th style="width: 70px;">T1</th>
                                    <th style="width: 70px;">T2</th>
                                    <th style="width: 70px;">T3</th>
                                    <th style="width: 70px;">T4</th>
                                    <th style="width: 70px;">P1</th>
                                    <th style="width: 70px;">P2</th>
                                    <th style="width: 70px;">P3</th>
                                    <th style="width: 70px;">P4</th>
                                    <th style="width: 70px;">P5</th>
                                    <th style="width: 70px;">UTS</th>
                                    <th style="width: 70px;">UAS</th>
                                    <th style="width: 80px;">Akhir</th>
                                    <th style="width: 80px;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="daftar-grades-tbody">
                                <tr><td colspan="16" class="text-center text-muted">Silakan pilih kelas terlebih dahulu.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                `;
    },

    renderDaftarNilaiTable() {
        const cls = document.getElementById('daftar-class').value;
        const subject = document.getElementById('daftar-subject').value;
        const semester = document.getElementById('daftar-semester').value;
        const btnSave = document.getElementById('btn-save-grades');
        const tbody = document.getElementById('daftar-grades-tbody');

        if (!cls) {
            tbody.innerHTML = `<tr><td colspan="16" class="text-center text-muted">Silakan pilih kelas terlebih dahulu.</td></tr>`;
            if (btnSave) btnSave.style.display = 'none';
            return;
        }

        const students = Store.getStudents().filter(s => s.kelas === cls);
        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="16" class="text-center text-muted">Belum ada siswa di kelas ini.</td></tr>`;
            if (btnSave) btnSave.style.display = 'none';
            return;
        }

        const allGrades = Store.getGrades();
        if (btnSave) btnSave.style.display = 'inline-flex';

        tbody.innerHTML = students.map((s, index) => {
            const gradeRecord = allGrades.find(g => g.studentId === s.id && g.subject === subject && g.semester === semester) || {};
            const photoEl = s.photo ? `<img src="${s.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<div style="width:40px; height:40px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center;"><i class="ph ph-user"></i></div>`;

            return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${photoEl}</td>
                        <td class="font-semibold" style="min-width: 150px;">${s.name}
                            <input type="hidden" class="g-student-id" value="${s.id}">
                                <input type="hidden" class="g-student-name" value="${s.name}">
                                </td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="tugas1" value="${gradeRecord.tugas1 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="tugas2" value="${gradeRecord.tugas2 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="tugas3" value="${gradeRecord.tugas3 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="tugas4" value="${gradeRecord.tugas4 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="praktek1" value="${gradeRecord.praktek1 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="praktek2" value="${gradeRecord.praktek2 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="praktek3" value="${gradeRecord.praktek3 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="praktek4" value="${gradeRecord.praktek4 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="praktek5" value="${gradeRecord.praktek5 || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="uts" value="${gradeRecord.uts || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" min="0" max="100" step="1" class="form-control g-val" data-type="uas" value="${gradeRecord.uas || ''}" oninput="App.calculateFinalGrade(this)" onfocus="this.select()"></td>
                                <td><input type="number" readonly class="form-control g-akhir" value="${gradeRecord.akhir || ''}" style="background-color: var(--surface-hover); font-weight: bold; width: 60px;"></td>
                                <td>
                                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="App.editGrade('${s.id}', '${cls}', '${subject}', '${semester}')" title="Edit Nilai Manual"><i class="ph ph-pencil-simple"></i></button>
                                </td>
                            </tr>
                            `;
        }).join('');
    },

    calculateFinalGrade(inputElement) {
        const row = inputElement.closest('tr');
        const inputs = Array.from(row.querySelectorAll('.g-val')).map(inp => parseFloat(inp.value)).filter(v => !isNaN(v));

        let akhir = 0;
        if (inputs.length > 0) {
            akhir = inputs.reduce((a, b) => a + b, 0) / inputs.length;
        }

        row.querySelector('.g-akhir').value = inputs.length > 0 ? Math.round(akhir) : '';
    },

    saveGrades() {
        const cls = document.getElementById('daftar-class')?.value;
        const subject = document.getElementById('daftar-subject')?.value;
        const semester = document.getElementById('daftar-semester')?.value;
        const date = new Date().toISOString().split('T')[0];

        if (!cls || !subject || !semester) {
            Components.notify('Lengkapi filter kelas, mata pelajaran, dan semester', 'error');
            return;
        }

        let allGrades = Store.getGrades();

        allGrades = allGrades.filter(g => !(g.kelas === cls && g.subject === subject && g.semester === semester));

        const rows = document.querySelectorAll('#daftar-grades-tbody tr');
        rows.forEach(row => {
            const studentIdEl = row.querySelector('.g-student-id');
            if (!studentIdEl) return;

            const studentId = studentIdEl.value;
            const studentName = row.querySelector('.g-student-name').value;

            const record = {
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                studentId, studentName, kelas: cls, subject, semester, date,
                akhir: row.querySelector('.g-akhir').value
            };

            let hasValue = false;
            row.querySelectorAll('.g-val').forEach(inp => {
                record[inp.dataset.type] = inp.value;
                if (inp.value) hasValue = true;
            });

            if (hasValue) {
                allGrades.push(record);
            }
        });

        Store.saveGrades(allGrades);
        Components.notify('Nilai berhasil disimpan', 'success');
    },

    editGrade(studentId, cls, subject, semester) {
        this.openManualGradeModal();
        setTimeout(() => {
            document.getElementById('mg-kelas').value = cls;
            this.updateManualStudentList();
            document.getElementById('mg-student').value = studentId;
            document.getElementById('mg-subject').value = subject;
            document.getElementById('mg-semester').value = semester;

            const gradeRecord = Store.getGrades().find(g => g.studentId === studentId && g.subject === subject && g.semester === semester) || {};

            const fields = ['tugas1', 'tugas2', 'tugas3', 'tugas4', 'praktek1', 'praktek2', 'praktek3', 'praktek4', 'praktek5', 'uts', 'uas'];
            fields.forEach(f => {
                const el = document.querySelector(`.mg-val[data-type="${f}"]`);
                if (el) el.value = gradeRecord[f] || '';
            });
            this.calculateManualFinal();
        }, 100);
    },

    printDaftarNilai() {
        const cls = document.getElementById('daftar-class')?.value || '-';
        const subj = document.getElementById('daftar-subject')?.value || '-';
        const sem = document.getElementById('daftar-semester')?.value || '-';

        const tableHtml = document.getElementById('daftarGradesTable').outerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;
        tempDiv.querySelectorAll('input').forEach(inp => {
            const val = inp.value;
            const span = document.createElement('span');
            span.textContent = val;
            inp.parentNode.replaceChild(span, inp);
        });

        ExportUtils.printSection(`Daftar Nilai Kelas ${cls} - ${subj} (Semester ${sem})`, tempDiv.innerHTML);
    },

    // --- Attendance Module --- //
    loadAttendance() {
        const classes = Store.getClasses().map(c => `<option value="${c}">${c}</option>`).join('');
        const subjects = Store.getSubjects().map(s => `<option value="${s}">${s}</option>`).join('');
        const today = new Date().toISOString().split('T')[0];

        document.getElementById('page-content').innerHTML = `
                            <div class="page-header">
                                <div>
                                    <h2 class="page-title">Absensi Siswa</h2>
                                    <p class="text-muted">Kelola kehadiran harian per kelas dan mata pelajaran</p>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-secondary" onclick="ExportUtils.exportTableToExcel('attendanceTable', 'Data_Kehadiran.xlsx')">
                                        <i class="ph ph-microsoft-excel-logo"></i> Unduh Excel
                                    </button>
                                    <button class="btn btn-outline" onclick="App.printAttendance()">
                                        <i class="ph ph-printer"></i> Cetak
                                    </button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
                                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                        <div class="form-group mb-0">
                                            <label class="form-label mb-1" style="font-size:0.75rem;">Tanggal</label>
                                            <input type="date" class="form-control" id="attn-date" value="${today}" onchange="App.renderAttendanceTable()">
                                        </div>
                                        <div class="form-group mb-0">
                                            <label class="form-label mb-1" style="font-size:0.75rem;">Kelas</label>
                                            <select class="form-control" id="attn-class" onchange="App.renderAttendanceTable()">
                                                <option value="">-- Pilih Kelas --</option>
                                                ${classes}
                                            </select>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label class="form-label mb-1" style="font-size:0.75rem;">Mata Pelajaran</label>
                                            <select class="form-control" id="attn-subject" onchange="App.renderAttendanceTable()">
                                                ${subjects}
                                            </select>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary" id="btn-save-attn" onclick="App.saveAttendance()" style="display:none;">
                                        <i class="ph ph-floppy-disk"></i> Simpan Absensi
                                    </button>
                                </div>

                                <div class="table-responsive">
                                    <table class="table" id="attendanceTable">
                                        <thead>
                                            <tr>
                                                <th style="width: 50px;">No</th>
                                                <th>Nama Siswa</th>
                                                <th style="width: 50px; text-align: center;">H</th>
                                                <th style="width: 50px; text-align: center;">S</th>
                                                <th style="width: 50px; text-align: center;">I</th>
                                                <th style="width: 50px; text-align: center;">A</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody id="attn-tbody">
                                            <tr><td colspan="7" class="text-center text-muted">Silakan pilih kelas terlebih dahulu.</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            `;
    },

    renderAttendanceTable() {
        const cls = document.getElementById('attn-class').value;
        const subject = document.getElementById('attn-subject').value;
        const date = document.getElementById('attn-date').value;
        const btnSave = document.getElementById('btn-save-attn');
        const tbody = document.getElementById('attn-tbody');

        if (!cls || !date) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Silakan pilih kelas dan tanggal.</td></tr>`;
            btnSave.style.display = 'none';
            return;
        }

        const students = Store.getStudents().filter(s => s.kelas === cls);
        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada siswa di kelas ini.</td></tr>`;
            btnSave.style.display = 'none';
            return;
        }

        const allAttn = Store.getAttendance();
        btnSave.style.display = 'inline-flex';

        tbody.innerHTML = students.map((s, index) => {
            const attnRecord = allAttn.find(a => a.studentId === s.id && a.date === date && a.subject === subject) || { status: 'H', keterangan: '' };

            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td class="font-semibold">${s.name}
                                    <input type="hidden" class="a-student-id" value="${s.id}">
                                        <input type="hidden" class="a-student-name" value="${s.name}">
                                        </td>
                                        <td style="text-align: center;"><input type="radio" name="status-${s.id}" value="H" class="a-status" ${attnRecord.status === 'H' ? 'checked' : ''}></td>
                                        <td style="text-align: center;"><input type="radio" name="status-${s.id}" value="S" class="a-status" ${attnRecord.status === 'S' ? 'checked' : ''}></td>
                                        <td style="text-align: center;"><input type="radio" name="status-${s.id}" value="I" class="a-status" ${attnRecord.status === 'I' ? 'checked' : ''}></td>
                                        <td style="text-align: center;"><input type="radio" name="status-${s.id}" value="A" class="a-status" ${attnRecord.status === 'A' ? 'checked' : ''}></td>
                                        <td><input type="text" class="form-control a-ket" value="${attnRecord.keterangan || ''}" placeholder="Catatan opsional"></td>
                                    </tr>
                                    `;
        }).join('');
    },

    saveAttendance() {
        const cls = document.getElementById('attn-class').value;
        const subject = document.getElementById('attn-subject').value;
        const date = document.getElementById('attn-date').value;
        const month = date.substring(0, 7);

        let allAttn = Store.getAttendance();
        allAttn = allAttn.filter(a => !(a.kelas === cls && a.subject === subject && a.date === date));

        const rows = document.querySelectorAll('#attn-tbody tr');
        rows.forEach(row => {
            const studentIdEl = row.querySelector('.a-student-id');
            if (!studentIdEl) return;

            const studentId = studentIdEl.value;
            const studentName = row.querySelector('.a-student-name').value;
            const statusEl = row.querySelector('.a-status:checked');
            const status = statusEl ? statusEl.value : 'H';
            const ket = row.querySelector('.a-ket').value;

            allAttn.push({
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                studentId, studentName, kelas: cls, subject, date, month, status, keterangan: ket
            });
        });

        Store.saveAttendance(allAttn);
        Components.notify('Absensi berhasil disimpan', 'success');
    },

    printAttendance() {
        const cls = document.getElementById('attn-class')?.value || '-';
        const subj = document.getElementById('attn-subject')?.value || '-';
        const date = document.getElementById('attn-date')?.value || '-';

        const tableHtml = document.getElementById('attendanceTable').outerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;

        tempDiv.querySelectorAll('tr').forEach((row, index) => {
            if (index === 0) return; // Header handled separately or skipped if problematic

            const radios = row.querySelectorAll('.a-status');
            if (radios.length === 4) {
                radios.forEach(radio => {
                    const span = document.createElement('span');
                    span.textContent = radio.checked ? '✔' : '';
                    radio.parentNode.replaceChild(span, radio);
                });
            }
        });

        // Handle inputs (Keterangan)
        tempDiv.querySelectorAll('input').forEach(inp => {
            if (inp.type === 'hidden') return;
            const val = inp.value;
            const span = document.createElement('span');
            span.textContent = val;
            inp.parentNode.replaceChild(span, inp);
        });

        ExportUtils.printSection(`Absensi Kelas ${cls} - ${subj} (${date})`, tempDiv.innerHTML);
    },

    // --- Report / Recap Modules --- //

    loadRecaps(type) {
        const isJournal = type === 'journal';
        let title = '';
        if (type === 'grades') title = 'Rekap Nilai Bulanan';
        if (type === 'attendance') title = 'Rekap Absensi Bulanan';
        if (isJournal) title = 'Jurnal Mengajar';

        const classes = Store.getClasses().map(c => `<option value="${c}">${c}</option>`).join('');
        const thisMonth = new Date().toISOString().substring(0, 7);

        document.getElementById('page-content').innerHTML = `
                                    <div class="page-header">
                                        <div>
                                            <h2 class="page-title">${title}</h2>
                                            <p class="text-muted">Akses laporan dan rekapitulasi data administrasi</p>
                                        </div>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <button class="btn btn-secondary" onclick="ExportUtils.exportTableToExcel('recapTable', '${title.replace(/ /g, '_')}.xlsx')">
                                                <i class="ph ph-download-simple"></i> Unduh Excel
                                            </button>
                                            <button class="btn btn-outline" onclick="ExportUtils.printSection('${title}', document.getElementById('recap-table-container').innerHTML)">
                                                <i class="ph ph-printer"></i> Cetak
                                            </button>
                                        </div>
                                    </div>

                                    <div class="card">
                                        <div class="card-header" style="gap: 1rem; flex-wrap: wrap;">
                                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                                <div class="form-group mb-0">
                                                    <label class="form-label mb-1" style="font-size:0.75rem;">Bulan</label>
                                                    <input type="month" class="form-control" id="recap-month" value="${thisMonth}" onchange="App.renderRecapData('${type}')">
                                                </div>
                                                ${!isJournal ? `
                         <div class="form-group mb-0">
                            <label class="form-label mb-1" style="font-size:0.75rem;">Kelas (Opsional)</label>
                            <select class="form-control" id="recap-class" onchange="App.renderRecapData('${type}')">
                                <option value="">Semua Kelas</option>
                                ${classes}
                            </select>
                        </div>` : ''}
                                            </div>

                                            ${isJournal ? `
                    <button class="btn btn-primary" onclick="App.addJournalEntry('${thisMonth}')">
                        <i class="ph ph-plus"></i> Tambah Jurnal
                    </button>
                    ` : ''}
                                        </div>

                                        <div class="table-responsive" id="recap-table-container">
                                            <table class="table" id="recapTable">
                                                <!-- Table structure populated via JS -->
                                            </table>
                                        </div>
                                    </div>
                                    `;

        this.renderRecapData(type);
    },

    renderRecapData(type) {
        const month = document.getElementById('recap-month').value;
        const clsEl = document.getElementById('recap-class');
        const cls = clsEl ? clsEl.value : '';
        const table = document.getElementById('recapTable');

        if (type === 'grades') {
            let data = Store.getGrades().filter(g => g.date && g.date.startsWith(month));
            if (cls) data = data.filter(g => g.kelas === cls);

            table.innerHTML = `
                                    <thead>
                                        <tr>
                                            <th>Tanggal Input</th>
                                            <th>Kelas</th>
                                            <th>Foto</th>
                                            <th>Siswa</th>
                                            <th>Mapel</th>
                                            <th>Semester</th>
                                            <th>T1</th><th>T2</th><th>T3</th><th>T4</th>
                                            <th>P1</th><th>P2</th><th>P3</th><th>P4</th><th>P5</th>
                                            <th>UTS</th>
                                            <th>UAS</th>
                                            <th>Akhir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.length ? data.map(d => {
                const student = Store.getStudents().find(s => s.id === d.studentId);
                const photoEl = student && student.photo ? `<img src="${student.photo}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">` : `<div style="width:30px; height:30px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center;font-size:12px;"><i class="ph ph-user"></i></div>`;
                return `
                        <tr>
                            <td>${d.date}</td>
                            <td>${d.kelas}</td>
                            <td>${photoEl}</td>
                            <td>${d.studentName}</td>
                            <td>${d.subject}</td>
                            <td>${d.semester}</td>
                            <td>${d.tugas1 || '-'}</td><td>${d.tugas2 || '-'}</td><td>${d.tugas3 || '-'}</td><td>${d.tugas4 || '-'}</td>
                            <td>${d.praktek1 || '-'}</td><td>${d.praktek2 || '-'}</td><td>${d.praktek3 || '-'}</td><td>${d.praktek4 || '-'}</td><td>${d.praktek5 || '-'}</td>
                            <td>${d.uts || '-'}</td>
                            <td>${d.uas || '-'}</td>
                            <td class="font-bold">${d.akhir || '-'}</td>
                        </tr>
                        `;
            }).join('') : '<tr><td colspan="18" class="text-center text-muted">Tidak ada data untuk bulan ini</td></tr>'}
                                    </tbody>
                                    `;
        }
        else if (type === 'attendance') {
            let data = Store.getAttendance().filter(a => a.month === month);
            if (cls) data = data.filter(a => a.kelas === cls);

            table.innerHTML = `
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Kelas</th>
                                            <th>Siswa</th>
                                            <th>Mapel</th>
                                            <th>Status</th>
                                            <th>Ket</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.length ? data.map(d => {
                let badgeClass = d.status === 'H' ? 'badge-success' : d.status === 'S' || d.status === 'I' ? 'badge-warning' : 'badge-danger';
                return `
                        <tr>
                            <td>${d.date}</td>
                            <td>${d.kelas}</td>
                            <td>${d.studentName}</td>
                            <td>${d.subject}</td>
                            <td><span class="badge ${badgeClass}">${d.status}</span></td>
                            <td>${d.keterangan || '-'}</td>
                        </tr>
                        `;
            }).join('') : '<tr><td colspan="6" class="text-center text-muted">Tidak ada data untuk bulan ini</td></tr>'}
                                    </tbody>
                                    `;
        }
        else if (type === 'journal') {
            let data = Store.getJournal().filter(j => j.date.startsWith(month));
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            table.innerHTML = `
                                    <thead>
                                        <tr>
                                            <th style="width:120px;">Tanggal</th>
                                            <th style="width:100px;">Kelas</th>
                                            <th style="width:120px;">Mapel</th>
                                            <th>Materi Pembahasan</th>
                                            <th>Pelanggaran Siswa</th>
                                            <th style="width:120px;">Hadir/Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.length ? data.map(d => `
                        <tr>
                            <td>${d.date}</td>
                            <td><span class="badge badge-primary">${d.kelas}</span></td>
                            <td>${d.subject}</td>
                            <td>${d.materi}</td>
                            <td>${d.pelanggaran || '-'}</td>
                            <td>${d.hadir}/${d.total}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="5" class="text-center text-muted">Tidak ada jurnal untuk bulan ini</td></tr>'}
                                    </tbody>
                                    `;
        }
    },

    loadRecapsYearly(type) {
        let title = type === 'grades' ? 'Rekap Nilai Tahunan' : 'Rekap Absensi Tahunan';
        const years = [2026, 2027, 2028, 2029, 2030];
        const yearOptions = years.map(y => `<option value="${y}">${y}</option>`).join('');

        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">${title}</h2>
                    <p class="text-muted">Ringkasan data administrasi selama satu tahun</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" onclick="ExportUtils.exportTableToExcel('recapYearlyTable', '${title.replace(/ /g, '_')}.xlsx')">
                        <i class="ph ph-download-simple"></i> Unduh Excel
                    </button>
                    <button class="btn btn-outline" onclick="ExportUtils.printSection('${title}', document.getElementById('recap-yearly-container').innerHTML)">
                        <i class="ph ph-printer"></i> Cetak
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-header" style="gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div class="form-group mb-0">
                            <label class="form-label mb-1" style="font-size:0.75rem;">Pilih Tahun</label>
                            <select class="form-control" id="recap-year" onchange="App.renderRecapDataYearly('${type}')">
                                ${yearOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="table-responsive" id="recap-yearly-container">
                    <table class="table" id="recapYearlyTable">
                        <!-- Table structure populated via JS -->
                    </table>
                </div>
            </div>
        `;

        this.renderRecapDataYearly(type);
    },

    renderRecapDataYearly(type) {
        const year = document.getElementById('recap-year').value;
        const table = document.getElementById('recapYearlyTable');

        if (type === 'grades') {
            let data = Store.getGrades().filter(g => g.date && g.date.startsWith(year));
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kelas</th>
                        <th>Siswa</th>
                        <th>Mapel</th>
                        <th>Smt</th>
                        <th>Tgs</th><th>Prk</th><th>UTS</th><th>UAS</th><th>Akhir</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.length ? data.map(d => `
                        <tr>
                            <td>${d.date}</td>
                            <td>${d.kelas}</td>
                            <td>${d.studentName}</td>
                            <td>${d.subject}</td>
                            <td>${d.semester}</td>
                            <td>${d.tugas1 || '-'}</td>
                            <td>${d.praktek1 || '-'}</td>
                            <td>${d.uts || '-'}</td>
                            <td>${d.uas || '-'}</td>
                            <td class="font-bold">${d.akhir || '-'}</td>
                        </tr>
                    `).join('') : `<tr><td colspan="10" class="text-center text-muted">Tidak ada data untuk tahun ${year}</td></tr>`}
                </tbody>
            `;
        } else if (type === 'attendance') {
            let data = Store.getAttendance().filter(a => a.date && a.date.startsWith(year));

            // Aggregate by student and subject
            const aggregate = {};
            data.forEach(a => {
                const key = `${a.studentId}_${a.subject}`;
                if (!aggregate[key]) {
                    aggregate[key] = {
                        name: a.studentName,
                        kelas: a.kelas,
                        subject: a.subject,
                        H: 0, S: 0, I: 0, A: 0
                    };
                }
                if (['H', 'S', 'I', 'A'].includes(a.status)) {
                    aggregate[key][a.status]++;
                }
            });

            const sortedData = Object.values(aggregate).sort((a, b) => a.kelas.localeCompare(b.kelas) || a.name.localeCompare(b.name));

            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Kelas</th>
                        <th>Nama Siswa</th>
                        <th>Mata Pelajaran</th>
                        <th class="text-center">Hadir</th>
                        <th class="text-center">Sakit</th>
                        <th class="text-center">Izin</th>
                        <th class="text-center">Alpa</th>
                        <th class="text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedData.length ? sortedData.map(d => `
                        <tr>
                            <td><span class="badge badge-primary">${d.kelas}</span></td>
                            <td class="font-semibold">${d.name}</td>
                            <td>${d.subject}</td>
                            <td class="text-center">${d.H}</td>
                            <td class="text-center">${d.S}</td>
                            <td class="text-center">${d.I}</td>
                            <td class="text-center">${d.A}</td>
                            <td class="text-center font-bold">${d.H + d.S + d.I + d.A}</td>
                        </tr>
                    `).join('') : `<tr><td colspan="8" class="text-center text-muted">Tidak ada data absensi untuk tahun ${year}</td></tr>`}
                </tbody>
            `;
        }
    },

    addJournalEntry(currentMonthVal) {
        const classes = Store.getClasses().map(c => `<option value="${c}">${c}</option>`).join('');
        const subjects = Store.getSubjects().map(s => `<option value="${s}">${s}</option>`).join('');
        const today = new Date().toISOString().split('T')[0];

        const body = `
                                    <form id="journal-form">
                                        <div class="form-group">
                                            <label class="form-label">Tanggal</label>
                                            <input type="date" class="form-control" id="j-date" value="${today}" required>
                                        </div>
                                        <div style="display:flex; gap:1rem;">
                                            <div class="form-group w-full">
                                                <label class="form-label">Kelas</label>
                                                <select class="form-control" id="j-class">${classes}</select>
                                            </div>
                                            <div class="form-group w-full">
                                                <label class="form-label">Mapel</label>
                                                <select class="form-control" id="j-subject">${subjects}</select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Materi Pembahasan</label>
                                            <textarea class="form-control" id="j-materi" rows="3" required placeholder="Tulis ringkasan materi yang diajarkan..."></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Pelanggaran Siswa (Opsional)</label>
                                            <textarea class="form-control" id="j-pelanggaran" rows="2" placeholder="Tulis jika ada siswa yang melanggar tata tertib..."></textarea>
                                        </div>
                                        <div style="display:flex; gap:1rem;">
                                            <div class="form-group w-full">
                                                <label class="form-label">Jml Hadir</label>
                                                <input type="number" class="form-control" id="j-hadir" required>
                                            </div>
                                            <div class="form-group w-full">
                                                <label class="form-label">Jml Total Siswa</label>
                                                <input type="number" class="form-control" id="j-total" required>
                                            </div>
                                        </div>
                                    </form>
                                    `;

        const footer = `
                                    <button class="btn btn-outline" onclick="Components.closeModal()">Batal</button>
                                    <button class="btn btn-primary" onclick="document.getElementById('journal-form').dispatchEvent(new Event('submit'))"><i class="ph ph-floppy-disk"></i> Simpan Jurnal</button>
                                    `;

        Components.showModal('Tambah Jurnal Mengajar', body, footer);

        const form = document.getElementById('journal-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: Date.now().toString(),
                date: document.getElementById('j-date').value,
                kelas: document.getElementById('j-class').value,
                subject: document.getElementById('j-subject').value,
                materi: document.getElementById('j-materi').value,
                pelanggaran: document.getElementById('j-pelanggaran').value,
                hadir: document.getElementById('j-hadir').value,
                total: document.getElementById('j-total').value,
            };

            const journal = Store.getJournal();
            journal.push(data);
            Store.saveJournal(journal);

            Components.notify('Jurnal berhasil disimpan', 'success');
            Components.closeModal();
        });
    },

    // --- Settings Module --- //

    loadSettings() {
        const settings = Store.getAppSettings();
        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Pengaturan Aplikasi</h2>
                    <p class="text-muted">Konfigurasi identitas dan tampilan aplikasi</p>
                </div>
                <button class="btn btn-primary" onclick="App.saveSettings()">
                    <i class="ph ph-floppy-disk"></i> Simpan Perubahan
                </button>
            </div>

            <div class="card animate-fade-in">
                <div class="card-header">
                    <h4>Identitas Madrasah</h4>
                </div>
                <div class="card-body" style="padding: 1.5rem;">
                    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                        <div class="form-group">
                            <label class="form-label">Judul Aplikasi</label>
                            <input type="text" class="form-control" id="set-title" value="${settings.title || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nama Sekolah / Madrasah</label>
                            <input type="text" class="form-control" id="set-school" value="${settings.schoolName || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nama Kepala Madrasah</label>
                            <input type="text" class="form-control" id="set-headmaster" value="${settings.headmaster || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Website Madrasah</label>
                            <input type="text" class="form-control" id="set-website" value="${settings.website || ''}">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label">Alamat Sekolah</label>
                            <textarea class="form-control" id="set-address" rows="2">${settings.address || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tahun Pelajaran</label>
                            <input type="text" class="form-control" id="set-year" value="${settings.academicYear || ''}" placeholder="Contoh: 2025/2026">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Semester</label>
                            <select class="form-control" id="set-semester">
                                <option value="Ganjil" ${settings.semester === 'Ganjil' ? 'selected' : ''}>Ganjil</option>
                                <option value="Genap" ${settings.semester === 'Genap' ? 'selected' : ''}>Genap</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-4 animate-fade-in">
                <div class="card-header">
                    <h4>Konfigurasi Dropdown & Data</h4>
                </div>
                <div class="card-body" style="padding: 1.5rem;">
                    <div class="form-group">
                        <label class="form-label">Daftar Mata Pelajaran (Pisahkan dengan koma)</label>
                        <textarea class="form-control" id="set-subjects" rows="3" placeholder="Contoh: Matematika, IPA, IPS">${settings.subjects || ''}</textarea>
                    </div>
                    <div class="form-group mt-3">
                        <label class="form-label">Daftar Kelas (Pisahkan dengan koma)</label>
                        <textarea class="form-control" id="set-classes" rows="3" placeholder="Contoh: 7A, 7B, 8A, 8B">${settings.classes || ''}</textarea>
                    </div>
                </div>
            </div>

            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
                <!-- Logo Sekolah -->
                <div class="card h-full">
                    <div class="card-header">
                        <h4>Logo Sekolah</h4>
                    </div>
                    <div class="card-body text-center" style="padding: 1.5rem;">
                        <div class="mb-3">
                            <img id="logo-preview" src="${settings.logo || ''}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-light); background: #f8fafc; display: ${settings.logo ? 'inline-block' : 'none'};">
                            ${!settings.logo ? '<div id="logo-placeholder" style="width: 120px; height: 120px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto;"><i class="ph ph-image" style="font-size: 3rem; color: #cbd5e1;"></i></div>' : ''}
                        </div>
                        <input type="file" id="set-logo-input" class="form-control" accept="image/*" onchange="App.previewImage(this, 'logo-preview', 'logo-placeholder')">
                        <p class="text-muted mt-2" style="font-size: 0.75rem;">Format PNG/JPG, ukuran kotak (1:1) disarankan.</p>
                    </div>
                </div>

                <!-- Banner Login -->
                <div class="card h-full">
                    <div class="card-header">
                        <h4>Banner Halaman Login</h4>
                    </div>
                    <div class="card-body text-center" style="padding: 1.5rem;">
                        <div class="mb-3">
                            <img id="banner-preview" src="${settings.banner || ''}" style="width: 100%; height: 120px; border-radius: 8px; object-fit: cover; border: 2px dashed #e2e8f0; display: ${settings.banner ? 'block' : 'none'};">
                            ${!settings.banner ? '<div id="banner-placeholder" style="width: 100%; height: 120px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center;"><i class="ph ph-image" style="font-size: 3rem; color: #cbd5e1;"></i></div>' : ''}
                        </div>
                        <input type="file" id="set-banner-input" class="form-control" accept="image/*" onchange="App.previewImage(this, 'banner-preview', 'banner-placeholder')">
                        <p class="text-muted mt-2" style="font-size: 0.75rem;">Akan muncul sebagai latar belakang halaman login.</p>
                    </div>
                </div>
            </div>

            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
                <div class="card h-full">
                    <div class="card-header">
                        <h4>Manajemen Data</h4>
                    </div>
                    <div class="card-body" style="padding: 1.5rem;">
                        <p class="text-muted mb-3" style="font-size: 0.875rem;">Amankan data Anda dengan mencadangkannya secara berkala.</p>
                        <div class="flex flex-col gap-2">
                            <button class="btn btn-outline w-full" onclick="App.exportData()">
                                <i class="ph ph-download-simple"></i> Cadangkan Data (Backup JSON)
                            </button>
                            <div class="mt-2">
                                <label class="form-label" style="font-size: 0.75rem;">Pulihkan dari Cadangan</label>
                                <input type="file" id="restore-input" class="form-control btn-sm" accept=".json" onchange="App.importData(this)">
                            </div>
                            <button class="btn btn-outline w-full mt-4" style="color: var(--danger); border-color: var(--danger);" onclick="App.resetData()">
                                <i class="ph ph-trash"></i> Reset Seluruh Data Sistem
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card h-full">
                    <div class="card-header">
                        <h4>Keamanan Akun</h4>
                    </div>
                    <div class="card-body" style="padding: 1.5rem;">
                        <div class="form-group">
                            <label class="form-label">Password Baru</label>
                            <input type="password" class="form-control" id="new-password">
                        </div>
                        <div class="form-group mt-3">
                            <label class="form-label">Konfirmasi Password</label>
                            <input type="password" class="form-control" id="confirm-password">
                        </div>
                        <button class="btn btn-primary w-full mt-4" onclick="App.changeSettingsPassword()">
                            <i class="ph ph-lock"></i> Perbarui Password
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    previewImage(input, previewId, placeholderId) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.getElementById(previewId);
                const placeholder = document.getElementById(placeholderId);
                preview.src = e.target.result;
                preview.style.display = 'inline-block';
                if (placeholder) placeholder.style.display = 'none';
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    saveSettings() {
        const title = document.getElementById('set-title').value;
        const schoolName = document.getElementById('set-school').value;
        const headmaster = document.getElementById('set-headmaster').value;
        const address = document.getElementById('set-address').value;
        const website = document.getElementById('set-website').value;
        const academicYear = document.getElementById('set-year').value;
        const semester = document.getElementById('set-semester').value;
        const subjects = document.getElementById('set-subjects').value;
        const classes = document.getElementById('set-classes').value;
        const logo = document.getElementById('logo-preview').src;
        const banner = document.getElementById('banner-preview').src;

        Store.updateAppSettings({
            title, schoolName, headmaster, address, website, academicYear, semester, subjects, classes,
            logo: logo.startsWith('data:') ? logo : Store.getAppSettings().logo,
            banner: banner.startsWith('data:') ? banner : Store.getAppSettings().banner
        });

        Components.notify('Pengaturan berhasil disimpan. Memuat ulang...', 'success');
        setTimeout(() => location.reload(), 1500);
    },

    // --- Data Maintenance ---
    exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_adm_guru_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        Components.notify('File cadangan berhasil diunduh', 'success');
    },

    importData(input) {
        if (!input.files || !input.files[0]) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('Seluruh data saat ini akan diganti dengan data dari file cadangan. Lanjutkan?')) {
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                    });
                    Components.notify('Data berhasil dipulihkan. Memuat ulang...', 'success');
                    setTimeout(() => location.reload(), 1500);
                }
            } catch (err) {
                Components.notify('File tidak valid atau rusak', 'error');
            }
        };
        reader.readAsText(input.files[0]);
    },

    resetData() {
        if (confirm('PERINGATAN! Seluruh data (Siswa, Nilai, Absensi, Jurnal, Pengaturan) akan dihaspus secara permanen. Lanjutkan?')) {
            const keysToKeep = ['session']; // Keep session so user doesn't get logged out during wipe
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            }
            Components.notify('Data berhasil di-reset. Memuat ulang sistem...', 'warning');
            setTimeout(() => location.reload(), 2000);
        }
    },

    changeSettingsPassword() {
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;

        if (!newPass || newPass.length < 4) {
            return Components.notify('Password minimal 4 karakter', 'error');
        }
        if (newPass !== confirmPass) {
            return Components.notify('Konfirmasi password tidak cocok', 'error');
        }

        const user = Auth.getCurrentUser();
        const users = Store.getUsers();
        const userIdx = users.findIndex(u => u.id === user.id);

        if (userIdx !== -1) {
            users[userIdx].password = newPass;
            Store.saveUsers(users);
            Components.notify('Password berhasil diperbarui', 'success');
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            Components.notify('Gagal memperbarui password', 'error');
        }
    },

    // --- Users Management Module --- //
    loadUsers() {
        const users = Store.getUsers();

        document.getElementById('page-content').innerHTML = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Daftar User</h2>
                    <p class="text-muted">Kelola akun guru dan hak akses aplikasi</p>
                </div>
                <button class="btn btn-primary" onclick="App.openUserModal()">
                    <i class="ph ph-user-plus"></i> Tambah User
                </button>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nama Lengkap</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>NIP</th>
                                <th>Mapel</th>
                                <th style="text-align:right;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => `
                                <tr>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:0.75rem;">
                                            <div style="width:32px; height:32px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center;">
                                                ${u.photo ? `<img src="${u.photo}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">` : '<i class="ph ph-user"></i>'}
                                            </div>
                                            <span class="font-semibold">${u.name}</span>
                                        </div>
                                    </td>
                                    <td><code>${u.username}</code></td>
                                    <td><code>${u.password}</code></td>
                                    <td>${u.nip || '-'}</td>
                                    <td>${u.subject || '-'}</td>
                                    <td style="text-align:right;">
                                        <button class="btn btn-outline btn-sm" onclick="App.openUserModal('${u.id}')" title="Edit User"><i class="ph ph-pencil"></i></button>
                                        <button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="App.deleteUser('${u.id}')" title="Hapus User"><i class="ph ph-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    openUserModal(userId = null) {
        const users = Store.getUsers();
        const user = userId ? users.find(u => u.id.toString() === userId.toString()) : null;
        const title = userId ? 'Edit User' : 'Tambah User';

        const body = `
            <form id="user-form">
                <div class="form-group">
                    <label class="form-label">Nama Lengkap</label>
                    <input type="text" id="u-name" class="form-control" value="${user?.name || ''}" required>
                </div>
                <div style="display:flex; gap:1rem;">
                    <div class="form-group w-full">
                        <label class="form-label">Username</label>
                        <input type="text" id="u-username" class="form-control" value="${user?.username || ''}" required ${userId ? 'readonly' : ''}>
                    </div>
                    <div class="form-group w-full">
                        <label class="form-label">Password</label>
                        <input type="password" id="u-password" class="form-control" value="${user?.password || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">NIP</label>
                    <input type="text" id="u-nip" class="form-control" value="${user?.nip || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Mata Pelajaran</label>
                    <input type="text" id="u-subject" class="form-control" value="${user?.subject || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="u-email" class="form-control" value="${user?.email || ''}">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-outline" onclick="Components.closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="document.getElementById('user-form').dispatchEvent(new Event('submit'))"><i class="ph ph-floppy-disk"></i> Simpan</button>
        `;

        Components.showModal(title, body, footer);

        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            App.handleUserSubmit(userId);
        });
    },

    handleUserSubmit(userId) {
        const userData = {
            name: document.getElementById('u-name').value,
            username: document.getElementById('u-username').value,
            password: document.getElementById('u-password').value,
            nip: document.getElementById('u-nip').value,
            subject: document.getElementById('u-subject').value,
            email: document.getElementById('u-email').value,
        };

        if (userId) {
            Store.updateUser(userId, userData);
            Components.notify('User berhasil diperbarui', 'success');
        } else {
            Store.addUser(userData);
            Components.notify('User berhasil ditambahkan', 'success');
        }

        Components.closeModal();
        this.loadUsers();
    },

    deleteUser(userId) {
        Components.confirm('Hapus User', 'Apakah Anda yakin ingin menghapus user ini?', () => {
            Store.deleteUser(userId);
            Components.notify('User berhasil dihapus', 'success');
            this.loadUsers();
        });
    }
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
