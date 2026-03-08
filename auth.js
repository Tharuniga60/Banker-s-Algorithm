/**
 * =============================================
 *   BANKER'S ALGORITHM SIMULATOR — AUTH.JS
 *   LocalStorage-based simple authentication
 * =============================================
 */

const AUTH_KEY = 'bankers_auth_user';
const USERS_KEY = 'bankers_auth_users';

/* ── HELPERS ─────────────────────────────── */
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_KEY);
}

/* ── SIGNUP ───────────────────────────────── */
function signupUser(name, email, password) {
    const users = getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: 'An account with this email already exists.' };

    const newUser = { name, email: email.toLowerCase(), password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    return { ok: true };
}

/* ── LOGIN ────────────────────────────────── */
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, message: 'Invalid email or password. Please try again.' };

    setCurrentUser({ name: user.name, email: user.email });
    return { ok: true, user: { name: user.name, email: user.email } };
}

/* ── LOGOUT ───────────────────────────────── */
function logoutUser() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

/* ── GUARD: require login ─────────────────── */
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

/* ── GUARD: redirect if already logged in ─── */
function redirectIfLoggedIn(destination = 'simulator.html') {
    const user = getCurrentUser();
    if (user) window.location.href = destination;
}

/* ── TOAST (shared across pages) ─────────── */
function showAuthToast(type, icon, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => { if (container.contains(toast)) container.removeChild(toast); }, 350);
    }, 3500);
}

/* ── Update nav user display ─────────────── */
function updateNavUser() {
    const user = getCurrentUser();
    const navUser = document.getElementById('navUser');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navSignupBtn = document.getElementById('navSignupBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    if (user) {
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navSignupBtn) navSignupBtn.style.display = 'none';
        if (navUser) { navUser.style.display = 'flex'; navUser.querySelector('.nav-user-name').textContent = user.name; }
        if (navLogoutBtn) navLogoutBtn.style.display = 'flex';
    } else {
        if (navLoginBtn) navLoginBtn.style.display = 'flex';
        if (navSignupBtn) navSignupBtn.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
        if (navLogoutBtn) navLogoutBtn.style.display = 'none';
    }
}
