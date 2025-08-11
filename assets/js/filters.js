/**
 * Filters system for Atlas Games website
 */

class Filters {
    constructor(containerSelector, onFilterChange) {
        this.container = document.querySelector(containerSelector);
        this.onFilterChange = onFilterChange;
        this.activeFilters = {};
        this.filterOptions = {};
    }

    /**
     * Initialize filters with options
     */
    init(filterOptions) {
        this.filterOptions = filterOptions;
        this.createFilterUI();
        this.bindEvents();
        this.loadFromURL();
    }

    /**
     * Create filter UI elements
     */
    createFilterUI() {
        if (!this.container) return;

        const filtersHTML = `
            <div class="search-filters">
                <div class="search-bar">
                    <input 
                        type="text" 
                        id="search-input" 
                        class="search-input" 
                        placeholder="Search..." 
                        aria-label="Search"
                    >
                    <button type="button" class="btn btn-primary" id="search-btn">Search</button>
                </div>
                
                <div class="filters-row">
                    ${this.createFilterSelect('status', 'Status', this.filterOptions.statuses)}
                    ${this.createFilterSelect('genre', 'Genre', this.filterOptions.genres)}
                    ${this.createFilterSelect('platform', 'Platform', this.filterOptions.platforms)}
                    ${this.createFilterSelect('role', 'Role', this.filterOptions.roles)}
                    ${this.createFilterSelect('competition', 'Competition', this.filterOptions.competitions)}
                    ${this.createSortSelect()}
                    <div class="filter-group">
                        <button type="button" class="btn btn-secondary" id="clear-filters">Clear All</button>
                    </div>
                </div>
                
                ${this.createTagsFilter()}
            </div>
        `;

        this.container.innerHTML = filtersHTML;
    }

    /**
     * Create a filter select dropdown
     */
    createFilterSelect(key, label, options) {
        if (!options || options.length === 0) return '';

        return `
            <div class="filter-group">
                <label for="filter-${key}">${label}</label>
                <select id="filter-${key}" class="filter-select" data-filter="${key}">
                    <option value="all">All ${label}s</option>
                    ${options.map(option => 
                        `<option value="${option}">${option}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }

    /**
     * Create sort select dropdown
     */
    createSortSelect() {
        return `
            <div class="filter-group">
                <label for="sort-select">Sort By</label>
                <select id="sort-select" class="filter-select">
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="status-asc">Status</option>
                </select>
            </div>
        `;
    }

    /**
     * Create tags filter checkboxes
     */
    createTagsFilter() {
        if (!this.filterOptions.tags || this.filterOptions.tags.length === 0) {
            return '';
        }

        return `
            <div class="tags-filter">
                <h4>Filter by Tags:</h4>
                <div class="tags-grid">
                    ${this.filterOptions.tags.map(tag => `
                        <label class="tag-checkbox">
                            <input type="checkbox" value="${tag}" data-filter="tags">
                            <span class="tag">${tag}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const clearBtn = document.getElementById('clear-filters');
        const sortSelect = document.getElementById('sort-select');

        // Search functionality
        if (searchInput) {
            const debouncedSearch = Utils.debounce(() => {
                this.handleFilterChange();
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleFilterChange();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleFilterChange());
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => this.handleFilterChange());
        });

        // Tag checkboxes
        document.querySelectorAll('input[data-filter="tags"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilterChange());
        });

        // Clear filters
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllFilters());
        }
    }

    /**
     * Handle filter changes
     */
    handleFilterChange() {
        this.activeFilters = this.getActiveFilters();

        // Update URL
        Utils.updateURLParams(this.activeFilters);

        // Trigger callback
        if (this.onFilterChange) {
            this.onFilterChange(this.activeFilters);
        }
    }

    /**
     * Get currently active filters
     */
    getActiveFilters() {
        const filters = {};

        // Search query
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim()) {
            filters.query = searchInput.value.trim();
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            const filterType = select.dataset.filter;
            if (filterType && select.value !== 'all') {
                filters[filterType] = select.value;
            }
        });

        // Sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const [sortBy, sortOrder] = sortSelect.value.split('-');
            filters.sortBy = sortBy;
            filters.sortOrder = sortOrder;
        }

        // Tags
        const selectedTags = [];
        document.querySelectorAll('input[data-filter="tags"]:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        if (selectedTags.length > 0) {
            filters.tags = selectedTags;
        }

        return filters;
    }

    /**
     * Load filters from URL parameters
     */
    loadFromURL() {
        const params = Utils.getURLParams();

        Object.keys(params).forEach(key => {
            if (key === 'query') {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = params[key];
                }
            } else if (key === 'tags') {
                const tags = Array.isArray(params[key]) ? params[key] : [params[key]];
                tags.forEach(tag => {
                    const checkbox = document.querySelector(`input[data-filter="tags"][value="${tag}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            } else if (key === 'sortBy' || key === 'sortOrder') {
                // Handle sort separately
                const sortBy = params.sortBy || 'date';
                const sortOrder = params.sortOrder || 'desc';
                const sortSelect = document.getElementById('sort-select');
                if (sortSelect) {
                    sortSelect.value = `${sortBy}-${sortOrder}`;
                }
            } else {
                const select = document.querySelector(`[data-filter="${key}"]`);
                if (select) {
                    select.value = params[key];
                }
            }
        });

        // Trigger initial filter if URL has parameters
        if (Object.keys(params).length > 0) {
            this.handleFilterChange();
        }
    }

    /**
     * Clear all active filters
     */
    clearAllFilters() {
        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset all selects
        document.querySelectorAll('.filter-select').forEach(select => {
            if (select.id === 'sort-select') {
                select.value = 'date-desc';
            } else {
                select.value = 'all';
            }
        });

        // Uncheck all tag checkboxes
        document.querySelectorAll('input[data-filter="tags"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear URL parameters
        Utils.updateURLParams({});

        // Trigger filter change
        this.handleFilterChange();
    }

    /**
     * Update filter options (useful for dynamic updates)
     */
    updateOptions(newOptions) {
        this.filterOptions = newOptions;
        this.createFilterUI();
        this.bindEvents();
    }

    /**
     * Get active filter count for display
     */
    getActiveFilterCount() {
        const filters = this.getActiveFilters();
        let count = 0;

        if (filters.query) count++;
        if (filters.status && filters.status !== 'all') count++;
        if (filters.genre && filters.genre !== 'all') count++;
        if (filters.platform && filters.platform !== 'all') count++;
        if (filters.role && filters.role !== 'all') count++;
        if (filters.competition && filters.competition !== 'all') count++;
        if (filters.tags && filters.tags.length > 0) count += filters.tags.length;

        return count;
    }
}

// Export for use in other modules
window.Filters = Filters;
