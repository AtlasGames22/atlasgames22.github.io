/* ==========================================================================
   ATLAS GAMES - BLOG/POSTS RENDERING
   ========================================================================== */

/**
 * Blog rendering functionality for blog.html and post.html pages
 */
class BlogRenderer {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentFilters = {
      tag: 'all',
      search: '',
      page: 1
    };
    this.postsPerPage = 6;
    this.init();
  }

  /**
   * Initialize blog renderer
   */
  async init() {
    try {
      this.posts = await AtlasUtils.fetchJSON('data/posts.json');
      // Sort posts by date (newest first)
      this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.filteredPosts = [...this.posts];

      // Set up page based on current location
      if (window.location.pathname.includes('blog.html')) {
        this.setupBlogPage();
      } else if (window.location.pathname.includes('post.html')) {
        this.setupPostDetailPage();
      }

    } catch (error) {
      console.error('Error loading posts:', error);
      AtlasUtils.showError('Failed to load blog posts. Please refresh the page.');
    }
  }

  /**
   * Setup blog listing page
   */
  setupBlogPage() {
    this.setupFilters();
    this.setupSearch();
    this.renderPosts();
  }

  /**
   * Setup post detail page
   */
  setupPostDetailPage() {
    const postId = AtlasRouter.getParam('id') || AtlasRouter.getParam('slug');
    if (postId) {
      const post = this.posts.find(p => p.id === postId || p.slug === postId);
      if (post) {
        this.renderPostDetail(post);
      }
    }
  }

  /**
   * Setup filter controls
   */
  setupFilters() {
    // Get unique tags from all posts
    const allTags = [...new Set(this.posts.flatMap(post => post.tags))].sort();

    // Render tag filter options
    this.renderTagFilter(allTags);

    // Setup filter event listeners
    this.setupFilterListeners();
  }

  /**
   * Render tag filter options
   */
  renderTagFilter(tags) {
    const container = document.getElementById('tag-filter');
    if (!container) return;

    const filterHtml = `
      <div class="filter-options">
        <button class="filter-option is-active" data-value="all">All Topics</button>
        ${tags.map(tag => 
          `<button class="filter-option" data-value="${tag.toLowerCase()}">${tag}</button>`
        ).join('')}
      </div>
    `;

    container.innerHTML = filterHtml;
  }

  /**
   * Setup filter event listeners
   */
  setupFilterListeners() {
    // Tag filter
    const tagFilter = document.getElementById('tag-filter');
    if (tagFilter) {
      tagFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-option')) {
          this.updateFilter('tag', e.target.dataset.value, tagFilter);
        }
      });
    }
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
      const debouncedSearch = AtlasUtils.debounce((value) => {
        this.currentFilters.search = value;
        this.currentFilters.page = 1; // Reset to first page on search
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
    this.currentFilters.page = 1; // Reset to first page on filter change

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
    this.filteredPosts = this.posts.filter(post => {
      // Tag filter
      if (this.currentFilters.tag !== 'all') {
        if (!post.tags.some(tag => tag.toLowerCase() === this.currentFilters.tag)) {
          return false;
        }
      }

      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    // Re-render posts with pagination
    this.renderPosts();

    // Update URL
    AtlasRouter.applyFilters(this.currentFilters);
  }

  /**
   * Render posts with pagination
   */
  renderPosts() {
    const container = document.getElementById('posts-grid');
    if (!container) return;

    if (this.filteredPosts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-5xl">
          <h3 class="text-2xl font-semibold mb-md">No posts found</h3>
          <p class="text-muted">Try adjusting your filters or search terms.</p>
          <button class="btn btn-primary mt-lg" onclick="blogRenderer.clearFilters()">Clear Filters</button>
        </div>
      `;
      this.renderPagination(0, 0);
      return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    const startIndex = (this.currentFilters.page - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);

    // Render posts
    const postsHtml = paginatedPosts.map(post => this.renderPostCard(post)).join('');
    container.innerHTML = postsHtml;

    // Render pagination
    this.renderPagination(this.currentFilters.page, totalPages);

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredPosts.length} post${this.filteredPosts.length !== 1 ? 's' : ''} found`;
    }
  }

  /**
   * Render individual post card
   */
  renderPostCard(post) {
    const postUrl = `post.html?id=${post.id}`;
    const readTime = this.calculateReadTime(post.content);

    return `
      <article class="card">
        <div class="card-image">
          <img src="${post.coverImage}" alt="${post.title}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-header">
            <h2 class="card-title">
              <a href="${postUrl}" class="text-primary">${post.title}</a>
            </h2>
            <div class="flex items-center gap-md text-sm text-muted mb-sm">
              <span>By ${post.author}</span>
              <span>•</span>
              <time datetime="${post.date}">${AtlasUtils.formatDate(post.date)}</time>
              <span>•</span>
              <span>${readTime} min read</span>
            </div>
          </div>
          <div class="card-body">
            <p class="text-muted mb-md">${post.excerpt}</p>
            <div class="tags">
              ${post.tags.map(tag => `<a href="blog.html?tag=${tag.toLowerCase()}" class="tag">${tag}</a>`).join('')}
            </div>
          </div>
          <div class="card-footer">
            <a href="${postUrl}" class="btn btn-primary btn-sm">Read More</a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Calculate estimated read time
   */
  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(wordCount / wordsPerMinute));
  }

  /**
   * Render pagination
   */
  renderPagination(currentPage, totalPages) {
    const container = document.getElementById('pagination');
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let paginationHtml = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
      paginationHtml += `<button class="pagination-item" onclick="blogRenderer.goToPage(${currentPage - 1})" aria-label="Previous page">‹</button>`;
    } else {
      paginationHtml += `<button class="pagination-item" disabled aria-label="Previous page">‹</button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      paginationHtml += `<button class="pagination-item" onclick="blogRenderer.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHtml += `<span class="pagination-item" disabled>…</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage ? 'is-active' : '';
      paginationHtml += `<button class="pagination-item ${isActive}" onclick="blogRenderer.goToPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHtml += `<span class="pagination-item" disabled>…</span>`;
      }
      paginationHtml += `<button class="pagination-item" onclick="blogRenderer.goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHtml += `<button class="pagination-item" onclick="blogRenderer.goToPage(${currentPage + 1})" aria-label="Next page">›</button>`;
    } else {
      paginationHtml += `<button class="pagination-item" disabled aria-label="Next page">›</button>`;
    }

    paginationHtml += '</div>';
    container.innerHTML = paginationHtml;
  }

  /**
   * Go to specific page
   */
  goToPage(page) {
    this.currentFilters.page = page;
    this.renderPosts();

    // Scroll to top of posts
    const postsGrid = document.getElementById('posts-grid');
    if (postsGrid) {
      postsGrid.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.currentFilters = {
      tag: 'all',
      search: '',
      page: 1
    };

    // Reset UI
    document.querySelectorAll('.filter-option').forEach(btn => {
      btn.classList.remove('is-active');
    });
    document.querySelector('.filter-option[data-value="all"]')?.classList.add('is-active');

    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
      searchInput.value = '';
    }

    this.applyFilters();
  }

  /**
   * Render post detail page
   */
  renderPostDetail(post) {
    window.renderPostDetail = (postData, allPosts) => {
      const main = document.querySelector('main');
      if (!main) return;

      // Get previous and next posts
      const currentIndex = allPosts.findIndex(p => p.id === postData.id);
      const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
      const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

      const readTime = this.calculateReadTime(postData.content);

      main.innerHTML = `
        <div class="container max-w-4xl">
          <article class="py-xl">
            <!-- Back to blog -->
            <div class="mb-lg">
              <a href="blog.html" class="btn btn-ghost">← Back to Blog</a>
            </div>

            <!-- Post header -->
            <header class="mb-xl text-center">
              <div class="tags justify-center mb-lg">
                ${postData.tags.map(tag => `<a href="blog.html?tag=${tag.toLowerCase()}" class="tag">${tag}</a>`).join('')}
              </div>
              <h1 class="text-4xl md:text-5xl font-bold mb-lg">${postData.title}</h1>
              <div class="flex items-center justify-center gap-md text-muted mb-lg">
                <span>By <strong>${postData.author}</strong></span>
                <span>•</span>
                <time datetime="${postData.date}">${AtlasUtils.formatDate(postData.date)}</time>
                <span>•</span>
                <span>${readTime} minute read</span>
              </div>
              ${postData.coverImage ? `
              <div class="aspect-video rounded-lg overflow-hidden mb-lg">
                <img src="${postData.coverImage}" alt="${postData.title}" class="img-cover">
              </div>
              ` : ''}
            </header>

            <!-- Post content -->
            <div class="prose max-w-none">
              ${postData.content}
            </div>

            <!-- Post footer -->
            <footer class="mt-xl pt-xl border-t">
              <div class="text-center mb-xl">
                <h3 class="text-xl font-semibold mb-md">Share this post</h3>
                <div class="flex gap-md justify-center">
                  <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(postData.title)}&url=${encodeURIComponent(window.location.href)}" 
                     target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Share on Twitter
                  </a>
                  <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                     target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Share on Facebook
                  </a>
                </div>
              </div>

              <!-- Navigation -->
              <div class="grid md:grid-cols-2 gap-lg">
                ${prevPost ? `
                <div class="card">
                  <div class="card-content">
                    <p class="text-sm text-muted mb-sm">Previous Post</p>
                    <h4 class="font-semibold">
                      <a href="post.html?id=${prevPost.id}" class="text-primary">${prevPost.title}</a>
                    </h4>
                  </div>
                </div>
                ` : '<div></div>'}
                
                ${nextPost ? `
                <div class="card">
                  <div class="card-content text-right">
                    <p class="text-sm text-muted mb-sm">Next Post</p>
                    <h4 class="font-semibold">
                      <a href="post.html?id=${nextPost.id}" class="text-primary">${nextPost.title}</a>
                    </h4>
                  </div>
                </div>
                ` : '<div></div>'}
              </div>
            </footer>
          </article>

          <!-- Related posts -->
          <section class="py-xl border-t">
            <h2 class="text-3xl font-bold mb-xl text-center">Related Posts</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
              ${this.getRelatedPosts(postData, 3).map(relatedPost => this.renderPostCard(relatedPost)).join('')}
            </div>
          </section>
        </div>
      `;

      // Add structured data
      this.addPostStructuredData(postData);
    };

    // Call the render function
    window.renderPostDetail(post, this.posts);
  }

  /**
   * Get related posts (same tags, excluding current post)
   */
  getRelatedPosts(currentPost, limit = 3) {
    const related = this.posts
      .filter(post =>
        post.id !== currentPost.id &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit);

    // If not enough related posts, fill with recent posts
    if (related.length < limit) {
      const remaining = this.posts
        .filter(post => post.id !== currentPost.id && !related.includes(post))
        .slice(0, limit - related.length);
      related.push(...remaining);
    }

    return related;
  }

  /**
   * Add JSON-LD structured data for blog posts
   */
  addPostStructuredData(post) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Atlas Games"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };

    if (post.coverImage) {
      structuredData.image = post.coverImage;
    }

    // Remove existing post structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-post]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-post', '');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Update filters from URL parameters (called by router)
   */
  updateFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };

    // Update UI to match filters
    if (filters.tag && filters.tag !== 'all') {
      const tagElement = document.querySelector(`[data-value="${filters.tag}"]`);
      if (tagElement) {
        tagElement.parentNode.querySelectorAll('.filter-option').forEach(btn => {
          btn.classList.remove('is-active');
        });
        tagElement.classList.add('is-active');
      }
    }

    // Update search input
    if (filters.search) {
      const searchInput = document.getElementById('blog-search');
      if (searchInput) {
        searchInput.value = filters.search;
      }
    }

    this.applyFilters();
  }
}

// Initialize blog renderer when DOM is ready
document.addEventListener('atlas:ready', () => {
  if (window.location.pathname.includes('blog.html') || window.location.pathname.includes('post.html')) {
    window.blogRenderer = new BlogRenderer();
  }
});

// Make renderer available globally for router
window.updateBlogFilters = (filters) => {
  if (window.blogRenderer) {
    window.blogRenderer.updateFilters(filters);
  }
};
