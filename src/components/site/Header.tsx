import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/investing", label: "Investing" },
  { to: "/trading", label: "Trading" },
  { to: "/markets", label: "Markets" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-brand"><TrendingUp className="h-4 w-4" /></span>
          Arnil <span className="text-brand">Etrade</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-muted-foreground transition hover:text-ink" activeProps={{ className: "text-ink" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-semibold text-ink hover:text-brand">Log in</Link>
          <Link to="/open-account" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-background transition hover:bg-ink/85">Open account</Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm font-medium text-ink hover:bg-muted">{n.label}</Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm font-medium text-ink hover:bg-muted">Log in</Link>
            <Link to="/open-account" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-ink px-3 py-2 text-center text-sm font-semibold text-background">Open account</Link>
          </div>
        </div>
      )}
    </header>
  );
}
