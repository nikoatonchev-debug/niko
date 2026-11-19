"""Holt aktuelle Kurse (Krypto, Indizes, Rohstoffe, Devisen, Aktien) und schreibt sie nach kurse.json."""
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone

UA = {"User-Agent": "Mozilla/5.0 (kurs-check)"}

CRYPTO = {"bitcoin": "bitcoin", "ethereum": "ethereum"}
YAHOO = {
    "dax": "^GDAXI",
    "sp500": "^GSPC",
    "nasdaq100": "^NDX",
    "gold": "GC=F",
    "oel_brent": "BZ=F",
    "eur_usd": "EURUSD=X",
    "nvidia": "NVDA",
    "apple": "AAPL",
    "tesla": "TSLA",
    "sap": "SAP.DE",
}


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.load(resp)


def crypto():
    ids = ",".join(CRYPTO.values())
    data = get_json(
        "https://api.coingecko.com/api/v3/simple/price"
        f"?ids={ids}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true"
    )
    out = {}
    for name, cid in CRYPTO.items():
        d = data[cid]
        out[name] = {
            "price": d["usd"],
            "change_24h_pct": round(d["usd_24h_change"], 2),
            "time": datetime.fromtimestamp(d["last_updated_at"], timezone.utc).isoformat(),
        }
    return out


def yahoo(symbol):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}?range=1y&interval=1d"
    result = get_json(url)["chart"]["result"][0]
    meta = result["meta"]
    closes = [c for c in result["indicators"]["quote"][0]["close"] if c is not None]
    last200 = closes[-200:]
    return {
        "price": round(meta["regularMarketPrice"], 4),
        "last_closes": [round(c, 4) for c in closes[-5:]],
        "sma200": round(sum(last200) / len(last200), 4) if last200 else None,
        "time": datetime.fromtimestamp(meta["regularMarketTime"], timezone.utc).isoformat(),
    }


def safe(fn, *args):
    try:
        return fn(*args)
    except Exception as exc:  # eine Quelle darf ausfallen, ohne alles zu stoppen
        return {"error": str(exc)}


out = {"fetched_at": datetime.now(timezone.utc).isoformat()}
c = safe(crypto)
for name in CRYPTO:
    out[name] = c.get(name, c)
for name, symbol in YAHOO.items():
    out[name] = safe(yahoo, symbol)

with open("kurse.json", "w") as f:
    json.dump(out, f, indent=1)
print(json.dumps(out, indent=1))
