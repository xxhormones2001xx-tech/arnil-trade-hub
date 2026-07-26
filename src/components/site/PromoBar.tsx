import { Link } from "@tanstack/react-router";
import { Gift, ArrowRight } from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-brand text-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold md:gap-3 md:px-6 md:text-sm">
        <Gift className="hidden h-4 w-4 md:block" />
        <span>
          🎉 First-time bonus: <strong>Get $200</strong> when you open an Instant Access account &amp;
          deposit just $10.
        </span>
        <Link to="/open-account" className="hidden items-center gap-1 underline underline-offset-2 md:inline-flex">
          Claim now <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
