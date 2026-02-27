const THEME_MODE_KEY = 'themeMode';
const AUTO_THEME_KEY = 'autoTheme';

const LANGUAGE_KEY = 'language';

const INSTALL_ID_KEY = 'installId';

const HARDCODED_SUPABASE_URL = 'https://whryujjatvqqrlawmxqy.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indocnl1amphdHZxcXJsYXdteHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDI3NzAsImV4cCI6MjA4NzI3ODc3MH0.Kn5NlWFgEdOICny3WmRfHf8PdukQ6nPyn2lhZreJF4c';

const SUPABASE_VIEW = 'v_host_time_by_user';
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
    auth_not_ready: 'Auth not ready (no access token). Check Supabase Email provider + Confirm email OFF.',
    worker_not_available: 'Worker not available',
    status_measuring: 'Measuring',
    status_idle: 'Idle',
    status_error: 'Error',
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
    auth_not_ready: 'Authentifizierung nicht bereit (kein Zugriffstoken). Prüfe: E-Mail-Provider aktiv + E-Mail-Bestätigung AUS.',
    worker_not_available: 'Worker nicht verfügbar',
    status_measuring: 'Messung',
    status_idle: 'Leerlauf',
    status_error: 'Fehler',
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
    auth_not_ready: "Authentification non prête (aucun jeton d'accès). Vérifie : fournisseur Email activé + confirmation email désactivée.",
    worker_not_available: 'Worker indisponible',
    status_measuring: 'Mesure',
    status_idle: 'Inactif',
    status_error: 'Erreur',
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
    auth_not_ready: 'Autenticación no lista (sin token de acceso). Revisa: proveedor Email activo + confirmación de email desactivada.',
    worker_not_available: 'Worker no disponible',
    status_measuring: 'Midiendo',
    status_idle: 'Inactivo',
    status_error: 'Error',
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
    auth_not_ready: "Autenticazione non pronta (nessun token d'accesso). Controlla: provider Email attivo + conferma email disattivata.",
    worker_not_available: 'Worker non disponibile',
    status_measuring: 'Misurazione',
    status_idle: 'Inattivo',
    status_error: 'Errore',
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
    auth_not_ready: 'Prihlásenie nie je pripravené (chýba access token). Skontroluj: Email provider zapnutý + Confirm email vypnuté.',
    worker_not_available: 'Worker nie je dostupný',
    status_measuring: 'Meranie',
    status_idle: 'Nečinné',
    status_error: 'Chyba',
  },
};

let currentLang = 'en';

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return dict[key] || I18N.en[key] || key;
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

function safeRandomId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  const result = await chrome.storage.local.get({ [INSTALL_ID_KEY]: null });
  let installId = typeof result[INSTALL_ID_KEY] === 'string' ? result[INSTALL_ID_KEY].trim() : null;
  if (!installId) {
    installId = safeRandomId();
    try {
      await chrome.storage.local.set({ [INSTALL_ID_KEY]: installId });
    } catch {
    }
  }

  return {
    url: HARDCODED_SUPABASE_URL,
    anonKey: HARDCODED_SUPABASE_ANON_KEY,
    installId,
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

async function fetchAnalytics() {
  const cfg = await getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return { ok: false, error: 'Missing Supabase config' };

  const accessToken = await getSupabaseAccessTokenFromWorker();
  if (!accessToken) return { ok: false, error: t('auth_not_ready') };

  const base = cfg.url.replace(/\/+$/, '');
  const endpoint = `${base}/rest/v1/${encodeURIComponent(SUPABASE_VIEW)}?select=host,total_duration_ms,sessions&order=total_duration_ms.desc`;

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

async function getStatusFromWorker() {
  try {
    return await chrome.runtime.sendMessage({ type: 'getStatus' });
  } catch {
    return null;
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

  const pieCanvas = document.getElementById('pieChart');
  const legendEl = document.getElementById('legend');
  const totalTimeEl = document.getElementById('totalTime');
  const pagerEl = document.getElementById('pager');
  const pagerInfoEl = document.getElementById('pagerInfo');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  let analyticsRows = [];
  let pageIndex = 0;

  const renderPage = () => {
    const totalItems = analyticsRows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (pageIndex >= totalPages) pageIndex = totalPages - 1;
    if (pageIndex < 0) pageIndex = 0;

    const start = pageIndex * PAGE_SIZE;
    const pageItems = analyticsRows.slice(start, start + PAGE_SIZE);

    drawPie(pieCanvas, pageItems);
    renderLegend(legendEl, pageItems, 0);

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

  const refreshAnalytics = async () => {
    const result = await fetchAnalytics();
    if (!result.ok) {
      analyticsRows = [];
      drawPie(pieCanvas, []);
      if (totalTimeEl) totalTimeEl.textContent = '-';
      if (legendEl) {
        legendEl.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'k';
        row.textContent = t('analytics_not_available');
        row.title = result.error;
        legendEl.appendChild(row);

        const err = document.createElement('div');
        err.className = 'k';
        err.textContent = String(result.error || 'Unknown error');
        legendEl.appendChild(err);
      }
      if (pagerEl) pagerEl.style.display = 'none';
      return;
    }

    analyticsRows = result.data
      .map((r) => ({
        host: r?.host,
        total_duration_ms: r?.total_duration_ms,
        sessions: r?.sessions,
      }))
      .filter((r) => r.host && Number(r.total_duration_ms) > 0);

    const totalMs = analyticsRows.reduce((sum, r) => sum + (Number(r.total_duration_ms) || 0), 0);
    if (totalTimeEl) totalTimeEl.textContent = `${t('total')} ${formatDuration(totalMs)}`;

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
