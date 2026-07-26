import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-ink"><TrendingUp className="h-4 w-4" /></span>
            Arnil <span className="text-brand">Etrade</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-background/70">
            A modern brokerage for the next generation of investors. Trade stocks, ETFs, options, futures and crypto — all in one account.
          </p>
        </div>
        <FooterCol title="Products" links={[["Investing","/investing"],["Trading","/trading"],["Retirement","/pricing"],["Markets","/markets"]]} />
        <FooterCol title="Company" links={[["About","/about"],["Pricing","/pricing"],["Contact","/contact"],["Careers","/about"]]} />
        <FooterCol title="Account" links={[["Log in","/login"],["Open account","/open-account"],["Help center","/contact"]]} />
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
