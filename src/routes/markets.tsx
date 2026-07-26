import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";

const stocks = [
  ["AAPL", "Apple Inc.", "193.42", "+1.32%", true],
  ["MSFT", "Microsoft Corp.", "378.85", "+0.75%", true],
  ["GOOGL", "Alphabet Inc.", "128.96", "+1.10%", true],
  ["AMZN", "Amazon.com Inc.", "181.59", "-0.35%", false],
  ["NVDA", "NVIDIA Corp.", "912.44", "+2.41%", true],
  ["TSLA", "Tesla, Inc.", "175.64", "-1.22%", false],
  ["META", "Meta Platforms", "489.20", "+0.88%", true],
  ["JPM", "JPMorgan Chase", "198.32", "+0.42%", true],
  ["BAC", "Bank of America", "38.11", "-0.19%", false],
  ["V", "Visa Inc.", "275.60", "+0.55%", true],
] as const;

const indices = [
  ["S&P 500", "5,278.40", "+0.65%", true],
  ["NASDAQ 100", "18,556.89", "+0.83%", true],
  ["DOW JONES", "38,997.66", "-0.27%", false],
  ["RUSSELL 2000", "2,109.13", "+1.05%", true],
  ["FTSE 100", "8,320.55", "+0.23%", true],
  ["NIKKEI 225", "38,405.66", "-0.17%", false],
] as const;

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — Arnil Etrade" },
      { name: "description", content: "Live quotes, top movers, and global indices across US and international markets." },
      { property: "og:title", content: "Markets — Arnil Etrade" },
      { property: "og:description", content: "Live quotes and top movers across global markets." },
    ],
  }),
  component: Markets,
});

function Markets() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Markets" title="Live quotes. Global reach." desc="Track indices, top movers and your watchlist in real time." />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">Global indices</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indices.map(([n, p, c, up]) => (
            <div key={n as string} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{n}</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">{p}</p>
              <p className={`mt-1 text-sm font-semibold ${up ? "text-brand" : "text-danger"}`}>{c}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl font-bold text-ink">Most active stocks</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Symbol</th>
                <th className="px-5 py-3 text-left font-medium">Company</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {stocks.map(([s, n, p, c, up]) => (
                <tr key={s as string} className="border-t border-border">
                  <td className="px-5 py-3 font-semibold text-ink">{s}</td>
                  <td className="px-5 py-3 text-muted-foreground">{n}</td>
                  <td className="px-5 py-3 text-right text-ink">${p}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${up ? "text-brand" : "text-danger"}`}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
