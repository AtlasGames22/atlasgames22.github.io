import { db } from './firebase-config.js';
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const grid = document.getElementById('games-grid');

async function loadGames() {
    try {
        const q = query(collection(db, 'games'), orderBy('dateAdded', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            grid.innerHTML = "<p>No games yet. Check back soon!</p>";
            return;
        }

        snapshot.forEach(doc => {
            const game = doc.data();
            const id = doc.id;

            const imageUrl = game.thumbnailUrl || game.imageUrl || 'assets/images/default-game.jpg';
            const tags = Array.isArray(game.tags) ? game.tags.join(', ') : '';

            const card = document.createElement('div');
            card.className = 'game-card';
            card.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = game.title || 'Game Image';
            img.loading = 'lazy';
            img.onerror = () => {
                img.src = 'assets/images/default-game.jpg';
            };

            const title = document.createElement('h3');
            title.textContent = game.title || 'Untitled Game';

            const description = document.createElement('p');
            description.textContent = game.description || 'No description available.';

            const tagText = document.createElement('p');
            tagText.innerHTML = `<small>${tags}</small>`;

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(tagText);

            card.addEventListener('click', () => {
                window.location.href = `game-detail.html?id=${id}`;
            });

            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading games:', err);
        grid.innerHTML = "<p>Error loading games. Please try again later.</p>";
    }
}

loadGames();
