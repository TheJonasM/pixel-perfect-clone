import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  faPaw, faBullhorn, faMapLocationDot, faSatelliteDish, faUsers, faTruckMedical, faHouseMedical, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/Icon";
import { Logo, ThemeToggle } from "@/components/AppShell";
import { AlertCard } from "@/components/AlertCard";
import { ALERTS } from "@/lib/data";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PawFinds — Helping pets find their way home" },
      { name: "description", content: "Global rescue network for lost and found pets, sightings, shelters and emergency animal support." },
      { property: "og:title", content: "PawFinds — Global Pet Rescue & Radar" },
      { property: "og:description", content: "Global rescue network powered by community, technology and compassion." },
    ],
  }),
  component: Landing,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - t0) / 1800, 1);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n.toLocaleString()}{suffix}</>;
}

const STATS = [
  { label: "Pets reunited", value: 128430, color: "text-mint" },
  { label: "Active alerts", value: 3912, color: "text-coral" },
  { label: "Volunteers", value: 54200, color: "text-violet" },
  { label: "Organizations", value: 1870, color: "text-foreground" },
];

const FEATURES = [
  { icon: faSatelliteDish, title: "Live radar", text: "Real-time lost, found and sighting signals within your chosen radius." },
  { icon: faUsers, title: "Community network", text: "Rescuers, volunteers and shelters coordinating in one place." },
  { icon: faTruckMedical, title: "Emergency zones", text: "Disaster areas and urgent cases surfaced to nearby responders." },
  { icon: faHouseMedical, title: "Shelters & vets", text: "Find the closest verified help, open now." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background */}
      <div className="bg-hero pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <Icon key={i} icon={faPaw}
            className="animate-drift absolute text-violet/20"
            style={{ left: `${(i * 37) % 100}%`, bottom: "-40px", fontSize: 12 + (i % 4) * 8, animationDelay: `${i * 1.1}s`, animationDuration: `${12 + (i % 5) * 3}s` }} />
        ))}
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/map" className="hover:text-foreground">Radar</Link>
          <Link to="/alerts" className="hover:text-foreground">Alerts</Link>
          <Link to="/community" className="hover:text-foreground">Community</Link>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Open app</Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
            <span className="relative flex h-2 w-2"><span className="animate-ping-slow absolute inset-0 rounded-full bg-mint" /><span className="relative h-2 w-2 rounded-full bg-mint" /></span>
            3,912 active alerts worldwide right now
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Helping pets find their <span className="text-brand">way home.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Global rescue network powered by community, technology and compassion.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-4 font-bold text-primary-foreground shadow-glow transition hover:scale-[1.03] dark:text-navy">
              <Icon icon={faBullhorn} /> Report Pet
            </button>
            <Link to="/map" className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-4 font-bold transition hover:scale-[1.03]">
              <Icon icon={faMapLocationDot} /> Explore Map
            </Link>
          </div>
        </div>

        {/* floating visual */}
        <div className="relative mx-auto h-[460px] w-full max-w-md">
          <div className="absolute inset-0 m-auto h-80 w-80 rounded-full border border-violet/30" />
          <div className="absolute inset-0 m-auto h-56 w-56 rounded-full border border-coral/30" />
          <div className="animate-ping-slow absolute inset-0 m-auto h-24 w-24 rounded-full bg-coral/30" />
          <div className="animate-float glass absolute left-0 top-6 w-60 rounded-3xl p-3 shadow-float">
            <img src={pet1} alt="Golden retriever Max" className="aspect-[4/3] w-full rounded-2xl object-cover" width={816} height={816} />
            <div className="mt-3 flex items-center justify-between px-1">
              <div><div className="font-extrabold">Max</div><div className="text-xs text-muted-foreground">Lost · Chapinero · 1.2 km</div></div>
              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-bold text-coral">HIGH</span>
            </div>
          </div>
          <div className="animate-float glass absolute bottom-6 right-0 w-56 rounded-3xl p-3 shadow-float" style={{ animationDelay: "1.5s" }}>
            <img src={pet2} alt="Tabby cat Luna" className="aspect-[4/3] w-full rounded-2xl object-cover" width={816} height={816} />
            <div className="mt-3 flex items-center justify-between px-1">
              <div><div className="font-extrabold">Luna</div><div className="text-xs text-muted-foreground">Reunited today</div></div>
              <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[11px] font-bold text-mint">HOME</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5">
        <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 shadow-soft md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${s.color}`}><Counter to={s.value} /></div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24">
        <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight">One ecosystem for every rescue.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="lift rounded-3xl border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-lg text-accent-foreground"><Icon icon={f.icon} /></span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight">Urgent near you</h2>
          <Link to="/alerts" className="text-sm font-semibold text-coral">See all alerts <Icon icon={faArrowRight} /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ALERTS.slice(0, 4).map((p) => <AlertCard key={p.id} pin={p} />)}
        </div>
      </section>

      <footer className="relative z-10 border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 PawFinds · A global rescue technology ecosystem
      </footer>
    </div>
  );
}
