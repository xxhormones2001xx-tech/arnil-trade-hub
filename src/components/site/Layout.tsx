import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { PromoBar } from "./PromoBar";
import { CookieConsent } from "./CookieConsent";

export function SiteLayout({ children, ticker = true, promo = true }: { children: ReactNode; ticker?: boolean; promo?: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {promo && <PromoBar />}
      <Header />
      {ticker && <Ticker />}
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
