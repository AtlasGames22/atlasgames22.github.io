/* ==========================================================================
   ATLAS GAMES - GAME RENDERING
   ========================================================================== */

/**
 * Game rendering functionality for games.html and game.html pages
 */
class GameRenderer {
  constructor() {
    this.games = [];
    this.filteredGames = [];
    this.currentFilters = {
      genre: 'all',
      platform: 'all',
      status: 'all',
      search: '',
      sort: 'newest'
    };
    this.init();
  }

  /**
   * Initialize game renderer
   */
  async init() {
    try {
      this.games = await AtlasUtils.fetchJSON('data/games.json');
      this.filteredGames = [...this.games];

      // Set up page based on current location
      if (window.location.pathname.includes('games.html')) {
        this.setupGamesPage();
      } else if (window.location.pathname.includes('game.html')) {
        this.setupGameDetailPage();
      }

    } catch (error) {
      console.error('Error loading games:', error);
      AtlasUtils.showError('Failed to load games. Please refresh the page.');
    }
  }

  /**
   * Setup games listing page
   */
  setupGamesPage() {
    this.setupFilters();
    this.setupSearch();
    this.renderGames();
  }

  /**
   * Setup game detail page
   */
  setupGameDetailPage() {
    const gameId = AtlasRouter.getParam('id') || AtlasRouter.getParam('slug');
    if (gameId) {
      const game = this.games.find(g => g.id === gameId || g.slug === gameId);
      if (game) {
        this.renderGameDetail(game);
      }
    }
  }

  /**
   * Setup filter controls
   */
  setupFilters() {
    // Get unique values for filter options
    const genres = [...new Set(this.games.flatMap(game => game.genre))].sort();
    const platforms = [...new Set(this.games.flatMap(game => game.platforms))].sort();
    const statuses = [...new Set(this.games.map(game => game.releaseStatus))].sort();

    // Render filter options
    this.renderFilterOptions('genre-filter', genres, 'All Genres');
    this.renderFilterOptions('platform-filter', platforms, 'All Platforms');
    this.renderFilterOptions('status-filter', statuses, 'All Status');

    // Setup filter event listeners
    this.setupFilterListeners();
  }

  /**
   * Render filter options
   */
  renderFilterOptions(containerId, options, defaultText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filterHtml = `
      <div class="filter-options">
        <button class="filter-option is-active" data-value="all">${defaultText}</button>
        ${options.map(option => 
          `<button class="filter-option" data-value="${option.toLowerCase()}">${option}</button>`
        ).join('')}
      </div>
    `;

    container.innerHTML = filterHtml;
  }

