import { auth } from './firebase-config.js';
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Blog submission
const blogTitle = document.getElementById('blog-title');
const blogContent = document.getElementById('blog-content');
const blogSuccess = document.getElementById('blog-success');
const blogSubmit = document.getElementById('submit-blog');

blogSubmit.addEventListener('click', async () => {
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();

    if (!title || !content) {
        blogSuccess.textContent = 'Please fill out all fields.';
        return;
    }

    try {
        await addDoc(collection(auth, 'blogs'), {
            title,
            content,
            date: serverTimestamp()
        });

        blogTitle.value = '';
        blogContent.value = '';
        blogSuccess.textContent = '✅ Blog post submitted successfully!';
    } catch (error) {
        console.error("Error adding blog post:", error);
        blogSuccess.textContent = '❌ Failed to submit blog post.';
    }
});

// Game submission
const gameTitle = document.getElementById('game-title');
const gameDescription = document.getElementById('game-description');
const gameImage = document.getElementById('game-image');
const gameTags = document.getElementById('game-tags');
const gameLink = document.getElementById('game-link');
const gameSuccess = document.getElementById('game-success');
const gameSubmit = document.getElementById('submit-game');

gameSubmit.addEventListener('click', async () => {
    const title = gameTitle.value.trim();
    const description = gameDescription.value.trim();
    const imageUrl = gameImage.value.trim();
    const tags = gameTags.value.split(',').map(tag => tag.trim()).filter(Boolean);
    const link = gameLink.value.trim();

    if (!title || !description || !imageUrl || !tags.length || !link) {
        gameSuccess.textContent = 'Please fill out all fields.';
        return;
    }

    try {
        await addDoc(collection(auth, 'games'), {
            title,
            description,
            imageUrl,
            tags,
            link,
            dateAdded: serverTimestamp()
        });

        gameTitle.value = '';
        gameDescription.value = '';
        gameImage.value = '';
        gameTags.value = '';
        gameLink.value = '';
        gameSuccess.textContent = '✅ Game submitted successfully!';
    } catch (error) {
        console.error("Error adding game:", error);
        gameSuccess.textContent = '❌ Failed to submit game.';
    }
});
