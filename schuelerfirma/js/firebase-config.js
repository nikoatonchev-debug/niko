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
 * „Abholbereit“ gesetzt wird. Verschickt aus dem Gmail-Konto der Schülerfirma
 * über ein kleines Google-Apps-Script (tools/email-apps-script/Code.gs).
 * Hier steht nur dessen Web-App-Adresse – die ist nicht geheim, denn das Skript
 * verschickt nur, wenn der angemeldete Admin es auslöst. Leer = keine E-Mails.
 * Einrichtung: siehe README. */
window.SF_MAIL_URL = "https://script.google.com/macros/s/AKfycby3t_F7d5o5ek1WFwadabp_BmqaUyRQFn2sR3GgiSOGDR70Lez-4eQWf0sMqIU27TQe/exec";

// Rechnungsnummern (1, 2, 3 …), Rechnung per E-Mail und selbst erstellte
// Rechnungen. Erst auf true stellen, wenn die neuen Datenbank-Regeln
// (firestore.rules) und der neue Apps-Script-Code veröffentlicht sind –
// vorher würden Bestellungen mit den neuen Feldern abgelehnt.
window.SF_INVOICES_LIVE = true;
