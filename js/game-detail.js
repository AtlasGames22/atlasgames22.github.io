import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Get game ID from URL
const params = new URLSearchParams(window.location.search);
const gameId = params.get('id');

// DOM elements
const titleEl = document.getElementById('game-title');
const subtitleEl = document.getElementById('game-subtitle');
const descEl = document.getElementById('game-description');
const tagsEl = document.getElementById('game-tags');
const linkEl = document.getElementById('game-link');
const mainImageEl = document.getElementById('main-image');
const galleryEl = document.getElementById('gallery');

async function loadGame() {
    if (!gameId) {
        titleEl.textContent = "Game Not Found";
        subtitleEl.textContent = "No game ID provided.";
        return;
    }

    try {
        const docRef = doc(db, 'games', gameId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            titleEl.textContent = "Game Not Found";
            subtitleEl.textContent = "The requested game does not exist.";
            return;
        }

        const game = docSnap.data();

        titleEl.textContent = game.title;
        subtitleEl.textContent = game.dateAdded?.toDate().toLocaleDateString('en-GB') || 'Unknown Date';
        descEl.textContent = game.description;
        linkEl.href = game.link || '#';

        // Main image fallback
        mainImageEl.src = game.imageUrl || 'assets/images/default-game.jpg';
        mainImageEl.alt = game.title || 'Game Image';
        mainImageEl.onerror = () => {
            mainImageEl.src = 'assets/images/default-game.jpg';
        };

        // Tags
        tagsEl.innerHTML = '';
        if (Array.isArray(game.tags)) {
            game.tags.forEach(tag => {
                const li = document.createElement('li');
                li.textContent = tag;
                tagsEl.appendChild(li);
            });
        }

        // Optional: Add screenshots to gallery in the future
        // if (Array.isArray(game.screenshots)) { ... }

    } catch (err) {
        console.error("Error loading game detail:", err);
        titleEl.textContent = "Error";
        subtitleEl.textContent = "There was a problem loading this game.";
    }
}

loadGame();
