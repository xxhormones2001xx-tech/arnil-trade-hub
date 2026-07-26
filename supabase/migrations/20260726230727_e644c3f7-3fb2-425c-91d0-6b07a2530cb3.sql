ALTER TABLE public.account_applications ADD CONSTRAINT account_applications_email_key UNIQUE (email);
ALTER TABLE public.payments ADD CONSTRAINT payments_application_id_key UNIQUE (application_id);