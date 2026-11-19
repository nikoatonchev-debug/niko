# Telegram-Bot

Ein einfacher Telegram-Bot, der Kurse (Bitcoin, Ethereum, DAX, S&P 500, Gold, Aktien …) abfragt.
Er nutzt die Funktionen aus `trading/fetch_prices.py`.

## 1. Bot bei Telegram anlegen

1. In Telegram **@BotFather** öffnen.
2. `/newbot` senden, Namen und Benutzernamen (muss auf `bot` enden) wählen.
3. Den **Token** kopieren (sieht aus wie `123456789:AAH...`). Niemandem zeigen und nicht ins Repo committen!

## 2. Installieren und starten

```bash
pip install -r telegram_bot/requirements.txt
export TELEGRAM_BOT_TOKEN="DEIN_TOKEN"      # Windows PowerShell: $env:TELEGRAM_BOT_TOKEN="DEIN_TOKEN"
python telegram_bot/bot.py
```

Der Bot läuft, solange das Programm läuft. Dann in Telegram den Bot suchen und `/start` schicken.

## Befehle

| Befehl | Was passiert |
|---|---|
| `/start` | Begrüßung + Hilfe |
| `/hilfe` | Liste aller Befehle |
| `/kurse` | Alle Kurse auf einmal |
| `/kurs bitcoin` | Ein einzelner Kurs |
| normaler Text | Bot antwortet mit einem Echo |

## Eigene Befehle hinzufügen

In `bot.py` eine neue `async def`-Funktion schreiben und in `main()` mit
`app.add_handler(CommandHandler("name", funktion))` registrieren.
