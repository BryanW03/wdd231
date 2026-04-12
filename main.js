// main.js – Home page module (ES Module)
import { initNav } from './nav.js';
import { getStartingNine } from './storage.js';

// ── Fetch players for Big Three ───────────────────────────────────────────
async function fetchBigThree() {
  try {
    const response = await fetch('./data/players.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const players = await response.json();
    return players.filter(p => p.isBigThree);
  } catch (err) {
    console.error('Failed to load big three:', err);
    return [];
  }
}

// ── Render Big Three Cards ────────────────────────────────────────────────
function renderBigThree(players) {
  const grid = document.querySelector('#big-three-grid');
  if (!grid || !players.length) return;

  grid.innerHTML = players.map(player => `
    <article class="big-three-card">
      <div class="big-three-photo-placeholder" aria-hidden="true">⚾</div>
      <div class="big-three-body">
        <p class="big-three-number">No. ${player.number} · ${player.mlbTeam}</p>
        <h3 class="big-three-name">${player.name}</h3>
        <p class="big-three-role">${player.role}</p>
        <div class="big-three-stat-row">
          <div class="big-three-stat">
            <p class="big-three-stat-val">${player.avg}</p>
            <p class="big-three-stat-key">AVG</p>
          </div>
          <div class="big-three-stat">
            <p class="big-three-stat-val">${player.hr}</p>
            <p class="big-three-stat-key">HR</p>
          </div>
          <div class="big-three-stat">
            <p class="big-three-stat-val">${player.rbi}</p>
            <p class="big-three-stat-key">RBI</p>
          </div>
        </div>
        <p class="big-three-bio">${player.bio}</p>
      </div>
    </article>
  `).join('');
}

// ── Render Starting Nine Status ───────────────────────────────────────────
function renderLineupStatus() {
  const el = document.querySelector('#lineup-status');
  if (!el) return;
  const lineup = getStartingNine();
  el.textContent = lineup.length > 0
    ? `You have ${lineup.length} player${lineup.length === 1 ? '' : 's'} in your Starting Nine`
    : 'Build your dream lineup on the Roster page';
}

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
  initNav();
  const bigThree = await fetchBigThree();
  renderBigThree(bigThree);
  renderLineupStatus();
}

init();