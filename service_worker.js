let attachedTabId = null;
let bytesSinceLastTick = 0;
let tickTimerId = null;

const THEME_MODE_KEY = 'themeMode';
const AUTO_THEME_KEY = 'autoTheme';

const INSTALL_ID_KEY = 'installId';
const SUPABASE_URL_KEY = 'supabaseUrl';
const SUPABASE_ANON_KEY = 'supabaseAnonKey';
const SUPABASE_TABLE_KEY = 'supabaseTable';

const SUPABASE_AUTH_EMAIL_KEY = 'supabaseAuthEmail';
const SUPABASE_AUTH_PASSWORD_KEY = 'supabaseAuthPassword';
const SUPABASE_AUTH_SESSION_KEY = 'supabaseAuthSession';

const HARDCODED_SUPABASE_URL = 'https://whryujjatvqqrlawmxqy.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indocnl1amphdHZxcXJsYXdteHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDI3NzAsImV4cCI6MjA4NzI3ODc3MH0.Kn5NlWFgEdOICny3WmRfHf8PdukQ6nPyn2lhZreJF4c';

const SUPABASE_QUEUE_KEY = 'supabaseQueue';

let themeMode = 'auto';
let autoTheme = 'dark';

let installId = null;
let supabaseConfig = {
  url: HARDCODED_SUPABASE_URL,
  anonKey: HARDCODED_SUPABASE_ANON_KEY,
  table: 'tab_sessions',
};

let supabaseAuthSession = null;

let activeWindowFocused = true;
let activeTabSession = null;

let flushTimerId = null;
let flushInProgress = false;

let lastRender = {
  tabId: null,
  valueText: '0K',
  unitText: '',
  state: 'idle',
};

let lastTabUrl = null;

