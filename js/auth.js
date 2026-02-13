/* ============================================
   FINVERSE - Login / Authentication
   ============================================ */

function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.login-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appLayout').classList.add('active');
    renderDashboard();
    renderAllPages();
}

function handleLogout() {
    document.getElementById('appLayout').classList.remove('active');
    document.getElementById('loginScreen').style.display = 'flex';
}
