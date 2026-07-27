
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price text NOT NULL DEFAULT '$0',
  period text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  cta text NOT NULL DEFAULT 'Open account',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  amount_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.plans TO anon;
GRANT SELECT ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON public.plans FOR SELECT
  USING (active = true);

CREATE POLICY "Service role manages plans"
  ON public.plans FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.plans (name, price, period, tag, cta, featured, sort_order, amount_cents, features) VALUES
  ('Instant Access', '$50', 'one-time', 'Best value — $200 bonus', 'Claim $200 bonus', true, 1, 5000,
    '["🎁 $200 registration bonus with $10 deposit","Same-day account activation","Priority KYC review","Dedicated onboarding specialist","Instant deposit up to $1,000","Withdraw anytime — no lock-up"]'::jsonb),
  ('Standard', '$0', 'per trade', 'Most popular', 'Open account', false, 2, 0,
    '["Commission-free stocks & ETFs","Fractional shares from $1","Mobile & web platforms","24/7 support"]'::jsonb),
  ('Active Trader', '$0', 'per trade', 'For frequent traders', 'Open account', false, 3, 0,
    '["Everything in Standard","$0.50 per options contract","Advanced charts & Level 2","Priority routing"]'::jsonb),
  ('Wealth', '0.25%', 'per year', 'Managed portfolios', 'Open account', false, 4, 0,
    '["Automated investing","Tax-loss harvesting","Human advisor access","No account minimum"]'::jsonb);
