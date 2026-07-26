import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin, adminGetData } from "@/lib/admin.functions";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Arnil Etrade" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Row = Record<string, any>;

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString();
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status ?? "").toLowerCase();
  const variant =
    s === "paid" || s === "verified" || s === "succeeded"
      ? "default"
      : s.includes("pending") || s === "submitted"
      ? "secondary"
      : "outline";
  return <Badge variant={variant as any}>{status ?? "—"}</Badge>;
}

function DataTable({ columns, rows }: { columns: { key: string; label: string; render?: (r: Row) => any }[]; rows: Row[] }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground p-4">No records yet.</p>;
  return (
    <div className="overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-2 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-2 align-top">{c.render ? c.render(r) : (r[c.key] ?? "—")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminPage() {
  const login = useServerFn(adminLogin);
  const fetchData = useServerFn(adminGetData);
  const [password, setPassword] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("admin_pw") ?? "" : ""
  );
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ applications: Row[]; payments: Row[]; otps: Row[]; newsletter: Row[] } | null>(null);

  async function refresh(pw: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData({ data: { password: pw } });
      setData(res);
      setAuthed(true);
      sessionStorage.setItem("admin_pw", pw);
    } catch (e: any) {
      setError(e?.message ?? "Failed");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ data: { password } });
      await refresh(password);
    } catch (e: any) {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <Layout>
        <div className="container max-w-md py-16">
          <Card>
            <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const apps = data?.applications ?? [];
  const payments = data?.payments ?? [];
  const otps = data?.otps ?? [];
  const newsletter = data?.newsletter ?? [];

  const paidCount = payments.filter((p) => p.status === "paid" || p.status === "succeeded").length;
  const verifiedCount = apps.filter((a) => a.status === "verified").length;
  const pendingCount = apps.filter((a) => (a.status ?? "").includes("pending")).length;

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Registrations, payments & OTP verification status</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refresh(password)} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
            <Button variant="ghost" onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthed(false); setPassword(""); }}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{apps.length}</div><p className="text-xs text-muted-foreground">Applications</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{paidCount}</div><p className="text-xs text-muted-foreground">Paid</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{verifiedCount}</div><p className="text-xs text-muted-foreground">OTP Verified</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{pendingCount}</div><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        </div>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">Applications ({apps.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="otps">OTP Codes ({otps.length})</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter ({newsletter.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <DataTable
              rows={apps}
              columns={[
                { key: "created_at", label: "Created", render: (r) => fmt(r.created_at) },
                { key: "name", label: "Name", render: (r) => `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "plan_name", label: "Plan" },
                { key: "account_type", label: "Type" },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "paid_at", label: "Paid at", render: (r) => fmt(r.paid_at) },
              ]}
            />
          </TabsContent>

          <TabsContent value="payments">
            <DataTable
              rows={payments}
              columns={[
                { key: "created_at", label: "Created", render: (r) => fmt(r.created_at) },
                { key: "email", label: "Email" },
                { key: "amount", label: "Amount", render: (r) => `$${(r.amount / 100).toFixed(2)} ${(r.currency ?? "").toUpperCase()}` },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "stripe_session_id", label: "Stripe Session", render: (r) => <code className="text-xs">{r.stripe_session_id?.slice(0, 20) ?? "—"}…</code> },
                { key: "paid_at", label: "Paid at", render: (r) => fmt(r.paid_at) },
              ]}
            />
          </TabsContent>

          <TabsContent value="otps">
            <DataTable
              rows={otps}
              columns={[
                { key: "created_at", label: "Created", render: (r) => fmt(r.created_at) },
                { key: "email", label: "Email" },
                { key: "code", label: "Code", render: (r) => <code>{r.code}</code> },
                { key: "expires_at", label: "Expires", render: (r) => fmt(r.expires_at) },
                { key: "verified_at", label: "Verified", render: (r) => r.verified_at ? <Badge>Verified {fmt(r.verified_at)}</Badge> : <Badge variant="secondary">Pending</Badge> },
              ]}
            />
          </TabsContent>

          <TabsContent value="newsletter">
            <DataTable
              rows={newsletter}
              columns={[
                { key: "subscribed_at", label: "Subscribed", render: (r) => fmt(r.subscribed_at) },
                { key: "email", label: "Email" },
                { key: "source", label: "Source" },
                { key: "unsubscribed_at", label: "Unsubscribed", render: (r) => fmt(r.unsubscribed_at) },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
