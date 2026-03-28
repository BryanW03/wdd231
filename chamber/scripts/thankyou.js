// thankyou.js — Reads URL query params and displays submitted form data

document.addEventListener('DOMContentLoaded', () => {

  // ── PARSE URL PARAMS ───────────────────────────────────────
  const params = new URLSearchParams(window.location.search);

  // Map of param name → display element id
  const fields = {
    firstName:    'val-firstName',
    lastName:     'val-lastName',
    email:        'val-email',
    phone:        'val-phone',
    businessName: 'val-businessName',
    timestamp:    'val-timestamp',
  };

  Object.entries(fields).forEach(([param, elId]) => {
    const el  = document.getElementById(elId);
    const val = params.get(param);
    if (el) {
      el.textContent = val && val.trim() !== '' ? val : '(not provided)';
    }
  });

  // ── COPYRIGHT YEAR & LAST MODIFIED ────────────────────────
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
    if (darkBtn) { darkBtn.textContent = '☀️'; darkBtn.setAttribute('aria-label', 'Switch to light mode'); }
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