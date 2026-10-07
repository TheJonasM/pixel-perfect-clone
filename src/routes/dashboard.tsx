import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { faTriangleExclamation, faHouseCircleCheck, faHandHoldingHeart, faUsers } from "@fortawesome/free-solid-svg-icons";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PawFinds" },
      { name: "description", content: "Your rescue overview: active alerts, reunions, map activity, donations and community." },
      { property: "og:title", content: "Dashboard — PawFinds" },
      { property: "og:description", content: "Rescue activity at a glance." },
    ],
  }),
  component: Dashboard,
});

const KPIS = [
  { label: "Active alerts", value: "312", delta: "+12%", icon: faTriangleExclamation, tone: "bg-coral/15 text-coral" },
  { label: "Pets reunited", value: "1,284", delta: "+8%", icon: faHouseCircleCheck, tone: "bg-mint/15 text-mint" },
  { label: "Donations", value: "$48.2k", delta: "+21%", icon: faHandHoldingHeart, tone: "bg-violet/15 text-violet" },
  { label: "Community", value: "9.4k", delta: "+5%", icon: faUsers, tone: "bg-amber/20 text-amber" },
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activity = days.map((d, i) => ({ d, alerts: 40 + ((i * 17) % 30), reunions: 20 + ((i * 11) % 25) }));
const donations = days.map((d, i) => ({ d, v: 3 + ((i * 7) % 9) }));
const species = [
  { name: "Dogs", v: 58, c: "var(--coral)" },
  { name: "Cats", v: 32, c: "var(--violet)" },
  { name: "Other", v: 10, c: "var(--mint)" },
];

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border bg-card p-5 shadow-soft ${className}`}>
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-4 h-56">{children}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold tracking-tight">Good evening, Yonatan</h1>
      <p className="text-muted-foreground">Here's what's happening across your rescue radius.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="lift rounded-3xl border bg-card p-5 shadow-soft">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${k.tone}`}><Icon icon={k.icon} /></span>
            <div className="mt-4 text-3xl font-extrabold tracking-tight">{k.value}</div>
            <div className="mt-1 flex justify-between text-sm text-muted-foreground"><span>{k.label}</span><span className="font-semibold text-mint">{k.delta}</span></div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Map activity — this week" className="lg:col-span-2">
          <ResponsiveContainer>
            <AreaChart data={activity}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--coral)" stopOpacity={0.4} /><stop offset="1" stopColor="var(--coral)" stopOpacity={0} /></linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--violet)" stopOpacity={0.4} /><stop offset="1" stopColor="var(--violet)" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="alerts" stroke="var(--coral)" strokeWidth={2.5} fill="url(#ga)" />
              <Area type="monotone" dataKey="reunions" stroke="var(--violet)" strokeWidth={2.5} fill="url(#gb)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Alerts by species">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={species} dataKey="v" innerRadius={60} outerRadius={88} paddingAngle={4} stroke="none">
                {species.map((s) => <Cell key={s.name} fill={s.c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Donations (k$)" className="lg:col-span-3">
          <ResponsiveContainer>
            <BarChart data={donations}>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="v" radius={[10, 10, 10, 10]} fill="var(--mint)" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </AppShell>
  );
}
