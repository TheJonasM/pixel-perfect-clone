import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  faPaw, faMagnifyingGlass, faMoon, faSun, faGauge, faMapLocationDot,
  faTriangleExclamation, faUsers, faBuilding, faHandsHolding, faCalendarDays, faHeart,
  faComments, faDog, faGear, faShieldHalved, faPlus, faRightFromBracket, faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";
import { supabase } from "@/integrations/supabase/client";
import { initials, useSession } from "@/hooks/use-session";

type NavItem = { label: string; icon: IconDefinition; to?: "/dashboard" | "/map" | "/alerts" | "/community" | "/my-reports" };
const NAV: NavItem[] = [
  { label: "Dashboard", icon: faGauge, to: "/dashboard" },
  { label: "Map", icon: faMapLocationDot, to: "/map" },
  { label: "Alerts", icon: faTriangleExclamation, to: "/alerts" },
  { label: "My reports", icon: faDog, to: "/my-reports" },
  { label: "Community", icon: faUsers, to: "/community" },
  { label: "Organizations", icon: faBuilding },
  { label: "Volunteers", icon: faHandsHolding },
  { label: "Events", icon: faCalendarDays },
  { label: "Donations", icon: faHeart },
  { label: "Messages", icon: faComments },
  { label: "Settings", icon: faGear },
  { label: "Admin", icon: faShieldHalved },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow dark:text-navy">
        <Icon icon={faPaw} />
      </span>
      <span className="text-lg font-extrabold tracking-tight">PawFinds</span>
    </Link>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pf-theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-muted transition">
      <Icon icon={dark ? faSun : faMoon} />
    </button>
  );
}

export function UserMenu() {
  const { user, name, ready } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  if (!ready) return <span className="ml-1 h-9 w-9 animate-pulse rounded-full bg-muted" />;
  if (!user) return <Link to="/auth" className="ml-1 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted">Log in</Link>;
  const signOut = async () => {
    setOpen(false);
    await qc.cancelQueries();
    qc.removeQueries({ queryKey: ["my-reports"] });
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <div ref={ref} className="relative ml-1">
      <button onClick={() => setOpen((o) => !o)} aria-label="Account menu" className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground dark:text-navy">
        {initials(name)}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-2xl border bg-card p-2 shadow-float">
          <div className="px-3 py-2"><div className="truncate text-sm font-bold">{name}</div><div className="truncate text-xs text-muted-foreground">{user.email}</div></div>
          <Link to="/my-reports" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted"><Icon icon={faDog} fixedWidth />My reports</Link>
          <Link to="/report/new" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted"><Icon icon={faBullhorn} fixedWidth />Report a pet</Link>
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-coral hover:bg-muted"><Icon icon={faRightFromBracket} fixedWidth />Log out</button>
        </div>
      )}
    </div>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); navigate({ to: "/alerts", search: { q: q.trim() || undefined } }); };
  return (
    <form onSubmit={submit} className="mx-auto hidden w-full max-w-xl items-center gap-3 rounded-xl bg-muted px-4 py-2.5 text-sm text-muted-foreground md:flex">
      <Icon icon={faMagnifyingGlass} />
      <input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pets by name, area or description…" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
    </form>
  );
}

export function AppShell({ children, fullBleed }: { children: ReactNode; fullBleed?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-[1000] grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-x-0 border-t-0 px-4 lg:px-6">
        <Logo />
        <HeaderSearch />
        <div className="flex items-center gap-1 justify-self-end">
          <Link to="/report/new" className="hidden items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-bold text-primary-foreground sm:flex dark:text-navy"><Icon icon={faBullhorn} />Report</Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col gap-0.5 overflow-y-auto border-r bg-sidebar p-3 lg:flex">
          {NAV.map((n) => {
            const active = n.to && path === n.to;
            const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            }`;
            return n.to ? (
              <Link key={n.label} to={n.to} className={cls}>
                <Icon icon={n.icon} className="w-4" fixedWidth /> {n.label}
              </Link>
            ) : (
              <span key={n.label} className={cls + " cursor-default opacity-70"} title="Coming soon">
                <Icon icon={n.icon} className="w-4" fixedWidth /> {n.label}
                <span className="ml-auto text-[10px] uppercase tracking-wider">Soon</span>
              </span>
            );
          })}
        </aside>
        <main className={`min-w-0 flex-1 pb-24 lg:pb-0 ${fullBleed ? "" : "p-4 lg:p-8"}`}>{children}</main>
      </div>

      {/* Mobile bottom nav + FAB */}
      <nav className="glass fixed inset-x-3 bottom-3 z-[1000] grid grid-cols-5 items-center rounded-2xl px-2 py-2 shadow-float lg:hidden">
        {([
          ["/dashboard", faGauge, "Home"],
          ["/map", faMapLocationDot, "Map"],
          [null, faPlus, "Report"],
          ["/alerts", faTriangleExclamation, "Alerts"],
          ["/my-reports", faDog, "Mine"],
        ] as const).map(([to, icon, label]) =>
          to ? (
            <Link key={label} to={to} className={`flex flex-col items-center gap-1 py-1 text-[11px] font-semibold ${path === to ? "text-coral" : "text-muted-foreground"}`}>
              <Icon icon={icon} className="text-lg" /> {label}
            </Link>
          ) : (
            <Link key={label} to="/report/new" aria-label="Report a pet" className="mx-auto -mt-8 grid h-14 w-14 place-items-center rounded-full bg-brand text-xl text-primary-foreground shadow-glow dark:text-navy">
              <Icon icon={icon} />
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
