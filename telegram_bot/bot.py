"""Einfacher Telegram-Bot mit Kurs-Abfrage.

Start:  TELEGRAM_BOT_TOKEN=123:ABC python telegram_bot/bot.py
"""
import asyncio
import logging
import os
import sys
from pathlib import Path

from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# Kurs-Funktionen aus dem trading-Ordner wiederverwenden
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "trading"))
from fetch_prices import CRYPTO, YAHOO, crypto, safe, yahoo  # noqa: E402

logging.basicConfig(format="%(asctime)s %(levelname)s %(message)s", level=logging.INFO)
log = logging.getLogger("bot")

ALLE = list(CRYPTO) + list(YAHOO)

HILFE = (
    "Befehle:\n"
    "/start – Begrüßung\n"
    "/hilfe – diese Hilfe\n"
    "/kurse – alle Kurse auf einmal\n"
    "/kurs <name> – ein einzelner Kurs, z.B. /kurs bitcoin\n\n"
    "Verfügbar: " + ", ".join(ALLE)
)


def kurs_holen(name: str) -> dict:
    if name in CRYPTO:
        c = safe(crypto)
        return c.get(name, c)
    return safe(yahoo, YAHOO[name])


def zeile(name: str, d: dict) -> str:
    if "error" in d:
        return f"{name}: Fehler ({d['error'][:60]})"
    text = f"{name}: {d['price']:,.2f}"
    if "change_24h_pct" in d:
        text += f" ({d['change_24h_pct']:+.2f}% 24h)"
    elif d.get("sma200"):
        trend = "über" if d["price"] > d["sma200"] else "unter"
        text += f" ({trend} SMA200 {d['sma200']:,.2f})"
    return text


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    name = update.effective_user.first_name if update.effective_user else ""
    await update.message.reply_text(f"Hallo {name}! 👋 Ich bin dein Kurs-Bot.\n\n{HILFE}")


async def hilfe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(HILFE)


async def kurs(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not context.args:
        await update.message.reply_text("Bitte einen Namen angeben, z.B. /kurs gold\n\nVerfügbar: " + ", ".join(ALLE))
        return
    name = context.args[0].lower()
    if name not in ALLE:
        await update.message.reply_text(f"Unbekannt: {name}\nVerfügbar: " + ", ".join(ALLE))
        return
    d = await asyncio.to_thread(kurs_holen, name)
    await update.message.reply_text(zeile(name, d))


async def kurse(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Hole Kurse … ⏳")

    def alle():
        c = safe(crypto)
        out = {n: c.get(n, c) for n in CRYPTO}
        out.update({n: safe(yahoo, s) for n, s in YAHOO.items()})
        return out

    daten = await asyncio.to_thread(alle)
    await update.message.reply_text("\n".join(zeile(n, d) for n, d in daten.items()))


async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(f"Du hast geschrieben: {update.message.text}\n\nTippe /hilfe für alle Befehle.")


def main() -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token:
        sys.exit("Fehler: Umgebungsvariable TELEGRAM_BOT_TOKEN ist nicht gesetzt.")

    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler(["hilfe", "help"], hilfe))
    app.add_handler(CommandHandler("kurs", kurs))
    app.add_handler(CommandHandler("kurse", kurse))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    log.info("Bot läuft – beenden mit Strg+C")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
