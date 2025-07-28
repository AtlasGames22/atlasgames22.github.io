import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth/externs.js';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-button');
const logoutBtn = document.getElementById('logout-button');
const errorText = document.getElementById('login-error');

// Check login status on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
});

// Login handler
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            errorText.textContent = '';
        })
        .catch((error) => {
            errorText.textContent = "Login failed. Check credentials.";
            console.error(error);
        });
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch(console.error);
});
