let currentView = 'grid';
let currentFilter = 'all';

function updateCount() {
  const countEl = document.getElementById('member-count');
  if (!countEl) return;
  const visible = document.querySelectorAll('#members-container .member-card:not([hidden])').length;
  countEl.textContent = visible;
}

function applyFilter() {
  const cards = document.querySelectorAll('#members-container .member-card');
  cards.forEach((card, index) => {
    const level = card.dataset.level;
    const show = currentFilter === 'all' || level === currentFilter;
    card.hidden = !show;
    if (show) {
      card.style.animationDelay = '';
    }
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

document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();
  setupMobileMenu();
  setupViewToggle();
  setupFilters();
  setupFooter();
  updateCount();
});