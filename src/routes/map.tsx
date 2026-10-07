import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { faXmark, faLocationDot, faPhone, faShareNodes, faEye, faSliders } from "@fortawesome/free-solid-svg-icons";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { PINS, PIN_META, URGENCY_STYLE, type Pin, type PinType } from "@/lib/data";

const PetMap = lazy(() => import("@/components/PetMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Rescue Radar Map — PawFinds" },
      { name: "description", content: "Live map of lost pets, found pets, sightings, shelters, vets and emergency zones near you." },
      { property: "og:title", content: "Rescue Radar Map — PawFinds" },
      { property: "og:description", content: "Live radar of lost and found pets, shelters and emergencies." },
    ],
  }),
  component: MapPage,
});

const RADII = [3, 5, 10, 20];
const TYPES = Object.keys(PIN_META) as PinType[];

function MapPage() {
  const [radius, setRadius] = useState(10);
  const [active, setActive] = useState<Set<PinType>>(new Set(TYPES));
  const [species, setSpecies] = useState<"all" | "dog" | "cat">("all");
  const [selected, setSelected] = useState<Pin | null>(null);

  const pins = useMemo(
    () => PINS.filter((p) => active.has(p.type) && p.distanceKm <= radius && (species === "all" || !p.species || p.species === species)),
    [active, radius, species],
  );
  const toggle = (t: PinType) => setActive((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });

  return (
    <AppShell fullBleed>
      <div className="relative h-[calc(100vh-4rem)] lg:flex">
        <div className="relative h-full min-w-0 flex-1">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <PetMap pins={pins} radiusKm={radius} onSelect={setSelected} />
            </Suspense>
          </ClientOnly>

          {/* Filter bar */}
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-col gap-2">
            <div className="glass pointer-events-auto flex gap-2 overflow-x-auto rounded-2xl p-2 shadow-soft">
              {TYPES.map((t) => (
                <button key={t} onClick={() => toggle(t)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${active.has(t) ? "bg-card shadow-soft" : "opacity-50"}`}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIN_META[t].color }} />
                  {PIN_META[t].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="glass pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5 shadow-soft">
                <Icon icon={faSliders} className="mx-2 text-muted-foreground" />
                {RADII.map((r) => (
                  <button key={r} onClick={() => setRadius(r)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${radius === r ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{r} km</button>
                ))}
              </div>
              <div className="glass pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5 shadow-soft">
                {(["all", "dog", "cat"] as const).map((s) => (
                  <button key={s} onClick={() => setSpecies(s)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${species === s ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className={`glass z-[600] overflow-y-auto border-y-0 border-r-0 p-5 lg:static lg:block lg:w-96 ${selected ? "absolute inset-x-0 bottom-24 max-h-[60%] rounded-t-3xl lg:max-h-none lg:rounded-none" : "hidden"}`}>
          {selected ? <Detail pin={selected} onClose={() => setSelected(null)} /> : <Summary pins={pins} radius={radius} onPick={setSelected} />}
        </aside>
      </div>
    </AppShell>
  );
}

function Summary({ pins, radius, onPick }: { pins: Pin[]; radius: number; onPick: (p: Pin) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Within {radius} km</p>
      <h2 className="mt-1 text-2xl font-extrabold">{pins.length} signals</h2>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["lost", "found", "sighting"] as const).map((t) => (
          <div key={t} className="rounded-2xl bg-card p-3 shadow-soft">
            <div className="text-xl font-extrabold" style={{ color: PIN_META[t].color }}>{pins.filter((p) => p.type === t).length}</div>
            <div className="text-[11px] text-muted-foreground">{PIN_META[t].label}</div>
          </div>
        ))}
      </div>
      <h3 className="mt-6 text-sm font-bold">Nearest</h3>
      <ul className="mt-2 space-y-1">
        {[...pins].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 10).map((p) => (
          <li key={p.id}>
            <button onClick={() => onPick(p)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-card">
              {p.photo ? <img src={p.photo} alt="" className="h-11 w-11 rounded-xl object-cover" /> :
                <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: PIN_META[p.type].color }} />}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{p.title}</div>
                <div className="text-xs text-muted-foreground">{PIN_META[p.type].label} · {p.subtitle}</div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{p.distanceKm} km</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: PIN_META[pin.type].color }}>{PIN_META[pin.type].label}</span>
        <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"><Icon icon={faXmark} /></button>
      </div>
      {pin.photo && <img src={pin.photo} alt={pin.title} className="mt-3 aspect-square w-full rounded-3xl object-cover shadow-soft" />}
      <div className="mt-4 flex items-center justify-between gap-2">
        <h2 className="truncate text-2xl font-extrabold">{pin.title}</h2>
        {pin.urgency && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${URGENCY_STYLE[pin.urgency]}`}>{pin.urgency}</span>}
      </div>
      <p className="mt-1 text-sm text-muted-foreground"><Icon icon={faLocationDot} className="mr-1 text-coral" />{pin.subtitle} · {pin.distanceKm} km · {pin.date}</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button className="rounded-2xl bg-muted py-3 text-xs font-semibold"><Icon icon={faShareNodes} className="block mx-auto mb-1" />Share</button>
        <button className="rounded-2xl bg-muted py-3 text-xs font-semibold"><Icon icon={faPhone} className="block mx-auto mb-1" />Contact</button>
        <button className="rounded-2xl bg-brand py-3 text-xs font-semibold text-primary-foreground dark:text-navy"><Icon icon={faEye} className="block mx-auto mb-1" />Sighting</button>
      </div>
    </div>
  );
}
