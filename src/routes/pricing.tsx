import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Arnil Etrade" },
      { name: "description", content: "Zero commissions on stocks and ETFs. Transparent, low pricing on options, futures and crypto." },
      { property: "og:title", content: "Pricing — Arnil Etrade" },
      { property: "og:description", content: "Transparent, low pricing across every market." },
    ],
  }),
  component: Pricing,
});

const plans = [
  { name: "Standard", price: "$0", tag: "Most popular", features: ["Commission-free stocks & ETFs", "Fractional shares from $1", "Mobile & web platforms", "24/7 support"] },
  { name: "Active Trader", price: "$0", tag: "For frequent traders", features: ["Everything in Standard", "$0.50 per options contract", "Advanced charts & Level 2", "Priority routing"], featured: true },
  { name: "Wealth", price: "0.25%", tag: "Managed portfolios", features: ["Automated investing", "Tax-loss harvesting", "Human advisor access", "No account minimum"] },
];

function Pricing() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Pricing" title="Transparent pricing. No hidden fees." desc="Zero commissions on stocks and ETFs. Pay only for what you use." />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-8 ${p.featured ? "border-brand bg-ink text-background shadow-2xl" : "border-border bg-card"}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${p.featured ? "text-brand" : "text-muted-foreground"}`}>{p.tag}</p>
              <h3 className={`mt-2 font-display text-2xl font-bold ${p.featured ? "text-background" : "text-ink"}`}>{p.name}</h3>
              <p className={`mt-4 font-display text-5xl font-bold ${p.featured ? "text-background" : "text-ink"}`}>{p.price}</p>
              <p className={`mt-1 text-sm ${p.featured ? "text-background/60" : "text-muted-foreground"}`}>per trade / per year</p>
              <ul className="mt-8 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 ${p.featured ? "text-background/90" : "text-ink"}`}>
                    <Check className="mt-0.5 h-4 w-4 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/open-account" className={`mt-8 block rounded-md px-6 py-3 text-center font-semibold ${p.featured ? "bg-brand text-ink hover:bg-brand/90" : "bg-ink text-background hover:bg-ink/85"}`}>Get started</Link>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-ink">Detailed pricing</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody className="bg-card">
                {[
                  ["US stocks & ETFs (online)", "$0"],
                  ["Options — per contract", "$0.50"],
                  ["Futures — per contract, per side", "$1.50"],
                  ["Crypto spread", "~1.0%"],
                  ["Mutual funds (no-load, NTF)", "$0"],
                  ["Broker-assisted trade", "$25"],
                  ["Account maintenance", "$0"],
                  ["Domestic wire transfer", "$25"],
                ].map(([l, v]) => (
                  <tr key={l} className="border-t border-border first:border-0">
                    <td className="px-5 py-4 text-ink">{l}</td>
                    <td className="px-5 py-4 text-right font-semibold text-ink">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
