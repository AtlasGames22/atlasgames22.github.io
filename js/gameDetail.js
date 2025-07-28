// /js/gameDetail.js
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const container = document.getElementById('game-detail-container');

// Extract ID from query string
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

async function loadGame() {
    if (!gameId) {
        container.innerHTML = "<p>Game not found. Invalid link.</p>";
        return;
    }

    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
        container.innerHTML = "<p>This game does not exist.</p>";
        return;
    }

    const game = gameSnap.data();

    const html = `
    <h1>${game.title}</h1>
    <img src="${game.imageUrl}" alt="${game.title}" class="detail-image" />
    <p class="game-date">${game.dateAdded?.toDate().toLocaleDateString('en-GB') || ''}</p>
    <p>${game.description}</p>
    <p><strong>Tags:</strong> ${game.tags.join(', ')}</p>
    <a href="${game.link}" class="btn primary" target="_blank">Play Now</a>
  `;

    container.innerHTML = html;
}

loadGame();
