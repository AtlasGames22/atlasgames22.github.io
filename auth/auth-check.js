// /auth/auth-check.js
import { auth } from '../js/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
});
