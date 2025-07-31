import { db, storage } from '../firebase-config.js';
import {
    collection, getDocs, getDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
    ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Elements
const gameSelect = document.getElementById('edit-game-select');
const deleteGameSelect = document.getElementById('delete-game-select');

const editGameTitle = document.getElementById('edit-game-title');
const editGameDesc = document.getElementById('edit-game-description');
const editGameTags = document.getElementById('edit-game-tags');
const editGameLink = document.getElementById('edit-game-link');

const editThumbnailInput = document.getElementById('edit-thumbnail-upload');
const editThumbnailPreview = document.getElementById('edit-thumbnail-preview');
const editScreenshotsInput = document.getElementById('edit-screenshots-upload');
const editScreenshotsPreview = document.getElementById('edit-screenshots-preview');

const editGameSave = document.getElementById('edit-game-save');
const editGameSuccess = document.getElementById('edit-game-success');
const deleteGameBtn = document.getElementById('delete-game-button');
const deleteGameSuccess = document.getElementById('delete-game-success');

// Load game list
async function loadGames() {
    const snapshot = await getDocs(collection(db, 'games'));

    gameSelect.innerHTML = `<option value="">Select a game</option>`;
    deleteGameSelect.innerHTML = `<option value="">Select a game</option>`;

    snapshot.forEach(docSnap => {
        const game = docSnap.data();
        const id = docSnap.id;
        const opt1 = new Option(game.title, id);
        const opt2 = new Option(game.title, id);
        gameSelect.appendChild(opt1);
        deleteGameSelect.appendChild(opt2);
    });
}

// Prefill fields
gameSelect?.addEventListener('change', async () => {
    const id = gameSelect.value;
    if (!id) return;

    const docSnap = await getDoc(doc(db, 'games', id));
    const game = docSnap.data();

    editGameTitle.value = game.title;
    editGameDesc.value = game.description;
    editGameTags.value = game.tags.join(', ');
    editGameLink.value = game.link;

    // Show current thumbnail preview
    if (game.imageUrl) {
        editThumbnailPreview.src = game.imageUrl;
        editThumbnailPreview.style.display = 'block';
    }

    // Show existing screenshots
    editScreenshotsPreview.innerHTML = '';
    (game.screenshots || []).forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxHeight = '80px';
        img.style.margin = '5px';
        editScreenshotsPreview.appendChild(img);
    });
});

// Save changes
editGameSave?.addEventListener('click', async () => {
    const id = gameSelect.value;
    const title = editGameTitle.value.trim();
    const description = editGameDesc.value.trim();
    const tags = editGameTags.value.split(',').map(t => t.trim()).filter(Boolean);
    const link = editGameLink.value.trim();

    if (!id || !title || !description || !tags.length || !link) {
        editGameSuccess.textContent = '❌ Please fill in all fields.';
        return;
    }

    try {
        const updateData = { title, description, tags, link };

        // Upload new thumbnail if selected
        if (editThumbnailInput.files[0]) {
            const thumbRef = ref(storage, `games/thumbnails/${id}_${editThumbnailInput.files[0].name}`);
            await uploadBytes(thumbRef, editThumbnailInput.files[0]);
            const thumbUrl = await getDownloadURL(thumbRef);
            updateData.imageUrl = thumbUrl;
        }

        // Upload new screenshots if selected
        if (editScreenshotsInput.files.length > 0) {
            const screenshotUrls = [];
            for (const file of editScreenshotsInput.files) {
                const ssRef = ref(storage, `games/screenshots/${id}_${file.name}`);
                await uploadBytes(ssRef, file);
                const ssUrl = await getDownloadURL(ssRef);
                screenshotUrls.push(ssUrl);
            }
            updateData.screenshots = screenshotUrls;
        }

        await updateDoc(doc(db, 'games', id), updateData);
        editGameSuccess.textContent = '✅ Game updated!';
        await loadGames();
    } catch (err) {
        console.error(err);
        editGameSuccess.textContent = '❌ Failed to update game.';
    }
});

// Delete game
deleteGameBtn?.addEventListener('click', async () => {
    const id = deleteGameSelect.value;
    if (!id) {
        deleteGameSuccess.textContent = '❌ Please select a game.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this game?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'games', id));
        deleteGameSuccess.textContent = '✅ Game deleted!';
        await loadGames();
    } catch (err) {
        console.error(err);
        deleteGameSuccess.textContent = '❌ Failed to delete game.';
    }
});

loadGames();
