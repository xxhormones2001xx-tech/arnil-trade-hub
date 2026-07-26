import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";

export function SiteLayout({ children, ticker = true }: { children: ReactNode; ticker?: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {ticker && <Ticker />}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
