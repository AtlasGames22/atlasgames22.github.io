import { auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById('logout-button')?.addEventListener('click', () => {
    signOut(auth).catch(console.error);
});

// Optional: Hamburger toggle for subpages
const toggle = document.getElementById('hamburger-toggle');
const menu = document.getElementById('admin-menu');
if (toggle && menu) {
    toggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}
