const THEME_MODE_KEY = 'themeMode';
const AUTO_THEME_KEY = 'autoTheme';

const LANGUAGE_KEY = 'language';

const HARDCODED_SUPABASE_URL = 'https://whryujjatvqqrlawmxqy.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indocnl1amphdHZxcXJsYXdteHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDI3NzAsImV4cCI6MjA4NzI3ODc3MH0.Kn5NlWFgEdOICny3WmRfHf8PdukQ6nPyn2lhZreJF4c';

const SUPABASE_TABLE = 'tab_sessions';
const PAGE_SIZE = 5;

const I18N = {
  en: {
    analytics_title: 'Website analytics',
    prev: 'Prev',
    next: 'Next',
    site: 'Site',
    speed: 'Speed',
    status: 'Status',
    ping: 'Ping',
    language: 'Language',
    theme: 'Theme',
    theme_auto: 'Auto',
    theme_dark: 'Dark',
    theme_light: 'Light',
    quit: 'Quit',
    settings: 'Settings',
    total: 'Total',
    page: 'Page',
    analytics_not_available: 'Analytics not available',
    range_1h: 'Last hour',
    range_today: 'Today',
    range_7d: 'Last 7 days',
    daily_title: 'Daily totals',
    hourly_title: 'Hourly totals',
    last_hour_title: 'Last hour',
    auth_not_ready: 'Auth not ready (no access token). Check Supabase Email provider + Confirm email OFF.',
    worker_not_available: 'Worker not available',
    status_measuring: 'Measuring',
    status_idle: 'Idle',
    status_error: 'Error',
    st_ping: 'Ping',
    st_download: 'Download',
    st_upload: 'Upload',
    st_jitter: 'Jitter',
    st_testing_ping: 'Testing ping…',
    st_testing_download: 'Testing download…',
    st_testing_upload: 'Testing upload…',
    st_done: 'Done',
    st_error: 'Test failed',
  },
  de: {
    analytics_title: 'Website-Analyse',
    prev: 'Zurück',
    next: 'Weiter',
    site: 'Website',
    speed: 'Geschwindigkeit',
    status: 'Status',
    ping: 'Ping',
    language: 'Sprache',
    theme: 'Design',
    theme_auto: 'Auto',
    theme_dark: 'Dunkel',
    theme_light: 'Hell',
    quit: 'Beenden',
    settings: 'Einstellungen',
    total: 'Gesamt',
    page: 'Seite',
    analytics_not_available: 'Analyse nicht verfügbar',
    range_1h: 'Letzte Stunde',
    range_today: 'Heute',
    range_7d: 'Letzte 7 Tage',
    daily_title: 'Tägliche Summen',
    hourly_title: 'Stündliche Summen',
    last_hour_title: 'Letzte Stunde',
    auth_not_ready: 'Authentifizierung nicht bereit (kein Zugriffstoken). Prüfe: E-Mail-Provider aktiv + E-Mail-Bestätigung AUS.',
    worker_not_available: 'Worker nicht verfügbar',
    status_measuring: 'Messung',
    status_idle: 'Leerlauf',
    status_error: 'Fehler',
    st_ping: 'Ping',
    st_download: 'Download',
    st_upload: 'Upload',
    st_jitter: 'Jitter',
    st_testing_ping: 'Ping wird getestet…',
    st_testing_download: 'Download wird getestet…',
    st_testing_upload: 'Upload wird getestet…',
    st_done: 'Fertig',
    st_error: 'Test fehlgeschlagen',
  },
  fr: {
    analytics_title: 'Statistiques des sites',
    prev: 'Préc.',
    next: 'Suiv.',
    site: 'Site',
    speed: 'Vitesse',
    status: 'Statut',
    ping: 'Ping',
    language: 'Langue',
    theme: 'Thème',
    theme_auto: 'Auto',
    theme_dark: 'Sombre',
    theme_light: 'Clair',
    quit: 'Quitter',
    settings: 'Paramètres',
    total: 'Total',
    page: 'Page',
    analytics_not_available: 'Statistiques indisponibles',
    range_1h: 'Dernière heure',
    range_today: "Aujourd'hui",
    range_7d: '7 derniers jours',
    daily_title: 'Totaux quotidiens',
    hourly_title: 'Totaux horaires',
    last_hour_title: 'Dernière heure',
    auth_not_ready: "Authentification non prête (aucun jeton d'accès). Vérifie : fournisseur Email activé + confirmation email désactivée.",
    worker_not_available: 'Worker indisponible',
    status_measuring: 'Mesure',
    status_idle: 'Inactif',
    status_error: 'Erreur',
    st_ping: 'Ping',
    st_download: 'Téléchargement',
    st_upload: 'Envoi',
    st_jitter: 'Gigue',
    st_testing_ping: 'Test du ping…',
    st_testing_download: 'Test du téléchargement…',
    st_testing_upload: "Test de l'envoi…",
    st_done: 'Terminé',
    st_error: 'Test échoué',
  },
  es: {
    analytics_title: 'Analítica de sitios',
    prev: 'Anterior',
    next: 'Siguiente',
    site: 'Sitio',
    speed: 'Velocidad',
    status: 'Estado',
    ping: 'Ping',
    language: 'Idioma',
    theme: 'Tema',
    theme_auto: 'Auto',
    theme_dark: 'Oscuro',
    theme_light: 'Claro',
    quit: 'Salir',
    settings: 'Ajustes',
    total: 'Total',
    page: 'Página',
    analytics_not_available: 'Analítica no disponible',
    range_1h: 'Última hora',
    range_today: 'Hoy',
    range_7d: 'Últimos 7 días',
    daily_title: 'Totales diarios',
    hourly_title: 'Totales por hora',
    last_hour_title: 'Última hora',
    auth_not_ready: 'Autenticación no lista (sin token de acceso). Revisa: proveedor Email activo + confirmación de email desactivada.',
    worker_not_available: 'Worker no disponible',
    status_measuring: 'Midiendo',
    status_idle: 'Inactivo',
    status_error: 'Error',
    st_ping: 'Ping',
    st_download: 'Descarga',
    st_upload: 'Subida',
    st_jitter: 'Jitter',
    st_testing_ping: 'Probando ping…',
    st_testing_download: 'Probando descarga…',
    st_testing_upload: 'Probando subida…',
    st_done: 'Listo',
    st_error: 'Prueba fallida',
  },
  it: {
    analytics_title: 'Analisi dei siti',
    prev: 'Prec.',
    next: 'Succ.',
    site: 'Sito',
    speed: 'Velocità',
    status: 'Stato',
    ping: 'Ping',
    language: 'Lingua',
    theme: 'Tema',
    theme_auto: 'Auto',
    theme_dark: 'Scuro',
    theme_light: 'Chiaro',
    quit: 'Chiudi',
    settings: 'Impostazioni',
    total: 'Totale',
    page: 'Pagina',
    analytics_not_available: 'Analisi non disponibile',
    range_1h: 'Ultima ora',
    range_today: 'Oggi',
    range_7d: 'Ultimi 7 giorni',
    daily_title: 'Totali giornalieri',
    hourly_title: 'Totali orari',
    last_hour_title: 'Ultima ora',
    auth_not_ready: "Autenticazione non pronta (nessun token d'accesso). Controlla: provider Email attivo + conferma email disattivata.",
    worker_not_available: 'Worker non disponibile',
    status_measuring: 'Misurazione',
    status_idle: 'Inattivo',
    status_error: 'Errore',
    st_ping: 'Ping',
    st_download: 'Download',
    st_upload: 'Upload',
    st_jitter: 'Jitter',
    st_testing_ping: 'Test del ping…',
    st_testing_download: 'Test del download…',
    st_testing_upload: "Test dell'upload…",
    st_done: 'Fatto',
    st_error: 'Test fallito',
  },
  sk: {
    analytics_title: 'Sledovanosť stránok',
    prev: 'Späť',
    next: 'Ďalej',
    site: 'Stránka',
    speed: 'Rýchlosť',
    status: 'Stav',
    ping: 'Ping',
    language: 'Jazyk',
    theme: 'Téma',
    theme_auto: 'Auto',
    theme_dark: 'Tmavá',
    theme_light: 'Svetlá',
    quit: 'Ukončiť',
    settings: 'Nastavenia',
    total: 'Spolu',
    page: 'Strana',
    analytics_not_available: 'Štatistiky nie sú dostupné',
    range_1h: 'Posledná hodina',
    range_today: 'Dnes',
    range_7d: 'Posledných 7 dní',
    daily_title: 'Denné súčty',
    hourly_title: 'Hodinové súčty',
    last_hour_title: 'Posledná hodina',
    auth_not_ready: 'Prihlásenie nie je pripravené (chýba access token). Skontroluj: Email provider zapnutý + Confirm email vypnuté.',
    worker_not_available: 'Worker nie je dostupný',
    status_measuring: 'Meranie',
    status_idle: 'Nečinné',
    status_error: 'Chyba',
    st_ping: 'Ping',
    st_download: 'Sťahovanie',
    st_upload: 'Nahrávanie',
    st_jitter: 'Jitter',
    st_testing_ping: 'Meranie ping…',
    st_testing_download: 'Meranie sťahovania…',
    st_testing_upload: 'Meranie nahrávania…',
    st_done: 'Hotovo',
    st_error: 'Test zlyhal',
  },
};

