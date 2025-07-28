import { auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById('logout-button')?.addEventListener('click', () => {
    signOut(auth).catch(console.error);
});

const toggle = document.getElementById('hamburger-toggle');
const menu = document.getElementById('admin-menu');
const overlay = document.getElementById('admin-overlay');

function toggleMenu(open = true) {
    document.body.classList.toggle('menu-open', open);
    menu?.classList.remove('hidden'); // remove hidden so slide-in works
    overlay?.classList.remove('hidden');
}

toggle?.addEventListener('click', () => toggleMenu(true));
overlay?.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menu?.classList.add('hidden');
    overlay?.classList.add('hidden');
});
