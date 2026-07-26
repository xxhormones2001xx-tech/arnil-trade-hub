import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const doSubscribe = useServerFn(subscribeNewsletter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      await doSubscribe({ data: { email } });
      setSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-6 md:px-6">
        <div className="md:col-span-2">
          <Logo className="h-9 w-auto" invert />

          <p className="mt-4 max-w-sm text-sm text-background/70">
            A modern brokerage for the next generation of investors. Trade stocks, ETFs, options, futures and crypto — all in one account.
          </p>
          <address className="mt-5 space-y-2 text-sm not-italic text-background/70">
            <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand" /><span>403 Cummins Street<br />Franklin, Tennessee 37064</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /><a href="mailto:support@arniletrade.com" className="hover:text-brand">support@arniletrade.com</a></div>
            <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-brand" /><a href="https://wa.me/16626071912" target="_blank" rel="noopener" className="hover:text-brand">WhatsApp: +1 662 607-1912</a></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /><span>+1 662 607-1912</span></div>
          </address>
        </div>
        <FooterCol title="Products" links={[["Investing","/investing"],["Trading","/trading"],["Retirement","/pricing"],["Markets","/markets"]]} />
        <FooterCol title="Company" links={[["About","/about"],["Pricing","/pricing"],["Contact","/contact"],["FAQ","/faq"]]} />
        <FooterCol title="Account" links={[["Log in","/login"],["Open account","/open-account"],["Help center","/contact"]]} />
        <div>
          <h4 className="font-display text-sm font-semibold text-background">Newsletter</h4>
          <p className="mt-4 text-sm text-background/70">Market insights, weekly.</p>
          {subscribed ? (
            <p className="mt-3 text-sm text-brand">Thanks! You're subscribed.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="rounded-md border border-background/20 bg-background/10 px-3 py-2 text-sm text-background placeholder:text-background/40 outline-none focus:border-brand"
              />
              {error && <p className="text-xs text-danger">{error}</p>}
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-ink hover:bg-brand/90 disabled:opacity-50">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-background/60 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Arnil Etrade. All rights reserved.</p>
          <p>Securities products are offered by Arnil Etrade Securities LLC. Investing involves risk.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-background">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-background/70">
        {links.map(([label, to]) => (
          <li key={label}><Link to={to} className="hover:text-brand">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
