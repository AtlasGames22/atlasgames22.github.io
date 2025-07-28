import { db } from './firebase-config.js';
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const grid = document.getElementById('team-grid');

async function loadTeam() {
    const q = query(collection(db, 'team'), orderBy('dateAdded', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        grid.innerHTML = "<p>No team members found.</p>";
        return;
    }

    snapshot.forEach(doc => {
        const member = doc.data();
        const card = document.createElement('div');
        card.className = 'team-card';

        const img = document.createElement('img');
        img.src = member.imageUrl || 'assets/images/default-avatar.png';
        img.alt = member.name;
        img.onerror = () => {
            img.src = 'assets/images/default-avatar.png';
        };

        const name = document.createElement('h3');
        name.textContent = member.name;

        const role = document.createElement('p');
        role.className = 'role';
        role.textContent = member.role;

        const bio = document.createElement('p');
        bio.className = 'bio';
        bio.textContent = member.bio;

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(bio);

        grid.appendChild(card);
    });
}

loadTeam();
