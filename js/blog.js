import { db } from './firebase-config.js';
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const blogContainer = document.getElementById('blog-posts-container');

async function loadBlogPosts() {
    const blogQuery = query(collection(db, 'blogs'), orderBy('date', 'desc'));
    const blogSnapshot = await getDocs(blogQuery);

    if (blogSnapshot.empty) {
        blogContainer.innerHTML = "<p>No blog posts yet. Check back soon!</p>";
        return;
    }

    blogSnapshot.forEach(doc => {
        const post = doc.data();
        const safeTitle = post.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled';

        // 🗓 Format date safely
        let date = 'Date Unknown';
        if (post.date?.toDate) {
            try {
                date = post.date.toDate().toLocaleDateString('en-GB');
            } catch {}
        }

        // 🖼 Image fallback
        const image = post.imageUrl || `assets/images/blogsImages/${safeTitle}.jpg`;
        const preview = post.content.length > 140 ? post.content.slice(0, 140) + '...' : post.content;

        // 🧱 Build blog card element
        const card = document.createElement('div');
        card.className = 'blog-card';

        const img = document.createElement('img');
        img.src = image;
        img.alt = `Blog Image for ${post.title}`;
        img.loading = "lazy";
        img.onerror = () => {
            img.src = 'assets/images/default-blog.jpg';
        };

        const contentDiv = document.createElement('div');
        contentDiv.className = 'blog-content';

        const title = document.createElement('h3');
        title.textContent = post.title;

        const blogDate = document.createElement('p');
        blogDate.className = 'blog-date';
        blogDate.textContent = date;

        const previewPara = document.createElement('p');
        previewPara.textContent = preview;

        const readMoreLink = document.createElement('a');
        readMoreLink.href = `blogs/blogPost.html?id=${doc.id}`;
        readMoreLink.className = 'btn secondary';
        readMoreLink.textContent = 'Read More';

        contentDiv.appendChild(title);
        contentDiv.appendChild(blogDate);
        contentDiv.appendChild(previewPara);
        contentDiv.appendChild(readMoreLink);

        card.appendChild(img);
        card.appendChild(contentDiv);

        blogContainer.appendChild(card);
    });
}

loadBlogPosts();
