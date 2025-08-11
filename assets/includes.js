/**
 * includes.js - Client-side include system for static sites
 * Loads HTML partials and handles navigation state management
 */

(async () => {
  async function fetchHTML(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return await res.text();
  }

  // Inject partial and tag its root for CSS control
  async function inject(el) {
    const url = el.getAttribute('data-include');
    if (!url) return;

    const html = await fetchHTML(url);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();

    // Grab first top-level element and tag it
    const first = wrapper.firstElementChild;

    // Replace placeholder with nodes of the partial
    el.replaceWith(...wrapper.childNodes);
  }

  // Inject all includes in DOM order
  const includes = Array.from(document.querySelectorAll('[data-include]'));
  for (const el of includes) {
    try { await inject(el); } catch (e) { console.error(e); }
  }

  // Determine current page key (index.html -> home)
  function getPageKey() {
    const path = (location.pathname || '').toLowerCase();
    const file = path.split('/').pop() || 'index.html';
    if (file === '' || file === 'index.html') return 'home';
    return file.replace('.html', '');
  }
  const pageKey = getPageKey();

  // Apply aria-current and wire toggles for EACH nav in the DOM
  function setupNav(navRoot) {
    if (!navRoot) return;

    // Active link logic
    const links = navRoot.querySelectorAll('a');
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const isCTA = a.classList.contains('btn');
      const keyMatch = href.endsWith(`${pageKey}.html`) ||
                       (pageKey === 'home' && (href.endsWith('/index.html') || href === '/' || href === 'index.html'));
      if (!isCTA && keyMatch) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });

    // Mobile toggle (scoped to this nav)
    const toggle = navRoot.querySelector('.nav-toggle');
    const linksList = navRoot.querySelector('.nav-links');
    if (toggle && linksList) {
      toggle.addEventListener('click', () => {
        const isOpen = linksList.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  // Find all navs (desktop + mobile) and set them up
  document.querySelectorAll('nav').forEach(setupNav);
})();
