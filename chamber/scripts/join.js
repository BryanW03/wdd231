// join.js — Logic for join.html

document.addEventListener('DOMContentLoaded', () => {

  // ── SET TIMESTAMP ──────────────────────────────────────────
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toLocaleString('en-US', {
      year:   'numeric',
      month:  '2-digit',
      day:    '2-digit',
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // ── MODALS ─────────────────────────────────────────────────
  // Open modals via data-modal buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal   = document.getElementById(modalId);
      if (modal) modal.showModal();
    });
  });

  // Close modals and select membership level via data-select-level buttons
  document.querySelectorAll('[data-select-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      const level   = btn.getAttribute('data-select-level');
      const modalId = btn.getAttribute('data-close-modal');
      const modal   = document.getElementById(modalId);
      const select  = document.getElementById('membership-level');
      if (modal)  modal.close();
      if (select) select.value = level;
    });
  });

  // Close modals via ✕ buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      if (modal) modal.close();
    });
  });

  // Close modal when clicking backdrop (outside dialog)
  document.querySelectorAll('.membership-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const clickedOutside =
        e.clientX < rect.left  ||
        e.clientX > rect.right ||
        e.clientY < rect.top   ||
        e.clientY > rect.bottom;
      if (clickedOutside) modal.close();
    });
  });

  // Close on Escape key (browsers handle this natively for <dialog>)
  // but we keep this as a safety net
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.membership-modal[open]').forEach(m => m.close());
    }
  });

  // ── COPYRIGHT YEAR & LAST MODIFIED ────────────────────────
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastModEl = document.getElementById('last-modified');
  if (lastModEl) lastModEl.textContent = document.lastModified;

  // ── HAMBURGER MENU (shared with script.js but safe to duplicate) ──
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  // ── DARK MODE (sync with main script.js logic) ─────────────
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