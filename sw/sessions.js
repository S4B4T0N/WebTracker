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
    data_bytes: Number(session.dataBytes) || 0,
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
    dataBytes: 0,
  };
}

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
