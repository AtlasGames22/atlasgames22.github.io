const fs = require('fs');
const path = require('path');

// Build configuration
const BUILD_DIR = 'dist';
const SITE_URL = 'https://atlasgames22.github.io';

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
        console.warn(`Warning: Could not load ${filePath}`);
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
        console.warn(`Warning: Could not load ${filePath}`);
        return null;
    }
}

function generateHTML(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || '';
    });
}

// Load content data
function loadGames() {
    const games = [];
    if (fs.existsSync('content/games')) {
        const gameFiles = fs.readdirSync('content/games').filter(f => f.endsWith('.json'));
        for (const file of gameFiles) {
            const game = loadJSON(path.join('content/games', file));
            if (game) games.push(game);
        }
    }
    return games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
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
                posts.push(post);
            }
        }
    }
    return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

// Generate sitemap
function generateSitemap(games, posts) {
    const urls = [
        { url: '', priority: '1.0' },
        { url: 'games.html', priority: '0.9' },
        { url: 'team.html', priority: '0.8' },
        { url: 'blog.html', priority: '0.8' },
        { url: 'about.html', priority: '0.7' },
        { url: 'contact.html', priority: '0.7' },
        { url: 'awards.html', priority: '0.6' },
        { url: 'art.html', priority: '0.6' }
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
}

// Main build function
function build() {
    console.log('🏗️  Building Atlas Games website...');

    // Clean and create dist directory
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true });
    }
    ensureDir(BUILD_DIR);

    // Copy static assets
    if (fs.existsSync('assets')) {
        copyDir('assets', path.join(BUILD_DIR, 'assets'));
    }

    // Copy root files
    const rootFiles = ['robots.txt', 'manifest.webmanifest', '404.html'];
    rootFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(BUILD_DIR, file));
        }
    });

    // Copy HTML files
    const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
    htmlFiles.forEach(file => {
        fs.copyFileSync(file, path.join(BUILD_DIR, file));
    });

    // Load content
    const games = loadGames();
    const team = loadTeam();
    const posts = loadBlogPosts();

    // Create game detail pages
    ensureDir(path.join(BUILD_DIR, 'game'));
    games.forEach(game => {
        if (fs.existsSync('game-detail.html')) {
            fs.copyFileSync('game-detail.html', path.join(BUILD_DIR, 'game', `${game.slug}.html`));
        }
    });

    // Create blog post pages
    ensureDir(path.join(BUILD_DIR, 'blog'));
    posts.forEach(post => {
        if (fs.existsSync('blog-post.html')) {
            fs.copyFileSync('blog-post.html', path.join(BUILD_DIR, 'blog', `${post.slug}.html`));
        }
    });

    // Generate data files for JavaScript
    ensureDir(path.join(BUILD_DIR, 'data'));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'games.json'), JSON.stringify(games, null, 2));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'team.json'), JSON.stringify(team, null, 2));
    fs.writeFileSync(path.join(BUILD_DIR, 'data', 'blog.json'), JSON.stringify(posts, null, 2));

    // Generate sitemap
    generateSitemap(games, posts);

    console.log('✅ Build completed successfully!');
    console.log(`📁 Output directory: ${BUILD_DIR}/`);
    console.log(`🎮 Games: ${games.length}`);
    console.log(`👥 Team members: ${team.length}`);
    console.log(`📝 Blog posts: ${posts.length}`);
}

// Run build
build();
