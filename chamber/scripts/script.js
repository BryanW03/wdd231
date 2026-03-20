let currentView = 'grid';
let currentFilter = 'all';

// ── Image map: matches each member's image field to a real photo URL ──────────
const IMAGE_MAP = {
  'banco-popular.svg':        'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&q=80',
  'supermercado-nacional.svg':'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  'hotel-lina.svg':           'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'farmacia-carol.svg':       'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
  'constructora-herrera.svg': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  'instituto-tecnologico.svg':'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
  'panaderia-espanola.svg':   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'auto-repuestos-diaz.svg':  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'clinica-del-oeste.svg':    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
};

// ── Helper: build one member card from a data object ──────────────────────────
function buildMemberCard(member) {
  const levelMap = {
    3: { cls: 'badge-gold',   label: 'Gold',   aria: 'Gold' },
    2: { cls: 'badge-silver', label: 'Silver', aria: 'Silver' },
    1: { cls: 'badge-member', label: 'Member', aria: 'Member' },
  };
  const badge = levelMap[member.membershipLevel] || levelMap[1];

  let displayDomain = '';
  try {
    displayDomain = new URL(member.website).hostname.replace(/^www\./, '');
  } catch {
    displayDomain = member.website;
  }

  // Use mapped Unsplash image, or fall back to local path
  const imgSrc = IMAGE_MAP[member.image] ||
    `images/${member.image.replace(/\.svg$/, '.webp')}`;

  const article = document.createElement('article');
  article.className = 'member-card';
  article.dataset.level = member.membershipLevel;
  article.setAttribute('role', 'listitem');
  article.setAttribute('aria-label', `${member.name} - ${badge.aria} member`);

  article.innerHTML = `
    <span class="membership-badge ${badge.cls}" role="img" aria-label="Membership level: ${badge.aria}">${badge.label}</span>
    <div class="card-image-wrap" aria-hidden="true">
      <img
        class="card-img"
        src="${imgSrc}"
        alt="${member.name}"
        loading="lazy"
        width="300"
        height="160"
        onerror="this.style.display='none';this.parentElement.innerHTML+='<span class=\\'card-img-placeholder\\' aria-hidden=\\'true\\'>🏢</span>'"
      >
    </div>
    <div class="card-body">
      <h2 class="card-title">${member.name}</h2>
      <p class="card-tagline">${member.tagline}</p>
      <div class="card-info">
        <div class="card-info-row">
          <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
          </svg>
          <span>${member.address}</span>
        </div>
        <div class="card-info-row">
          <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/>
          </svg>
          <a href="tel:${member.phone.replace(/[^\d+]/g, '')}">${member.phone}</a>
        </div>
        <div class="card-info-row">
          <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <a href="${member.website}" target="_blank" rel="noopener noreferrer">${displayDomain}</a>
        </div>
      </div>
    </div>`;

  return article;
}

// ── Async fetch: load members.json and render cards ───────────────────────────
async function loadMembers() {
  const container = document.getElementById('members-container');
  if (!container) return;

  try {
    const response = await fetch('data/members.json');
    const data = await response.json();

    data.members.forEach(member => {
      const card = buildMemberCard(member);
      container.appendChild(card);
    });

    applyFilter();
  } catch (error) {
    console.error('Error loading members.json:', error);
    container.innerHTML = '<p class="error-msg">Unable to load member data. Please try again later.</p>';
  }
}

// ── View / filter / UI helpers ────────────────────────────────────────────────
function updateCount() {
  const countEl = document.getElementById('member-count');
  if (!countEl) return;
  const visible = document.querySelectorAll('#members-container .member-card:not([hidden])').length;
  countEl.textContent = visible;
}

function applyFilter() {
  const cards = document.querySelectorAll('#members-container .member-card');
  cards.forEach(card => {
    const level = card.dataset.level;
    const show = currentFilter === 'all' || level === currentFilter;
    card.hidden = !show;
  });

  let visibleIndex = 0;
  cards.forEach(card => {
    if (!card.hidden) {
      card.style.animationDelay = `${visibleIndex * 0.06}s`;
      visibleIndex++;
    }
  });

  updateCount();
}

function applyView() {
  const container = document.getElementById('members-container');
  if (!container) return;
  container.className = currentView === 'grid' ? 'grid-view' : 'list-view';
}

function setupViewToggle() {
  const gridBtn = document.getElementById('btn-grid');
  const listBtn = document.getElementById('btn-list');
  if (!gridBtn || !listBtn) return;

  gridBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridBtn.classList.add('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'false');
    applyView();
  });

  listBtn.addEventListener('click', () => {
    currentView = 'list';
    listBtn.classList.add('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'false');
    applyView();
  });
}

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.dataset.filter;
      applyFilter();
    });
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen.toString());
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
    btn.setAttribute('aria-label', 'Switch to light mode');
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('darkMode', isDark);
  });
}

function setupFooter() {
  const yearEl = document.getElementById('copyright-year');
  const modEl = document.getElementById('last-modified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();
  setupMobileMenu();
  setupViewToggle();
  setupFilters();
  setupFooter();
  loadMembers(); // async: fetches JSON and renders cards dynamically
});