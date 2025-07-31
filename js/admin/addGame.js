// Thumbnail Preview
document.getElementById('thumbnail-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('thumbnail-preview');
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
    }
});

// Screenshot Previews
document.getElementById('screenshots-upload')?.addEventListener('change', (e) => {
    const gallery = document.getElementById('screenshots-preview');
    gallery.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'preview-img';
        gallery.appendChild(img);
    });
});
