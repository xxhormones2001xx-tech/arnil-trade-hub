import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = () =>
  createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

function checkPassword(pw: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || pw !== expected) throw new Error("Unauthorized");
}

const planSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  price: z.string().default("$0"),
  period: z.string().default(""),
  tag: z.string().default(""),
  cta: z.string().default("Open account"),
  features: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
  amount_cents: z.number().int().min(0).default(0),
  currency: z.string().default("usd"),
});

export const adminListPlans = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const sb = supabaseAdmin();
    const res = await sb.from("plans").select("*").order("sort_order", { ascending: true });
    return { plans: res.data ?? [] };
  });

export const adminUpsertPlan = createServerFn({ method: "POST" })
  .validator((d) =>
    z.object({ password: z.string().min(1), plan: planSchema }).parse(d)
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const sb = supabaseAdmin();
    const payload = { ...data.plan, features: data.plan.features };
    if (data.plan.id) {
      const { id, ...rest } = payload;
      const { error } = await sb.from("plans").update(rest).eq("id", id!);
      if (error) throw new Error(error.message);
    } else {
      const { id: _ignore, ...rest } = payload;
      const { error } = await sb.from("plans").insert(rest);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeletePlan = createServerFn({ method: "POST" })
  .validator((d) =>
    z.object({ password: z.string().min(1), id: z.string().uuid() }).parse(d)
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const sb = supabaseAdmin();
    const { error } = await sb.from("plans").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
