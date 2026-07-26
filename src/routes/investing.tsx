import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PieChart, Target, TrendingUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/investing")({
  head: () => ({
    meta: [
      { title: "Investing — Arnil Etrade" },
      { name: "description", content: "Build long-term wealth with commission-free stocks, ETFs, mutual funds and IRAs at Arnil Etrade." },
      { property: "og:title", content: "Investing — Arnil Etrade" },
      { property: "og:description", content: "Commission-free stocks, ETFs, mutual funds and retirement accounts." },
    ],
  }),
  component: Investing,
});

function Investing() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Investing"
        title="Build wealth for the long run."
        desc="Diversify with 10,000+ stocks and ETFs, curated portfolios, and tax-advantaged retirement accounts — all with zero commissions."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        {[
          { icon: TrendingUp, title: "Stocks & ETFs", desc: "10,000+ US listings. Fractional shares from $1." },
          { icon: PieChart, title: "Mutual Funds", desc: "Access to 6,000+ no-transaction-fee funds." },
          { icon: Target, title: "Managed Portfolios", desc: "Automated investing tuned to your goals." },
          { icon: ShieldCheck, title: "Retirement (IRA)", desc: "Traditional, Roth and Rollover — no account fees." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 hover:border-brand/50 transition">
            <c.icon className="h-8 w-8 text-brand" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="font-display text-4xl font-bold text-ink">Automated investing, personalized.</h2>
            <p className="mt-4 text-muted-foreground">Answer a few questions and we'll build a diversified portfolio matched to your goals, timeline and risk. Automatic rebalancing and tax-loss harvesting included.</p>
            <Link to="/open-account" className="mt-8 inline-flex rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85">Start investing</Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground">Sample portfolio allocation</p>
            <div className="mt-6 space-y-4">
              {[["US Stocks", 55], ["International", 20], ["Bonds", 15], ["Real Estate", 7], ["Cash", 3]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-sm"><span className="text-ink font-medium">{l}</span><span className="text-muted-foreground">{v}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function PageHero({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <section className="bg-ink text-background">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-background/75">{desc}</p>
      </div>
    </section>
  );
}
