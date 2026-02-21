let attachedTabId = null;
let bytesSinceLastTick = 0;
let tickTimerId = null;

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

function formatRate(bytesPerSecond) {
  const kb = bytesPerSecond / 1024;
  if (kb < 1) return '0K';
  if (kb < 1000) {
    const k = Math.round(kb);
    return `${Math.min(999, k)}K`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)}M`;
}

async function setBadgeForTab(tabId, text) {
  try {
    await chrome.action.setBadgeText({ tabId, text });
  } catch {
  }
}

async function clearBadge(tabId) {
  await setBadgeForTab(tabId, '');
}

function startTickLoop() {
  if (tickTimerId != null) return;

  tickTimerId = setInterval(async () => {
    const tabId = attachedTabId;
    if (tabId == null) return;

    const bytes = bytesSinceLastTick;
    bytesSinceLastTick = 0;

    const text = formatRate(bytes);
    await setBadgeForTab(tabId, text === '0K' ? '' : text);
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

  await clearBadge(tabId);

  stopTickLoop();
}

async function attachToTab(tabId) {
  if (attachedTabId === tabId) return;

  await detachCurrentTab();

  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    return;
  }

  if (isRestrictedUrl(tab.url)) {
    await clearBadge(tabId);
    return;
  }

  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    attachedTabId = tabId;
    bytesSinceLastTick = 0;

    await chrome.debugger.sendCommand({ tabId }, 'Network.enable');
    startTickLoop();
  } catch {
    await clearBadge(tabId);
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
  await clearBadge(tabId);
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await attachToTab(tabId);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  await attachToActiveTab();
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId !== attachedTabId) return;
  await detachCurrentTab();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (tabId !== attachedTabId) return;
  if (changeInfo.url && isRestrictedUrl(changeInfo.url)) {
    await detachCurrentTab();
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await attachToActiveTab();
});

chrome.runtime.onInstalled.addListener(async () => {
  await attachToActiveTab();
});

attachToActiveTab();