  /**
   * Setup filter event listeners
   */
  setupFilterListeners() {
    // Genre filter
    const genreFilter = document.getElementById('genre-filter');
    if (genreFilter) {
      genreFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-option')) {
          this.updateFilter('genre', e.target.dataset.value, genreFilter);
        }
      });
    }

    // Platform filter
    const platformFilter = document.getElementById('platform-filter');
    if (platformFilter) {
      platformFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-option')) {
          this.updateFilter('platform', e.target.dataset.value, platformFilter);
        }
      });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-option')) {
          this.updateFilter('status', e.target.dataset.value, statusFilter);
        }
      });
    }

    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentFilters.sort = e.target.value;
        this.applyFilters();
      });
    }
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchInput = document.getElementById('game-search');
    if (searchInput) {
      const debouncedSearch = AtlasUtils.debounce((value) => {
        this.currentFilters.search = value;
        this.applyFilters();
      }, 300);

      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }
  }

  /**
   * Update filter and UI state
   */
  updateFilter(filterType, value, container) {
    // Update filter state
    this.currentFilters[filterType] = value;

    // Update UI
    container.querySelectorAll('.filter-option').forEach(btn => {
      btn.classList.remove('is-active');
    });
    container.querySelector(`[data-value="${value}"]`).classList.add('is-active');

    // Apply filters
    this.applyFilters();
  }

  /**
   * Apply all filters
   */
  applyFilters() {
    this.filteredGames = this.games.filter(game => {
      // Genre filter
      if (this.currentFilters.genre !== 'all') {
        if (!game.genre.some(g => g.toLowerCase() === this.currentFilters.genre)) {
          return false;
        }
      }

      // Platform filter
      if (this.currentFilters.platform !== 'all') {
        if (!game.platforms.some(p => p.toLowerCase() === this.currentFilters.platform)) {
          return false;
        }
      }

      // Status filter
      if (this.currentFilters.status !== 'all') {
        if (game.releaseStatus.toLowerCase() !== this.currentFilters.status) {
          return false;
        }
      }

      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const searchableText = `${game.title} ${game.shortDescription} ${game.genre.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    this.sortGames();

    // Re-render games
    this.renderGames();

    // Update URL
    AtlasRouter.applyFilters(this.currentFilters);
  }

  /**
   * Sort games based on current sort option
   */
  sortGames() {
    switch (this.currentFilters.sort) {
      case 'newest':
        this.filteredGames.sort((a, b) => new Date(b.releaseDate || '1970-01-01') - new Date(a.releaseDate || '1970-01-01'));
        break;
      case 'oldest':
        this.filteredGames.sort((a, b) => new Date(a.releaseDate || '1970-01-01') - new Date(b.releaseDate || '1970-01-01'));
        break;
      case 'alphabetical':
        this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'reverse-alphabetical':
        this.filteredGames.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
  }

  /**
   * Render games grid
   */
  renderGames() {
    const container = document.getElementById('games-grid');
    if (!container) return;

    if (this.filteredGames.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-5xl">
          <h3 class="text-2xl font-semibold mb-md">No games found</h3>
          <p class="text-muted">Try adjusting your filters or search terms.</p>
          <button class="btn btn-primary mt-lg" onclick="gameRenderer.clearFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    const gamesHtml = this.filteredGames.map(game => this.renderGameCard(game)).join('');
    container.innerHTML = gamesHtml;

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredGames.length} game${this.filteredGames.length !== 1 ? 's' : ''} found`;
    }
  }

  /**
   * Render individual game card
   */
  renderGameCard(game) {
    const statusBadgeClass = this.getStatusBadgeClass(game.releaseStatus);
    const gameUrl = `game.html?id=${game.id}`;

    return `
      <div class="game-card card">
        <div class="card-image">
          <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
          <div class="absolute top-2 right-2">
            <span class="badge ${statusBadgeClass}">${game.releaseStatus}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title">
              <a href="${gameUrl}" class="text-primary">${game.title}</a>
            </h3>
            <div class="tags">
              ${game.genre.map(g => `<span class="tag">${g}</span>`).join('')}
            </div>
          </div>
          <div class="card-body">
            <p class="text-muted">${AtlasUtils.truncate(game.shortDescription, 120)}</p>
            <div class="mt-md">
              <strong>Platforms:</strong> ${game.platforms.join(', ')}
            </div>
          </div>
          <div class="card-footer">
            <div class="flex gap-sm">
              <a href="${gameUrl}" class="btn btn-primary btn-sm flex-1">View Details</a>
              ${game.itchUrl ? `<a href="${game.itchUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Play</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get badge class for release status
   */
  getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
      case 'released': return 'badge-success';
      case 'beta': return 'badge-warning';
      case 'in development': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.currentFilters = {
      genre: 'all',
      platform: 'all',
      status: 'all',
      search: '',
      sort: 'newest'
    };

    // Reset UI
    document.querySelectorAll('.filter-option').forEach(btn => {
      btn.classList.remove('is-active');
    });
    document.querySelectorAll('.filter-option[data-value="all"]').forEach(btn => {
      btn.classList.add('is-active');
    });

    const searchInput = document.getElementById('game-search');
    if (searchInput) {
      searchInput.value = '';
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.value = 'newest';
    }

    this.applyFilters();
  }

  /**
   * Render game detail page
   */
  renderGameDetail(game) {
    window.renderGameDetail = (gameData) => {
      const main = document.querySelector('main');
      if (!main) return;

      main.innerHTML = `
        <div class="container">
          <!-- Hero Section -->
          <div class="hero">
            <div class="hero-content">
              <div class="flex flex-wrap gap-sm justify-center mb-lg">
                ${gameData.genre.map(g => `<span class="tag">${g}</span>`).join('')}
                <span class="badge ${this.getStatusBadgeClass(gameData.releaseStatus)}">${gameData.releaseStatus}</span>
              </div>
              <h1 class="hero-title">${gameData.title}</h1>
              <p class="hero-subtitle">${gameData.shortDescription}</p>
              <div class="hero-actions">
                ${gameData.itchUrl ? `<a href="${gameData.itchUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-lg">Play Now</a>` : ''}
                ${gameData.trailer ? `<a href="${gameData.trailer}" target="_blank" rel="noopener" class="btn btn-outline btn-lg">Watch Trailer</a>` : ''}
                <a href="games.html" class="btn btn-ghost btn-lg">← Back to Games</a>
              </div>
            </div>
          </div>

          <!-- Screenshots Gallery -->
          ${gameData.screenshots && gameData.screenshots.length > 0 ? `
          <section class="section">
            <h2 class="text-3xl font-bold mb-xl text-center">Screenshots</h2>
            <div class="gallery">
              ${gameData.screenshots.map(screenshot => `
                <div class="gallery-item" tabindex="0" role="button" aria-label="View screenshot">
                  <img src="${screenshot}" alt="${gameData.title} screenshot" loading="lazy">
                </div>
              `).join('')}
            </div>
          </section>
          ` : ''}

          <!-- Game Details -->
          <section class="section">
            <div class="grid md:grid-cols-2 gap-xl">
              <div>
                <h2 class="text-3xl font-bold mb-lg">About ${gameData.title}</h2>
                <div class="prose">
                  <p>${gameData.longDescription}</p>
                </div>
                
                <div class="mt-xl">
                  <h3 class="text-xl font-semibold mb-md">Game Information</h3>
                  <dl class="space-y-sm">
                    <div class="flex">
                      <dt class="font-medium w-32">Platforms:</dt>
                      <dd>${gameData.platforms.join(', ')}</dd>
                    </div>
                    <div class="flex">
                      <dt class="font-medium w-32">Status:</dt>
                      <dd><span class="badge ${this.getStatusBadgeClass(gameData.releaseStatus)}">${gameData.releaseStatus}</span></dd>
                    </div>
                    ${gameData.releaseDate ? `
                    <div class="flex">
                      <dt class="font-medium w-32">Release Date:</dt>
                      <dd>${AtlasUtils.formatDate(gameData.releaseDate)}</dd>
                    </div>
                    ` : ''}
                    <div class="flex">
                      <dt class="font-medium w-32">Genres:</dt>
                      <dd>${gameData.genre.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              ${gameData.features && gameData.features.length > 0 ? `
              <div>
                <h3 class="text-xl font-semibold mb-lg">Key Features</h3>
                <ul class="space-y-sm">
                  ${gameData.features.map(feature => `<li class="flex items-start gap-sm">
                    <svg class="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span>${feature}</span>
                  </li>`).join('')}
                </ul>
              </div>
              ` : ''}
            </div>
          </section>

          <!-- Related Games -->
          <section class="section">
            <h2 class="text-3xl font-bold mb-xl text-center">More Games</h2>
            <div class="grid md:grid-cols-3 gap-lg">
              ${this.getRelatedGames(gameData, 3).map(relatedGame => this.renderGameCard(relatedGame)).join('')}
            </div>
          </section>
        </div>
      `;

      // Add JSON-LD structured data
      this.addGameStructuredData(gameData);
    };

    // Call the render function
    window.renderGameDetail(game);
  }

  /**
   * Get related games (same genre, excluding current game)
   */
  getRelatedGames(currentGame, limit = 3) {
    const related = this.games
      .filter(game =>
        game.id !== currentGame.id &&
        game.genre.some(g => currentGame.genre.includes(g))
      )
      .slice(0, limit);

    // If not enough related games, fill with random games
    if (related.length < limit) {
      const remaining = this.games
        .filter(game => game.id !== currentGame.id && !related.includes(game))
        .slice(0, limit - related.length);
      related.push(...remaining);
    }

    return related;
  }

  /**
   * Add JSON-LD structured data for games
   */
  addGameStructuredData(game) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": game.title,
      "description": game.shortDescription,
      "genre": game.genre,
      "gamePlatform": game.platforms,
      "publisher": {
        "@type": "Organization",
        "name": "Atlas Games"
      },
      "datePublished": game.releaseDate,
      "applicationCategory": "Game"
    };

    if (game.screenshots && game.screenshots.length > 0) {
      structuredData.screenshot = game.screenshots[0];
    }

    // Remove existing game structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-game]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-game', '');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Update filters from URL parameters (called by router)
   */
  updateFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };

    // Update UI to match filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        const filterElement = document.querySelector(`[data-value="${value}"]`);
        if (filterElement) {
          // Remove active class from siblings
          filterElement.parentNode.querySelectorAll('.filter-option').forEach(btn => {
            btn.classList.remove('is-active');
          });
          // Add active class to current
          filterElement.classList.add('is-active');
        }
      }
    });

    // Update search input
    if (filters.search) {
      const searchInput = document.getElementById('game-search');
      if (searchInput) {
        searchInput.value = filters.search;
      }
    }

    // Update sort select
    if (filters.sort) {
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.value = filters.sort;
      }
    }

    this.applyFilters();
  }
}

// Initialize game renderer when DOM is ready
document.addEventListener('atlas:ready', () => {
  window.gameRenderer = new GameRenderer();
});

// Make renderer available globally for router
window.updateGamesFilters = (filters) => {
  if (window.gameRenderer) {
    window.gameRenderer.updateFilters(filters);
  }
};
