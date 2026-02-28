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
