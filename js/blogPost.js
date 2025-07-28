import { db } from './firebase-config.js';
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Get blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');
const blogDetail = document.getElementById('blog-detail');

async function loadBlogPost() {
    if (!blogId) {
        blogDetail.innerHTML = "<p class='error-text'>❌ Blog ID not found.</p>";
        return;
    }

    try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            blogDetail.innerHTML = "<p class='error-text'>❌ Blog post not found.</p>";
            return;
        }

        const post = docSnap.data();
        const date = post.date?.toDate().toLocaleDateString('en-GB') || 'Date Unknown';
        const image = post.imageUrl || '../assets/images/default-blog.jpg';

        blogDetail.innerHTML = `
      <h1>${post.title}</h1>
      <p class="blog-date">${date}</p>
      <img src="${image}" alt="Blog Image" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin: 2rem 0;" />
      <p style="white-space: pre-wrap; line-height: 1.8;">${post.content}</p>
    `;
    } catch (error) {
        console.error("Error loading blog:", error);
        blogDetail.innerHTML = "<p class='error-text'>❌ Error loading blog post.</p>";
    }
}

loadBlogPost();
