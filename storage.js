// storage.js – Local Storage utilities (ES Module)

const STORAGE_KEY = 'dp2026_starting_nine';

export function getStartingNine() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStartingNine(lineup) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineup));
  } catch {
    console.warn('LocalStorage unavailable');
  }
}

export function addToLineup(player) {
  const lineup = getStartingNine();
  if (lineup.length >= 9) return { success: false, reason: 'full' };
  if (lineup.some(p => p.id === player.id)) return { success: false, reason: 'duplicate' };
  lineup.push({ id: player.id, name: player.name, position: player.position });
  saveStartingNine(lineup);
  return { success: true };
}

export function removeFromLineup(playerId) {
  const lineup = getStartingNine().filter(p => p.id !== playerId);
  saveStartingNine(lineup);
  return lineup;
}

export function clearLineup() {
  saveStartingNine([]);
}

export function storeValue(key, value) {
  try {
    localStorage.setItem(`dp2026_${key}`, JSON.stringify(value));
  } catch {
    console.warn('LocalStorage unavailable');
  }
}

export function getValue(key, defaultVal = null) {
  try {
    const val = localStorage.getItem(`dp2026_${key}`);
    return val !== null ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}