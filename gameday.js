// gameday.js – Game Day Analytics module (ES Module)
import { initNav } from './nav.js';
import { initScroll } from './scroll.js';

// ── Fetch games data ──────────────────────────────────────────────────────
async function fetchGames() {
  try {
    const response = await fetch('./games.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const games = await response.json();
    return games;
  } catch (err) {
    console.error('Failed to load games:', err);
    document.querySelector('#games-grid').innerHTML =
      `<p style="color:#CE1126;text-align:center;grid-column:1/-1;">
        Failed to load game data. Please refresh the page.
      </p>`;
    return [];
  }
}

// ── Render game cards ─────────────────────────────────────────────────────
function renderGames(games) {
  const grid = document.querySelector('#games-grid');
  if (!grid) return;

  grid.innerHTML = games.map(game => createGameCard(game)).join('');

  grid.querySelectorAll('.game-card').forEach((card, i) => {
    card.addEventListener('click', () => openGameModal(games[i]));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGameModal(games[i]); }
    });
  });
}

function createGameCard(game) {
  const resultClass = game.result === 'W' ? 'win' : 'loss';
  const resultText = game.result === 'W' ? 'WIN' : 'LOSS';

  return `
    <article class="game-card" tabindex="0" role="button" aria-label="View ${game.opponent} game details">
      <div class="game-card-header">
        <span class="game-stage">${game.stage}</span>
        <span class="game-result-badge ${resultClass}">${resultText}</span>
      </div>
      <div class="game-card-body">
        <div class="game-matchup">
          <div class="game-team">
            <span class="game-team-flag" aria-hidden="true">🇩🇴</span>
            <span class="game-team-name">DR</span>
          </div>
          <div style="text-align:center">
            <p class="game-score">${game.score}</p>
          </div>
          <div class="game-team">
            <span class="game-team-flag" aria-hidden="true">${game.opponentFlag}</span>
            <span class="game-team-name">${game.opponent.slice(0,3).toUpperCase()}</span>
          </div>
        </div>
        <p class="game-date">${game.date}</p>
        <p class="game-pot-label">Player of the Game</p>
        <p class="game-pot-name">${game.playerOfGame}</p>
        <p class="view-details-hint">Click for Box Score →</p>
      </div>
    </article>
  `;
}

// ── Game Modal ────────────────────────────────────────────────────────────
function openGameModal(game) {
  const backdrop = document.querySelector('#game-modal');
  const content = document.querySelector('#game-modal-content');
  if (!backdrop || !content) return;

  const resultClass = game.result === 'W' ? 'win' : 'loss';
  const resultText = game.result === 'W' ? '✓ Dominican Victory' : 'Defeat — Pride Remains';

  const pitcherRows = game.boxScore.pitchers
    .map(p => `<tr><td>${p.name}</td><td>${p.ip}</td><td>${p.er}</td><td>${p.k}</td></tr>`)
    .join('');

  const batterRows = game.boxScore.topBatters
    .map(b => `<tr><td>${b.name}</td><td>${b.ab}</td><td>${b.h}</td><td>${b.hr}</td><td>${b.rbi}</td></tr>`)
    .join('');

  content.innerHTML = `
    <div class="modal-header">
      <div>
        <p class="modal-title">DR vs ${game.opponent} ${game.opponentFlag}</p>
        <p class="modal-sub">${game.stage} · ${game.date}</p>
      </div>
      <button class="modal-close" id="game-modal-close" aria-label="Close modal">&#x2715;</button>
    </div>
    <div class="modal-body">
      <div class="modal-score-display">
        <div class="modal-score-matchup">
          <div class="modal-team">
            <span class="modal-team-flag" aria-hidden="true">🇩🇴</span>
            <span class="modal-team-name">Dominican Republic</span>
          </div>
          <div style="text-align:center">
            <p class="modal-final-score">${game.score}</p>
          </div>
          <div class="modal-team">
            <span class="modal-team-flag" aria-hidden="true">${game.opponentFlag}</span>
            <span class="modal-team-name">${game.opponent}</span>
          </div>
        </div>
        <p class="modal-result ${resultClass}">${resultText}</p>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Player of the Game</p>
        <div class="modal-pot-card">
          <span class="modal-pot-icon" aria-hidden="true">⭐</span>
          <div>
            <p class="modal-pot-player">${game.playerOfGame}</p>
            <p class="modal-pot-stat">${game.playerOfGameStat}</p>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Key Turning Point</p>
        <div class="modal-key-moment">${game.keyMoment}</div>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Game Summary</p>
        <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6">${game.summary}</p>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Pitching</p>
        <table class="box-score-table">
          <thead><tr><th>Pitcher</th><th>IP</th><th>ER</th><th>K</th></tr></thead>
          <tbody>${pitcherRows}</tbody>
        </table>
      </div>

      <div class="modal-section">
        <p class="modal-section-title">Top Batters</p>
        <table class="box-score-table">
          <thead><tr><th>Batter</th><th>AB</th><th>H</th><th>HR</th><th>RBI</th></tr></thead>
          <tbody>${batterRows}</tbody>
        </table>
      </div>
    </div>
  `;

  backdrop.classList.add('is-open');
  document.querySelector('#game-modal-close').focus();

  document.querySelector('#game-modal-close').addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', handleEsc);
}

function closeModal() {
  document.querySelector('#game-modal')?.classList.remove('is-open');
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(e) { if (e.key === 'Escape') closeModal(); }

// ── Render Tournament Stats ───────────────────────────────────────────────
function renderTournamentStats(games) {
  const wins = games.filter(g => g.result === 'W').length;
  const losses = games.filter(g => g.result === 'L').length;
  const totalRuns = games.reduce((sum, g) => sum + g.drRuns, 0);
  const oppRuns = games.reduce((sum, g) => sum + g.oppRuns, 0);

  const statsEl = document.querySelector('#tournament-stats');
  if (!statsEl) return;

  statsEl.innerHTML = `
    <div class="fact-card">
      <p class="fact-num">${wins}-${losses}</p>
      <p class="fact-label">Record</p>
    </div>
    <div class="fact-card">
      <p class="fact-num">${totalRuns}</p>
      <p class="fact-label">Runs Scored</p>
    </div>
    <div class="fact-card">
      <p class="fact-num">${oppRuns}</p>
      <p class="fact-label">Runs Allowed</p>
    </div>
    <div class="fact-card">
      <p class="fact-num">Final</p>
      <p class="fact-label">Tournament Result</p>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
  initNav();
  initScroll();
  const games = await fetchGames();
  if (games.length > 0) {
    renderGames(games);
    renderTournamentStats(games);
  }
}

init();