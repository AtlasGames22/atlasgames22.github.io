/* Main JavaScript - Atlas Games Website */

class AtlasGamesWebsite {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.lightbox = null;
        this.mobileMenuOpen = false;
        this.searchData = {
            games: [],
            blog: [],
            team: []
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupLightbox();
        this.loadPageContent();
        this.setupSearch();
        this.setupLazyLoading();

        // Load content data
        this.loadContentData();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        return filename || 'index.html';
    }

    setupNavigation() {
        // Set active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPage ||
                (this.currentPage === 'index.html' && href === '/')) {
                link.classList.add('active');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-links');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                this.mobileMenuOpen = !this.mobileMenuOpen;
                menu.classList.toggle('active', this.mobileMenuOpen);
                toggle.setAttribute('aria-expanded', this.mobileMenuOpen);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.mobileMenuOpen && !toggle.contains(e.target) && !menu.contains(e.target)) {
                    this.mobileMenuOpen = false;
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', false);
                }
            });

            // Close menu when clicking nav links
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileMenuOpen = false;
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', false);
                });
            });
        }
    }

    setupLightbox() {
        // Create lightbox HTML if it doesn't exist
        if (!document.querySelector('.lightbox')) {
            const lightboxHTML = `
                <div class="lightbox" id="lightbox">
                    <div class="lightbox-content">
                        <button class="lightbox-close" aria-label="Close">&times;</button>
                        <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
                        <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
                        <img class="lightbox-image" src="" alt="">
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        this.lightbox = {
            element: document.getElementById('lightbox'),
            image: document.querySelector('.lightbox-image'),
            closeBtn: document.querySelector('.lightbox-close'),
            prevBtn: document.querySelector('.lightbox-prev'),
            nextBtn: document.querySelector('.lightbox-next'),
            currentIndex: 0,
            images: []
        };

        // Event listeners
        this.lightbox.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.lightbox.element.addEventListener('click', (e) => {
            if (e.target === this.lightbox.element) this.closeLightbox();
        });
        this.lightbox.prevBtn.addEventListener('click', () => this.showPrevImage());
        this.lightbox.nextBtn.addEventListener('click', () => this.showNextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.element.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.showPrevImage();
                if (e.key === 'ArrowRight') this.showNextImage();
            }
        });

        // Setup gallery items
        this.setupGalleryItems();
    }

    setupGalleryItems() {
        document.querySelectorAll('.gallery-item, .game-screenshot').forEach((item, index) => {
            item.addEventListener('click', () => {
                const images = Array.from(item.closest('.gallery, .screenshots-grid').querySelectorAll('img'));
                this.openLightbox(images, index);
            });
        });
    }

    openLightbox(images, startIndex = 0) {
        this.lightbox.images = images.map(img => ({
            src: img.src,
            alt: img.alt || ''
        }));
        this.lightbox.currentIndex = startIndex;
        this.showCurrentImage();
        this.lightbox.element.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.element.classList.remove('active');
        document.body.style.overflow = '';
    }

    showCurrentImage() {
        const current = this.lightbox.images[this.lightbox.currentIndex];
        this.lightbox.image.src = current.src;
        this.lightbox.image.alt = current.alt;

        // Update navigation buttons
        this.lightbox.prevBtn.style.display = this.lightbox.currentIndex > 0 ? 'block' : 'none';
        this.lightbox.nextBtn.style.display = this.lightbox.currentIndex < this.lightbox.images.length - 1 ? 'block' : 'none';
    }

    showPrevImage() {
        if (this.lightbox.currentIndex > 0) {
            this.lightbox.currentIndex--;
            this.showCurrentImage();
        }
    }

    showNextImage() {
        if (this.lightbox.currentIndex < this.lightbox.images.length - 1) {
            this.lightbox.currentIndex++;
            this.showCurrentImage();
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const filterSelects = document.querySelectorAll('.filter-select');

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.performSearch();
            }, 300));
        }

        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.performSearch();
            });
        });
    }

    performSearch() {
        const query = document.querySelector('.search-input')?.value.toLowerCase() || '';
        const filters = {};

        document.querySelectorAll('.filter-select').forEach(select => {
            if (select.value) {
                filters[select.name] = select.value;
            }
        });

        // Filter based on current page
        if (this.currentPage.includes('games')) {
            this.filterGames(query, filters);
        } else if (this.currentPage.includes('blog')) {
            this.filterBlog(query, filters);
        }
    }

    filterGames(query, filters) {
        const gameCards = document.querySelectorAll('.game-card');

        gameCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            const status = card.querySelector('.game-status')?.textContent.toLowerCase() || '';

            let show = true;

            // Text search
            if (query && !title.includes(query) && !description.includes(query) && !tags.some(tag => tag.includes(query))) {
                show = false;
            }

            // Filters
            if (filters.status && status !== filters.status.toLowerCase()) {
                show = false;
            }

            if (filters.platform) {
                const platforms = card.querySelector('.platforms')?.textContent.toLowerCase() || '';
                if (!platforms.includes(filters.platform.toLowerCase())) {
                    show = false;
                }
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    filterBlog(query, filters) {
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());

            let show = true;

            // Text search
            if (query && !title.includes(query) && !excerpt.includes(query) && !tags.some(tag => tag.includes(query))) {
                show = false;
            }

            // Tag filter
            if (filters.tag && !tags.includes(filters.tag.toLowerCase())) {
                show = false;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('skeleton');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.classList.add('skeleton');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    async loadContentData() {
        try {
            // Load games data
            const gamesResponse = await fetch('./data/games.json');
            if (gamesResponse.ok) {
                this.searchData.games = await gamesResponse.json();
            }

            // Load blog data
            const blogResponse = await fetch('./data/blog.json');
            if (blogResponse.ok) {
                this.searchData.blog = await blogResponse.json();
            }

            // Load team data
            const teamResponse = await fetch('./data/team.json');
            if (teamResponse.ok) {
                this.searchData.team = await teamResponse.json();
            }

            // Render dynamic content based on current page
            this.renderPageContent();
        } catch (error) {
            console.warn('Content data not available yet:', error);
        }
    }

    renderPageContent() {
        // This will be called after build when data files exist
        if (this.currentPage === 'index.html' || this.currentPage === '') {
            this.renderHomePage();
        }
    }

    renderHomePage() {
        // Render featured game and latest blog posts on home page
        const featuredGameContainer = document.querySelector('#featured-game');
        const latestPostsContainer = document.querySelector('#latest-posts');

        if (featuredGameContainer && this.searchData.games.length > 0) {
            const featuredGame = this.searchData.games.find(game => game.featured) || this.searchData.games[0];
            featuredGameContainer.innerHTML = this.renderGameCard(featuredGame);
        }

        if (latestPostsContainer && this.searchData.blog.length > 0) {
            const latestPosts = this.searchData.blog.slice(0, 3);
            latestPostsContainer.innerHTML = latestPosts.map(post => this.renderBlogCard(post)).join('');
        }
    }

    renderGameCard(game) {
        return `
            <div class="card game-card">
                <div class="game-card-image">
                    <img src="${game.coverImage}" alt="${game.title}" class="card-image">
                    <div class="game-status ${game.status.toLowerCase().replace(' ', '-')}">${game.status}</div>
                    <div class="game-card-overlay">
                        <a href="game/${game.slug}.html" class="btn btn-primary">View Details</a>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${game.title}</h3>
                    <p class="card-text">${game.shortPitch}</p>
                    <div class="tags">
                        ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="platforms">${game.platforms.join(', ')}</div>
                </div>
                <div class="card-footer">
                    <a href="${game.links.itchio}" class="btn btn-primary">Play on itch.io</a>
                </div>
            </div>
        `;
    }

    renderBlogCard(post) {
        return `
            <div class="card blog-card">
                <img src="${post.frontmatter.cover || '/assets/images/blog/default.jpg'}" alt="${post.frontmatter.title}" class="blog-card-image">
                <div class="blog-card-content">
                    <div class="blog-date">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
                    <h3 class="card-title">
                        <a href="blog/${post.slug}.html">${post.frontmatter.title}</a>
                    </h3>
                    <p class="blog-excerpt">${post.frontmatter.excerpt}</p>
                    <div class="tags">
                        ${(post.frontmatter.tags || '').split(',').map(tag => 
                            `<span class="tag">${tag.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    loadPageContent() {
        // Add fade-in animation to page content
        const main = document.querySelector('.main');
        if (main) {
            main.classList.add('fade-in');
        }

        // Setup any page-specific functionality
        this.setupPageSpecificFeatures();
    }

    setupPageSpecificFeatures() {
        // Contact form
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Newsletter signup
        const newsletterForm = document.querySelector('#newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSignup.bind(this));
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Create mailto link
        const subject = `Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:atlasgamesstudio22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    }

    handleNewsletterSignup(e) {
        e.preventDefault();
        const email = new FormData(e.target).get('email');
        // For now, just show a success message
        alert('Thank you for subscribing! We\'ll be in touch soon.');
    }

    // Utility functions
    debounce(func, wait) {
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
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AtlasGamesWebsite();
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
