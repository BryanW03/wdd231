// home.js — Weather (OpenWeatherMap API) + Member Spotlights
// Supports: index.html for Santo Domingo Oeste Chamber of Commerce

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Get a free API key at https://openweathermap.org/api
// Replace the string below with your key, then deploy.
const OWM_API_KEY = 'YOUR_API_KEY_HERE';

// Santo Domingo, Dominican Republic — city ID for OpenWeatherMap
const OWM_CITY_ID = '3492897';
const OWM_UNITS   = 'metric';   // Celsius

// Unsplash photo map keyed by members.json image filenames
const SPOTLIGHT_IMAGES = {
  'banco-popular.svg':         'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&q=80',
  'supermercado-nacional.svg': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  'hotel-lina.svg':            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'farmacia-carol.svg':        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
  'constructora-herrera.svg':  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  'instituto-tecnologico.svg': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
  'panaderia-espanola.svg':    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'auto-repuestos-diaz.svg':   'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'clinica-del-oeste.svg':     'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
};

// ── WEATHER ICON → EMOJI ──────────────────────────────────────────────────────
function iconEmoji(code) {
  const map = {
    '01d':'☀️','01n':'🌙','02d':'⛅','02n':'🌤️',
    '03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
    '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
    '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️',
    '50d':'🌫️','50n':'🌫️',
  };
  return map[code] || '🌡️';
}

// ── DEMO DATA (used when no API key is configured) ────────────────────────────
function demoCurrentWeather() {
  return {
    temp: 31, feelsLike: 34, humidity: 75,
    high: 33, low: 27,
    wind: 18, sunrise: '6:28am', sunset: '6:51pm',
    desc: 'Partly Cloudy', icon: '⛅',
  };
}

function demoForecast() {
  const days = [];
  const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const icons  = ['☀️','⛅','🌦️','☁️','⛈️'];
  const descs  = ['Sunny','Partly Cloudy','Light Rain','Cloudy','Thunderstorms'];
  const today  = new Date().getDay();
  for (let i = 1; i <= 3; i++) {
    const idx = Math.floor(Math.random() * icons.length);
    days.push({
      label: names[(today + i) % 7],
      temp:  Math.round(28 + Math.random() * 6),
      icon:  icons[idx],
      desc:  descs[idx],
    });
  }
  return days;
}

// ── RENDER CURRENT WEATHER ────────────────────────────────────────────────────
function renderCurrentWeather(data) {
  const el = document.getElementById('weather-current');
  if (!el) return;
  // Matches wireframe: icon, temp, condition, High/Low/Humidity/Sunrise/Sunset
  el.innerHTML = `
    <div class="weather-body">
      <div class="weather-main-row">
        <span class="weather-icon-xl" aria-hidden="true">${data.icon}</span>
        <div>
          <div class="weather-temp">${data.temp}°C</div>
          <p class="weather-condition">${data.desc}</p>
        </div>
      </div>
      <div class="weather-detail-list">
        <span><strong>High:</strong> ${data.high}°C</span>
        <span><strong>Low:</strong> ${data.low}°C</span>
        <span><strong>Humidity:</strong> ${data.humidity}%</span>
        <span><strong>Sunrise:</strong> ${data.sunrise}</span>
        <span><strong>Sunset:</strong> ${data.sunset}</span>
      </div>
    </div>`;
}

// ── RENDER FORECAST ───────────────────────────────────────────────────────────
function renderForecast(days) {
  const el = document.getElementById('weather-forecast');
  if (!el) return;
  // Matches wireframe: "Today: 90°F  Wednesday: 89°F  Thursday: 68°F" style list
  const rows = days.map(d => `
    <div class="forecast-row">
      <span class="forecast-day-name">${d.label}:</span>
      <span class="forecast-icon" aria-hidden="true">${d.icon}</span>
      <span class="forecast-temp-val">${d.temp}°C</span>
      <span class="forecast-desc-txt">${d.desc}</span>
    </div>`).join('');
  el.innerHTML = `<div class="forecast-list">${rows}</div>`;
}

