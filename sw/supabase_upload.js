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
    let queue = Array.isArray(result[SUPABASE_QUEUE_KEY]) ? result[SUPABASE_QUEUE_KEY] : [];
    queue.push(row);
    if (queue.length > SUPABASE_QUEUE_MAX_SIZE) {
      queue = queue.slice(queue.length - SUPABASE_QUEUE_MAX_SIZE);
    }
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
