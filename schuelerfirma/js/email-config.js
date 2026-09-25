/* Konfiguration für den E-Mail-Versand der Bestätigungscodes.
 *
 * So richtet ihr das ein (kostenlos, keine Kreditkarte nötig):
 * 1. Kostenloses Konto auf https://www.emailjs.com anlegen.
 * 2. Unter "Email Services" einen Dienst verbinden (z. B. euer Gmail-Konto)
 *    -> ihr bekommt eine SERVICE_ID (z. B. "service_abc1234").
 * 3. Unter "Email Templates" eine Vorlage anlegen mit den Variablen
 *    {{to_email}} und {{code}} im Text (z. B. "Euer Code: {{code}}")
 *    -> ihr bekommt eine TEMPLATE_ID (z. B. "template_xyz789").
 * 4. Unter "Account" -> "General" den "Public Key" kopieren.
 * 5. Alle drei Werte hier unten eintragen und speichern.
 *
 * Solange hier noch die Platzhalter stehen, zeigt die Website den Code
 * stattdessen direkt auf dem Bildschirm an (Demo-Modus) - die Anmeldung
 * funktioniert also auch ohne diese Einrichtung schon zum Ausprobieren.
 */

const SF_EMAIL_CONFIG = {
  SERVICE_ID: "service_1upcgr9",
  TEMPLATE_ID: "template_wyhlhpf",
  PUBLIC_KEY: "d7je2VB4CAjz42K1E",
};

function sfEmailIsConfigured() {
  return (
    SF_EMAIL_CONFIG.SERVICE_ID !== "DEIN_SERVICE_ID" &&
    SF_EMAIL_CONFIG.TEMPLATE_ID !== "DEIN_TEMPLATE_ID" &&
    SF_EMAIL_CONFIG.PUBLIC_KEY !== "DEIN_PUBLIC_KEY"
  );
}
