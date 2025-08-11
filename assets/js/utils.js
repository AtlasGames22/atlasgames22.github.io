/**
 * Utility functions for Atlas Games website
 */

class Utils {
    /**
     * Debounce function to limit rapid function calls
     */
    static debounce(func, wait) {
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

    /**
     * Format date for display
     */
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Calculate reading time based on word count
     */
    static calculateReadTime(text, wordsPerMinute = 200) {
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Generate slug from title
     */
    static generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Update URL query parameters without page reload
     */
    static updateURLParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState(null, '', url);
    }

    /**
     * Get URL query parameters
     */
    static getURLParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Lazy load images when they enter viewport
     */
    static initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Create loading spinner element
     */
    static createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading';
        spinner.innerHTML = 'Loading...';
        return spinner;
    }

    /**
     * Create no results message element
     */
    static createNoResultsMessage(message = 'No results found') {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `<p>${message}</p>`;
        return noResults;
    }

    /**
     * Smooth scroll to element
     */
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Handle errors gracefully
     */
    static handleError(error, userMessage = 'Something went wrong') {
        console.error('Error:', error);

        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<p>${userMessage}</p>`;

        return errorDiv;
    }

    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Get unique values from array of objects by property
     */
    static getUniqueValues(array, property) {
        const values = array.flatMap(item => {
            const value = item[property];
            return Array.isArray(value) ? value : [value];
        });
        return [...new Set(values)].filter(Boolean).sort();
    }

    /**
     * Truncate text to specified length
     */
    static truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Create breadcrumb navigation
     */
    static createBreadcrumbs(path) {
        const breadcrumbs = document.createElement('nav');
        breadcrumbs.className = 'breadcrumbs';
        breadcrumbs.setAttribute('aria-label', 'Breadcrumb navigation');

        const parts = path.split('/').filter(Boolean);
        let currentPath = '';

        const breadcrumbList = document.createElement('ol');

        // Home link
        const homeItem = document.createElement('li');
        homeItem.innerHTML = '<a href="index.html">Home</a>';
        breadcrumbList.appendChild(homeItem);

        parts.forEach((part, index) => {
            currentPath += '/' + part;
            const item = document.createElement('li');

            if (index === parts.length - 1) {
                item.textContent = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                item.setAttribute('aria-current', 'page');
            } else {
                const link = document.createElement('a');
                link.href = currentPath + '.html';
                link.textContent = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                item.appendChild(link);
            }

            breadcrumbList.appendChild(item);
        });

        breadcrumbs.appendChild(breadcrumbList);
        return breadcrumbs;
    }
}

// Export for use in other modules
window.Utils = Utils;
