import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import hero from "@/assets/hero-trading.jpg";
import { ArrowRight, ShieldCheck, Zap, LineChart, Bitcoin, PieChart, Smartphone, Star, Gift, CheckCircle2, Lock, Award, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arnil Etrade — Online Investing & Trading Platform" },
      { name: "description", content: "Open an Arnil Etrade brokerage account. Zero-commission stocks & ETFs, options, futures, and crypto with pro-grade tools." },
      { property: "og:title", content: "Arnil Etrade — Online Investing & Trading Platform" },
      { property: "og:description", content: "Open an Arnil Etrade brokerage account. Zero-commission stocks & ETFs, options, futures, and crypto with pro-grade tools." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-background">
        <img src={hero} alt="" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 md:grid-cols-2 md:px-6 md:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Gift className="h-3.5 w-3.5" /> New client offer — Get $200 bonus
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
              Invest in your future.<br />Start with just <span className="text-brand">$10.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-background/75">
              Open an Instant Access brokerage account and deposit as little as $10 to unlock a
              <strong className="text-background"> $200 welcome bonus</strong>. Trade stocks, ETFs, options and crypto — commission-free, withdraw anytime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/open-account" className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-ink transition hover:bg-brand/90">
                Claim $200 bonus <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 rounded-md border border-background/20 px-6 py-3 font-semibold text-background transition hover:bg-background/10">
                See pricing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-background/70">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" /> SIPC protected</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-brand" /> 4.8 average rating</span>
              <span>2.4M+ investors</span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 rounded-2xl bg-brand/20 blur-3xl" />
            <div className="relative rounded-2xl border border-background/10 bg-background/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-background/60">Portfolio</p>
                  <p className="mt-1 font-display text-3xl font-bold">$248,392.14</p>
                  <p className="text-sm text-brand">+ $4,182.90 (1.72%) today</p>
                </div>
                <div className="rounded-md border border-brand/30 bg-brand/10 px-2 py-1 text-xs font-semibold text-brand">LIVE</div>
              </div>
              <MiniChart />
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {[["AAPL","+1.32%"],["NVDA","+2.41%"],["TSLA","-1.22%"]].map(([s,c]) => (
                  <div key={s} className="rounded-lg border border-background/10 bg-background/5 p-3">
                    <p className="font-semibold">{s}</p>
                    <p className={c.startsWith("+") ? "text-brand" : "text-danger"}>{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-6">
          {[
            ["$0", "Commissions on stocks & ETFs"],
            ["2.4M+", "Active investors"],
            ["$180B", "Assets under custody"],
            ["24/7", "Human support"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-bold text-ink">{n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">What you can trade</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">One account. Every market.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: LineChart, title: "Stocks & ETFs", desc: "Invest in 10,000+ US stocks and ETFs, commission-free." },
            { icon: PieChart, title: "Options & Futures", desc: "Advanced tools, low contract fees, and pro strategy builders." },
            { icon: Bitcoin, title: "Crypto", desc: "Trade BTC, ETH and 40+ coins 24/7 with tight spreads." },
            { icon: ShieldCheck, title: "Retirement (IRA)", desc: "Traditional, Roth and Rollover IRAs with no account fees." },
            { icon: Smartphone, title: "Mobile app", desc: "Native iOS and Android apps rated 4.8 stars." },
            { icon: Zap, title: "Instant funding", desc: "Deposit and start trading in minutes with instant settlement." },
          ].map((c) => (
            <div key={c.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-brand/50 hover:shadow-lg">
              <c.icon className="h-8 w-8 text-brand" />
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section className="bg-ink text-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-2 md:items-center md:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">Platform</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Pro-grade tools without the complexity.</h2>
            <p className="mt-4 max-w-lg text-background/70">
              Advanced charts, level-2 quotes, options chains and screeners — the same tools professionals use, redesigned for clarity.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Real-time streaming quotes", "50+ technical indicators", "Custom watchlists & alerts", "Paper trading sandbox"].map((f) => (
                <li key={f} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-ink">✓</span>{f}</li>
              ))}
            </ul>
            <Link to="/trading" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand hover:gap-3 transition-all">
              Explore the platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-background/10 bg-background/5 p-2">
            <img src={hero} alt="Trading dashboard" width={1600} height={1008} loading="lazy" className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* BONUS OFFER */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink via-ink to-ink/85 p-10 text-background md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                <Gift className="h-3.5 w-3.5" /> Limited-time welcome offer
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Get a <span className="text-brand">$200</span> registration bonus.
              </h2>
              <p className="mt-4 max-w-lg text-background/75">
                Open your <strong className="text-background">Instant Access</strong> account and deposit at least $10 to instantly receive a $200 trading bonus. Trade freely, withdraw anytime — no lock-in period.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  ["Create your Instant Access account", "Fast KYC, same-day activation"],
                  ["Deposit at least $10", "Card, ACH or wire — instant settlement"],
                  ["Receive your $200 bonus", "Credited to your balance immediately"],
                  ["Withdraw anytime", "No holding period, no hidden fees"],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <span><strong className="text-background">{t}.</strong> <span className="text-background/70">{d}.</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/open-account" className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-ink hover:bg-brand/90">
                  Claim $200 bonus <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/faq" className="inline-flex items-center gap-2 rounded-md border border-background/20 px-6 py-3 font-semibold hover:bg-background/10">
                  Offer terms
                </Link>
              </div>
              <p className="mt-4 text-xs text-background/50">
                *New clients only. Requires Instant Access plan activation and minimum $10 deposit. Bonus credited to trading balance and withdrawable at any time.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-brand/20 blur-3xl" />
              <div className="relative rounded-2xl border border-background/10 bg-background/5 p-8 backdrop-blur">
                <p className="text-xs uppercase tracking-widest text-background/60">Bonus preview</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <p className="font-display text-6xl font-bold text-brand">$200</p>
                  <p className="text-sm text-background/60">welcome credit</p>
                </div>
                <div className="mt-6 space-y-3 border-t border-background/10 pt-6 text-sm">
                  <Row label="Minimum deposit" value="$10" />
                  <Row label="Activation" value="Instant" />
                  <Row label="Withdrawal lock-up" value="None" />
                  <Row label="Bonus expiry" value="Never" />
                  <Row label="Eligible plan" value="Instant Access" />
                </div>
                <Link to="/open-account" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-ink hover:bg-brand/90">
                  Open Instant Access — $50 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4 md:px-6">
          {[
            [ShieldCheck, "SIPC protected", "Accounts insured up to $500,000 by SIPC."],
            [Lock, "Bank-level security", "256-bit encryption and MFA on every account."],
            [Award, "Award-winning", "Rated 4.8 by 120k+ investors worldwide."],
            [Clock, "24/7 support", "Real humans, real answers, day or night."],
          ].map(([Icon, t, d]) => (
            <div key={t as string} className="flex gap-4">
              <Icon className="h-8 w-8 shrink-0 text-brand" />
              <div>
                <p className="font-display font-semibold text-ink">{t as string}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-ink to-ink/80 p-10 text-background md:p-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold md:text-5xl">Ready to start? Fund with $10, get <span className="text-brand">$200.</span></h2>
              <p className="mt-4 text-background/70">No account minimums. Takes about 5 minutes.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/open-account" className="rounded-md bg-brand px-6 py-3 font-semibold text-ink hover:bg-brand/90">Open account</Link>
              <Link to="/pricing" className="rounded-md border border-background/20 px-6 py-3 font-semibold hover:bg-background/10">See offer details</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-background/60">{label}</span>
      <span className="font-semibold text-background">{value}</span>
    </div>
  );
}

function MiniChart() {
  const pts = [20, 24, 22, 28, 26, 32, 30, 36, 34, 40, 38, 46, 44, 52, 50, 58, 62];
  const w = 400, h = 120;
  const step = w / (pts.length - 1);
  const max = Math.max(...pts), min = Math.min(...pts);
  const y = (v: number) => h - ((v - min) / (max - min)) * (h - 10) - 5;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${y(p)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-6 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.19 145)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.72 0.19 145)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={d} fill="none" stroke="oklch(0.72 0.19 145)" strokeWidth="2" />
    </svg>
  );
}
