import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const teamName = document.getElementById('team-name');
const teamRole = document.getElementById('team-role');
const teamBio = document.getElementById('team-bio');
const teamImage = document.getElementById('team-image');
const teamSocial = document.getElementById('team-social');
const teamSubmit = document.getElementById('submit-team');
const teamSuccess = document.getElementById('team-success');

teamSubmit?.addEventListener('click', async () => {
    const name = teamName.value.trim();
    const role = teamRole.value.trim();
    const bio = teamBio.value.trim();
    const imageUrl = teamImage.value.trim();
    const social = teamSocial.value.trim();

    if (!name || !role || !bio || !imageUrl) {
        teamSuccess.textContent = '❌ Please fill out all fields.';
        return;
    }

    try {
        await addDoc(collection(db, 'team'), {
            name,
            role,
            bio,
            imageUrl,
            social,
            dateAdded: serverTimestamp()
        });

        teamName.value = '';
        teamRole.value = '';
        teamBio.value = '';
        teamImage.value = '';
        teamSocial.value = '';
        teamSuccess.textContent = '✅ Team member added successfully!';
    } catch (error) {
        console.error("Error adding team member:", error);
        teamSuccess.textContent = '❌ Failed to add team member.';
    }
});
