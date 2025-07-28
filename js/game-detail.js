import { db } from './firebase-config.js';
import { doc, getDoc } from 'firebase/firestore';

// Get game ID from URL
const params = new URLSearchParams(window.location.search);
const gameId = params.get('id');

const titleEl = document.getElementById('game-title');
const descEl = document.getElementById('game-description');
const imgEl = document.getElementById('game-image');
const gallery = document.getElementById('screenshot-gallery');

async function loadGame() {
    if (!gameId) {
        titleEl.textContent = 'Game not found';
        return;
    }

    try {
        const gameRef = doc(db, 'games', gameId);
        const docSnap = await getDoc(gameRef);

        if (!docSnap.exists()) {
            titleEl.textContent = 'Game not found';
            return;
        }

        const game = docSnap.data();
        document.title = `${game.title || 'Untitled'} – Atlas Games`;

        titleEl.textContent = game.title || 'Untitled';
        descEl.textContent = game.description || 'No description available.';
        imgEl.src = game.thumbnail || 'assets/images/games/thumbnails/default.jpg';
        imgEl.alt = game.title || 'Game Thumbnail';
        imgEl.onerror = () => {
            imgEl.src = 'assets/images/games/thumbnails/default.jpg';
        };

        // Load screenshots if available
        if (Array.isArray(game.screenshots) && game.screenshots.length > 0) {
            game.screenshots.forEach((url) => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = `${game.title || 'Game'} Screenshot`;
                img.className = 'screenshot';
                img.loading = 'lazy';
                img.onerror = () => {
                    img.remove(); // Remove broken images
                };
                gallery.appendChild(img);
            });
        } else {
            gallery.innerHTML = '<p>No screenshots available.</p>';
        }

    } catch (err) {
        console.error('Error loading game:', err);
        titleEl.textContent = 'Error loading game';
    }
}

loadGame();
