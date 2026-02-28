let attachedTabId = null;
let bytesSinceLastTick = 0;
let tickTimerId = null;

const THEME_MODE_KEY = 'themeMode';
const AUTO_THEME_KEY = 'autoTheme';

const INSTALL_ID_KEY = 'installId';

const SUPABASE_AUTH_EMAIL_KEY = 'supabaseAuthEmail';
const SUPABASE_AUTH_PASSWORD_KEY = 'supabaseAuthPassword';
const SUPABASE_AUTH_SESSION_KEY = 'supabaseAuthSession';

const HARDCODED_SUPABASE_URL = 'https://whryujjatvqqrlawmxqy.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indocnl1amphdHZxcXJsYXdteHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDI3NzAsImV4cCI6MjA4NzI3ODc3MH0.Kn5NlWFgEdOICny3WmRfHf8PdukQ6nPyn2lhZreJF4c';

const SUPABASE_QUEUE_KEY = 'supabaseQueue';
const SUPABASE_QUEUE_MAX_SIZE = 500;

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

function getHostFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
