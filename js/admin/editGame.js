import { db } from '../firebase-config.js';
import {
    collection,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const gameSelect = document.getElementById('edit-game-select');
const editGameTitle = document.getElementById('edit-game-title');
const editGameDesc = document.getElementById('edit-game-description');
const editGameTags = document.getElementById('edit-game-tags');
const editGameLink = document.getElementById('edit-game-link');
const editGameSuccess = document.getElementById('edit-game-success');
const editGameSave = document.getElementById('edit-game-save');

const deleteGameSelect = document.getElementById('delete-game-select');
const deleteGameBtn = document.getElementById('delete-game-button');
const deleteGameSuccess = document.getElementById('delete-game-success');

// Load games into both dropdowns
async function loadGames() {
    const snapshot = await getDocs(collection(db, 'games'));

    gameSelect.innerHTML = `<option value="">Select a game</option>`;
    deleteGameSelect.innerHTML = `<option value="">Select a game</option>`;

    snapshot.forEach(docSnap => {
        const game = docSnap.data();
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = docSnap.id;
        option1.textContent = option2.textContent = game.title;

        gameSelect.appendChild(option1);
        deleteGameSelect.appendChild(option2);
    });
}

// Prefill edit fields
gameSelect?.addEventListener('change', async () => {
    const id = gameSelect.value;
    if (!id) return;

    const docSnap = await getDoc(doc(db, 'games', id));
    const game = docSnap.data();

    editGameTitle.value = game.title;
    editGameDesc.value = game.description;
    editGameTags.value = game.tags.join(', ');
    editGameLink.value = game.link;
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
        await updateDoc(doc(db, 'games', id), {
            title,
            description,
            tags,
            link
        });

        editGameSuccess.textContent = '✅ Game updated!';
        await loadGames();
    } catch (error) {
        console.error(error);
        editGameSuccess.textContent = '❌ Failed to update game.';
    }
});

// Delete game
deleteGameBtn?.addEventListener('click', async () => {
    const gameId = deleteGameSelect.value;
    if (!gameId) {
        deleteGameSuccess.textContent = '❌ Please select a game.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this game?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'games', gameId));
        deleteGameSuccess.textContent = '✅ Game deleted!';
        await loadGames();
    } catch (error) {
        console.error(error);
        deleteGameSuccess.textContent = '❌ Failed to delete game.';
    }
});

loadGames();
