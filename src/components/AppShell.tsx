import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  faPaw, faMagnifyingGlass, faBell, faMoon, faSun, faGauge, faSatelliteDish, faMapLocationDot,
  faTriangleExclamation, faUsers, faBuilding, faHandsHolding, faCalendarDays, faHeart,
  faComments, faDog, faGear, faShieldHalved, faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";

type NavItem = { label: string; icon: IconDefinition; to?: "/dashboard" | "/map" | "/alerts" | "/community" };
const NAV: NavItem[] = [
  { label: "Dashboard", icon: faGauge, to: "/dashboard" },
  { label: "Radar", icon: faSatelliteDish, to: "/map" },
  { label: "Map", icon: faMapLocationDot, to: "/map" },
  { label: "Alerts", icon: faTriangleExclamation, to: "/alerts" },
  { label: "Community", icon: faUsers, to: "/community" },
  { label: "Organizations", icon: faBuilding },
  { label: "Volunteers", icon: faHandsHolding },
  { label: "Events", icon: faCalendarDays },
  { label: "Donations", icon: faHeart },
  { label: "Messages", icon: faComments },
  { label: "My Pets", icon: faDog },
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

export function AppShell({ children, fullBleed }: { children: ReactNode; fullBleed?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-[1000] grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-x-0 border-t-0 px-4 lg:px-6">
        <Logo />
        <div className="mx-auto hidden w-full max-w-xl items-center gap-3 rounded-xl bg-muted px-4 py-2.5 text-sm text-muted-foreground md:flex">
          <Icon icon={faMagnifyingGlass} />
          <input aria-label="Search" placeholder="Search pets, places, shelters…" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          <kbd className="rounded-md border px-1.5 text-xs">⌘K</kbd>
        </div>
        <div className="flex items-center gap-1 justify-self-end">
          <ThemeToggle />
          <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-muted">
            <Icon icon={faBell} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral" />
          </button>
          <button className="ml-1 hidden rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted sm:block">Log in</button>
          <span aria-label="Profile" className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground dark:text-navy">YM</span>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col gap-0.5 overflow-y-auto border-r bg-sidebar p-3 lg:flex">
          {NAV.map((n) => {
            const active = n.to && path === n.to && !(n.label === "Radar");
            const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            }`;
            return n.to ? (
              <Link key={n.label} to={n.to} className={cls}>
                <Icon icon={n.icon} className="w-4" fixedWidth /> {n.label}
              </Link>
            ) : (
              <button key={n.label} className={cls + " cursor-default opacity-70"} title="Coming soon">
                <Icon icon={n.icon} className="w-4" fixedWidth /> {n.label}
                <span className="ml-auto text-[10px] uppercase tracking-wider">Soon</span>
              </button>
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
          ["/community", faUsers, "Social"],
        ] as const).map(([to, icon, label]) =>
          to ? (
            <Link key={label} to={to} className={`flex flex-col items-center gap-1 py-1 text-[11px] font-semibold ${path === to ? "text-coral" : "text-muted-foreground"}`}>
              <Icon icon={icon} className="text-lg" /> {label}
            </Link>
          ) : (
            <button key={label} aria-label="Report a pet" className="mx-auto -mt-8 grid h-14 w-14 place-items-center rounded-full bg-brand text-xl text-primary-foreground shadow-glow dark:text-navy">
              <Icon icon={icon} />
            </button>
          ),
        )}
      </nav>
    </div>
  );
}
