import { db } from './firebase-config.js';
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const grid = document.getElementById('games-grid');

async function loadGames() {
    const q = query(collection(db, 'games'), orderBy('dateAdded', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        grid.innerHTML = "<p>No games yet. Check back soon!</p>";
        return;
    }

    snapshot.forEach(doc => {
        const game = doc.data();
        const id = doc.id;

        const imageUrl =
            game.thumbnailUrl ||
            game.imageUrl ||
            'assets/images/default-game.jpg';

        const tags = game.tags?.join(', ') || '';

        const card = document.createElement('div');
        card.className = 'game-card';

        // Image element with fallback
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = game.title;
        img.onerror = () => {
            img.src = 'assets/images/default-game.jpg';
        };

        const title = document.createElement('h3');
        title.textContent = game.title;

        const description = document.createElement('p');
        description.textContent = game.description;

        const tagText = document.createElement('p');
        tagText.innerHTML = `<small>${tags}</small>`;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(tagText);

        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `game-detail.html?id=${id}`;
        });

        grid.appendChild(card);
    });
}

loadGames();
