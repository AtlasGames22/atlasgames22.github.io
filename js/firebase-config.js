// /js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDIfidTTdIsdrfUsCMVlUIlNc9O-uul3Jo",
    authDomain: "atlas-games-site.firebaseapp.com",
    projectId: "atlas-games-site",
    storageBucket: "atlas-games-site.firebasestorage.app",
    messagingSenderId: "898227755392",
    appId: "1:898227755392:web:1cfe48c6bdfc0572c5c965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
