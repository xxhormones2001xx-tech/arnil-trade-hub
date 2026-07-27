import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListPlans, adminUpsertPlan, adminDeletePlan } from "@/lib/plans.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

type Plan = {
  id?: string;
  name: string;
  price: string;
  period: string;
  tag: string;
  cta: string;
  features: string[];
  featured: boolean;
  sort_order: number;
  active: boolean;
  amount_cents: number;
  currency: string;
};

const emptyPlan: Plan = {
  name: "",
  price: "$0",
  period: "",
  tag: "",
  cta: "Open account",
  features: [],
  featured: false,
  sort_order: 0,
  active: true,
  amount_cents: 0,
  currency: "usd",
};

export function PlansManager({ password }: { password: string }) {
  const list = useServerFn(adminListPlans);
  const upsert = useServerFn(adminUpsertPlan);
  const del = useServerFn(adminDeletePlan);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await list({ data: { password } });
      setPlans((res.plans as Plan[]) ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setErr(null);
    try {
      await upsert({ data: { password, plan: editing } });
      setEditing(null);
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plan?")) return;
    try {
      await del({ data: { password, id } });
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to delete");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span>Plans & Pricing</span>
          <Button size="sm" onClick={() => setEditing({ ...emptyPlan, sort_order: (plans.length + 1) * 10 })}>
            <Plus className="mr-1 h-4 w-4" /> New plan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {err && <p className="text-sm text-destructive">{err}</p>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {plans.map((p) => (
              <div key={p.id} className="rounded-md border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold truncate">{p.name}</h4>
                      {p.featured && <Badge>Featured</Badge>}
                      {!p.active && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.price} · {p.period} · {p.amount_cents > 0 ? `$${(p.amount_cents / 100).toFixed(2)} charge` : "Free"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.tag}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => p.id && handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h3 className="font-semibold">{editing.id ? "Edit plan" : "New plan"}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Tag (badge text)" value={editing.tag} onChange={(v) => setEditing({ ...editing, tag: v })} />
              <Field label="Price label (shown on card, e.g. $50, $0, 0.25%)" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              <Field label="Period (e.g. one-time, per trade)" value={editing.period} onChange={(v) => setEditing({ ...editing, period: v })} />
              <Field label="CTA button text" value={editing.cta} onChange={(v) => setEditing({ ...editing, cta: v })} />
              <Field
                label="Charge amount in USD (Stripe charges this, e.g. 1 = $1, 50 = $50, 0 = free)"
                type="number"
                value={(editing.amount_cents / 100).toString()}
                onChange={(v) => {
                  const dollars = parseFloat(v || "0") || 0;
                  const cents = Math.round(dollars * 100);
                  setEditing({
                    ...editing,
                    amount_cents: cents,
                    price: cents > 0 ? `$${dollars % 1 === 0 ? dollars : dollars.toFixed(2)}` : "$0",
                  });
                }}
              />
              <Field
                label="Sort order"
                type="number"
                value={String(editing.sort_order)}
                onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v || "0", 10) || 0 })}
              />
              <Field label="Currency" value={editing.currency} onChange={(v) => setEditing({ ...editing, currency: v })} />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                Featured (highlight card)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                Active (visible on site)
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">Features (one per line)</label>
              <textarea
                value={(editing.features ?? []).join("\n")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  })
                }
                rows={6}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="One feature per line"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} disabled={saving || !editing.name}>
                {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                Save plan
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
    </div>
  );
}
