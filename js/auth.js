/* js/auth.js */

const Auth = {
    isLoggedIn() {
        return localStorage.getItem('session') !== null;
    },

    login(username, password) {
        const user = Store.getUser(username);
        if (user && user.password === password) {
            // Remove password before saving to session
            const sessionUser = { ...user };
            delete sessionUser.password;

            localStorage.setItem('session', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    },

    logout() {
        localStorage.removeItem('session');
        window.location.reload();
    },

    getCurrentUser() {
        const session = localStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    }
};
