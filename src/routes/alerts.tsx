import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AlertCard } from "@/components/AlertCard";
import { ALERTS, type Status } from "@/lib/data";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Active Pet Alerts — PawFinds" },
      { name: "description", content: "Browse lost, found and sighted pets near you and help bring them home." },
      { property: "og:title", content: "Active Pet Alerts — PawFinds" },
      { property: "og:description", content: "Lost, found and sighted pets that need your help." },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const [tab, setTab] = useState<"all" | Status>("all");
  const list = ALERTS.filter((a) => tab === "all" || a.status === tab);
  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">{list.length} pets need your eyes today</p>
        </div>
        <div className="flex gap-1 rounded-2xl bg-muted p-1">
          {(["all", "pending", "active", "reunited"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {list.map((p) => <AlertCard key={p.id} pin={p} />)}
      </div>
    </AppShell>
  );
}
