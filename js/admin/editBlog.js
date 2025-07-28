import { db } from '../firebase-config.js';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const blogSelect = document.getElementById('edit-blog-select');
const editTitle = document.getElementById('edit-blog-title');
const editContent = document.getElementById('edit-blog-content');
const editSuccess = document.getElementById('edit-blog-success');
const editSave = document.getElementById('edit-blog-save');

const deleteBlogSelect = document.getElementById('delete-blog-select');
const deleteBlogBtn = document.getElementById('delete-blog-button');
const deleteBlogSuccess = document.getElementById('delete-blog-success');

// Load blogs into both dropdowns
async function loadBlogOptions() {
    const snapshot = await getDocs(collection(db, 'blogs'));

    blogSelect.innerHTML = `<option value="">Select a blog post</option>`;
    deleteBlogSelect.innerHTML = `<option value="">Select a blog post</option>`;

    snapshot.forEach(docSnap => {
        const blog = docSnap.data();
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = docSnap.id;
        option1.textContent = option2.textContent = blog.title;

        blogSelect.appendChild(option1);
        deleteBlogSelect.appendChild(option2);
    });
}

// Prefill on select
blogSelect?.addEventListener('change', async () => {
    const blogId = blogSelect.value;
    if (!blogId) return;

    const blogDoc = await getDoc(doc(db, 'blogs', blogId));
    const blog = blogDoc.data();

    editTitle.value = blog.title;
    editContent.value = blog.content;
});

// Save changes
editSave?.addEventListener('click', async () => {
    const blogId = blogSelect.value;
    const newTitle = editTitle.value.trim();
    const newContent = editContent.value.trim();

    if (!blogId || !newTitle || !newContent) {
        editSuccess.textContent = '❌ Fill all fields and select a blog.';
        return;
    }

    try {
        await updateDoc(doc(db, 'blogs', blogId), {
            title: newTitle,
            content: newContent
        });

        editSuccess.textContent = '✅ Blog updated!';
        await loadBlogOptions();
    } catch (error) {
        console.error(error);
        editSuccess.textContent = '❌ Failed to update blog.';
    }
});

// Delete post
deleteBlogBtn?.addEventListener('click', async () => {
    const blogId = deleteBlogSelect.value;
    if (!blogId) {
        deleteBlogSuccess.textContent = '❌ Select a blog to delete.';
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, 'blogs', blogId));
        deleteBlogSuccess.textContent = '✅ Blog deleted!';
        await loadBlogOptions();
    } catch (error) {
        console.error(error);
        deleteBlogSuccess.textContent = '❌ Failed to delete blog.';
    }
});

loadBlogOptions();
