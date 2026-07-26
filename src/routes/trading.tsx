import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";
import { Zap, LineChart, PieChart, Bitcoin } from "lucide-react";

export const Route = createFileRoute("/trading")({
  head: () => ({
    meta: [
      { title: "Trading Platform — Arnil Etrade" },
      { name: "description", content: "Trade options, futures and crypto with pro-grade tools, advanced charts, and low fees at Arnil Etrade." },
      { property: "og:title", content: "Trading — Arnil Etrade" },
      { property: "og:description", content: "Pro-grade options, futures and crypto trading tools." },
    ],
  }),
  component: Trading,
});

function Trading() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Trading" title="A platform built for active traders." desc="Real-time streaming data, advanced options chains, and lightning-fast order execution." />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        {[
          { icon: PieChart, title: "Options", desc: "$0.50/contract. Multi-leg strategies and risk analysis." },
          { icon: LineChart, title: "Futures", desc: "Access to 60+ futures markets with low margin rates." },
          { icon: Bitcoin, title: "Crypto", desc: "24/7 trading on 40+ coins with tight spreads." },
          { icon: Zap, title: "Fast execution", desc: "Sub-100ms average order routing and fills." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 hover:border-brand/50 transition">
            <c.icon className="h-8 w-8 text-brand" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <h2 className="max-w-2xl font-display text-4xl font-bold text-ink">Tools that pros trust.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Advanced charts", "50+ indicators, custom studies, drawing tools."],
              ["Level 2 quotes", "See market depth and time & sales in real time."],
              ["Strategy builder", "Design and back-test multi-leg options strategies."],
              ["Screeners", "Filter markets by 100+ fundamental and technical criteria."],
              ["Alerts", "Price, volume and news alerts across devices."],
              ["Paper trading", "Practice risk-free with simulated capital."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