let currentLang = 'en';

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return dict[key] || I18N.en[key] || key;
}

function startOfLocalDayMs(ts) {
  const d = new Date(Number(ts));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDayLabel(ts) {
  const d = new Date(Number(ts));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function getLanguage() {
  const result = await chrome.storage.sync.get({ [LANGUAGE_KEY]: 'en' });
  const v = result[LANGUAGE_KEY];
  return typeof v === 'string' && I18N[v] ? v : 'en';
}

async function setLanguage(value) {
  const v = typeof value === 'string' && I18N[value] ? value : 'en';
  await chrome.storage.sync.set({ [LANGUAGE_KEY]: v });
  currentLang = v;
}

function applyTranslations(root = document) {
  const nodes = root.querySelectorAll('[data-i18n]');
  for (const el of nodes) {
    const key = el.getAttribute('data-i18n');
    if (!key) continue;
    el.textContent = t(key);
  }
  const ariaNodes = root.querySelectorAll('[data-i18n-aria-label]');
  for (const el of ariaNodes) {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) continue;
    el.setAttribute('aria-label', t(key));
  }
}

function detectAutoTheme() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  } catch {
    return 'dark';
  }
}

async function getThemeMode() {
  const result = await chrome.storage.sync.get({ [THEME_MODE_KEY]: 'auto' });
  return result[THEME_MODE_KEY];
}

