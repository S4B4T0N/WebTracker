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

      const speedText = lastRender.unitText ? `${lastRender.valueText}${lastRender.unitText}` : lastRender.valueText;
      const statusState = lastRender.state === 'active' ? 'active' : lastRender.state === 'idle' ? 'idle' : 'error';
      const statusText = statusState === 'active' ? 'Measuring' : statusState === 'idle' ? 'Idle' : 'Error';

      sendResponse({
        site,
        speedText,
        statusState,
        statusText,
        pingText: 'N/A',
      });
    })();

    return true;
  }
});
