"""Holt aktuelle Kurse (Bitcoin, DAX, S&P 500) und schreibt sie nach kurse.json."""
import json
import urllib.request
from datetime import datetime, timezone

UA = {"User-Agent": "Mozilla/5.0 (kurs-check)"}


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.load(resp)


def bitcoin():
    data = get_json(
        "https://api.coingecko.com/api/v3/simple/price"
        "?ids=bitcoin&vs_currencies=usd,eur&include_24hr_change=true&include_last_updated_at=true"
    )["bitcoin"]
    return {
        "usd": data["usd"],
        "eur": data["eur"],
        "change_24h_pct": round(data["usd_24h_change"], 2),
        "time": datetime.fromtimestamp(data["last_updated_at"], timezone.utc).isoformat(),
        "source": "coingecko",
    }


def yahoo_index(symbol):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=1y&interval=1d"
    result = get_json(url)["chart"]["result"][0]
    meta = result["meta"]
    closes = [c for c in result["indicators"]["quote"][0]["close"] if c is not None]
    sma200 = sum(closes[-200:]) / len(closes[-200:]) if closes else None
    return {
        "price": meta["regularMarketPrice"],
        "previous_close": meta.get("chartPreviousClose"),
        "last_closes": [round(c, 2) for c in closes[-5:]],
        "sma200": round(sma200, 2) if sma200 else None,
        "time": datetime.fromtimestamp(meta["regularMarketTime"], timezone.utc).isoformat(),
        "source": "yahoo",
    }


def safe(fn, *args):
    try:
        return fn(*args)
    except Exception as exc:  # eine Quelle darf ausfallen, ohne alles zu stoppen
        return {"error": str(exc)}


out = {
    "fetched_at": datetime.now(timezone.utc).isoformat(),
    "bitcoin": safe(bitcoin),
    "dax": safe(yahoo_index, "%5EGDAXI"),
    "sp500": safe(yahoo_index, "%5EGSPC"),
}
with open("kurse.json", "w") as f:
    json.dump(out, f, indent=2)
print(json.dumps(out, indent=2))
