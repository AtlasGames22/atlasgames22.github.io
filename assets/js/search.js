/**
 * Search functionality for Atlas Games website
 */

class Search {
    constructor(data, searchFields = ['title']) {
        this.data = data;
        this.searchFields = searchFields;
        this.originalData = [...data];
    }

    /**
     * Perform search across specified fields
     */
    search(query) {
        if (!query || query.trim() === '') {
            return this.originalData;
        }

        const searchTerm = query.toLowerCase().trim();

        return this.originalData.filter(item => {
            return this.searchFields.some(field => {
                const value = item[field];

                if (Array.isArray(value)) {
                    return value.some(v =>
                        v.toString().toLowerCase().includes(searchTerm)
                    );
                }

                return value && value.toString().toLowerCase().includes(searchTerm);
            });
        });
    }

    /**
     * Advanced search with multiple criteria
     */
    advancedSearch(criteria) {
        let results = this.originalData;

        // Text search
        if (criteria.query) {
            results = this.search(criteria.query);
        }

        // Filter by tags
        if (criteria.tags && criteria.tags.length > 0) {
            results = results.filter(item => {
                if (!item.tags) return false;
                return criteria.tags.every(tag => item.tags.includes(tag));
            });
        }

        // Filter by status
        if (criteria.status && criteria.status !== 'all') {
            results = results.filter(item => item.status === criteria.status);
        }

        // Filter by genre
        if (criteria.genre && criteria.genre !== 'all') {
            results = results.filter(item => item.genre === criteria.genre);
        }

        // Filter by platform
        if (criteria.platform && criteria.platform !== 'all') {
            results = results.filter(item => {
                if (!item.platform) return false;
                return item.platform.includes(criteria.platform);
            });
        }

        // Filter by role (for team members)
        if (criteria.role && criteria.role !== 'all') {
            results = results.filter(item => item.role === criteria.role);
        }

        // Filter by competition (for awards)
        if (criteria.competition && criteria.competition !== 'all') {
            results = results.filter(item => item.competition === criteria.competition);
        }

        // Date range filter
        if (criteria.dateFrom || criteria.dateTo) {
            results = results.filter(item => {
                if (!item.date && !item.releaseDate) return false;

                const itemDate = new Date(item.date || item.releaseDate);

                if (criteria.dateFrom) {
                    const fromDate = new Date(criteria.dateFrom);
                    if (itemDate < fromDate) return false;
                }

                if (criteria.dateTo) {
                    const toDate = new Date(criteria.dateTo);
                    if (itemDate > toDate) return false;
                }

                return true;
            });
        }

        return results;
    }

    /**
     * Sort results by specified field and order
     */
    sort(data, sortBy, sortOrder = 'asc') {
        const sortedData = [...data];

        sortedData.sort((a, b) => {
            let valueA = a[sortBy];
            let valueB = b[sortBy];

            // Handle date sorting
            if (sortBy === 'date' || sortBy === 'releaseDate') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            // Handle string sorting
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            // Handle array sorting (for tags, platforms, etc.)
            if (Array.isArray(valueA)) {
                valueA = valueA.join(',').toLowerCase();
                valueB = valueB.join(',').toLowerCase();
            }

            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }

            return sortOrder === 'desc' ? comparison * -1 : comparison;
        });

        return sortedData;


    /**
     * Get filter options from data
     */
    getFilterOptions() {
        const options = {
            tags: Utils.getUniqueValues(this.originalData, 'tags'),
            genres: Utils.getUniqueValues(this.originalData, 'genre'),
            platforms: Utils.getUniqueValues(this.originalData, 'platform'),
            statuses: Utils.getUniqueValues(this.originalData, 'status'),
            roles: Utils.getUniqueValues(this.originalData, 'role'),
            competitions: Utils.getUniqueValues(this.originalData, 'competition')
        };

        // Remove empty arrays
        Object.keys(options).forEach(key => {
            if (options[key].length === 0) {
                delete options[key];
            }
        });

        return options;
    }

    /**
     * Highlight search terms in text
     */
    highlightSearchTerms(text, searchTerm) {
        if (!searchTerm || !text) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Get search suggestions based on partial input
     */
    getSuggestions(partialQuery, limit = 5) {
        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }

        const suggestions = new Set();
        const query = partialQuery.toLowerCase();

        this.originalData.forEach(item => {
            this.searchFields.forEach(field => {
                const value = item[field];

                if (Array.isArray(value)) {
                    value.forEach(v => {
                        if (v.toString().toLowerCase().includes(query)) {
                            suggestions.add(v);
                        }
                    });
                } else if (value && value.toString().toLowerCase().includes(query)) {
                    // Add words that start with the query
                    const words = value.toString().split(' ');
                    words.forEach(word => {
                        if (word.toLowerCase().startsWith(query)) {
                            suggestions.add(word);
                        }
                    });
                }
            });
        });

        return Array.from(suggestions).slice(0, limit);
    }

    /**
     * Update data (useful for dynamic data updates)
     */
    updateData(newData) {
        this.data = newData;
        this.originalData = [...newData];
    }
}

// Export for use in other modules
window.Search = Search;
