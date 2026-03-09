/* js/store.js */
// Use LocalStorage as database simulator

const Store = {
    // Generate initial sample data if not exists
    init() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([{
                id: 1,
                username: 'admin',
                password: 'password', // in real app, must be hashed
                name: 'Guru Pengampu',
                nip: '198001012005011001',
                email: 'guru@mtsn1bandarlampung.sch.id',
                subject: 'Matematika',
                photo: ''
            }]));
        }

        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }

        if (!localStorage.getItem('grades')) {
            localStorage.setItem('grades', JSON.stringify([]));
        }

        if (!localStorage.getItem('attendance')) {
            localStorage.setItem('attendance', JSON.stringify([]));
        }

        if (!localStorage.getItem('journal')) {
            localStorage.setItem('journal', JSON.stringify([]));
        }

        if (!localStorage.getItem('appSettings')) {
            localStorage.setItem('appSettings', JSON.stringify({
                title: 'Aplikasi Administrasi Guru',
                schoolName: 'MTs N 1 Bandar Lampung',
                address: 'Jl. Jenderal Sudirman No. 123, Bandar Lampung',
                headmaster: 'Nama Kepala Madrasah',
                academicYear: '2025/2026',
                semester: 'Ganjil',
                website: 'www.mtsn1bandarlampung.sch.id',
                subjects: 'Matematika, Bahasa Indonesia, Bahasa Inggris, IPA, IPS, Pendidikan Agama Islam, PKn, Seni Budaya, Penjaskes, Prakarya',
                classes: '7A, 7B, 7C, 8A, 8B, 8C, 9A, 9B, 9C',
                logo: '',
                banner: ''
            }));
        }
    },

    // --- App Settings --- //
    getAppSettings() {
        return JSON.parse(localStorage.getItem('appSettings')) || {};
    },

    updateAppSettings(settings) {
        const current = this.getAppSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem('appSettings', JSON.stringify(updated));
        return updated;
    },

    // --- Users (Profile) --- //
    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    getUser(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = Date.now();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    },

    updateUser(id, userData) {
        let users = this.getUsers();
        const index = users.findIndex(u => (id && u.id.toString() === id.toString()) || u.username === userData.username);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem('users', JSON.stringify(users));

            // update session if it's the logged-in user
            const currentSession = JSON.parse(localStorage.getItem('session'));
            if (currentSession && (currentSession.id === id || currentSession.username === users[index].username)) {
                const sessionUser = { ...users[index] };
                delete sessionUser.password;
                localStorage.setItem('session', JSON.stringify(sessionUser));
            }
            return true;
        }
        return false;
    },

    deleteUser(id) {
        let users = this.getUsers();

        // Prevent deleting current session user
        const currentSession = JSON.parse(localStorage.getItem('session'));
        if (currentSession && (currentSession.id.toString() === id.toString() || currentSession.username === id)) {
            Components.notify('Tidak dapat menghapus akun sendiri', 'error');
            return;
        }

        users = users.filter(u => u.id.toString() !== id.toString());
        localStorage.setItem('users', JSON.stringify(users));
    },

    updateUserProfile(userData) {
        return this.updateUser(null, userData);
    },

    // --- Students --- //
    getStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    },
    addStudent(student) {
        const students = this.getStudents();
        student.id = Date.now().toString();
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        return student;
    },
    updateStudent(id, studentData) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...studentData };
            localStorage.setItem('students', JSON.stringify(students));
            return true;
        }
        return false;
    },
    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
    },
    saveMassStudents(studentsArray) {
        let students = this.getStudents();
        // Add minimal required properties
        const newStudents = studentsArray.map(s => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: s.nama || s.Nama || s['Nama Lengkap'] || s.NAME || 'N/A',
            nis: s.nis || s.NIS || '',
            kelas: s.kelas || s.Kelas || s.KELAS || '7A',
            jk: s['Jenis Kelamin'] || s.jk || s.JK || s.gender || 'L',
            photo: ''
        }));

        students = [...students, ...newStudents];
        localStorage.setItem('students', JSON.stringify(students));
        return newStudents.length;
    },

    // --- General Options/Enums ---
    getClasses() {
        const settings = this.getAppSettings();
        if (settings.classes) {
            return settings.classes.split(',').map(s => s.trim());
        }
        // Fallback
        const classes = [];
        ['7', '8', '9'].forEach(level => {
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(section => {
                classes.push(`${level}${section}`);
            });
        });
        return classes;
    },

    getSubjects() {
        const settings = this.getAppSettings();
        if (settings.subjects) {
            return settings.subjects.split(',').map(s => s.trim());
        }
        // Fallback
        return [
            'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS',
            'Pendidikan Agama Islam', 'PKn', 'Seni Budaya', 'Penjaskes', 'Prakarya'
        ];
    },

    // Data operations for grades, attendance, journal can be added here

    getGrades() { return JSON.parse(localStorage.getItem('grades')) || []; },
    saveGrades(grades) { localStorage.setItem('grades', JSON.stringify(grades)); },

    getAttendance() { return JSON.parse(localStorage.getItem('attendance')) || []; },
    saveAttendance(data) { localStorage.setItem('attendance', JSON.stringify(data)); },

    getJournal() { return JSON.parse(localStorage.getItem('journal')) || []; },
    saveJournal(data) { localStorage.setItem('journal', JSON.stringify(data)); },
};

Store.init();