function safeRandomId() {
  try {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
  } catch {
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function ensureInstallId() {
  if (installId) return installId;
  try {
    const result = await chrome.storage.local.get({ [INSTALL_ID_KEY]: null });
    if (result[INSTALL_ID_KEY]) {
      installId = result[INSTALL_ID_KEY];
      return installId;
    }
  } catch {
  }

  installId = safeRandomId();
  try {
    await chrome.storage.local.set({ [INSTALL_ID_KEY]: installId });
  } catch {
  }
  return installId;
}

async function loadSupabaseConfig() {
  supabaseConfig = {
    url: HARDCODED_SUPABASE_URL,
    anonKey: HARDCODED_SUPABASE_ANON_KEY,
    table: 'tab_sessions',
  };
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function computeExpirySec(session) {
  const exp = Number(session?.expires_at);
  if (Number.isFinite(exp) && exp > 0) return exp;
  const expiresIn = Number(session?.expires_in);
  if (Number.isFinite(expiresIn) && expiresIn > 0) return nowSec() + expiresIn;
  return null;
}

async function loadSupabaseAuthSession() {
  if (supabaseAuthSession) return supabaseAuthSession;
  try {
    const result = await chrome.storage.local.get({ [SUPABASE_AUTH_SESSION_KEY]: null });
    if (result[SUPABASE_AUTH_SESSION_KEY] && typeof result[SUPABASE_AUTH_SESSION_KEY] === 'object') {
      supabaseAuthSession = result[SUPABASE_AUTH_SESSION_KEY];
      return supabaseAuthSession;
    }
  } catch {
  }
  return null;
}

async function saveSupabaseAuthSession(session) {
  supabaseAuthSession = session;
  try {
    await chrome.storage.local.set({ [SUPABASE_AUTH_SESSION_KEY]: session });
  } catch {
  }
}

async function getOrCreateAuthCreds() {
  const id = await ensureInstallId();
  const result = await chrome.storage.local.get({
    [SUPABASE_AUTH_EMAIL_KEY]: null,
    [SUPABASE_AUTH_PASSWORD_KEY]: null,
  });

  let email = typeof result[SUPABASE_AUTH_EMAIL_KEY] === 'string' ? result[SUPABASE_AUTH_EMAIL_KEY].trim() : null;
  let password = typeof result[SUPABASE_AUTH_PASSWORD_KEY] === 'string' ? result[SUPABASE_AUTH_PASSWORD_KEY] : null;

  if (!email) email = `${id}@webtracker.local`;
  if (!password) password = safeRandomId();

  await chrome.storage.local.set({
    [SUPABASE_AUTH_EMAIL_KEY]: email,
    [SUPABASE_AUTH_PASSWORD_KEY]: password,
  });

  return { email, password };
}

async function supabaseAuthSignup(email, password) {
  const base = HARDCODED_SUPABASE_URL.replace(/\/+$/, '');
  const endpoint = `${base}/auth/v1/signup`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      apikey: HARDCODED_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`Supabase signup HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  const data = text ? JSON.parse(text) : {};
  const session = data?.session || data;
  if (session?.access_token && session?.refresh_token) {
    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: computeExpirySec(session),
    };
  }
  return null;
}

async function supabaseAuthSignIn(email, password) {
  const base = HARDCODED_SUPABASE_URL.replace(/\/+$/, '');
  const endpoint = `${base}/auth/v1/token?grant_type=password`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      apikey: HARDCODED_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`Supabase sign-in HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  const data = text ? JSON.parse(text) : {};
  if (!data?.access_token || !data?.refresh_token) throw new Error('Supabase sign-in: missing tokens');
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: computeExpirySec(data),
  };
}

async function supabaseAuthRefresh(refreshToken) {
  const base = HARDCODED_SUPABASE_URL.replace(/\/+$/, '');
  const endpoint = `${base}/auth/v1/token?grant_type=refresh_token`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      apikey: HARDCODED_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`Supabase refresh HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  const data = text ? JSON.parse(text) : {};
  if (!data?.access_token || !data?.refresh_token) throw new Error('Supabase refresh: missing tokens');
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: computeExpirySec(data),
  };
}

async function getValidSupabaseAccessToken() {
  await loadSupabaseAuthSession();

  const session = supabaseAuthSession;
  const expiry = Number(session?.expires_at);
  const aboutToExpire = Number.isFinite(expiry) ? expiry - nowSec() < 60 : true;

  if (session?.access_token && session?.refresh_token && !aboutToExpire) {
    return session.access_token;
  }

  if (session?.refresh_token) {
    try {
      const refreshed = await supabaseAuthRefresh(session.refresh_token);
      await saveSupabaseAuthSession(refreshed);
      return refreshed.access_token;
    } catch {
    }
  }

  const creds = await getOrCreateAuthCreds();
  try {
    const signupSession = await supabaseAuthSignup(creds.email, creds.password);
    if (signupSession?.access_token) {
      await saveSupabaseAuthSession(signupSession);
      return signupSession.access_token;
    }
  } catch {
  }

  const signedIn = await supabaseAuthSignIn(creds.email, creds.password);
  await saveSupabaseAuthSession(signedIn);
  return signedIn.access_token;
}

function getHostFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

async function uploadTabSessionToSupabase(row) {
  if (!row) return;
  if (!supabaseConfig?.url || !supabaseConfig?.anonKey || !supabaseConfig?.table) return;

  const accessToken = await getValidSupabaseAccessToken();

  const base = supabaseConfig.url.replace(/\/+$/, '');
  const endpoint = `${base}/rest/v1/${encodeURIComponent(supabaseConfig.table)}`;

  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
  } catch (e) {
    console.warn('Supabase fetch threw (network/CORS/permissions?)', {
      endpoint,
      urlConfigured: Boolean(supabaseConfig?.url),
      table: supabaseConfig?.table,
      hasAnonKey: Boolean(supabaseConfig?.anonKey),
      error: String(e?.message || e),
    });
    throw e;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('Supabase upload failed', {
      endpoint,
      status: res.status,
      statusText: res.statusText,
      responseText: text,
    });
    throw new Error(`Supabase HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  }
}

async function enqueueSupabaseRow(row) {
  try {
    const result = await chrome.storage.local.get({ [SUPABASE_QUEUE_KEY]: [] });
    const queue = Array.isArray(result[SUPABASE_QUEUE_KEY]) ? result[SUPABASE_QUEUE_KEY] : [];
    queue.push(row);
    await chrome.storage.local.set({ [SUPABASE_QUEUE_KEY]: queue });
    console.warn('Supabase row queued', { queued: queue.length });
  } catch {
  }
}

async function flushSupabaseQueue() {
  if (flushInProgress) return;
  flushInProgress = true;

  try {
    if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
      flushInProgress = false;
      return;
    }

    const result = await chrome.storage.local.get({ [SUPABASE_QUEUE_KEY]: [] });
    const queue = Array.isArray(result[SUPABASE_QUEUE_KEY]) ? result[SUPABASE_QUEUE_KEY] : [];
    if (!queue.length) {
      flushInProgress = false;
      return;
    }

    const remaining = [];
    for (const row of queue) {
      try {
        await uploadTabSessionToSupabase(row);
      } catch {
        remaining.push(row);
      }
    }
    await chrome.storage.local.set({ [SUPABASE_QUEUE_KEY]: remaining });
    if (remaining.length !== queue.length) {
      console.warn('Supabase queue flushed', { sent: queue.length - remaining.length, remaining: remaining.length });
    }
  } catch {
  } finally {
    flushInProgress = false;
  }
}

