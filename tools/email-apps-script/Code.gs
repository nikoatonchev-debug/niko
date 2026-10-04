/**
 * Siebdruck-Schülerfirma – E-Mail „Deine Bestellung ist abholbereit“
 *
 * Läuft als Google-Apps-Script-Web-App im Gmail-Konto der Schülerfirma und
 * verschickt die E-Mail echt aus diesem Gmail-Konto (Gmail-Limit: 100 E-Mails
 * pro Tag, kostenlos, keine eigene Domain nötig).
 *
 * Ablauf: Im Admin-Bereich wird eine Bestellung auf „Abholbereit“ gesetzt. Der
 * Browser schickt dann nur Bestell-Art, Bestell-ID und den Login-Nachweis des
 * Admins (Firebase-ID-Token) hierher. Dieses Skript
 *   1. liest die Bestellung mit genau diesem Login aus Firestore – Google prüft
 *      dabei, ob der Login echt ist, und die Datenbank-Regeln, ob er die
 *      Bestellung sehen darf,
 *   2. prüft, dass der Login der Admin ist und die Bestellung abholbereit ist,
 *   3. holt die (bestätigte) E-Mail-Adresse aus dem Kundenprofil und schickt die
 *      E-Mail.
 * Empfänger und Text kommen also nie vom Browser – niemand kann darüber fremde
 * E-Mails verschicken.
 *
 * Einrichtung: siehe schuelerfirma/README.md („E-Mail abholbereit“).
 */

var PROJECT_ID = 'schuelerfirma-siebdruck';
var ADMIN_EMAILS = ['erdkinderkollektiv@gmail.com'];
var SHOP_NAME = 'Siebdruck-Schülerfirma';
var REPLY_TO = 'erdkinderkollektiv@gmail.com';
var FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';
var COLLECTIONS = ['orders', 'specialOrders'];

// Zum Ausprobieren im Browser: zeigt, ob der Dienst läuft und wie viele E-Mails heute noch gehen.
function doGet() {
  return json({ ok: true, info: 'E-Mail-Dienst der Schülerfirma läuft.', heuteNochMoeglich: MailApp.getRemainingDailyQuota() });
}

function doPost(e) {
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return json(handleReady(req));
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  }
}

function handleReady(req) {
  var token = String(req.idToken || '');
  var collection = String(req.collection || '');
  var id = String(req.orderId || '');
  if (!token || COLLECTIONS.indexOf(collection) < 0 || !/^[A-Za-z0-9]{1,64}$/.test(id)) {
    throw new Error('Ungültige Anfrage.');
  }

  // 1) Mit dem Login des Admins lesen – Firestore prüft Echtheit + Regeln.
  var order = readDoc(collection + '/' + id, token);

  // 2) Login ist echt (sonst hätte Firestore abgelehnt) – ist es der Admin?
  var claims = decodeJwtPayload(token);
  var who = String(claims.email || '').toLowerCase();
  if (claims.email_verified !== true || ADMIN_EMAILS.indexOf(who) < 0) {
    throw new Error('Nur der Admin darf E-Mails auslösen.');
  }
  if (order.status !== 'abholbereit') {
    throw new Error('Die Bestellung ist nicht als abholbereit markiert.');
  }

  // Doppelklick-Schutz: dieselbe Bestellung höchstens einmal in 10 Minuten.
  var cache = CacheService.getScriptCache();
  var key = 'sent_' + collection + '_' + id;
  var before = cache.get(key);
  if (before) return { ok: true, already: true, email: before };

  // 3) Empfänger aus dem Kundenprofil (die Regeln erlauben dort nur die bestätigte Login-Adresse).
  if (!/^[A-Za-z0-9]{1,128}$/.test(String(order.userId || ''))) {
    throw new Error('Diese Bestellung gehört zu keinem Konto mehr.');
  }
  var user = readDoc('users/' + order.userId, token);
  var to = String(user.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    throw new Error('Für dieses Konto ist keine E-Mail-Adresse gespeichert.');
  }
  if (MailApp.getRemainingDailyQuota() < 1) {
    throw new Error('Das Tageslimit von Gmail ist erreicht (100 E-Mails pro Tag). Morgen geht es wieder.');
  }

  var mail = buildMail(collection, id, order);
  MailApp.sendEmail({ to: to, subject: mail.subject, body: mail.text, htmlBody: mail.html, name: SHOP_NAME, replyTo: REPLY_TO });
  cache.put(key, to, 600);
  return { ok: true, email: to, heuteNochMoeglich: MailApp.getRemainingDailyQuota() };
}