async function setThemeMode(value) {
  await chrome.storage.sync.set({ [THEME_MODE_KEY]: value });
}

async function setAutoTheme(value) {
  await chrome.storage.sync.set({ [AUTO_THEME_KEY]: value });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

function formatBytes(n) {
  const v = Number(n) || 0;
  if (v <= 0) return '0 B';
  const kb = v / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(gb < 10 ? 1 : 0)} GB`;
}

function startOfLocalHourMs(ts) {
  const d = new Date(Number(ts));
  d.setMinutes(0, 0, 0);
  return d.getTime();
}

function startOfLocal5MinMs(ts) {
  const d = new Date(Number(ts));
  d.setMinutes(Math.floor(d.getMinutes() / 5) * 5, 0, 0);
  return d.getTime();
}

function getPaletteColors() {
  return ['#007aff', '#34c759', '#ff9500', '#ff2d55', '#5856d6', '#64d2ff', '#ffcc00'];
}

function drawPie(canvas, items) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.44;

  ctx.clearRect(0, 0, w, h);

  const total = items.reduce((sum, it) => sum + (Number(it.total_duration_ms) || 0), 0);
  if (total <= 0 || !items.length) {
    ctx.fillStyle = 'rgba(120,120,128,0.18)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const colors = getPaletteColors();
  let a = -Math.PI / 2;
  for (let i = 0; i < items.length; i++) {
    const v = Number(items[i].total_duration_ms) || 0;
    const da = (v / total) * Math.PI * 2;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + da);
    ctx.closePath();
    ctx.fill();
    a += da;
  }

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.56, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

function renderLegend(legendEl, items, startIndex = 0) {
  if (!legendEl) return;
  legendEl.innerHTML = '';

  const colors = getPaletteColors();
  for (let i = 0; i < items.length; i++) {
    const row = document.createElement('div');
    row.className = 'legendRow';

    const left = document.createElement('div');
    left.className = 'legendLeft';

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = colors[(startIndex + i) % colors.length];

    const host = document.createElement('span');
    host.className = 'legendHost';
    host.textContent = String(items[i].host || '-');
    host.title = host.textContent;

    left.appendChild(dot);
    left.appendChild(host);

    const leader = document.createElement('span');
    leader.className = 'leader';

    const time = document.createElement('span');
    time.className = 'legendTime';
    time.textContent = formatDuration(items[i].total_duration_ms);

    row.appendChild(left);
    row.appendChild(leader);
    row.appendChild(time);

    legendEl.appendChild(row);
  }
}

async function getSupabaseConfig() {
  return {
    url: HARDCODED_SUPABASE_URL,
    anonKey: HARDCODED_SUPABASE_ANON_KEY,
  };
}

async function getSupabaseAccessTokenFromWorker() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'getSupabaseAccessToken' });
    if (res?.ok && typeof res.access_token === 'string') return res.access_token;
    return null;
  } catch {
    return null;
  }
}

function getRangeWindowMs(rangeValue) {
  const now = Date.now();
  if (rangeValue === '7d') {
    const todayStart = startOfLocalDayMs(now);
    const from = todayStart - 6 * 24 * 60 * 60 * 1000;
    return { fromMs: from, toMs: now };
  }
  if (rangeValue === '1h') {
    return { fromMs: now - 60 * 60 * 1000, toMs: now };
  }
  const fromMs = startOfLocalDayMs(now);
  return { fromMs, toMs: now };
}

async function fetchSessions(rangeValue) {
  const cfg = await getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return { ok: false, error: 'Missing Supabase config' };

  const accessToken = await getSupabaseAccessTokenFromWorker();
  if (!accessToken) return { ok: false, error: t('auth_not_ready') };

  const { fromMs, toMs } = getRangeWindowMs(rangeValue);

  const base = cfg.url.replace(/\/+$/, '');
  const endpoint =
    `${base}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}` +
    `?select=host,duration_ms,data_bytes,start_ts_ms,end_ts_ms` +
    `&end_ts_ms=gte.${fromMs}` +
    `&end_ts_ms=lte.${toMs}`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, error: `HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}` };
    }
    const data = await res.json();
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

function renderLineChart(canvas, sessions, rangeValue) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, cssW, cssH);

  const { fromMs, toMs } = getRangeWindowMs(rangeValue);

  const totals = new Map();
  if (rangeValue === '7d') {
    for (const s of sessions) {
      const endTs = Number(s?.end_ts_ms);
      const bytes = Number(s?.data_bytes) || 0;
      if (!Number.isFinite(endTs) || bytes <= 0) continue;
      const dayStart = startOfLocalDayMs(endTs);
      totals.set(dayStart, (totals.get(dayStart) || 0) + bytes);
    }
  } else if (rangeValue === '1h') {
    for (const s of sessions) {
      const endTs = Number(s?.end_ts_ms);
      const bytes = Number(s?.data_bytes) || 0;
      if (!Number.isFinite(endTs) || bytes <= 0) continue;
      const bucket = startOfLocal5MinMs(endTs);
      totals.set(bucket, (totals.get(bucket) || 0) + bytes);
    }
  } else {
    for (const s of sessions) {
      const endTs = Number(s?.end_ts_ms);
      const bytes = Number(s?.data_bytes) || 0;
      if (!Number.isFinite(endTs) || bytes <= 0) continue;
      const hourStart = startOfLocalHourMs(endTs);
      totals.set(hourStart, (totals.get(hourStart) || 0) + bytes);
    }
  }

  const keys = [];
  if (rangeValue === '7d') {
    const dayStartFrom = startOfLocalDayMs(fromMs);
    const dayStartTo = startOfLocalDayMs(toMs);
    for (let day = dayStartFrom; day <= dayStartTo; day += 24 * 60 * 60 * 1000) keys.push(day);
  } else if (rangeValue === '1h') {
    const bucketFrom = startOfLocal5MinMs(fromMs);
    const bucketTo = startOfLocal5MinMs(toMs);
    for (let b = bucketFrom; b <= bucketTo; b += 5 * 60 * 1000) keys.push(b);
  } else {
    const hourStartFrom = startOfLocalHourMs(fromMs);
    const hourStartTo = startOfLocalHourMs(toMs);
    for (let h = hourStartFrom; h <= hourStartTo; h += 60 * 60 * 1000) keys.push(h);
  }

  if (keys.length === 0) return;

  const values = keys.map(k => totals.get(k) || 0);
  const max = Math.max(...values, 1);

  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const lineColor = isDark ? '#0a84ff' : '#007aff';
  const dotFill = isDark ? '#0a84ff' : '#007aff';
  const gridColor = isDark ? 'rgba(84,84,88,0.35)' : 'rgba(60,60,67,0.12)';
  const textColor = isDark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';

  const padL = 48;
  const padR = 10;
  const padT = 12;
  const padB = 28;
  const plotW = cssW - padL - padR;
  const plotH = cssH - padT - padB;

  const yTicks = 4;
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  for (let i = 0; i <= yTicks; i++) {
    const yVal = max * (1 - i / yTicks);
    const y = padT + (i / yTicks) * plotH;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(cssW - padR, y);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(formatBytes(yVal), padL - 6, y);
  }

  const n = keys.length;
  const xStep = n > 1 ? plotW / (n - 1) : 0;

  const points = values.map((v, i) => ({
    x: padL + i * xStep,
    y: padT + plotH - (max > 0 ? (v / max) * plotH : 0),
  }));

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
    else ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = dotFill;
    ctx.fill();
    ctx.strokeStyle = isDark ? '#1c1c1e' : '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor;
  ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
  const maxLabels = Math.min(n, rangeValue === '7d' ? 7 : rangeValue === '1h' ? 12 : 8);
  const labelStep = n > maxLabels ? Math.ceil(n / maxLabels) : 1;
  for (let i = 0; i < n; i += labelStep) {
    const x = padL + i * xStep;
    let label;
    if (rangeValue === '7d') {
      label = formatDayLabel(keys[i]).slice(5);
    } else {
      const d = new Date(keys[i]);
      label = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    ctx.fillText(label, x, cssH - padB + 6);
  }
}

async function getStatusFromWorker() {
  try {
    return await chrome.runtime.sendMessage({ type: 'getStatus' });
  } catch {
    return null;
  }
}

async function measurePing(url, count = 5) {
  const times = [];
  for (let i = 0; i < count; i++) {
    const t0 = performance.now();
    try {
      await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    } catch { /* still measures round-trip */ }
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  const avg = times.reduce((s, v) => s + v, 0) / times.length;
  const jitter = times.length > 1
    ? times.slice(1).reduce((s, v, i) => s + Math.abs(v - times[i]), 0) / (times.length - 1)
    : 0;
  return { ping: Math.round(avg), jitter: Math.round(jitter * 10) / 10 };
}

async function measureDownload(url, durationMs = 4000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), durationMs + 2000);
  let totalBytes = 0;
  const t0 = performance.now();
  try {
    const res = await fetch(url + '?bytes=26214400&cachebust=' + Date.now(), {
      cache: 'no-store',
      signal: controller.signal,
    });
    const reader = res.body.getReader();
    while (true) {
      const elapsed = performance.now() - t0;
      if (elapsed > durationMs) { reader.cancel(); break; }
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
    }
  } catch { /* aborted or error */ }
  clearTimeout(timeout);
  const elapsed = (performance.now() - t0) / 1000;
  const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed * 1000 * 1000) : 0;
  return Math.round(mbps * 100) / 100;
}

async function measureUpload(url, durationMs = 4000) {
  const chunkSize = 1024 * 1024;
  const blob = new Blob([new ArrayBuffer(chunkSize)]);
  let totalBytes = 0;
  const t0 = performance.now();
  while (performance.now() - t0 < durationMs) {
    try {
      await fetch(url + '?cachebust=' + Date.now(), {
        method: 'POST',
        body: blob,
        mode: 'no-cors',
        cache: 'no-store',
      });
      totalBytes += chunkSize;
    } catch { break; }
  }
  const elapsed = (performance.now() - t0) / 1000;
  const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed * 1000 * 1000) : 0;
  return Math.round(mbps * 100) / 100;
}

async function runSpeedTest(els) {
  const { goBtn, phaseEl, pingEl, downEl, upEl, jitterEl } = els;

  goBtn.classList.add('running');
  goBtn.classList.remove('done');
  goBtn.textContent = '···';
  pingEl.textContent = '-';
  downEl.textContent = '-';
  upEl.textContent = '-';
  jitterEl.textContent = '-';

  const CF_TRACE = 'https://speed.cloudflare.com/__down';
  const CF_UP = 'https://speed.cloudflare.com/__up';
  const PING_URL = 'https://1.1.1.1/cdn-cgi/trace';

  try {
    phaseEl.textContent = t('st_testing_ping');
    const { ping, jitter } = await measurePing(PING_URL, 6);
    pingEl.textContent = String(ping);
    jitterEl.textContent = jitter.toFixed(1);

    phaseEl.textContent = t('st_testing_download');
    const down = await measureDownload(CF_TRACE, 5000);
    downEl.textContent = down.toFixed(2);

    phaseEl.textContent = t('st_testing_upload');
    const up = await measureUpload(CF_UP, 4000);
    upEl.textContent = up.toFixed(2);

    phaseEl.textContent = t('st_done');
    goBtn.classList.remove('running');
    goBtn.classList.add('done');
    goBtn.textContent = 'GO';
  } catch (e) {
    phaseEl.textContent = `${t('st_error')}: ${e.message || e}`;
    goBtn.classList.remove('running');
    goBtn.textContent = 'GO';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  currentLang = await getLanguage();
  applyTranslations(document);

  const languageSelect = document.getElementById('language');
  const select = document.getElementById('themeMode');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const quitBtn = document.getElementById('quitBtn');

  const goBtn = document.getElementById('goBtn');
  const stPhaseEl = document.getElementById('stPhase');
  const stPingEl = document.getElementById('stPing');
  const stDownEl = document.getElementById('stDown');
  const stUpEl = document.getElementById('stUp');
  const stJitterEl = document.getElementById('stJitter');
  let speedTestRunning = false;

  if (goBtn) {
    goBtn.addEventListener('click', async () => {
      if (speedTestRunning) return;
      speedTestRunning = true;
      await runSpeedTest({
        goBtn,
        phaseEl: stPhaseEl,
        pingEl: stPingEl,
        downEl: stDownEl,
        upEl: stUpEl,
        jitterEl: stJitterEl,
      });
      speedTestRunning = false;
    });
  }

  const pieCanvas = document.getElementById('pieChart');
  const legendEl = document.getElementById('legend');
  const totalTimeEl = document.getElementById('totalTime');
  const lineChartEl = document.getElementById('lineChart');
  const pagerEl = document.getElementById('pager');
  const pagerInfoEl = document.getElementById('pagerInfo');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  const rangeSelect = document.getElementById('range');
  let currentRange = rangeSelect && typeof rangeSelect.value === 'string' ? rangeSelect.value : 'today';

  let analyticsRows = [];
  let pageIndex = 0;

  const renderPage = () => {
    const totalItems = analyticsRows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (pageIndex >= totalPages) pageIndex = totalPages - 1;
    if (pageIndex < 0) pageIndex = 0;

    const start = pageIndex * PAGE_SIZE;
    const pageItems = analyticsRows.slice(start, start + PAGE_SIZE);

    drawPie(pieCanvas, analyticsRows);
    renderLegend(legendEl, pageItems, start);

    if (pagerEl && pagerInfoEl && prevBtn && nextBtn) {
      pagerEl.style.display = totalItems > PAGE_SIZE ? 'flex' : 'none';
      pagerInfoEl.textContent = `${t('page')} ${pageIndex + 1}/${totalPages}`;
      prevBtn.disabled = pageIndex <= 0;
      nextBtn.disabled = pageIndex >= totalPages - 1;
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pageIndex -= 1;
      renderPage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pageIndex += 1;
      renderPage();
    });
  }

  const chartTitleEl = document.querySelector('[data-i18n="daily_title"]');

  const refreshAnalytics = async () => {
    if (chartTitleEl) {
      chartTitleEl.textContent = currentRange === '7d' ? t('daily_title') : currentRange === '1h' ? t('last_hour_title') : t('hourly_title');
    }
    const sessionsRes = await fetchSessions(currentRange);
    if (!sessionsRes.ok) {
      analyticsRows = [];
      drawPie(pieCanvas, []);
      if (totalTimeEl) totalTimeEl.textContent = '-';
      if (legendEl) {
        legendEl.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'k';
        row.textContent = t('analytics_not_available');
        row.title = sessionsRes.error;
        legendEl.appendChild(row);

        const err = document.createElement('div');
        err.className = 'k';
        err.textContent = String(sessionsRes.error || 'Unknown error');
        legendEl.appendChild(err);
      }
      if (lineChartEl) { const lctx = lineChartEl.getContext('2d'); if (lctx) lctx.clearRect(0, 0, lineChartEl.width, lineChartEl.height); }
      if (pagerEl) pagerEl.style.display = 'none';
      return;
    }

    const sessions = sessionsRes.data;

    const totalsByHost = new Map();
    for (const s of sessions) {
      const host = typeof s?.host === 'string' ? s.host : null;
      const dur = Number(s?.duration_ms) || 0;
      if (!host || dur <= 0) continue;
      totalsByHost.set(host, (totalsByHost.get(host) || 0) + dur);
    }

    analyticsRows = Array.from(totalsByHost.entries())
      .map(([host, total_duration_ms]) => ({ host, total_duration_ms }))
      .sort((a, b) => (Number(b.total_duration_ms) || 0) - (Number(a.total_duration_ms) || 0));

    const totalMs = analyticsRows.reduce((sum, r) => sum + (Number(r.total_duration_ms) || 0), 0);
    if (totalTimeEl) totalTimeEl.textContent = `${t('total')} ${formatDuration(totalMs)}`;

    renderLineChart(lineChartEl, sessions, currentRange);

    renderPage();
  };

  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      settingsPanel.classList.toggle('open');
    });
  }

  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      window.close();
    });
  }

  if (languageSelect) {
    languageSelect.value = currentLang;
    languageSelect.addEventListener('change', async () => {
      await setLanguage(languageSelect.value);
      applyTranslations(document);
      renderPage();
      await refreshAnalytics();
      await refresh();
    });
  }

  if (rangeSelect) {
    rangeSelect.addEventListener('change', async () => {
      currentRange = rangeSelect.value === '7d' ? '7d' : rangeSelect.value === '1h' ? '1h' : 'today';
      pageIndex = 0;
      await refreshAnalytics();
    });
  }

  if (!select) return;

  select.value = await getThemeMode();

  await setAutoTheme(detectAutoTheme());

  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  if (mql) {
    const handler = async () => {
      await setAutoTheme(detectAutoTheme());
    };
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(handler);
    }
  }

  select.addEventListener('change', async () => {
    await setThemeMode(select.value);
    if (select.value === 'auto') {
      await setAutoTheme(detectAutoTheme());
    }
  });

  const refresh = async () => {
    const status = await getStatusFromWorker();
    if (!status) {
      setText('site', '-');
      setText('speed', '-');
      setText('status', t('worker_not_available'));
      setText('ping', '-');
      return;
    }

    setText('site', status.site || '-');
    setText('speed', status.speedText || '-');
    const state = status.statusState;
    if (state === 'active') setText('status', t('status_measuring'));
    else if (state === 'idle') setText('status', t('status_idle'));
    else if (state === 'error') setText('status', t('status_error'));
    else setText('status', status.statusText || '-');
    setText('ping', status.pingText || '-');
  };

  await refresh();
  setInterval(refresh, 1000);

  await refreshAnalytics();
  setInterval(refreshAnalytics, 15000);
});