function ensureFlushTimer() {
  if (flushTimerId != null) return;
  flushTimerId = setInterval(async () => {
    await flushSupabaseQueue();
  }, 30000);
}

async function finalizeActiveTabSession(reason) {
  const session = activeTabSession;
  activeTabSession = null;
  if (!session) return;

  const endTs = Date.now();
  const durationMs = Math.max(0, endTs - session.startTs);
  if (durationMs < 250) return;

  const id = await ensureInstallId();
  const host = session.host || getHostFromUrl(session.url) || session.url || '-';
  const row = {
    install_id: id,
    tab_id: session.tabId,
    url: session.url,
    host,
    start_ts_ms: session.startTs,
    end_ts_ms: endTs,
    duration_ms: durationMs,
    reason: String(reason || 'unknown'),
  };

  try {
    if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
      console.warn('Supabase config missing; skipping upload. Set chrome.storage.local supabaseUrl + supabaseAnonKey.');
      return;
    }
    await uploadTabSessionToSupabase(row);
  } catch (e) {
    console.warn('Supabase upload failed; queued for retry.', e);
    await enqueueSupabaseRow(row);
  } finally {
    ensureFlushTimer();
    await flushSupabaseQueue();
  }
}

async function startActiveTabSessionForTab(tabId) {
  if (!activeWindowFocused) return;
  if (!tabId) return;

  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    return;
  }

  const url = tab?.url || null;
  if (!url || isRestrictedUrl(url)) return;

  activeTabSession = {
    tabId,
    url,
    host: getHostFromUrl(url) || url,
    startTs: Date.now(),
  };
}

