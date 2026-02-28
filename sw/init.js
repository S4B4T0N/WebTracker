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

(async () => {
  await loadThemeSettings();
  if (attachedTabId != null) {
    await redrawLastIcon();
  }
})();
