import { db, auth, storage } from './firebase-config.js'; // Add storage import
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// === AUTH UI ===
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-button');
const logoutBtn = document.getElementById('logout-button');
const errorText = document.getElementById('login-error');

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
});

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            errorText.textContent = '';
        })
        .catch((error) => {
            console.error("Login error:", error);
            errorText.textContent = "Login failed. Check credentials.";
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).catch(console.error);
});

// === BLOG SUBMISSION ===
const blogImageFile = document.getElementById('blog-image-file');

blogSubmit.addEventListener('click', async () => {
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();
    const imageFile = blogImageFile.files[0];

    if (!title || !content) {
        blogSuccess.textContent = 'Please fill out all fields.';
        return;
    }

    let imageUrl = null;

    try {
        if (imageFile) {
            const cleanTitle = title.replace(/\s+/g, '-').toLowerCase();
            const imageRef = ref(storage, `blogs/${cleanTitle}/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        await addDoc(collection(db, 'blogs'), {
            title,
            content,
            imageUrl,
            date: serverTimestamp()
        });

        blogTitle.value = '';
        blogContent.value = '';
        blogImageFile.value = '';
        blogSuccess.textContent = '✅ Blog post submitted successfully!';
    } catch (error) {
        console.error("Error adding blog post:", error);
        blogSuccess.textContent = '❌ Failed to submit blog post.';
    }
});

// === GAME SUBMISSION (with image upload) ===
const gameTitle = document.getElementById('game-title');
const gameDescription = document.getElementById('game-description');
const gameImageFile = document.getElementById('game-image-file'); // file input
const gameTags = document.getElementById('game-tags');
const gameLink = document.getElementById('game-link');
const gameSuccess = document.getElementById('game-success');
const gameSubmit = document.getElementById('submit-game');

gameSubmit.addEventListener('click', async () => {
    const title = gameTitle.value.trim();
    const description = gameDescription.value.trim();
    const imageFile = gameImageFile.files[0];
    const tags = gameTags.value.split(',').map(tag => tag.trim()).filter(Boolean);
    const link = gameLink.value.trim();

    if (!title || !description || !imageFile || !tags.length || !link) {
        gameSuccess.textContent = 'Please fill out all fields and upload an image.';
        return;
    }

    try {
        // Upload image to Firebase Storage
        const cleanTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageRef = ref(storage, `games/${cleanTitle}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        // Add to Firestore
        await addDoc(collection(db, 'games'), {
            title,
            description,
            imageUrl,
            tags,
            link,
            dateAdded: serverTimestamp()
        });

        // Reset form
        gameTitle.value = '';
        gameDescription.value = '';
        gameImageFile.value = '';
        gameTags.value = '';
        gameLink.value = '';
        gameSuccess.textContent = '✅ Game submitted successfully!';
    } catch (error) {
        console.error("Error adding game:", error);
        gameSuccess.textContent = '❌ Failed to submit game.';
    }
});
