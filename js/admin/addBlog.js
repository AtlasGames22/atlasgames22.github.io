import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const blogTitle = document.getElementById('blog-title');
const blogContent = document.getElementById('blog-content');
const blogImageFile = document.getElementById('blog-image-file');
const blogSuccess = document.getElementById('blog-success');
const blogSubmit = document.getElementById('submit-blog');

blogSubmit?.addEventListener('click', async () => {
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();
    const imageFile = blogImageFile.files[0];

    if (!title || !content || !imageFile) {
        blogSuccess.textContent = '❌ Please fill out all fields and select an image.';
        return;
    }

    try {
        const cleanTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageUrl = `assets/images/blogsImages/${imageFile.name}`; // Static path

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
