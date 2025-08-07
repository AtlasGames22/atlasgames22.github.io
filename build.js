const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const Ajv = require('ajv');

// Build configuration
const BUILD_DIR = 'dist';
const SITE_URL = 'https://atlasgames22.github.io';

// Initialize JSON Schema validator
const ajv = new Ajv();

// Utility functions
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyDir(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function loadJSON(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`❌ Error loading ${filePath}: ${e.message}`);
        return null;
    }
}

function loadMarkdown(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

        if (frontmatterMatch) {
            const frontmatter = {};
            frontmatterMatch[1].split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                    frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                }
            });
            return { frontmatter, content: frontmatterMatch[2] };
        }
        return { frontmatter: {}, content };
    } catch (e) {
        console.warn(`Warning: Could not load ${filePath}: ${e.message}`);
        return null;
    }
}

// Load and compile templates
function loadTemplates() {
    const templates = {};

    // Load partials as simple strings
    const partials = {
        head: fs.readFileSync('templates/partials/head.html', 'utf8'),
        header: fs.readFileSync('templates/partials/header.html', 'utf8'),
        footer: fs.readFileSync('templates/partials/footer.html', 'utf8')
    };

    // Load main template
    templates.gameDetail = fs.readFileSync('templates/game-detail.html', 'utf8');

    return { templates, partials };
}

// Simple template function using string replacement
function renderTemplate(template, data) {
    let result = template;

    // Replace all placeholders
    Object.keys(data).forEach(key => {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(placeholder, data[key] || '');
    });

    return result;
}

// Helper function to generate HTML snippets
function generatePlatformBadges(platforms) {
    return platforms.map(platform =>
        `<span class="platform-badge">${platform}</span>`
    ).join('');
}

function generateGameLinks(links) {
    if (!links) return '';

    let html = '';
    if (links.itchio) {
        html += `<a href="${links.itchio}" class="btn btn-primary" target="_blank" rel="noopener">Play on Itch.io</a>`;
    }
    if (links.steam) {
        html += `<a href="${links.steam}" class="btn btn-secondary" target="_blank" rel="noopener">View on Steam</a>`;
    }
    if (links.trailer) {
        html += `<a href="${links.trailer}" class="btn btn-outline" target="_blank" rel="noopener">Watch Trailer</a>`;
    }
    return html;
}

function generateScreenshotGallery(screenshots) {
    if (!screenshots || screenshots.length === 0) return '';

    return screenshots.map((screenshot, index) => `
        <button class="gallery-item" onclick="openLightbox(${index})" aria-label="View screenshot ${index + 1}">
            <img src="${screenshot.url}" alt="${screenshot.alt}" loading="lazy" class="gallery-image">
            ${screenshot.caption ? `<span class="gallery-caption">${screenshot.caption}</span>` : ''}
        </button>
    `).join('');
}

function generateFeaturesList(features) {
    if (!features || features.length === 0) return '';

    return features.map(feature =>
        `<li class="feature-item">${feature}</li>`
    ).join('');
}

function generateSystemRequirements(systemRequirements) {
    if (!systemRequirements) return '';

    let html = '<div class="requirements-section"><h3 class="subsection-title">System Requirements</h3>';

    if (systemRequirements.minimum) {
        html += '<div class="requirements-block"><h4 class="requirements-label">Minimum</h4><dl class="requirements-list">';
        if (systemRequirements.minimum.os) html += `<dt>OS</dt><dd>${systemRequirements.minimum.os}</dd>`;
        if (systemRequirements.minimum.processor) html += `<dt>Processor</dt><dd>${systemRequirements.minimum.processor}</dd>`;
        if (systemRequirements.minimum.memory) html += `<dt>Memory</dt><dd>${systemRequirements.minimum.memory}</dd>`;
        if (systemRequirements.minimum.graphics) html += `<dt>Graphics</dt><dd>${systemRequirements.minimum.graphics}</dd>`;
        if (systemRequirements.minimum.storage) html += `<dt>Storage</dt><dd>${systemRequirements.minimum.storage}</dd>`;
        html += '</dl></div>';
    }

    if (systemRequirements.recommended) {
        html += '<div class="requirements-block"><h4 class="requirements-label">Recommended</h4><dl class="requirements-list">';
        if (systemRequirements.recommended.os) html += `<dt>OS</dt><dd>${systemRequirements.recommended.os}</dd>`;
        if (systemRequirements.recommended.processor) html += `<dt>Processor</dt><dd>${systemRequirements.recommended.processor}</dd>`;
        if (systemRequirements.recommended.memory) html += `<dt>Memory</dt><dd>${systemRequirements.recommended.memory}</dd>`;
        if (systemRequirements.recommended.graphics) html += `<dt>Graphics</dt><dd>${systemRequirements.recommended.graphics}</dd>`;
        if (systemRequirements.recommended.storage) html += `<dt>Storage</dt><dd>${systemRequirements.recommended.storage}</dd>`;
        html += '</dl></div>';
    }

    html += '</div>';
    return html;
}

