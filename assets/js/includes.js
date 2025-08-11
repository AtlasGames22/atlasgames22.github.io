/**
 * Includes system for Atlas Games website
 * Loads reusable components (header, nav, footer) into pages
 */

class IncludesLoader {
    constructor() {
        this.loadIncludes();
    }

    async loadIncludes() {
        try {
            // Load header
            await this.loadComponent('header', 'reusables/header.html');

            // Load navigation
            await this.loadComponent('nav', 'reusables/navigationbar.html');

            // Load footer
            await this.loadComponent('footer', 'reusables/footer.html');

            // Initialize navigation after loading
            this.initializeNavigation();

        } catch (error) {
            console.error('Error loading includes:', error);
        }
    }

    async loadComponent(elementId, filePath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }

            const content = await response.text();
            element.innerHTML = content;

        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            // Fallback content
            if (elementId === 'nav') {
                element.innerHTML = '<nav><a href="index.html">Atlas Games</a></nav>';
            }
        }
    }

    initializeNavigation() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }

        // Set active nav item based on current page
        this.setActiveNavItem();

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav') && navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle?.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
