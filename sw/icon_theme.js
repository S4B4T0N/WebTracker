function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
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