function isRestrictedUrl(url) {
  if (!url) return true;
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('https://chromewebstore.google.com/') ||
    url.startsWith('https://chrome.google.com/webstore')
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getEffectiveTheme() {
  if (themeMode === 'light' || themeMode === 'dark') return themeMode;
  return autoTheme;
}

async function loadThemeSettings() {
  try {
    const result = await chrome.storage.sync.get({
      [THEME_MODE_KEY]: 'auto',
      [AUTO_THEME_KEY]: 'dark',
    });
    themeMode = result[THEME_MODE_KEY] || 'auto';
    autoTheme = result[AUTO_THEME_KEY] === 'light' ? 'light' : 'dark';
  } catch {
    themeMode = 'auto';
    autoTheme = 'dark';
  }
}

function formatRateParts(bytesPerSecond) {
  const kb = bytesPerSecond / 1024;
  if (kb < 1) return { value: '0', unit: 'K' };
  if (kb < 1000) {
    const k = Math.round(kb);
    return { value: String(Math.min(999, k)), unit: 'K' };
  }
  const mb = kb / 1024;
  return { value: mb.toFixed(1), unit: 'M' };
}

function drawIcon(valueText, unitText, state, size, uiTheme) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  const scale = 1.25;
  const isLight = uiTheme === 'light';

  const palette = isLight
    ? {
        textActive: '#111111',
        textIdle: '#444444',
        textError: '#8a4b00',
        bgFill: 'rgba(220, 220, 220, 0.92)',
        bgStroke: 'rgba(0, 0, 0, 0.12)',
        outline: 'rgba(255, 255, 255, 0.90)',
        shadow: 'rgba(255, 255, 255, 0.35)',
      }
    : {
        textActive: '#f3f3f3',
        textIdle: '#b5b5b5',
        textError: '#ffcc00',
        bgFill: 'rgba(0, 0, 0, 0.80)',
        bgStroke: 'rgba(255, 255, 255, 0.10)',
        outline: 'rgba(0, 0, 0, 0.95)',
        shadow: 'rgba(0, 0, 0, 0.65)',
      };

  const textColor =
    state === 'error' ? palette.textError : state === 'idle' ? palette.textIdle : palette.textActive;

  const bgFill = palette.bgFill;
  const bgStroke = palette.bgStroke;

  ctx.clearRect(0, 0, size, size);

  const innerX = 0;
  const innerY = 0;
  const innerW = size;
  const innerH = size;

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const safeValue = typeof valueText === 'string' ? valueText : '';
  const safeUnit = typeof unitText === 'string' ? unitText : '';

  const valueFontPx = clamp(
    Math.round(size * 0.62 * scale),
    Math.round(10 * scale),
    Math.round(size * scale)
  );
  const unitFontPx = clamp(
    Math.round(size * 0.34 * scale),
    Math.round(8 * scale),
    Math.round(size * scale)
  );

  const cx = innerX + innerW / 2;
  const valueCy = innerY + innerH * 0.42;
  const unitCy = innerY + innerH * 0.78;

  const outlineW = size >= 128 ? 6 : size >= 64 ? 5 : size >= 32 ? 4 : 3;
  const shadowBlur = size >= 128 ? 4 : size >= 64 ? 3 : 2;

  function roundRectPath(x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawBackgroundPill() {
    const pad = size >= 64 ? 3 : 2;
    const x = pad;
    const y = pad;
    const w = size - pad * 2;
    const h = size - pad * 2;
    const r = size >= 64 ? 10 : 7;
    roundRectPath(x, y, w, h, r);
    ctx.fillStyle = bgFill;
    ctx.fill();
    ctx.strokeStyle = bgStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawBackgroundPill();

  if (!safeUnit) {
    const oneLineFontPx = clamp(
      Math.round(size * 0.62 * scale),
      Math.round(10 * scale),
      Math.round(size * scale)
    );

    ctx.font = `bold ${oneLineFontPx}px sans-serif`;
    const w = ctx.measureText(safeValue).width;
    const sx = w > 0 ? Math.min(1, innerW / w) : 1;
    const outlineW = size >= 128 ? 6 : size >= 64 ? 5 : size >= 32 ? 4 : 3;
    const shadowBlur = size >= 128 ? 4 : size >= 64 ? 3 : 2;

    ctx.save();
    ctx.translate(cx, innerY + innerH / 2 + 0.5);
    ctx.scale(sx, 1);
    ctx.shadowColor = palette.shadow;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.lineWidth = outlineW;
    ctx.strokeStyle = palette.outline;
    ctx.strokeText(safeValue, 0, 0);
    ctx.shadowBlur = 0;
    ctx.fillStyle = textColor;
    ctx.fillText(safeValue, 0, 0);
    ctx.restore();
  } else {

  ctx.font = `bold ${valueFontPx}px sans-serif`;
  const valueWidth = ctx.measureText(safeValue).width;
  const valueScaleX = valueWidth > 0 ? Math.min(1, innerW / valueWidth) : 1;
  ctx.lineWidth = outlineW;
  ctx.save();
  ctx.translate(cx, valueCy);
  ctx.scale(valueScaleX, 1);
  ctx.shadowColor = palette.shadow;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.strokeStyle = palette.outline;
  ctx.strokeText(safeValue, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = textColor;
  ctx.fillText(safeValue, 0, 0);
  ctx.restore();

  ctx.font = `bold ${unitFontPx}px sans-serif`;
  const unitWidth = ctx.measureText(safeUnit).width;
  const unitScaleX = unitWidth > 0 ? Math.min(1, innerW / unitWidth) : 1;
  ctx.lineWidth = Math.max(2, Math.round(outlineW * 0.75));
  ctx.save();
  ctx.translate(cx, unitCy);
  ctx.scale(unitScaleX, 1);
  ctx.shadowColor = palette.shadow;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.strokeStyle = palette.outline;
  ctx.strokeText(safeUnit, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = textColor;
  ctx.fillText(safeUnit, 0, 0);
  ctx.restore();
  }

  if (state === 'error') {
    ctx.fillStyle = palette.textError;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.font = `bold ${Math.max(8, Math.floor(size * 0.45 * scale))}px sans-serif`;
    ctx.lineWidth = Math.max(2, Math.round(outlineW * 0.6));
    ctx.strokeStyle = palette.outline;
    ctx.strokeText('!', size - 1, 0);
    ctx.fillText('!', size - 1, 0);
  }

  return ctx.getImageData(0, 0, size, size);
}

async function setIcon(tabId, valueText, unitText, state) {
  try {
    if (tabId == null) return;
    try {
      await chrome.tabs.get(tabId);
    } catch {
      return;
    }
    const uiTheme = getEffectiveTheme();
    const img32 = drawIcon(valueText, unitText, state, 32, uiTheme);
    const img64 = drawIcon(valueText, unitText, state, 64, uiTheme);
    const img128 = drawIcon(valueText, unitText, state, 128, uiTheme);
    await chrome.action.setIcon({ tabId, imageData: { 32: img32, 64: img64, 128: img128 } });

    lastRender = { tabId, valueText, unitText, state };
  } catch {
  }
}

async function redrawLastIcon() {
  if (!lastRender.tabId) return;
  await setIcon(lastRender.tabId, lastRender.valueText, lastRender.unitText, lastRender.state);
}

function startTickLoop() {
  if (tickTimerId != null) return;

  tickTimerId = setInterval(async () => {
    const tabId = attachedTabId;
    if (tabId == null) return;

    const bytes = bytesSinceLastTick;
    bytesSinceLastTick = 0;

    if (bytes <= 0) {
      await setIcon(tabId, '0K', '', 'idle');
      return;
    }

    const { value, unit } = formatRateParts(bytes);
    await setIcon(tabId, value, unit, 'active');
  }, 1000);
}

function stopTickLoop() {
  if (tickTimerId == null) return;
  clearInterval(tickTimerId);
  tickTimerId = null;
}

async function detachCurrentTab() {
  if (attachedTabId == null) return;

  const tabId = attachedTabId;
  attachedTabId = null;
  bytesSinceLastTick = 0;

  try {
    await chrome.debugger.detach({ tabId });
  } catch {
  }

  stopTickLoop();
  await setIcon(tabId, '0K', '', 'idle');
}

async function attachToTab(tabId) {
  if (attachedTabId === tabId) return;

  await detachCurrentTab();

  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    await setIcon(tabId, '0K', '', 'error');
    return;
  }

  lastTabUrl = tab.url || null;

  if (isRestrictedUrl(tab.url)) {
    await setIcon(tabId, '0K', '', 'error');
    return;
  }

  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    attachedTabId = tabId;
    bytesSinceLastTick = 0;

    lastTabUrl = tab.url || null;

    await chrome.debugger.sendCommand({ tabId }, 'Network.enable');
    await setIcon(tabId, '0K', '', 'idle');
    startTickLoop();
  } catch {
    await setIcon(tabId, '0K', '', 'error');
    attachedTabId = null;
    stopTickLoop();
  }
}

async function attachToActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs[0];
  if (!tab?.id) return;
  await attachToTab(tab.id);
}

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (source.tabId == null) return;
  if (source.tabId !== attachedTabId) return;

  if (method === 'Network.dataReceived') {
    const delta =
      typeof params?.encodedDataLength === 'number'
        ? params.encodedDataLength
        : typeof params?.dataLength === 'number'
          ? params.dataLength
          : 0;

    if (delta > 0) bytesSinceLastTick += delta;
  }
});

