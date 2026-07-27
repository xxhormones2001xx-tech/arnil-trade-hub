import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin, adminGetData, adminGetLiveStats } from "@/lib/admin.functions";
import { SiteLayout as Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlansManager } from "@/components/admin/PlansManager";

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
  const fetchLive = useServerFn(adminGetLiveStats);
  const [password, setPassword] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("admin_pw") ?? "" : ""
  );
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ applications: Row[]; payments: Row[]; otps: Row[]; newsletter: Row[] } | null>(null);
  const [live, setLive] = useState<{ liveCount: number; liveUsers: Row[]; uniqueToday: number; totalViews: number; recent: Row[] } | null>(null);

  useEffect(() => {
    if (!authed || !password) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetchLive({ data: { password } });
        if (!cancelled) setLive(res);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [authed, password, fetchLive]);

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
        <div className="mx-auto max-w-md px-4 py-16">
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
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-6">
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

        <Tabs defaultValue="pulse">
          <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1">
            <TabsTrigger value="pulse">🟢 Live Pulse</TabsTrigger>
            <TabsTrigger value="users">👥 User Details</TabsTrigger>
            <TabsTrigger value="plans">💰 Plans</TabsTrigger>
            <TabsTrigger value="applications">Applications ({apps.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="otps">OTP Codes ({otps.length})</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter ({newsletter.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pulse">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                  </span>
                  Live Visitors
                  <Badge variant="secondary" className="ml-2">auto-refresh 1s</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="rounded-md border p-4">
                    <div className="text-3xl font-bold text-emerald-600">{live?.liveCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Online now (last 60s)</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-3xl font-bold">{live?.uniqueToday ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Unique visitors (24h)</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-3xl font-bold">{live?.totalViews ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total page views</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Currently online</h3>
                  <DataTable
                    rows={live?.liveUsers ?? []}
                    columns={[
                      { key: "created_at", label: "Last seen", render: (r) => fmt(r.created_at) },
                      { key: "ip", label: "IP", render: (r) => <code className="text-xs">{r.ip ?? "—"}</code> },
                      { key: "country", label: "Country" },
                      { key: "path", label: "Page" },
                      { key: "user_agent", label: "Device", render: (r) => <span className="text-xs text-muted-foreground">{(r.user_agent ?? "").slice(0, 60)}</span> },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Details — Recent Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  rows={live?.recent ?? []}
                  columns={[
                    { key: "created_at", label: "Time", render: (r) => fmt(r.created_at) },
                    { key: "ip", label: "IP", render: (r) => <code className="text-xs">{r.ip ?? "—"}</code> },
                    { key: "country", label: "Country" },
                    { key: "path", label: "Page" },
                    { key: "user_agent", label: "Device", render: (r) => <span className="text-xs text-muted-foreground">{(r.user_agent ?? "").slice(0, 80)}</span> },
                    { key: "referrer", label: "Referrer", render: (r) => <span className="text-xs text-muted-foreground">{(r.referrer ?? "").slice(0, 40) || "—"}</span> },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <PlansManager password={password} />
          </TabsContent>


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
