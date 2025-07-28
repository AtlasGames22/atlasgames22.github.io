import { db } from '../firebase-config.js';
import {
    collection,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const teamSelect = document.getElementById('edit-team-select');
const editTeamName = document.getElementById('edit-team-name');
const editTeamRole = document.getElementById('edit-team-role');
const editTeamBio = document.getElementById('edit-team-bio');
const editTeamSave = document.getElementById('edit-team-save');
const editTeamSuccess = document.getElementById('edit-team-success');

const deleteTeamSelect = document.getElementById('delete-team-select');
const deleteTeamBtn = document.getElementById('delete-team-button');
const deleteTeamSuccess = document.getElementById('delete-team-success');

// Load members into dropdowns
async function loadTeamMembers() {
    const snapshot = await getDocs(collection(db, 'team'));

    teamSelect.innerHTML = `<option value="">Select a member</option>`;
    deleteTeamSelect.innerHTML = `<option value="">Select a member</option>`;

    snapshot.forEach(docSnap => {
        const member = docSnap.data();
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = docSnap.id;
        option1.textContent = option2.textContent = member.name;

        teamSelect.appendChild(option1);
        deleteTeamSelect.appendChild(option2);
    });
}

// Prefill selected member data
teamSelect?.addEventListener('change', async () => {
    const id = teamSelect.value;
    if (!id) return;

    const docSnap = await getDoc(doc(db, 'team', id));
    const member = docSnap.data();

    editTeamName.value = member.name;
    editTeamRole.value = member.role;
    editTeamBio.value = member.bio;
});

// Save updates
editTeamSave?.addEventListener('click', async () => {
    const id = teamSelect.value;
    const name = editTeamName.value.trim();
    const role = editTeamRole.value.trim();
    const bio = editTeamBio.value.trim();

    if (!id || !name || !role || !bio) {
        editTeamSuccess.textContent = '❌ Please fill out all fields.';
        return;
    }

    try {
        await updateDoc(doc(db, 'team', id), { name, role, bio });
        editTeamSuccess.textContent = '✅ Team member updated!';
        await loadTeamMembers();
    } catch (error) {
        console.error(error);
        editTeamSuccess.textContent = '❌ Failed to update member.';
    }
});

// Delete team member
deleteTeamBtn?.addEventListener('click', async () => {
    const teamId = deleteTeamSelect.value;
    if (!teamId) {
        deleteTeamSuccess.textContent = '❌ Please select a member.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this team member?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'team', teamId));
        deleteTeamSuccess.textContent = '✅ Team member deleted!';
        await loadTeamMembers();
    } catch (error) {
        console.error(error);
        deleteTeamSuccess.textContent = '❌ Failed to delete member.';
    }
});

loadTeamMembers();
