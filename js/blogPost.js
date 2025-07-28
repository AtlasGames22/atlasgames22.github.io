import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

// 🔍 Extract blog ID from URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

// 🔐 DOM elements
const titleEl = document.getElementById('blog-title');
const dateEl = document.getElementById('blog-date');
const imageEl = document.getElementById('blog-image');
const contentEl = document.getElementById('blog-content');

// ❌ Handle missing ID
if (!blogId) {
    titleEl.textContent = 'Post not found';
    return;
}

// 📥 Fetch blog post
async function loadBlogPost() {
    try {
        const blogRef = doc(db, 'blogs', blogId);
        const docSnap = await getDoc(blogRef);

        if (!docSnap.exists()) {
            titleEl.textContent = 'Post not found';
            return;
        }

        const data = docSnap.data();
        const date = data.timestamp?.seconds
            ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('en-GB')
            : 'Date Unknown';

        const safeTitle = data.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled';

        // Set content
        document.title = `${data.title} – Atlas Games`;
        titleEl.textContent = data.title;
        dateEl.textContent = date;
        imageEl.src = data.imageUrl || `assets/images/blogsImages/${safeTitle}.jpg`;
        imageEl.onerror = () => {
            imageEl.src = 'assets/images/default-blog.jpg';
        };
        contentEl.innerHTML = data.content;
    } catch (error) {
        console.error('Error loading blog post:', error);
        titleEl.textContent = 'Error loading post';
    }
}

loadBlogPost();
