// ============================================
// Santo Domingo Oeste Chamber of Commerce
// directory.js - Member Directory Logic
// ============================================

const MEMBERSHIP_LABELS = {
  3: { label: 'Gold', badgeClass: 'badge-gold' },
  2: { label: 'Silver', badgeClass: 'badge-silver' },
  1: { label: 'Member', badgeClass: 'badge-member' },
};

const CATEGORY_ICONS = {
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
};

// SVG icons for info rows
const ICONS = {
  address: `<svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
  phone:   `<svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/></svg>`,
  web:     `<svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
};

// State
let allMembers = [];
let currentView = 'grid';
let currentFilter = 'all';

// ========================
// FETCH MEMBERS
// ========================
async function fetchMembers() {
  const container = document.getElementById('members-container');
  container.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Loading member directory…</p>
    </div>`;

  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    allMembers = data.members;
    renderDirectory();
  } catch (error) {
    container.innerHTML = `
      <div class="loading-state" role="alert">
        <p>⚠️ Unable to load member data. Please try again later.</p>
      </div>`;
    console.error('Failed to load members:', error);
  }
}

// ========================
// RENDER DIRECTORY
// ========================
function renderDirectory() {
  const container = document.getElementById('members-container');
  const countEl = document.getElementById('member-count');

  // Filter members
  let filtered = allMembers;
  if (currentFilter !== 'all') {
    filtered = allMembers.filter(m => m.membershipLevel === parseInt(currentFilter));
  }

  // Update count
  if (countEl) {
    countEl.textContent = filtered.length;
  }

  // Apply view class
  container.className = currentView === 'grid' ? 'grid-view' : 'list-view';
  container.setAttribute('id', 'members-container');

  if (filtered.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>No members found for this filter.</p></div>`;
    return;
  }

  container.innerHTML = '';

  filtered.forEach((member, index) => {
    const card = createMemberCard(member, index);
    container.appendChild(card);
  });
}

// ========================
// CREATE MEMBER CARD
// ========================
function createMemberCard(member, index) {
  const memberInfo = MEMBERSHIP_LABELS[member.membershipLevel] || MEMBERSHIP_LABELS[1];
  const animDelay = `animation-delay: ${index * 0.06}s`;

  const article = document.createElement('article');
  article.className = 'member-card';
  article.setAttribute('style', animDelay);
  article.setAttribute('aria-label', `${member.name} - ${memberInfo.label} member`);

  // Build image src path
  const imgPath = `images/${member.image}`;

  article.innerHTML = `
    <span class="membership-badge ${memberInfo.badgeClass}" aria-label="Membership level: ${memberInfo.label}">
      ${memberInfo.label}
    </span>

    <div class="card-image-wrap" aria-hidden="true">
      <img
        class="card-img"
        src="${imgPath}"
        alt="${member.name} business photo"
        loading="lazy"
        width="300"
        height="160"
        onerror="this.style.display='none'; this.parentElement.innerHTML += '<span class=\'card-img-placeholder\' aria-hidden=\'true\'>🏢</span>'"
      >
    </div>

    <div class="card-body">
      <h2 class="card-title">${escapeHtml(member.name)}</h2>
      <p class="card-tagline">${escapeHtml(member.tagline || '')}</p>

      <div class="card-info">
        <div class="card-info-row">
          ${ICONS.address}
          <span>${escapeHtml(member.address)}</span>
        </div>
        <div class="card-info-row">
          ${ICONS.phone}
          <a href="tel:${member.phone.replace(/[^0-9+]/g, '')}">${escapeHtml(member.phone)}</a>
        </div>
        <div class="card-info-row">
          ${ICONS.web}
          <a href="${escapeHtml(member.website)}" target="_blank" rel="noopener noreferrer">
            ${formatUrl(member.website)}
          </a>
        </div>
      </div>
    </div>
  `;

  return article;
}

// ========================
// VIEW TOGGLE
// ========================
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
    renderDirectory();
  });

  listBtn.addEventListener('click', () => {
    currentView = 'list';
    listBtn.classList.add('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'false');
    renderDirectory();
  });
}

// ========================
// FILTER SETUP
// ========================
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
      renderDirectory();
    });
  });
}

// ========================
// HAMBURGER MENU
// ========================
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ========================
// DARK MODE TOGGLE
// ========================
function setupDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('darkMode') === 'true';
  if (saved) {
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

// ========================
// FOOTER: Date & Copyright
// ========================
function setupFooter() {
  const yearEl = document.getElementById('copyright-year');
  const modEl = document.getElementById('last-modified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
}

// ========================
// UTILITIES
// ========================
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();
  setupMobileMenu();
  setupViewToggle();
  setupFilters();
  setupFooter();
  fetchMembers();
});