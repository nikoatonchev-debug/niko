// Nimmt das Launch-Video Bild für Bild auf (1080x1920, 30 fps) und schreibt die
// Zeitpunkte für Klick- und Wisch-Geräusche nach cues.json (für audio/mix.sh).
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const fs = require('fs');
const path = require('path');

const FPS = 30;
const HOST = 'http://127.0.0.1:8935';
const OUT = path.join(__dirname, 'frames');
const DRAFT = process.argv.includes('--draft');
const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? parseFloat(process.argv[i + 1]) : null; };
const FROM = arg('--from') || 0;
const DURATION = 30.5;
const STILLS = (() => { const i = process.argv.indexOf('--stills'); return i > -1 ? process.argv[i + 1].split(',').map(Number) : null; })();
const UNTIL = arg('--until') || (STILLS ? Math.max(...STILLS) + 0.05 : DURATION);

// Szenenwechsel (gleich wie T in stage.html)
const T = { reveal: 3.0, shop: 8.3, pickup: 13.0, special: 18.75, end: 24.85 };
const WISH = 'Klassenpulli mit unserem eigenen Logo – 24 Stück für die 8b';

const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, k) => a + (b - a) * k;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (STILLS) fs.mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { window.__SF_EMULATOR = true; });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(HOST + '/__video/stage.html');
  await page.evaluate(() => window.stageReady);
  const frame = await (await page.$('#site')).contentFrame();

  const cues = [
    { t: T.reveal - 0.2, sfx: 'swish' }, { t: T.shop - 0.35, sfx: 'swish' }, { t: T.end - 0.2, sfx: 'swish' },
    { t: 6.85, sfx: 'stamp' }, { t: 15.6, sfx: 'pop' }, { t: 16.95, sfx: 'pop' }, { t: 23.7, sfx: 'pop' }, { t: 25.75, sfx: 'pop' },
  ];
  let tap = null;
  const done = new Set();
  const info = {};

  const scrollTo = (y) => frame.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(y));
  const centerOf = (sel) => frame.evaluate((sel) => {
    const el = document.querySelector(sel); if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  }, sel);
  async function load(url, waitSel) {
    await frame.goto(HOST + url);
    await frame.waitForLoadState('networkidle').catch(() => {});
    if (waitSel) await frame.waitForSelector(waitSel, { timeout: 15000 });
    await frame.evaluate(() => document.fonts.ready);
    await frame.waitForTimeout(300);
  }
  // einmalige Aktion ab Zeitpunkt `at`
  async function once(key, t, at, fn) { if (t >= at && !done.has(key)) { done.add(key); await fn(); } }
  async function showTap(sel, t) {
    const c = await centerOf(sel);
    if (c) { tap = { x: c.x, y: c.y + 46, at: t }; cues.push({ t, sfx: 'click' }); }
  }
  async function seekVideo(time) {
    await frame.evaluate(async (time) => {
      const v = document.getElementById('pickup-video'); if (!v) return;
      v.controls = false;
      if (v.readyState < 2) await new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); setTimeout(r, 3000); });
      const target = Math.max(0, Math.min(time, (v.duration || 10) - 0.05));
      if (Math.abs(v.currentTime - target) < 0.001) return;
      await new Promise((r) => { v.addEventListener('seeked', r, { once: true }); v.currentTime = target; setTimeout(r, 1500); });
    }, time);
  }

  // Bildschirm kurz abblenden, während die nächste Seite lädt
  const coverAt = (t) => {
    let c = 0;
    for (const s of [T.pickup, T.special]) {
      if (t >= s - 0.22 && t < s) c = Math.max(c, (t - (s - 0.22)) / 0.22);
      if (t >= s && t < s + 0.3) c = Math.max(c, 1 - (t - s) / 0.3);
    }
    return c;
  };

  let scene = null;
  const total = Math.round(UNTIL * FPS);
  for (let i = 0; i < total; i++) {
    const t = i / FPS;

    // ---------- Seiten laden ----------
    const want = t < T.pickup ? 'shop' : t < T.special ? 'pickup' : 'special';
    if (want !== scene) {
      scene = want; tap = null;
      if (want === 'shop') {
        await load('/shop.html', '.product-card');
        info.cardY = Math.max(0, (await centerOf('.product-card')).bottom - 692 + 24);
      } else if (want === 'pickup') {
        await load('/index.html');
        info.bannerY = Math.max(0, (await centerOf('.pickup-banner')).top - 230);
      } else {
        await load('/spezialbestellungen.html', '#sp-wunsch');
        info.formY = Math.max(0, (await centerOf('#sp-wunsch')).top - 330);
      }
    }

    // ---------- Handlung im Handy ----------
    if (want === 'shop') {
      if (t < 9.3) await scrollTo(lerp(0, info.cardY, ease((t - 8.5) / 0.75)));
      await once('tTitle', t, 9.15, () => showTap('.product-card h3 .link-btn', t));
      await once('title', t, 9.3, () => frame.click('.product-card h3 .link-btn'));
      await once('tSize', t, 9.85, () => showTap('#pd-size', t));
      await once('size', t, 10.05, () => frame.evaluate(() => {
        const s = document.getElementById('pd-size'); if ([...s.options].some((o) => o.value === 'M')) s.value = 'M';
        s.dispatchEvent(new Event('change', { bubbles: true })); s.blur();
      }));
      await once('tAdd', t, 10.85, () => showTap('#pd-add', t));
      await once('add', t, 11.0, () => frame.click('#pd-add'));
      await once('tCart', t, 11.5, () => showTap('#cart-open-btn', t));
      await once('cart', t, 11.65, () => frame.click('#cart-open-btn'));
    }
    if (want === 'pickup') {
      await scrollTo(lerp(0, info.bannerY, ease((t - (T.pickup + 0.25)) / 0.7)));
      await once('tVideo', t, 13.9, () => showTap('.pickup-banner [data-video-trigger]', t));
      await once('video', t, 14.05, () => frame.click('.pickup-banner [data-video-trigger]'));
      if (t > 14.15) await seekVideo(t - 14.15);
    }
    if (want === 'special') {
      await scrollTo(lerp(0, info.formY, ease((t - (T.special + 0.25)) / 0.8)));
      await once('tWish', t, 20.2, () => showTap('#sp-wunsch', t));
      await once('focus', t, 20.3, () => frame.focus('#sp-wunsch'));
      if (t >= 20.4) {
        const n = Math.round(WISH.length * Math.min(1, (t - 20.4) / 2.5));
        await frame.evaluate((v) => { const el = document.getElementById('sp-wunsch'); if (el.value !== v) el.value = v; }, WISH.slice(0, n));
      }
    }

    await page.evaluate((s) => window.render(s), { t, tap, draft: DRAFT, cover: coverAt(t) });
    if (t < FROM) continue;
    const still = STILLS && STILLS.find((x) => Math.round(x * FPS) === i);
    if (STILLS && still === undefined) continue;
    await page.screenshot({ path: STILLS ? path.join(__dirname, 'stills', `t${still.toFixed(2)}.jpg`) : path.join(OUT, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 });
    if (i % 60 === 0) console.log(`Bild ${i}/${total} (${t.toFixed(1)} s)`);
  }
  // Tipp-Geräusche etwas leiser als Akzente; Liste nach Zeit sortiert
  if (!STILLS) fs.writeFileSync(path.join(__dirname, 'cues.json'), JSON.stringify(cues.sort((a, b) => a.t - b.t).map((c) => ({ t: +c.t.toFixed(3), sfx: c.sfx })), null, 1));
  console.log('fertig, Fehler:', errors.length ? errors : 'keine');
  await browser.close();
})().catch((e) => { console.error('Abbruch:', e); process.exit(1); });
