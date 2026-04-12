// roster.js – Player roster module (ES Module)
import { initNav } from './nav.js';
import { initScroll } from './scroll.js';
import { getStartingNine, addToLineup, removeFromLineup, clearLineup } from './storage.js';

// ── Fetch players data ──────────────────────────────────────────────────────
async function fetchPlayers() {
  try {
    const response = await fetch('./players.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const players = await response.json();
    return players;
  } catch (err) {
    console.error('Failed to load players:', err);
    document.querySelector('#players-grid').innerHTML =
      `<p style="color:#CE1126;text-align:center;grid-column:1/-1;">
        Failed to load roster data. Please refresh the page.
      </p>`;
    return [];
  }
}

// ── Render player cards ─────────────────────────────────────────────────────
function renderPlayers(players, filter = 'all') {
  const grid = document.querySelector('#players-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? players
    : filter === 'pitchers'
      ? players.filter(p => p.position.toLowerCase().includes('pitcher'))
      : players.filter(p => !p.position.toLowerCase().includes('pitcher'));

  grid.innerHTML = filtered.map(player => createPlayerCard(player)).join('');

  // Attach click events for modal
  grid.querySelectorAll('.player-card').forEach((card, i) => {
    card.addEventListener('click', () => openPlayerModal(filtered[i]));
  });
}

function createPlayerCard(player) {
  const isPitcher = player.position.toLowerCase().includes('pitcher');
  const stat1Val = isPitcher ? (player.era || '—') : (player.avg || '—');
  const stat1Key = isPitcher ? 'ERA' : 'AVG';
  const stat2Val = isPitcher ? (player.strikeouts || 0) : (player.hr || 0);
  const stat2Key = isPitcher ? 'K' : 'HR';
  const stat3Val = isPitcher ? '—' : (player.rbi || 0);
  const stat3Key = isPitcher ? '—' : 'RBI';

  return `
    <article class="player-card" tabindex="0" role="button" aria-label="View ${player.name} details">
      <div class="player-card-header">
        <span class="player-jersey-num" aria-hidden="true">#${player.number}</span>
        <div class="player-avatar" aria-hidden="true">
          <span>${player.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
        </div>
        <div class="player-header-info">
          <p class="player-name">${player.name}</p>
          <p class="player-position">${player.position}</p>
          <span class="player-role-badge">${player.role}</span>
        </div>
      </div>
      <div class="player-card-body">
        <div class="player-stats-row">
          <div class="player-stat">
            <p class="player-stat-val">${stat1Val}</p>
            <p class="player-stat-key">${stat1Key}</p>
          </div>
          <div class="player-stat">
            <p class="player-stat-val">${stat2Val}</p>
            <p class="player-stat-key">${stat2Key}</p>
          </div>
          <div class="player-stat">
            <p class="player-stat-val">${stat3Val}</p>
            <p class="player-stat-key">${stat3Key}</p>
          </div>
        </div>
        <div class="player-team">
          <span class="team-badge">${player.teamLogo}</span>
          <span>${player.mlbTeam}</span>
        </div>
      </div>
    </article>
  `;
}

// ── Player Modal ─────────────────────────────────────────────────────────────
function openPlayerModal(player) {
  const backdrop = document.querySelector('#player-modal');
  const content = document.querySelector('#modal-content');
  if (!backdrop || !content) return;

  const isPitcher = player.position.toLowerCase().includes('pitcher');
  const lineup = getStartingNine();
  const isInLineup = lineup.some(p => p.id === player.id);

  content.innerHTML = `
    <div class="modal-header">
      <div>
        <p class="modal-title">${player.name}</p>
        <p class="modal-sub">${player.position} · #${player.number} · ${player.mlbTeam}</p>
      </div>
      <button class="modal-close" id="modal-close-btn" aria-label="Close modal">&#x2715;</button>
    </div>
    <div class="modal-body">
      <div class="modal-score-display">
        <div style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;text-align:center">
          ${isPitcher ? `
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.era}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">ERA</p></div>
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.strikeouts}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Strikeouts</p></div>
          ` : `
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.avg}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">AVG</p></div>
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.hr}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">HR</p></div>
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.rbi}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">RBI</p></div>
            <div><p style="font-family:'Oswald',sans-serif;font-size:2rem;font-weight:700;color:var(--blue);line-height:1">${player.ops}</p><p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">OPS</p></div>
          `}
        </div>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Player Profile</p>
        <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6">${player.bio}</p>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Role</p>
        <p style="font-family:'Oswald',sans-serif;font-size:1rem;font-weight:700;color:var(--red)">${player.role}</p>
      </div>

      <div style="text-align:center;margin-top:1rem">
        <button class="btn ${isInLineup ? 'btn-gold' : 'btn-primary'}" id="lineup-btn" data-player-id="${player.id}">
          ${isInLineup ? '✓ In Your Starting Nine' : '+ Add to Starting Nine'}
        </button>
      </div>
    </div>
  `;

  backdrop.classList.add('is-open');
  document.querySelector('#modal-close-btn').focus();

  // Close events
  document.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });

  // Add/remove from lineup
  document.querySelector('#lineup-btn').addEventListener('click', () => {
    const result = addToLineup(player);
    if (result.success) {
      renderStartingNine();
      closeModal();
    } else if (result.reason === 'full') {
      alert('Your Starting Nine is full! Remove a player to add a new one.');
    } else if (result.reason === 'duplicate') {
      removeFromLineup(player.id);
      renderStartingNine();
      closeModal();
    }
  });

  // Keyboard close
  document.addEventListener('keydown', handleEsc);
}

function closeModal() {
  document.querySelector('#player-modal')?.classList.remove('is-open');
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(e) { if (e.key === 'Escape') closeModal(); }

// ── Starting Nine ─────────────────────────────────────────────────────────
function renderStartingNine() {
  const grid = document.querySelector('#starting-nine-grid');
  const countEl = document.querySelector('#nine-count');
  if (!grid) return;

  const lineup = getStartingNine();
  if (countEl) countEl.textContent = `${lineup.length}/9`;

  grid.innerHTML = Array.from({ length: 9 }, (_, i) => {
    const player = lineup[i];
    if (player) {
      return `
        <div class="lineup-slot filled">
          <span class="lineup-slot.filled .slot-number" style="font-family:'Oswald',sans-serif;font-size:0.65rem;color:rgba(212,175,55,0.7)">#${i + 1}</span>
          <p class="slot-name">${player.name.split(' ').pop()}</p>
          <p style="font-size:0.65rem;color:rgba(255,255,255,0.55)">${player.position.split(' ').pop()}</p>
          <button class="slot-remove" data-id="${player.id}" aria-label="Remove ${player.name} from lineup">Remove</button>
        </div>
      `;
    }
    return `
      <div class="lineup-slot">
        <span class="slot-number">${i + 1}</span>
        <p style="font-size:0.65rem;color:rgba(255,255,255,0.35);margin-top:0.25rem">Empty</p>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.slot-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeFromLineup(Number(btn.dataset.id));
      renderStartingNine();
    });
  });
}

// ── Filters ───────────────────────────────────────────────────────────────
function initFilters(players) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPlayers(players, btn.dataset.filter);
    });
  });
}

// ── Clear lineup button ────────────────────────────────────────────────────
function initClearBtn() {
  const btn = document.querySelector('#clear-lineup-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('Clear your entire Starting Nine?')) {
      clearLineup();
      renderStartingNine();
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
  initNav();
  initScroll();
  const players = await fetchPlayers();
  if (players.length > 0) {
    renderPlayers(players);
    initFilters(players);
  }
  renderStartingNine();
  initClearBtn();
}

init();