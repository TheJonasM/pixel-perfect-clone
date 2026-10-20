import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { faShareNodes, faPhone, faEye, faLocationDot, faClock, faPaw } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";
import { PIN_META, STATUS_STYLE, URGENCY_STYLE, type Pin } from "@/lib/data";
import { shareReport } from "@/lib/reports";

export function AlertCard({ pin }: { pin: Pin }) {
  const onShare = async () => {
    const r = await shareReport(pin.id, pin.title);
    if (r === "copied") toast.success("Link copied");
  };
  return (
    <article className="lift group overflow-hidden rounded-3xl border bg-card shadow-soft">
      <Link to="/reports/$id" params={{ id: pin.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {pin.photo ? (
            <img src={pin.photo} alt={pin.title} loading="lazy" width={816} height={816}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl text-muted-foreground"><Icon icon={faPaw} /></div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="glass rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ color: PIN_META[pin.type].color }}>
              ● {PIN_META[pin.type].label}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize backdrop-blur ${STATUS_STYLE[pin.status]}`}>{pin.status}</span>
          </div>
        </div>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-lg font-extrabold">{pin.title}</h3>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${URGENCY_STYLE[pin.urgency]}`}>{pin.urgency}</span>
          </div>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">{pin.species}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span><Icon icon={faLocationDot} className="mr-1 text-coral" />{pin.subtitle} · {pin.distanceKm} km</span>
            <span><Icon icon={faClock} className="mr-1" />{pin.date}</span>
          </div>
        </div>
      </Link>
      <div className="grid grid-cols-3 gap-2 p-4">
        <button onClick={onShare} className="rounded-xl bg-muted py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition"><Icon icon={faShareNodes} className="mr-1" />Share</button>
        <Link to="/reports/$id" params={{ id: pin.id }} hash="contact" className="rounded-xl bg-muted py-2 text-center text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition"><Icon icon={faPhone} className="mr-1" />Contact</Link>
        <Link to="/report/new" search={{ type: "sighting", linked: pin.id }} className="rounded-xl bg-primary py-2 text-center text-xs font-semibold text-primary-foreground transition hover:opacity-90"><Icon icon={faEye} className="mr-1" />Sighting</Link>
      </div>
    </article>
  );
}