chrome.debugger.onDetach.addListener(async (source) => {
  if (source.tabId == null) return;
  if (source.tabId !== attachedTabId) return;

  const tabId = attachedTabId;
  attachedTabId = null;
  bytesSinceLastTick = 0;
  stopTickLoop();
  await setIcon(tabId, '0K', '', 'error');
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await finalizeActiveTabSession('tab_activated');
  await startActiveTabSessionForTab(tabId);
  await attachToTab(tabId);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeWindowFocused = false;
    await finalizeActiveTabSession('window_blur');
    return;
  }
  activeWindowFocused = true;
  await finalizeActiveTabSession('window_focus_switch');
  try {
    const tabs = await chrome.tabs.query({ active: true, windowId });
    const tab = tabs[0];
    if (tab?.id) await startActiveTabSessionForTab(tab.id);
  } catch {
  }
  await attachToActiveTab();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') return;

  if (message.type === 'getSupabaseAccessToken') {
    (async () => {
      try {
        const token = await getValidSupabaseAccessToken();
        sendResponse({ ok: true, access_token: token });
      } catch (e) {
        sendResponse({ ok: false, error: String(e?.message || e) });
      }
    })();
    return true;
  }

  if (message.type === 'getStatus') {
    (async () => {
      let url = lastTabUrl;
      try {
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const tab = tabs[0];
        if (tab?.url) url = tab.url;
      } catch {
      }

      let site = '-';
      if (url) {
        try {
          site = new URL(url).host;
        } catch {
          site = url;
        }
      }

      const speedText = lastRender.unitText
        ? `${lastRender.valueText}${lastRender.unitText}`
        : lastRender.valueText;
      const statusText =
        lastRender.state === 'active'
          ? 'Measuring'
          : lastRender.state === 'idle'
            ? 'Idle'
            : 'Error';

      sendResponse({
        site,
        speedText,
        statusText,
        pingText: 'N/A',
      });
    })();

    return true;
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (activeTabSession?.tabId === tabId) {
    await finalizeActiveTabSession('tab_removed');
  }
  if (tabId !== attachedTabId) return;
  await detachCurrentTab();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (activeTabSession?.tabId === tabId && typeof changeInfo.url === 'string') {
    const oldUrl = activeTabSession.url;
    const newUrl = changeInfo.url;
    if (oldUrl && newUrl && oldUrl !== newUrl) {
      await finalizeActiveTabSession('url_changed');
      await startActiveTabSessionForTab(tabId);
    }
  }
  if (tabId !== attachedTabId) return;
  if (changeInfo.url && isRestrictedUrl(changeInfo.url)) {
    await detachCurrentTab();
    await setIcon(tabId, '0K', '', 'error');
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await attachToActiveTab();
});

chrome.runtime.onInstalled.addListener(async () => {
  await ensureInstallId();
  await loadSupabaseConfig();
  await attachToActiveTab();
});

attachToActiveTab();

(async () => {
  await ensureInstallId();
  await loadSupabaseConfig();
  ensureFlushTimer();
  await flushSupabaseQueue();
  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs[0];
    if (tab?.id) await startActiveTabSessionForTab(tab.id);
  } catch {
  }
})();

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'sync') return;
  const modeChanged = Boolean(changes[THEME_MODE_KEY]);
  const autoChanged = Boolean(changes[AUTO_THEME_KEY]);
  if (!modeChanged && !autoChanged) return;

  if (modeChanged) {
    themeMode = changes[THEME_MODE_KEY].newValue || 'auto';
  }
  if (autoChanged) {
    autoTheme = changes[AUTO_THEME_KEY].newValue === 'light' ? 'light' : 'dark';
  }

  await redrawLastIcon();
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'local') return;

  const cfgChanged =
    Boolean(changes[SUPABASE_URL_KEY]) ||
    Boolean(changes[SUPABASE_ANON_KEY]) ||
    Boolean(changes[SUPABASE_TABLE_KEY]);
  if (!cfgChanged) return;

  await loadSupabaseConfig();
  ensureFlushTimer();
  await flushSupabaseQueue();
});

(async () => {
  await loadThemeSettings();
  if (attachedTabId != null) {
    await redrawLastIcon();
  }
})();
