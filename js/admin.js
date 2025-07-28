import { db, auth } from './firebase-config.js';
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
const blogTitle = document.getElementById('blog-title');
const blogContent = document.getElementById('blog-content');
const blogImageFile = document.getElementById('blog-image-file');
const blogSuccess = document.getElementById('blog-success');
const blogSubmit = document.getElementById('submit-blog');

blogSubmit.addEventListener('click', async () => {
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();
    const imageFile = blogImageFile.files[0];

    if (!title || !content || !imageFile) {
        blogSuccess.textContent = 'Please fill out all fields and select an image.';
        return;
    }

    try {
        const cleanTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageUrl = `assets/images/blogsImages/${imageFile.name}`;

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

import {
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// === BLOG EDITOR ===
const blogSelect = document.getElementById('edit-blog-select');
const editTitle = document.getElementById('edit-blog-title');
const editContent = document.getElementById('edit-blog-content');
const editSuccess = document.getElementById('edit-blog-success');
const editSave = document.getElementById('edit-blog-save');

// Load blog posts into the dropdown
async function populateBlogSelect() {
    const snapshot = await getDocs(collection(db, 'blogs'));
    blogSelect.innerHTML = `<option value="">Select a blog post to edit</option>`;

    snapshot.forEach(docSnap => {
        const blog = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = blog.title;
        blogSelect.appendChild(option);
    });
}

// When a blog is selected, prefill fields
blogSelect.addEventListener('change', async () => {
    const blogId = blogSelect.value;
    if (!blogId) return;

    const docRef = doc(db, 'blogs', blogId);
    const docSnap = await getDoc(docRef);
    const blog = docSnap.data();

    editTitle.value = blog.title;
    editContent.value = blog.content;
});

// Save changes
editSave.addEventListener('click', async () => {
    const blogId = blogSelect.value;
    const newTitle = editTitle.value.trim();
    const newContent = editContent.value.trim();

    if (!blogId || !newTitle || !newContent) {
        editSuccess.textContent = 'Please select a blog and fill out all fields.';
        return;
    }

    try {
        const docRef = doc(db, 'blogs', blogId);
        await updateDoc(docRef, {
            title: newTitle,
            content: newContent
        });

        editSuccess.textContent = '✅ Blog post updated!';
        populateBlogSelect(); // Refresh dropdown
    } catch (error) {
        console.error("Error updating blog:", error);
        editSuccess.textContent = '❌ Failed to update blog post.';
    }
});

populateBlogSelect();

const deleteBlogSelect = document.getElementById('delete-blog-select');
const deleteBlogBtn = document.getElementById('delete-blog-button');
const deleteBlogSuccess = document.getElementById('delete-blog-success');

// Reuse populateBlogSelect() to fill delete dropdown too
async function populateDeleteBlogSelect() {
    const snapshot = await getDocs(collection(db, 'blogs'));
    deleteBlogSelect.innerHTML = `<option value="">Select a blog to delete</option>`;
    snapshot.forEach(docSnap => {
        const blog = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = blog.title;
        deleteBlogSelect.appendChild(option);
    });
}

deleteBlogBtn.addEventListener('click', async () => {
    const blogId = deleteBlogSelect.value;
    if (!blogId) {
        deleteBlogSuccess.textContent = 'Please select a blog to delete.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this blog post?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'blogs', blogId));
        deleteBlogSuccess.textContent = '✅ Blog post deleted!';
        populateBlogSelect();        // Refresh both dropdowns
        populateDeleteBlogSelect();
    } catch (error) {
        console.error("Error deleting blog:", error);
        deleteBlogSuccess.textContent = '❌ Failed to delete blog post.';
    }
});
populateDeleteBlogSelect();



// === GAME SUBMISSION ===
const gameTitle = document.getElementById('game-title');
const gameDescription = document.getElementById('game-description');
const gameImagePath = document.getElementById('game-image-path');
const gameTags = document.getElementById('game-tags');
const gameLink = document.getElementById('game-link');
const gameScreenshots = document.getElementById('game-screenshots');
const gameSuccess = document.getElementById('game-success');
const gameSubmit = document.getElementById('submit-game');

gameSubmit.addEventListener('click', async () => {
    const title = gameTitle.value.trim();
    const description = gameDescription.value.trim();
    const imageUrl = gameImagePath.value.trim();
    const tags = gameTags.value.split(',').map(tag => tag.trim()).filter(Boolean);
    const link = gameLink.value.trim();
    const screenshots = gameScreenshots.value.split(',').map(url => url.trim()).filter(Boolean);

    if (!title || !description || !imageUrl || !tags.length || !link) {
        gameSuccess.textContent = 'Please fill out all fields.';
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

        // Reset form
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

// === GAME EDITOR ===
const gameSelect = document.getElementById('edit-game-select');
const editGameTitle = document.getElementById('edit-game-title');
const editGameDesc = document.getElementById('edit-game-description');
const editGameTags = document.getElementById('edit-game-tags');
const editGameLink = document.getElementById('edit-game-link');
const editGameSuccess = document.getElementById('edit-game-success');
const editGameSave = document.getElementById('edit-game-save');

async function populateGameSelect() {
    const snapshot = await getDocs(collection(db, 'games'));
    gameSelect.innerHTML = `<option value="">Select a game to edit</option>`;
    snapshot.forEach(docSnap => {
        const game = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = game.title;
        gameSelect.appendChild(option);
    });
}

gameSelect.addEventListener('change', async () => {
    const id = gameSelect.value;
    if (!id) return;
    const docSnap = await getDoc(doc(db, 'games', id));
    const game = docSnap.data();
    editGameTitle.value = game.title;
    editGameDesc.value = game.description;
    editGameTags.value = game.tags.join(', ');
    editGameLink.value = game.link;
});

editGameSave.addEventListener('click', async () => {
    const id = gameSelect.value;
    const title = editGameTitle.value.trim();
    const description = editGameDesc.value.trim();
    const tags = editGameTags.value.split(',').map(t => t.trim()).filter(Boolean);
    const link = editGameLink.value.trim();

    if (!id || !title || !description || !tags.length || !link) {
        editGameSuccess.textContent = 'Please complete all fields.';
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
        populateGameSelect();
    } catch (err) {
        console.error(err);
        editGameSuccess.textContent = '❌ Failed to update game.';
    }
});

populateGameSelect();


const deleteGameSelect = document.getElementById('delete-game-select');
const deleteGameBtn = document.getElementById('delete-game-button');
const deleteGameSuccess = document.getElementById('delete-game-success');

// Reuse populateGameSelect() to also fill the delete dropdown
async function populateDeleteGameSelect() {
    const snapshot = await getDocs(collection(db, 'games'));
    deleteGameSelect.innerHTML = `<option value="">Select a game to delete</option>`;
    snapshot.forEach(docSnap => {
        const game = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = game.title;
        deleteGameSelect.appendChild(option);
    });
}

deleteGameBtn.addEventListener('click', async () => {
    const gameId = deleteGameSelect.value;
    if (!gameId) {
        deleteGameSuccess.textContent = 'Please select a game to delete.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this game?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'games', gameId));
        deleteGameSuccess.textContent = '✅ Game deleted!';
        populateGameSelect();         // Refresh edit dropdown
        populateDeleteGameSelect();   // Refresh delete dropdown
    } catch (error) {
        console.error("Error deleting game:", error);
        deleteGameSuccess.textContent = '❌ Failed to delete game.';
    }
});

populateDeleteGameSelect();



// === TEAM MEMBER SUBMISSION ===
const teamName = document.getElementById('team-name');
const teamRole = document.getElementById('team-role');
const teamBio = document.getElementById('team-bio');
const teamImage = document.getElementById('team-image');
const teamSuccess = document.getElementById('team-success');
const teamSubmit = document.getElementById('submit-team');

teamSubmit.addEventListener('click', async () => {
    const name = teamName.value.trim();
    const role = teamRole.value.trim();
    const bio = teamBio.value.trim();
    const imageUrl = teamImage.value.trim();

    if (!name || !role || !bio || !imageUrl) {
        teamSuccess.textContent = 'Please fill out all fields.';
        return;
    }

    try {
        await addDoc(collection(db, 'team'), {
            name,
            role,
            bio,
            imageUrl,
            dateAdded: serverTimestamp()
        });

        teamName.value = '';
        teamRole.value = '';
        teamBio.value = '';
        teamImage.value = '';
        teamSuccess.textContent = '✅ Team member added successfully!';
    } catch (error) {
        console.error("Error adding team member:", error);
        teamSuccess.textContent = '❌ Failed to add team member.';
    }
});

// === TEAM EDITOR ===
const teamSelect = document.getElementById('edit-team-select');
const editTeamName = document.getElementById('edit-team-name');
const editTeamRole = document.getElementById('edit-team-role');
const editTeamBio = document.getElementById('edit-team-bio');
const editTeamSuccess = document.getElementById('edit-team-success');
const editTeamSave = document.getElementById('edit-team-save');

async function populateTeamSelect() {
    const snapshot = await getDocs(collection(db, 'team'));
    teamSelect.innerHTML = `<option value="">Select a member to edit</option>`;
    snapshot.forEach(docSnap => {
        const member = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = member.name;
        teamSelect.appendChild(option);
    });
}

teamSelect.addEventListener('change', async () => {
    const id = teamSelect.value;
    if (!id) return;
    const docSnap = await getDoc(doc(db, 'team', id));
    const member = docSnap.data();
    editTeamName.value = member.name;
    editTeamRole.value = member.role;
    editTeamBio.value = member.bio;
});

editTeamSave.addEventListener('click', async () => {
    const id = teamSelect.value;
    const name = editTeamName.value.trim();
    const role = editTeamRole.value.trim();
    const bio = editTeamBio.value.trim();

    if (!id || !name || !role || !bio) {
        editTeamSuccess.textContent = 'Please complete all fields.';
        return;
    }

    try {
        await updateDoc(doc(db, 'team', id), {
            name,
            role,
            bio
        });
        editTeamSuccess.textContent = '✅ Team member updated!';
        populateTeamSelect();
    } catch (err) {
        console.error(err);
        editTeamSuccess.textContent = '❌ Failed to update team member.';
    }
});

populateTeamSelect();

const deleteTeamSelect = document.getElementById('delete-team-select');
const deleteTeamBtn = document.getElementById('delete-team-button');
const deleteTeamSuccess = document.getElementById('delete-team-success');

// Reuse populateTeamSelect() for the delete dropdown too
async function populateDeleteTeamSelect() {
    const snapshot = await getDocs(collection(db, 'team'));
    deleteTeamSelect.innerHTML = `<option value="">Select a member to delete</option>`;
    snapshot.forEach(docSnap => {
        const member = docSnap.data();
        const option = document.createElement('option');
        option.value = docSnap.id;
        option.textContent = member.name;
        deleteTeamSelect.appendChild(option);
    });
}

deleteTeamBtn.addEventListener('click', async () => {
    const teamId = deleteTeamSelect.value;
    if (!teamId) {
        deleteTeamSuccess.textContent = 'Please select a team member to delete.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this team member?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'team', teamId));
        deleteTeamSuccess.textContent = '✅ Team member deleted!';
        populateTeamSelect();         // Refresh edit dropdown
        populateDeleteTeamSelect();   // Refresh delete dropdown
    } catch (error) {
        console.error("Error deleting team member:", error);
        deleteTeamSuccess.textContent = '❌ Failed to delete team member.';
    }
});

populateDeleteTeamSelect();


