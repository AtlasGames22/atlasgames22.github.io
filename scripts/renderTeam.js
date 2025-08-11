/* ==========================================================================
   ATLAS GAMES - TEAM RENDERING
   ========================================================================== */

/**
 * Team rendering functionality for team.html page
 */
class TeamRenderer {
  constructor() {
    this.team = [];
    this.init();
  }

  /**
   * Initialize team renderer
   */
  async init() {
    try {
      this.team = await AtlasUtils.fetchJSON('data/team.json');
      this.renderTeam();
    } catch (error) {
      console.error('Error loading team:', error);
      AtlasUtils.showError('Failed to load team information. Please refresh the page.');
    }
  }

  /**
   * Render team members
   */
  renderTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;

    const teamHtml = this.team.map(member => this.renderTeamCard(member)).join('');
    container.innerHTML = teamHtml;

    // Setup member detail modals
    this.setupMemberModals();
  }

  /**
   * Render individual team member card
   */
  renderTeamCard(member) {
    return `
      <div class="team-card card" data-member="${member.id}">
        <div class="card-image">
          <img src="${member.photo}" alt="${member.name}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title">${member.name}</h3>
            <p class="card-subtitle">${member.role}</p>
          </div>
          <div class="card-body">
            <p class="text-muted mb-md">${member.shortBio}</p>
            <div class="tags">
              ${member.skills.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('')}
              ${member.skills.length > 3 ? `<span class="tag">+${member.skills.length - 3} more</span>` : ''}
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-sm btn-block" data-modal="member-modal-${member.id}">
              Learn More
            </button>
            <div class="social-links mt-md justify-center">
              ${this.renderSocialLinks(member.links)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render social links for team member
   */
  renderSocialLinks(links) {
    if (!links) return '';

    const linkHtml = [];

    if (links.twitter) {
      linkHtml.push(`<a href="${links.twitter}" target="_blank" rel="noopener" aria-label="Twitter">
        <svg width="20" height="20"><use href="#icon-twitter"></use></svg>
      </a>`);
    }

    if (links.linkedin) {
      linkHtml.push(`<a href="${links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg width="20" height="20"><use href="#icon-linkedin"></use></svg>
      </a>`);
    }

    if (links.github) {
      linkHtml.push(`<a href="${links.github}" target="_blank" rel="noopener" aria-label="GitHub">
        <svg width="20" height="20"><use href="#icon-github"></use></svg>
      </a>`);
    }

    if (links.portfolio || links.website) {
      const url = links.portfolio || links.website;
      linkHtml.push(`<a href="${url}" target="_blank" rel="noopener" aria-label="Portfolio">
        <svg width="20" height="20"><use href="#icon-external"></use></svg>
      </a>`);
    }

    if (links.artstation) {
      linkHtml.push(`<a href="${links.artstation}" target="_blank" rel="noopener" aria-label="ArtStation">
        <svg width="20" height="20"><use href="#icon-external"></use></svg>
      </a>`);
    }

    if (links.instagram) {
      linkHtml.push(`<a href="${links.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="20" height="20"><use href="#icon-instagram"></use></svg>
      </a>`);
    }

    return linkHtml.join('');
  }

  /**
   * Setup member detail modals
   */
  setupMemberModals() {
    // Create modals for each team member
    this.team.forEach(member => {
      this.createMemberModal(member);
    });
  }

  /**
   * Create modal for team member
   */
  createMemberModal(member) {
    const modalId = `member-modal-${member.id}`;

    // Check if modal already exists
    if (document.getElementById(modalId)) return;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${member.name}</h2>
          <button class="modal-close" aria-label="Close modal">
            <svg width="24" height="24"><use href="#icon-close"></use></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="flex flex-col md:flex-row gap-lg">
            <div class="flex-shrink-0 text-center">
              <img src="${member.photo}" alt="${member.name}" 
                   class="w-32 h-32 rounded-full object-cover mx-auto mb-md">
              <h3 class="font-semibold">${member.role}</h3>
              <p class="text-sm text-muted mb-md">Joined ${AtlasUtils.formatDate(member.joinDate, { year: 'numeric', month: 'long' })}</p>
              <div class="social-links justify-center">
                ${this.renderSocialLinks(member.links)}
              </div>
            </div>
            <div class="flex-1">
              <div class="mb-lg">
                <h4 class="font-semibold mb-sm">About</h4>
                <p class="text-muted">${member.longBio}</p>
              </div>
              
              <div class="mb-lg">
                <h4 class="font-semibold mb-sm">Skills & Expertise</h4>
                <div class="tags">
                  ${member.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                </div>
              </div>
              
              ${member.favoriteGames && member.favoriteGames.length > 0 ? `
              <div class="mb-lg">
                <h4 class="font-semibold mb-sm">Favorite Atlas Games</h4>
                <ul class="text-sm text-muted">
                  ${member.favoriteGames.map(game => `<li>${game}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
              
              ${member.quote ? `
              <div class="bg-surface p-md rounded-lg border-l-4 border-primary">
                <p class="italic text-muted">"${member.quote}"</p>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup modal event listeners
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    });

    // Setup modal trigger
    const trigger = document.querySelector(`[data-modal="${modalId}"]`);
    if (trigger) {
      trigger.addEventListener('click', () => {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
  }

  /**
   * Get team member by ID
   */
  getMember(id) {
    return this.team.find(member => member.id === id);
  }

  /**
   * Get team members by role
   */
  getMembersByRole(role) {
    return this.team.filter(member =>
      member.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  /**
   * Get founders
   */
  getFounders() {
    return this.team.filter(member =>
      member.role.toLowerCase().includes('founder')
    );
  }
}

// Initialize team renderer when DOM is ready
document.addEventListener('atlas:ready', () => {
  if (window.location.pathname.includes('team.html')) {
    window.teamRenderer = new TeamRenderer();
  }
});