function buildMail(collection, id, o) {
  var nr = id.slice(-6).toUpperCase();
  var name = String(o.customerName || o.name || '').slice(0, 60);
  var lines, amount;
  if (collection === 'orders') {
    lines = (o.items || []).map(function (i) {
      return Number(i.qty) + 'x ' + String(i.name || '') + ' (' + String(i.size || '') + ')';
    });
    amount = 'Betrag: ' + euro(o.total) + ' – bitte bar mitbringen.';
  } else {
    lines = ['Spezialbestellung: ' + String(o.wunsch || '').slice(0, 300) + ' (Größe ' + String(o.groesse || '') + ', ' + (Number(o.menge) || 1) + 'x)'];
    amount = 'Den Preis haben wir mit dir am Telefon besprochen – bitte bar mitbringen.';
  }
  var subject = 'Deine Bestellung #' + nr + ' ist abholbereit!';
  var text =
    'Hallo' + (name ? ' ' + name : '') + ',\n\n' +
    'deine Bestellung #' + nr + ' ist fertig und liegt für dich bereit:\n' +
    lines.map(function (l) { return '  • ' + l; }).join('\n') + '\n' +
    amount + '\n\n' +
    'Abholung: freitags ab 11 Uhr bei der alten Apotheke.\n' +
    'Bitte bring deine Bestellnummer #' + nr + ' mit.\n\n' +
    'Viele Grüße\ndeine Siebdruck-Schülerfirma der Montessori-Schule Dietramszell';
  var html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2b2620">' +
    '<p>Hallo' + (name ? ' ' + esc(name) : '') + ',</p>' +
    '<p><strong>deine Bestellung #' + esc(nr) + ' ist fertig und liegt für dich bereit:</strong></p>' +
    '<ul>' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
    '<p>' + esc(amount) + '</p>' +
    '<p style="background:#dcf3dc;padding:10px 12px;border-radius:8px">Abholung: <strong>freitags ab 11 Uhr bei der alten Apotheke</strong>.<br>' +
    'Bitte bring deine Bestellnummer <strong>#' + esc(nr) + '</strong> mit.</p>' +
    '<p>Viele Grüße<br>deine Siebdruck-Schülerfirma der Montessori-Schule Dietramszell</p></div>';
  return { subject: subject, text: text, html: html };
}

// ---------- Hilfsfunktionen ----------

function readDoc(path, token) {
  var url = FIRESTORE_BASE + '/projects/' + PROJECT_ID + '/databases/(default)/documents/' + path;
  var res = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  var code = res.getResponseCode();
  if (code === 400 || code === 401 || code === 403) throw new Error('Keine Berechtigung – bitte im Admin-Bereich neu anmelden.');
  if (code === 404 && path.indexOf('users/') === 0) throw new Error('Für dieses Konto ist keine E-Mail-Adresse gespeichert.');
  if (code === 404) throw new Error('Die Bestellung wurde nicht gefunden.');
  if (code !== 200) throw new Error('Datenbank-Fehler (' + code + ').');
  var doc = JSON.parse(res.getContentText());
  var out = {};
  var f = doc.fields || {};
  Object.keys(f).forEach(function (k) { out[k] = fromValue(f[k]); });
  return out;
}

function fromValue(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) {
    var o = {};
    var f = v.mapValue.fields || {};
    Object.keys(f).forEach(function (k) { o[k] = fromValue(f[k]); });
    return o;
  }
  return null;
}

function decodeJwtPayload(token) {
  var part = String(token).split('.')[1] || '';
  while (part.length % 4) part += '=';
  var bytes = Utilities.base64DecodeWebSafe(part);
  return JSON.parse(Utilities.newBlob(bytes).getDataAsString('UTF-8'));
}

function euro(n) {
  return (Math.round(Number(n || 0) * 100) / 100).toFixed(2).replace('.', ',') + ' €';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
