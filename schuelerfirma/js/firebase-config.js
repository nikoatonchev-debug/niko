/* Zugangsdaten zum Firebase-Projekt "schuelerfirma-siebdruck".
 *
 * Diese Werte sind NICHT geheim: Sie stehen bei jeder Firebase-Website
 * oeffentlich im Code. Geschuetzt werden die Daten durch die Regeln in
 * firestore.rules (laufen auf Googles Servern), nicht durch dieses Verstecken.
 * Empfohlen: In der Google Cloud Console den API-Schluessel auf die eigene
 * Domain beschraenken (siehe README).
 */
window.SF_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDzHG35rub17qiRg7_1bvpYCMBJEDA1kaE",
  authDomain: "schuelerfirma-siebdruck.firebaseapp.com",
  projectId: "schuelerfirma-siebdruck",
  storageBucket: "schuelerfirma-siebdruck.firebasestorage.app",
  messagingSenderId: "709887316589",
  appId: "1:709887316589:web:8b109d466e19d16546a564",
};

/* Nur fuer die Anzeige im Admin-Bereich. Wer wirklich Admin ist, entscheiden
 * allein die Regeln in firestore.rules (isAdmin). */
window.SF_ADMIN_EMAILS = ["erdkinderkollektiv@gmail.com"];

/* E-Mail an die Kundschaft, sobald eine Bestellung im Admin-Bereich auf
 * „Abholbereit“ gesetzt wird. Verschickt über EmailJS (emailjs.com) aus dem
 * Gmail-Konto der Schülerfirma. Auch diese drei Werte sind öffentlich gedacht
 * (stehen bei jeder EmailJS-Website im Code). Leer = keine E-Mails.
 * Einrichtung: siehe README. */
window.SF_EMAILJS = {
  serviceId: "",
  templateId: "",
  publicKey: "",
};
