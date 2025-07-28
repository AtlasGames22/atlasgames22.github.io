import { db } from './firebase-config.js';
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const grid = document.getElementById('team-grid');

async function loadTeam() {
    try {
        const q = query(collection(db, 'team'), orderBy('dateAdded', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            grid.innerHTML = "<p>No team members found.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const member = doc.data();
            const id = doc.id;

            const card = document.createElement('div');
            card.className = 'team-card';

            const link = document.createElement('a');
            link.href = `team-member.html?id=${id}`;
            link.className = 'card-link';

            const img = document.createElement('img');
            img.src = member.imageUrl || 'assets/images/default-avatar.png';
            img.alt = member.name || 'Team Member';
            img.loading = 'lazy';
            img.onerror = () => {
                img.src = 'assets/images/default-avatar.png';
            };

            const name = document.createElement('h3');
            name.textContent = member.name || 'Unnamed';

            const role = document.createElement('p');
            role.className = 'role';
            role.textContent = member.role || 'Role Unknown';

            const bio = document.createElement('p');
            bio.className = 'bio';
            bio.textContent = member.bio || 'No bio available.';

            link.appendChild(img);
            link.appendChild(name);
            link.appendChild(role);
            link.appendChild(bio);

            card.appendChild(link);
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading team members:', err);
        grid.innerHTML = "<p>Error loading team members. Please try again later.</p>";
    }
}

loadTeam();
