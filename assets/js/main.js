// Atlas Games - Main JavaScript

// Global variables for lightbox
let currentImageIndex = 0;
let screenshots = [];

// Initialize the site
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLightbox();
    loadRelatedGames();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Lightbox functionality
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    screenshots = Array.from(galleryItems).map(img => ({
        url: img.src,
        alt: img.alt
    }));

    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            switch(event.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');

    if (lightbox && lightboxImage && screenshots[index]) {
        lightboxImage.src = screenshots[index].url;
        lightboxImage.alt = screenshots[index].alt;
        lightboxCounter.textContent = `${index + 1} / ${screenshots.length}`;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');

        // Focus management for accessibility
        lightbox.focus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to the gallery item that opened the lightbox
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems[currentImageIndex]) {
            galleryItems[currentImageIndex].focus();
        }
    }
}

function nextImage() {
    if (currentImageIndex < screenshots.length - 1) {
        openLightbox(currentImageIndex + 1);
    } else {
        openLightbox(0); // Loop to first image
    }
}

function prevImage() {
    if (currentImageIndex > 0) {
        openLightbox(currentImageIndex - 1);
    } else {
        openLightbox(screenshots.length - 1); // Loop to last image
    }
}

// Load related games for game detail pages
async function loadRelatedGames() {
    const relatedGamesContainer = document.getElementById('related-games');
    if (!relatedGamesContainer) return;

    try {
        const response = await fetch('/data/games.json');
        const games = await response.json();

        // Get current game slug from URL
        const currentPath = window.location.pathname;
        const currentSlug = currentPath.split('/').pop().replace('.html', '');

        // Filter out current game and get up to 3 related games
        const relatedGames = games
            .filter(game => game.slug !== currentSlug)
            .slice(0, 3);

        if (relatedGames.length > 0) {
            relatedGamesContainer.innerHTML = relatedGames.map(game => `
                <div class="game-card">
                    <a href="/game/${game.slug}.html" class="game-link">
                        <img src="${game.coverImage}" alt="${game.title}" class="game-cover" loading="lazy">
                        <div class="game-info">
                            <h3 class="game-title">${game.title}</h3>
                            <p class="game-pitch">${game.pitch}</p>
                            <div class="game-status">
                                <span class="status-badge status-${game.status}">${game.statusLabel || game.status}</span>
                            </div>
                        </div>
                    </a>
                </div>
            `).join('');
        } else {
            relatedGamesContainer.innerHTML = '<p>No other games available at this time.</p>';
        }
    } catch (error) {
        console.error('Error loading related games:', error);
        relatedGamesContainer.innerHTML = '<p>Unable to load related games.</p>';
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        img.addEventListener('error', function() {
            this.classList.add('error');
            // Optional: Replace with placeholder image
            // this.src = '/assets/images/placeholder.jpg';
        });
    });
});

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}
