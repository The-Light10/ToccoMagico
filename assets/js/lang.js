const SUPPORTED = ['it','de','fr','en'];
const FLAGS = { it:'🇮🇹', de:'🇩🇪', fr:'🇫🇷', en:'🇬🇧' };
let currentLang = localStorage.getItem('lang') || detectLang();
let dict = {};

function detectLang() {
  const b = (navigator.language || '').slice(0,2).toLowerCase();
  return SUPPORTED.includes(b) ? b : 'it';
}

async function loadLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  try {
    const base = document.querySelector('script[src*="lang.js"]')?.src.replace(/assets\/js\/lang\.js.*$/, '') || '';
    const r = await fetch(base + 'lang/' + lang + '.json');
    dict = await r.json();
  } catch(e) {
    dict = {};
  }
  applyTranslations();
  updateSelector();
  updateStatus();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) el.title = dict[key];
  });
}

function updateSelector() {
  document.querySelectorAll('.lang-selector').forEach(sel => {
    sel.innerHTML = '';
    SUPPORTED.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (l === currentLang ? ' active' : '');
      btn.textContent = FLAGS[l] + ' ' + l.toUpperCase();
      btn.onclick = () => loadLang(l);
      sel.appendChild(btn);
    });
  });
}

function updateStatus() {
  const badge = document.getElementById('status-badge');
  const text = document.getElementById('status-text');
  if (!badge || !text) return;
  const now = new Date();
  const day = now.getDay();
  const min = now.getHours() * 60 + now.getMinutes();
  const hours = [null,[510,1080],[510,1110],[510,1110],[510,1110],[510,1110],[510,960]];
  if (day === 4 && min >= 1110 && min < 1230) {
    badge.className = 'status-badge open';
    text.textContent = dict.open_thu_evening || 'Aperto — Giovedì sera';
    return;
  }
  const today = hours[day];
  if (!today) {
    badge.className = 'status-badge closed';
    text.textContent = (dict.closed_prefix||'Chiuso — Apre ') + (dict.closed_tomorrow||'domani') + (dict.closed_alle||' alle ') + '08:30';
    return;
  }
  const [open, close] = today;
  if (min >= open && min < close) {
    badge.className = 'status-badge open';
    text.textContent = (dict.open_prefix||'Aperto — Chiude alle ') + Math.floor(close/60) + ':' + String(close%60).padStart(2,'0');
  } else {
    badge.className = 'status-badge closed';
    let nextDay = day, nextOpen = null;
    for (let i = 1; i <= 7; i++) { const d = (day+i)%7; if (hours[d]) { nextDay=d; nextOpen=hours[d][0]; break; } }
    const dayNames = [dict.day_sun||'Domenica',dict.day_mon||'Lunedì',dict.day_tue||'Martedì',dict.day_wed||'Mercoledì',dict.day_thu||'Giovedì',dict.day_fri||'Venerdì',dict.day_sat||'Sabato'];
    const nextH = Math.floor(nextOpen/60);
    const nextM = String(nextOpen%60).padStart(2,'0');
    const diff = (nextDay === (day+1)%7) ? (dict.closed_tomorrow||'domani') : dayNames[nextDay];
    text.textContent = (dict.closed_prefix||'Chiuso — Apre ') + diff + (dict.closed_alle||' alle ') + nextH + ':' + nextM;
  }
}

document.addEventListener('DOMContentLoaded', () => loadLang(currentLang));
