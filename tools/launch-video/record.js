let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const fs = require('fs');
const path = require('path');

const FPS = 30;
const HOST = 'http://127.0.0.1:8935';
const OUT = path.join(__dirname, 'frames');
const DRAFT = process.argv.includes('--draft');
const LIMIT = (() => { const i = process.argv.indexOf('--until'); return i > -1 ? parseFloat(process.argv[i + 1]) : null; })();

// Ablauf des Videos (Sekunden)
const SCENES = [
  { id: 'title', start: 0, end: 3.4 },
  { id: 'home', start: 3.4, end: 9.4, url: '/index.html', kicker: 'Ab sofort online', caption: 'Handgedruckte Pullis – made by Schüler:innen' },
  { id: 'shop', start: 9.4, end: 16.4, url: '/shop.html', kicker: 'Shop', caption: 'Pulli aussuchen, Größe wählen, bestellen' },
  { id: 'pickup', start: 16.4, end: 21.6, url: '/index.html', kicker: 'Abholung an der alten Apotheke', caption: 'Freitags ab 11 Uhr – bar bezahlen' },
  { id: 'special', start: 21.6, end: 25.4, url: '/spezialbestellungen.html', kicker: 'Spezialbestellung', caption: 'Eigenes Motiv für die ganze Klasse?' },
  { id: 'reviews', start: 25.4, end: 28.6, url: '/bewertungen.html', kicker: 'Bewertungen', caption: 'Sag uns, wie dir dein Pulli gefällt' },
  { id: 'end', start: 28.6, end: 34.0 },
];
const TOTAL = LIMIT || SCENES[SCENES.length - 1].end;

const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, k) => a + (b - a) * k;

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { window.__SF_EMULATOR = true; });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(HOST + '/__video/stage.html');
  await page.waitForLoadState('networkidle');
  const frame = await (await page.$('#site')).contentFrame();

  let current = null;
  let info = {};     // pro Szene ermittelte Positionen
  let tap = null;
  const done = new Set();

  async function scrollTo(y) {
    await frame.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(y));
  }
  async function centerOf(selector) {
    return frame.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top + window.scrollY };
    }, selector);
  }
  async function enterScene(sc) {
    tap = null; info = {}; done.clear();
    if (!sc.url) return;
    await frame.goto(HOST + sc.url);
    await frame.waitForLoadState('networkidle').catch(() => {});
    if (sc.id === 'shop') await frame.waitForSelector('.product-card', { timeout: 15000 });
    await frame.waitForTimeout(400);
    await frame.evaluate(() => document.querySelectorAll('.video-btn, [data-video-trigger]').forEach((b) => b.blur()));
    if (sc.id === 'home') info.maxY = 1150;
    if (sc.id === 'shop') { const h = await frame.evaluate(() => { const c = document.querySelector('.product-card'); return c.getBoundingClientRect().bottom + window.scrollY; }); info.cardY = Math.max(0, h - 692 + 24); }
    if (sc.id === 'pickup') info.bannerY = Math.max(0, (await centerOf('.pickup-banner')).top - 250);
    if (sc.id === 'special') info.maxY = 520;
    if (sc.id === 'reviews') info.maxY = 260;
  }
  // einmalige Aktion zu einem Zeitpunkt (mit Tipp-Kreis kurz davor)
  async function once(key, t, at, fn) {
    if (t >= at && !done.has(key)) { done.add(key); await fn(); }
  }
  async function showTap(selector, t) {
    const c = await centerOf(selector);
    if (c) tap = { x: c.x, y: c.y + 46, at: t };
  }
  async function seekVideo(time) {
    await frame.evaluate(async (time) => {
      const v = document.getElementById('pickup-video');
      if (!v) return;
      v.controls = false;
      if (v.readyState < 1) await new Promise((r) => { v.addEventListener('loadedmetadata', r, { once: true }); setTimeout(r, 3000); });
      const target = Math.max(0, Math.min(time, (v.duration || 10) - 0.05));
      if (Math.abs(v.currentTime - target) < 0.001) return;
      await new Promise((r) => { v.addEventListener('seeked', r, { once: true }); v.currentTime = target; setTimeout(r, 1500); });
    }, time);
  }

  const frames = Math.round(TOTAL * FPS);
  for (let i = 0; i < frames; i++) {
    const t = i / FPS;
    const sc = SCENES.find((s) => t >= s.start && t < s.end) || SCENES[SCENES.length - 1];
    if (current !== sc.id) {
      current = sc.id;
      await enterScene(sc);
    }
    const local = t - sc.start;

    // ---------- Szenen-Handlung ----------
    if (sc.id === 'home') {
      await scrollTo(lerp(0, info.maxY, ease((local - 1.0) / 4.6)));
    }
    if (sc.id === 'shop') {
      if (local < 2.5) await scrollTo(lerp(0, info.cardY, ease((local - 0.6) / 1.5)));
      await once('tapTitle', t, sc.start + 2.3, () => showTap('.product-card h3 .link-btn', t));
      await once('openDetail', t, sc.start + 2.6, () => frame.click('.product-card h3 .link-btn'));
      await once('tapAdd', t, sc.start + 4.4, () => showTap('#pd-add', t));
      await once('add', t, sc.start + 4.7, () => frame.click('#pd-add'));
      await once('tapCart', t, sc.start + 5.4, () => showTap('#cart-open-btn', t));
      await once('cart', t, sc.start + 5.7, () => frame.click('#cart-open-btn'));
    }
    if (sc.id === 'pickup') {
      await scrollTo(lerp(0, info.bannerY, ease((local - 0.5) / 0.9)));
      await once('tapVideo', t, sc.start + 1.9, () => showTap('.pickup-banner [data-video-trigger]', t));
      await once('openVideo', t, sc.start + 2.2, () => frame.click('.pickup-banner [data-video-trigger]'));
      if (local > 2.3) await seekVideo(local - 2.3);
    }
    if (sc.id === 'special' || sc.id === 'reviews') {
      await scrollTo(lerp(0, info.maxY, ease((local - 0.7) / (sc.end - sc.start - 1.2))));
    }

    const firstPhone = SCENES.find((s) => s.url);
    await page.evaluate((s) => window.render(s), {
      t, scene: sc.id, sceneStart: sc.start, sceneEnd: sc.end, titleEnd: SCENES[0].end,
      kicker: sc.kicker, caption: sc.caption, tap, draft: DRAFT,
      firstPhoneScene: sc.id === firstPhone.id,
    });
    await page.screenshot({ path: path.join(OUT, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 });
    if (i % 60 === 0) console.log(`Bild ${i}/${frames} (${t.toFixed(1)} s, Szene ${sc.id})`);
  }
  console.log('fertig, Fehler:', errors.length ? errors : 'keine');
  await browser.close();
})().catch((e) => { console.error('Abbruch:', e); process.exit(1); });
