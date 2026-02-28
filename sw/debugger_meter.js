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

    if (delta > 0 && activeTabSession && activeTabSession.tabId === source.tabId) {
      activeTabSession.dataBytes = (Number(activeTabSession.dataBytes) || 0) + delta;
    }
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
