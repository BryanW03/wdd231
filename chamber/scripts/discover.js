// discover.js — Discover page logic

document.addEventListener('DOMContentLoaded', () => {

  // ── VISITOR MESSAGE (localStorage) ──────────────────────────
  const STORAGE_KEY = 'sdo_discover_lastVisit';
  const msgEl = document.getElementById('visitor-message');

  if (msgEl) {
    const lastVisit = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastVisit) {
      msgEl.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
      const diffMs   = now - Number(lastVisit);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 1) {
        msgEl.textContent = 'Back so soon! Awesome!';
      } else {
        const dayWord = diffDays === 1 ? 'day' : 'days';
        msgEl.textContent = `You last visited ${diffDays} ${dayWord} ago.`;
      }
    }

    localStorage.setItem(STORAGE_KEY, String(now));
  }

  // ── BUILD CARDS USING FETCH AND JSON ────────────────────────
  const grid = document.getElementById('discover-grid');
  
  async function getPlacesData() {
    try {
      const response = await fetch('data/discover.json');
      if (response.ok) {
        const data = await response.json();
        displayPlaces(data);
      } else {
        console.error('Failed to fetch places data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayPlaces(places) {
    if (!grid) return;
    
    places.forEach((place, i) => {
      const card = document.createElement('article');
      card.className = 'discover-card';
      card.setAttribute('role', 'listitem');
      card.style.gridArea = `p${i + 1}`;

      card.innerHTML = `
        <figure class="discover-figure">
          <img
            class="discover-img"
            src="${place.imageUrl}"
            alt="${place.alt}"
            loading="lazy"
            width="600"
            height="200"
            onerror="this.src='https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&fm=webp'">
        </figure>
        <div class="discover-body">
          <h3 class="discover-name">${place.name}</h3>
          <address class="discover-address">${place.address}</address>
          <p class="discover-desc">${place.description}</p>
          <button class="discover-btn" type="button" aria-label="Learn more about ${place.name}">Learn More</button>
        </div>`;

      grid.appendChild(card);
    });
  }

  // Ejecutar el fetch al cargar
  getPlacesData();

  // ── LEARN MORE BUTTONS ───────────────────────────────────────
  if (grid) {
    grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('discover-btn')) {
        const name = e.target.closest('.discover-card').querySelector('.discover-name').textContent;
        alert(`Coming soon: Full details about ${name}!`);
      }
    });
  }

  // ── SHARED: COPYRIGHT & LAST MODIFIED ───────────────────────
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastModEl = document.getElementById('last-modified');
  if (lastModEl) lastModEl.textContent = document.lastModified;

  // ── HAMBURGER MENU ─────────────────────────────────────────
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  // ── DARK MODE ──────────────────────────────────────────────
  const darkBtn = document.getElementById('dark-mode-toggle');
  const body    = document.body;

  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (darkBtn) {
      darkBtn.textContent = '☀️';
      darkBtn.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      darkBtn.textContent = isDark ? '☀️' : '🌙';
      darkBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
  }

});