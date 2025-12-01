// login-form.js
// Authentication Module (Standalone for Login Page)

let users = JSON.parse(localStorage.getItem('libraryUsers')) || [
    { username: "admin", password: "password123", role: "admin" }
];

function saveData() {
    localStorage.setItem('libraryUsers', JSON.stringify(users));
}

function switchToClient() {
    document.getElementById('authTitle').textContent = 'Client Login/Register';
    document.getElementById('authBtn').textContent = 'Log In / Register';
    document.getElementById('switchMode').style.display = 'none';
    document.getElementById('clientSwitch').style.display = 'block';
    document.getElementById('authForm').onsubmit = clientAuth;
}

function switchToAdmin() {
    document.getElementById('authTitle').textContent = 'Admin Login';
    document.getElementById('authBtn').textContent = 'Log In';
    document.getElementById('switchMode').style.display = 'block';
    document.getElementById('clientSwitch').style.display = 'none';
    document.getElementById('authForm').onsubmit = adminAuth;
}

function adminAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === '' || password === '') {
        showMessage('errorMessage', 'Please fill in both fields.');
        return;
    }
    const user = users.find(u => u.username === username && u.password === password && u.role === 'admin');
    if (user) {
        // Store user in localStorage for books.html
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('successMessage', 'Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'books.html';
        }, 1000);
    } else {
        showMessage('errorMessage', "Invalid admin credentials. (Hint: admin / password123)");
    }
}

function clientAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === '' || password === '') {
        showMessage('errorMessage', 'Please fill in both fields.');
        return;
    }
    let user = users.find(u => u.username === username && u.password === password && u.role === 'client');
    if (!user) {
        if (users.some(u => u.username === username)) {
            showMessage('errorMessage', 'Username already exists.');
            return;
        }
        user = { username, password, role: 'client', borrowedBooks: [] };
        users.push(user);
        saveData();
        showMessage('successMessage', `Account created for ${username}! Redirecting...`);
    } else {
        showMessage('successMessage', `Welcome back, ${username}! Redirecting...`);
    }
    // Store user in localStorage for books.html
    localStorage.setItem('currentUser', JSON.stringify(user));
    setTimeout(() => {
        window.location.href = 'books.html';
    }, 1000);
}

function showMessage(elementId, message, type = 'error') {
    const msg = document.getElementById(elementId);
    if (!msg) return;
    msg.textContent = message;
    msg.className = `message ${type} show`;
    setTimeout(() => msg.classList.remove('show'), 3000);
}

// Init: Default to admin mode
document.addEventListener('DOMContentLoaded', function() {
    switchToAdmin();
});