// ── FETCH CURRENT WEATHER ─────────────────────────────────────────────────────
async function loadCurrentWeather() {
  if (OWM_API_KEY === 'YOUR_API_KEY_HERE') {
    renderCurrentWeather(demoCurrentWeather());
    return;
  }
  try {
    const url  = `https://api.openweathermap.org/data/2.5/weather?id=${OWM_CITY_ID}&units=${OWM_UNITS}&appid=${OWM_API_KEY}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d    = await res.json();

    // Format sunrise / sunset to readable time
    const fmt = ts => new Date(ts * 1000).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });

    renderCurrentWeather({
      temp:      Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      high:      Math.round(d.main.temp_max),
      low:       Math.round(d.main.temp_min),
      humidity:  d.main.humidity,
      wind:      Math.round(d.wind.speed * 3.6),  // m/s → km/h
      sunrise:   fmt(d.sys.sunrise),
      sunset:    fmt(d.sys.sunset),
      desc:      d.weather[0].description.replace(/^\w/, c => c.toUpperCase()),
      icon:      iconEmoji(d.weather[0].icon),
    });
  } catch (err) {
    console.warn('Weather API unavailable, using demo data:', err);
    renderCurrentWeather(demoCurrentWeather());
  }
}

// ── FETCH 3-DAY FORECAST ──────────────────────────────────────────────────────
async function loadForecast() {
  if (OWM_API_KEY === 'YOUR_API_KEY_HERE') {
    renderForecast(demoForecast());
    return;
  }
  try {
    const url  = `https://api.openweathermap.org/data/2.5/forecast?id=${OWM_CITY_ID}&units=${OWM_UNITS}&cnt=40&appid=${OWM_API_KEY}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Pick one reading per day (noon preferred), skip today
    const today = new Date().toDateString();
    const seen  = new Map();

    for (const item of data.list) {
      const d     = new Date(item.dt * 1000);
      const label = d.toDateString();
      if (label === today) continue;
      const hour  = d.getHours();
      // Prefer hour closest to 12
      if (!seen.has(label) || Math.abs(hour - 12) < Math.abs(new Date(seen.get(label).dt * 1000).getHours() - 12)) {
        seen.set(label, item);
      }
      if (seen.size === 3) break;
    }

    const days = Array.from(seen.entries()).map(([label, item]) => ({
      label: new Date(label).toLocaleDateString('en-US', { weekday: 'long' }),
      temp:  Math.round(item.main.temp),
      icon:  iconEmoji(item.weather[0].icon),
      desc:  item.weather[0].description.replace(/^\w/, c => c.toUpperCase()),
    }));

    renderForecast(days);
  } catch (err) {
    console.warn('Forecast API unavailable, using demo data:', err);
    renderForecast(demoForecast());
  }
}

// ── SPOTLIGHTS ────────────────────────────────────────────────────────────────
async function loadSpotlights() {
  const container = document.getElementById('spotlights-container');
  if (!container) return;

  try {
    const res  = await fetch('data/members.json');
    const data = await res.json();

    // Filter: only Gold (3) or Silver (2)
    const eligible = data.members.filter(m => m.membershipLevel >= 2);

    // Shuffle randomly — different on every page load
    const shuffled = eligible.sort(() => Math.random() - 0.5);

    // Pick 2 or 3 randomly
    const count    = Math.random() < 0.5 ? 2 : 3;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    container.innerHTML = '';
    selected.forEach((member, i) => {
      container.appendChild(buildSpotlightCard(member, i));
    });
  } catch (err) {
    console.error('Spotlight load error:', err);
    if (container) {
      container.innerHTML = '<p style="color:var(--color-text-muted);font-size:.85rem;padding:1rem">Unable to load spotlights. Please try again later.</p>';
    }
  }
}

function buildSpotlightCard(member, index) {
  const isGold   = member.membershipLevel === 3;
  const badgeCls = isGold ? 'badge-gold' : 'badge-silver';
  const badgeTxt = isGold ? '🥇 Gold' : '🥈 Silver';
  const imgSrc   = SPOTLIGHT_IMAGES[member.image] || `images/${member.image.replace(/\.svg$/, '.webp')}`;

  let domain = member.website;
  try { domain = new URL(member.website).hostname.replace(/^www\./, ''); } catch {}

  const card = document.createElement('article');
  card.className = `spotlight-card${isGold ? ' gold-card' : ''}`;
  card.style.animationDelay = `${index * 0.1}s`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${member.name} — ${isGold ? 'Gold' : 'Silver'} member`);

  card.innerHTML = `
    <div class="spotlight-img-wrap">
      <img class="spotlight-img"
           src="${imgSrc}"
           alt="${member.name}"
           loading="lazy"
           width="400" height="130"
           onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span style=\\'font-size:2.5rem;opacity:.3;padding:24px;display:block;text-align:center\\' aria-hidden=\\'true\\'>🏢</span>')">
      <span class="spotlight-level-badge ${badgeCls}">${badgeTxt}</span>
    </div>
    <div class="spotlight-body">
      <h4 class="spotlight-name">${member.name}</h4>
      <p class="spotlight-tagline">${member.tagline}</p>

      <div class="spotlight-detail">
        <svg class="sdi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/>
        </svg>
        <a href="tel:${member.phone.replace(/[^\d+]/g, '')}">${member.phone}</a>
      </div>

      <div class="spotlight-detail">
        <svg class="sdi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
        <span>${member.address}</span>
      </div>

      <div class="spotlight-detail">
        <svg class="sdi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">${domain}</a>
      </div>
    </div>`;

  return card;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadCurrentWeather();
  loadForecast();
  loadSpotlights();
});