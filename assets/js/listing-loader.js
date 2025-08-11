/**
 * Listing loader for Atlas Games website
 * Handles loading and displaying data for games, blogs, team, awards
 */

class ListingLoader {
    constructor(config) {
        this.dataUrl = config.dataUrl;
        this.containerSelector = config.containerSelector;
        this.filtersSelector = config.filtersSelector;
        this.cardTemplate = config.cardTemplate;
        this.searchFields = config.searchFields || ['title'];
        this.itemsPerPage = config.itemsPerPage || 12;

        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.search = null;
        this.filters = null;

        this.init();
    }

    /**
     * Initialize the listing loader
     */
    async init() {
        try {
            await this.loadData();
            this.initializeSearch();
            this.initializeFilters();
            this.render();
        } catch (error) {
            this.handleError(error);
        }


    /**
     * Load data from JSON file
     */
    async loadData() {
        const container = document.querySelector(this.containerSelector);
        if (container) {
            container.appendChild(Utils.createLoadingSpinner());
        }

        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }

            this.data = await response.json();
            this.filteredData = [...this.data];

        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        this.search = new Search(this.data, this.searchFields);
    }

    /**
     * Initialize filters
     */
    initializeFilters() {
        const filterOptions = this.search.getFilterOptions();

        this.filters = new Filters(this.filtersSelector, (activeFilters) => {
            this.applyFilters(activeFilters);


        this.filters.init(filterOptions);
    }

    /**
     * Apply filters and update display
     */
    applyFilters(filters) {
        // Get filtered and sorted data
        this.filteredData = this.search.advancedSearch(filters);

        if (filters.sortBy) {
            this.filteredData = this.search.sort(
                this.filteredData,
                filters.sortBy,
                filters.sortOrder || 'desc'
            );
        }

        // Reset to first page
        this.currentPage = 1;

        // Update display
        this.render();
        this.updateResultsCount();
    }

    /**
     * Render the current page
     */
    render() {
        const container = document.querySelector(this.containerSelector);
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Show loading state
        if (this.filteredData.length === 0 && this.data.length > 0) {
            container.appendChild(Utils.createNoResultsMessage());
            return;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        // Render items
        const grid = document.createElement('div');
        grid.className = 'grid grid-3';

        pageData.forEach(item => {
            const card = this.createCard(item);
            grid.appendChild(card);
        });

        container.appendChild(grid);

        // Add pagination if needed
        if (this.filteredData.length > this.itemsPerPage) {
            container.appendChild(this.createPagination());
        }

        // Initialize lazy loading for images
        Utils.initLazyLoading();
    }

    /**
     * Create a card element based on the template
     */
    createCard(item) {
        const card = document.createElement('article');
        card.className = 'card';

        // Use template function if provided, otherwise use default
        if (this.cardTemplate && typeof this.cardTemplate === 'function') {
            card.innerHTML = this.cardTemplate(item);
        } else {
            card.innerHTML = this.getDefaultCardTemplate(item);
        }

        return card;
    }

    /**
     * Default card template
     */
    getDefaultCardTemplate(item) {
        const date = item.date || item.releaseDate || '';
        const formattedDate = date ? Utils.formatDate(date) : '';

        const tags = item.tags ? item.tags.map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('') : '';

        const status = item.status ? `<span class="status status-${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span>` : '';

        return `
            <img src="${item.thumbnail}" alt="${item.title}" class="card-image" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">
                    <a href="${item.detailPath}">${item.title}</a>
                </h3>
                ${formattedDate ? `<div class="card-meta">${formattedDate}</div>` : ''}
                ${item.role ? `<div class="card-meta">${item.role}</div>` : ''}
                ${item.competition ? `<div class="card-meta">${item.competition}</div>` : ''}
                ${item.rank ? `<div class="card-meta">Rank: ${item.rank}</div>` : ''}
                <p class="card-description">${item.description || item.excerpt || item.bio || ''}</p>
                ${tags ? `<div class="card-tags">${tags}</div>` : ''}
                ${status}
            </div>
        `;
    }

    /**
     * Create pagination controls
     */
    createPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

        const pagination = document.createElement('nav');
        pagination.className = 'pagination';
        pagination.setAttribute('aria-label', 'Pagination navigation');

        const paginationList = document.createElement('ul');
        paginationList.className = 'pagination-list';

        // Previous button
        if (this.currentPage > 1) {
            const prevButton = this.createPaginationButton(
                this.currentPage - 1,
                'Previous',
                'prev'
            );
            paginationList.appendChild(prevButton);
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = this.createPaginationButton(i, i.toString());
            if (i === this.currentPage) {
                pageButton.classList.add('active');
                pageButton.setAttribute('aria-current', 'page');
            }
            paginationList.appendChild(pageButton);
        }

        // Next button
        if (this.currentPage < totalPages) {
            const nextButton = this.createPaginationButton(
                this.currentPage + 1,
                'Next',
                'next'
            );
            paginationList.appendChild(nextButton);
        }

        pagination.appendChild(paginationList);
        return pagination;
    }

    /**
     * Create pagination button
     */
    createPaginationButton(page, text, type = 'page') {
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.textContent = text;
        button.className = `pagination-btn ${type}`;
        button.addEventListener('click', () => this.goToPage(page));

        li.appendChild(button);
        return li;
    }

    /**
     * Navigate to specific page
     */
    goToPage(page) {
        this.currentPage = page;
        this.render();

        // Scroll to top of results
        const container = document.querySelector(this.containerSelector);
        if (container) {
            Utils.scrollToElement(container, 100);
        }
    }

    /**
     * Update results count display
     */
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const total = this.filteredData.length;
            const showing = Math.min(this.itemsPerPage, total);
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(start + showing - 1, total);

            if (total === 0) {
                countElement.textContent = 'No results found';
            } else {
                countElement.textContent = `Showing ${start}-${end} of ${total} results`;
            }
        }
    }

    /**
     * Handle errors
     */
    handleError(error) {
        const container = document.querySelector(this.containerSelector);
        if (container) {
            container.innerHTML = '';
            container.appendChild(Utils.handleError(error, 'Failed to load data. Please try again later.'));
        }
    }

    /**
     * Refresh data
     */
    async refresh() {
        try {
            await this.loadData();
            this.search.updateData(this.data);
            this.filteredData = [...this.data];
            this.currentPage = 1;
            this.render();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get current data
     */
    getData() {
        return this.data;
    }

    /**
     * Get filtered data
     */
    getFilteredData() {
        return this.filteredData;
    }
}

// Export for use in other modules
window.ListingLoader = ListingLoader;