function generateCredits(credits) {
    if (!credits) return '';

    let html = '<div class="credits-section"><h3 class="subsection-title">Development Team</h3><div class="credits-list">';

    const roles = {
        gameDesign: 'Game Design',
        programming: 'Programming',
        art: 'Art',
        audio: 'Audio',
        qa: 'Quality Assurance'
    };

    Object.keys(roles).forEach(role => {
        if (credits[role] && credits[role].length > 0) {
            html += `<div class="credit-group">
                <h4 class="credit-role">${roles[role]}</h4>
                <ul class="credit-names">
                    ${credits[role].map(name => `<li>${name}</li>`).join('')}
                </ul>
            </div>`;
        }
    });

    html += '</div></div>';
    return html;
}

function generateTags(tags) {
    if (!tags || tags.length === 0) return '';

    return `<div class="tags-section">
        <h3 class="subsection-title">Tags</h3>
        <div class="tag-list">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    </div>`;
}

// Validate game data against schema
function validateGame(game, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(game);

    if (!valid) {
        console.error(`❌ Validation failed for game "${game.title || 'unknown'}":`);
        validate.errors.forEach(error => {
            console.error(`  - ${error.instancePath || 'root'}: ${error.message}`);
        });
        return false;
    }

    return true;
}

// Load and validate games
function loadGames() {
    const games = [];
    const schema = loadJSON('content/schemas/game.schema.json');

    if (!schema) {
        console.error('❌ Could not load game schema');
        process.exit(1);
    }

    if (fs.existsSync('content/games')) {
        const gameFiles = fs.readdirSync('content/games').filter(f => f.endsWith('.json'));

        for (const file of gameFiles) {
            const game = loadJSON(path.join('content/games', file));
            if (game) {
                // Validate against schema
                if (!validateGame(game, schema)) {
                    console.error(`❌ Game validation failed: ${file}`);
                    process.exit(1);
                }

                // Load optional markdown description
                const markdownPath = path.join('content/games', file.replace('.json', '.md'));
                if (fs.existsSync(markdownPath)) {
                    const markdown = loadMarkdown(markdownPath);
                    if (markdown) {
                        game.longDescription = markdown.content;
                        game.longDescriptionHtml = marked(markdown.content);
                    }
                }

                // Process data for templating
                game.statusLabel = game.status.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                if (game.releaseDate) {
                    game.releaseDateFormatted = new Date(game.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }

                // Ensure screenshots have alt text
                if (game.screenshots) {
                    game.screenshots = game.screenshots.map((screenshot, index) => ({
                        ...screenshot,
                        alt: screenshot.alt || `${game.title} screenshot ${index + 1}`
                    }));
                }

                games.push(game);
            }
        }
    }

    return games.sort((a, b) => {
        // Sort by featured first, then by release date
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
    });
}

function loadTeam() {
    const team = [];
    if (fs.existsSync('content/team')) {
        const teamFiles = fs.readdirSync('content/team').filter(f => f.endsWith('.json'));
        for (const file of teamFiles) {
            const member = loadJSON(path.join('content/team', file));
            if (member) team.push(member);
        }
    }
    return team;
}

function loadBlogPosts() {
    const posts = [];
    if (fs.existsSync('content/blog')) {
        const postFiles = fs.readdirSync('content/blog').filter(f => f.endsWith('.md'));
        for (const file of postFiles) {
            const post = loadMarkdown(path.join('content/blog', file));
            if (post) {
                post.slug = file.replace('.md', '');
                post.contentHtml = marked(post.content);
                posts.push(post);
            }
        }
    }
    return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

// Generate individual game pages
function generateGamePages(games, templates) {
    ensureDir(path.join(BUILD_DIR, 'game'));

    console.log('🎮 Generating game pages...');

    games.forEach(game => {
        // Prepare all the HTML snippets
        const platformBadges = generatePlatformBadges(game.platforms);
        const gameLinks = generateGameLinks(game.links);
        const screenshotGallery = generateScreenshotGallery(game.screenshots);
        const featuresList = generateFeaturesList(game.features);
        const systemRequirements = generateSystemRequirements(game.systemRequirements);
        const credits = generateCredits(game.credits);
        const tags = generateTags(game.tags);

        // Prepare game description (use longDescription if available, otherwise regular description)
        let gameDescription = game.longDescriptionHtml || `<p>${game.description}</p>`;

        // Prepare release date display
        let releaseDateDisplay = '';
        if (game.releaseDate && game.releaseDateFormatted) {
            releaseDateDisplay = `Released ${game.releaseDateFormatted}`;
        }

        // Base game data
        const gameData = {
            title: game.title,
            tagline: game.tagline || '',
            pitch: game.pitch,
            description: game.pitch, // For meta description
            status: game.status,
            statusLabel: game.statusLabel,
            releaseDate: game.releaseDate || '',
            releaseDateFormatted: releaseDateDisplay,
            coverImage: game.coverImage,
            canonicalUrl: `${SITE_URL}/game/${game.slug}.html`,
            ogImage: `${SITE_URL}${game.coverImage}`,
            keywords: [game.title, 'Atlas Games', 'indie game', ...(game.tags || [])].join(', '),
            currentYear: new Date().getFullYear(),
            jsonLd: `<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "${game.title}",
    "description": "${game.pitch.replace(/"/g, '\\"')}",
    "url": "${SITE_URL}/game/${game.slug}.html",
    "image": "${SITE_URL}${game.coverImage}",
    "applicationCategory": "Game",
    "operatingSystem": "${game.platforms.join(', ')}",
    "author": {
        "@type": "Organization",
        "name": "Atlas Games"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Atlas Games"
    }${game.releaseDate ? `,
    "datePublished": "${game.releaseDate}"` : ''}
}
</script>`,
            // Generated HTML snippets
            platformBadges,
            gameLinks,
            screenshotGallery,
            featuresList,
            gameDescription,
            systemRequirements,
            credits,
            tags
        };

        // Render partials first
        const headHtml = renderTemplate(templates.partials.head, gameData);
        const headerHtml = renderTemplate(templates.partials.header, gameData);
        const footerHtml = renderTemplate(templates.partials.footer, gameData);

        // Prepare final template data with rendered partials
        const templateData = {
            ...gameData,
            head: headHtml,
            header: headerHtml,
            footer: footerHtml
        };

        // Render the complete page
        const html = renderTemplate(templates.templates.gameDetail, templateData);

        fs.writeFileSync(
            path.join(BUILD_DIR, 'game', `${game.slug}.html`),
            html
        );

        console.log(`  ✅ Generated /game/${game.slug}.html`);
    });
}

// Generate sitemap
function generateSitemap(games, posts) {
    const urls = [
        { url: '', priority: '1.0' },
        { url: 'games.html', priority: '0.9' },
        { url: 'team.html', priority: '0.8' },
        { url: 'blog.html', priority: '0.8' },
        { url: 'about.html', priority: '0.7' },
        { url: 'contact.html', priority: '0.7' }
    ];

    games.forEach(game => {
        urls.push({ url: `game/${game.slug}.html`, priority: '0.8' });
    });

    posts.forEach(post => {
        urls.push({ url: `blog/${post.slug}.html`, priority: '0.7' });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(item => `  <url>
    <loc>${SITE_URL}/${item.url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${item.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);
    console.log('  ✅ Generated sitemap.xml');
}

// Main build function
function build() {
    console.log('🏗️  Building Atlas Games website...');

    // Clean and create dist directory
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true });
    }
    ensureDir(BUILD_DIR);

    // Load templates
    const { templates, partials } = loadTemplates();
    console.log('📄 Templates loaded');

    // Copy static assets
    if (fs.existsSync('assets')) {
        copyDir('assets', path.join(BUILD_DIR, 'assets'));
        console.log('📦 Assets copied');
    }

    // Copy root files
    const rootFiles = ['robots.txt', 'manifest.webmanifest', '404.html'];
    rootFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(BUILD_DIR, file));
        }
    });

    // Copy main HTML files (these should eventually be templated too)
    const htmlFiles = fs.readdirSync('.').filter(f =>
        f.endsWith('.html') && !['404.html'].includes(f)
    );
    htmlFiles.forEach(file => {
        fs.copyFileSync(file, path.join(BUILD_DIR, file));
    });
    console.log('📋 Static pages copied');

    // Load content
    const games = loadGames();
    const team = loadTeam();
    const posts = loadBlogPosts();

    console.log(`📊 Content loaded: ${games.length} games, ${team.length} team members, ${posts.length} blog posts`);

    // Generate game detail pages
    generateGamePages(games, { templates, partials });

    // Create blog post pages (placeholder for now)
    ensureDir(path.join(BUILD_DIR, 'blog'));
    posts.forEach(post => {
        // For now, just create placeholder files
        // TODO: Implement blog post template
        fs.writeFileSync(
            path.join(BUILD_DIR, 'blog', `${post.slug}.html`),
            `<!DOCTYPE html><html><head><title>${post.frontmatter.title || post.slug}</title></head><body><h1>Blog Post: ${post.frontmatter.title || post.slug}</h1><p>Coming soon...</p></body></html>`
        );
    });

    // Generate data files for JavaScript
    ensureDir(path.join(BUILD_DIR, 'data'));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'games.json'), JSON.stringify(games, null, 2));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'team.json'), JSON.stringify(team, null, 2));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'blog.json'), JSON.stringify(posts, null, 2));
    console.log('💾 Data files generated');

    // Generate sitemap
    generateSitemap(games, posts);

    console.log('✅ Build completed successfully!');
    console.log(`📁 Output directory: ${BUILD_DIR}/`);
    console.log(`🎮 Games: ${games.length}`);
    console.log(`👥 Team members: ${team.length}`);
    console.log(`📝 Blog posts: ${posts.length}`);
}

// Check for broken links (basic implementation)
function checkBrokenLinks() {
    console.log('🔍 Checking for broken links...');
    // This is a placeholder - in a real implementation you'd use a tool like broken-link-checker
    console.log('ℹ️  Link checking not implemented yet');
}

// Run build
if (require.main === module) {
    try {
        build();
        checkBrokenLinks();
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}
