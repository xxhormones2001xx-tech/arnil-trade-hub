CREATE TABLE public.account_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  country text DEFAULT 'United States',
  account_type text NOT NULL DEFAULT 'Individual brokerage',
  plan_name text NOT NULL DEFAULT 'Standard',
  status text NOT NULL DEFAULT 'pending',
  stripe_customer_id text,
  stripe_session_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.account_applications TO authenticated;
GRANT ALL ON public.account_applications TO service_role;

ALTER TABLE public.account_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON public.account_applications
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

CREATE POLICY "Users can create own applications"
  ON public.account_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (email = auth.email());

CREATE POLICY "Users can update own applications"
  ON public.account_applications
  FOR UPDATE
  TO authenticated
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

CREATE POLICY "Service role can manage applications"
  ON public.account_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.account_applications(id) ON DELETE CASCADE,
  email text NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

CREATE POLICY "Users can create own payments"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (email = auth.email());

CREATE POLICY "Users can update own payments"
  ON public.payments
  FOR UPDATE
  TO authenticated
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

CREATE POLICY "Service role can manage payments"
  ON public.payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.account_applications(id) ON DELETE CASCADE,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.otp_codes TO service_role;

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage otp_codes"
  ON public.otp_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_account_applications_updated_at
  BEFORE UPDATE ON public.account_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();