const tickers = [
  ["AAPL", "193.42", "+1.32%", true],
  ["MSFT", "378.85", "+0.75%", true],
  ["GOOGL", "128.96", "+1.10%", true],
  ["AMZN", "181.59", "-0.35%", false],
  ["TSLA", "175.64", "-1.22%", false],
  ["NVDA", "912.44", "+2.41%", true],
  ["META", "489.20", "+0.88%", true],
  ["S&P 500", "5,278.40", "+0.65%", true],
  ["NASDAQ", "18,556.89", "+0.83%", true],
  ["DOW", "38,997.66", "-0.27%", false],
  ["BTC/USD", "67,834.21", "+2.31%", true],
  ["ETH/USD", "3,789.12", "+1.15%", true],
  ["GOLD", "2,385.45", "+1.26%", true],
] as const;

export function Ticker() {
  const items = [...tickers, ...tickers];
  return (
    <div className="overflow-hidden border-y border-border bg-ink text-background">
      <div className="ticker-scroll flex w-max gap-8 py-3">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap px-4 text-sm">
            <span className="font-semibold">{t[0]}</span>
            <span className="text-background/80">{t[1]}</span>
            <span className={t[3] ? "text-brand" : "text-danger"}>{t[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
