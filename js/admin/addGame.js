import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const gameTitle = document.getElementById('game-title');
const gameDescription = document.getElementById('game-description');
const gameImagePath = document.getElementById('game-image-path');
const gameTags = document.getElementById('game-tags');
const gameLink = document.getElementById('game-link');
const gameScreenshots = document.getElementById('game-screenshots');
const gameSuccess = document.getElementById('game-success');
const gameSubmit = document.getElementById('submit-game');

gameSubmit?.addEventListener('click', async () => {
    const title = gameTitle.value.trim();
    const description = gameDescription.value.trim();
    const imageUrl = gameImagePath.value.trim();
    const tags = gameTags.value.split(',').map(tag => tag.trim()).filter(Boolean);
    const link = gameLink.value.trim();
    const screenshots = gameScreenshots.value.split(',').map(path => path.trim()).filter(Boolean);

    if (!title || !description || !imageUrl || !tags.length || !link) {
        gameSuccess.textContent = '❌ Please fill out all fields.';
        return;
    }

    try {
        await addDoc(collection(db, 'games'), {
            title,
            description,
            imageUrl,
            tags,
            link,
            screenshots,
            dateAdded: serverTimestamp()
        });

        gameTitle.value = '';
        gameDescription.value = '';
        gameImagePath.value = '';
        gameTags.value = '';
        gameLink.value = '';
        gameScreenshots.value = '';
        gameSuccess.textContent = '✅ Game submitted successfully!';
    } catch (error) {
        console.error("Error adding game:", error);
        gameSuccess.textContent = '❌ Failed to submit game.';
    }
});
