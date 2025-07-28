import { db } from './firebase-config.js';
import { doc, getDoc } from 'firebase/firestore';

// Get the member ID from the URL
const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');

const nameEl = document.getElementById('team-name');
const roleEl = document.getElementById('team-role');
const bioEl = document.getElementById('team-bio');
const photoEl = document.getElementById('team-photo');

if (!memberId) {
    nameEl.textContent = 'Team member not found';
} else {
    const memberRef = doc(db, 'team', memberId);

    getDoc(memberRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const member = docSnap.data();

                document.title = `${member.name || 'Team Member'} – Atlas Games`;

                nameEl.textContent = member.name || 'Unnamed';
                roleEl.textContent = member.role || 'Role Unknown';
                bioEl.textContent = member.bio || 'No biography available.';

                photoEl.src = member.imageUrl || 'assets/images/default-avatar.png';
                photoEl.alt = member.name || 'Team Member';
                photoEl.onerror = () => {
                    photoEl.src = 'assets/images/default-avatar.png';
                };
            } else {
                nameEl.textContent = 'Team member not found';
            }
        })
        .catch((err) => {
            console.error('Error loading team member:', err);
            nameEl.textContent = 'Error loading team member';
        });
}
