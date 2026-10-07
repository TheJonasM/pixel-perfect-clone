import { faShareNodes, faPhone, faEye, faBookmark, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";
import { PIN_META, STATUS_STYLE, URGENCY_STYLE, type Pin } from "@/lib/data";

export function AlertCard({ pin }: { pin: Pin }) {
  return (
    <article className="lift group overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={pin.photo} alt={pin.title} loading="lazy" width={816} height={816}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="glass rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ color: PIN_META[pin.type].color }}>
            ● {PIN_META[pin.type].label}
          </span>
          {pin.status && <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize backdrop-blur ${STATUS_STYLE[pin.status]}`}>{pin.status}</span>}
        </div>
        <button aria-label="Save" className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full">
          <Icon icon={faBookmark} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-lg font-extrabold">{pin.title}</h3>
          {pin.urgency && <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${URGENCY_STYLE[pin.urgency]}`}>{pin.urgency}</span>}
        </div>
        <p className="mt-0.5 text-sm capitalize text-muted-foreground">{pin.species}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span><Icon icon={faLocationDot} className="mr-1 text-coral" />{pin.subtitle} · {pin.distanceKm} km</span>
          <span><Icon icon={faClock} className="mr-1" />{pin.date}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="rounded-xl bg-muted py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition"><Icon icon={faShareNodes} className="mr-1" />Share</button>
          <button className="rounded-xl bg-muted py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition"><Icon icon={faPhone} className="mr-1" />Contact</button>
          <button className="rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"><Icon icon={faEye} className="mr-1" />Sighting</button>
        </div>
      </div>
    </article>
  );
}
