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
        const date = post.date?.toDate().toLocaleDateString('en-GB') || 'Date Unknown';
        const image = post.imageUrl || 'assets/images/default-blog.jpg';
        const preview = post.content.length > 140 ? post.content.slice(0, 140) + '...' : post.content;

        const cardHTML = `
      <div class="blog-card">
        <img src="${image}" alt="Blog Image">
        <div class="blog-content">
          <h3>${post.title}</h3>
          <p class="blog-date">${date}</p>
          <p>${preview}</p>
          <a href="#" class="btn secondary">Read More</a>
        </div>
      </div>
    `;
        blogContainer.innerHTML += cardHTML;
    });
}

loadBlogPosts();
