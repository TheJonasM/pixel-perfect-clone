import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CENTER, PIN_META, type Pin } from "@/lib/data";

function pinIcon(p: Pin) {
  const c = PIN_META[p.type].color;
  const pulse = p.urgency === "critical" || p.urgency === "high" || p.type === "emergency";
  const glyph = { lost: "?", found: "✓", sighting: "👁", shelter: "⌂", vet: "+", emergency: "!" }[p.type];
  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `<div class="pf-marker">${pulse ? `<span class="ring" style="background:${c}"></span>` : ""}<span class="dot" style="background:${c}">${glyph}</span></div>`,
  });
}

function clusterIcon(n: number) {
  const s = 34 + Math.min(n, 20) * 1.5;
  return L.divIcon({ className: "", iconSize: [s, s], html: `<div class="pf-cluster" style="width:${s}px;height:${s}px">${n}</div>` });
}

/** Lightweight grid clustering that re-runs on zoom. */
function Clustered({ pins, onSelect }: { pins: Pin[]; onSelect: (p: Pin) => void }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useEffect(() => {
    const h = () => setZoom(map.getZoom());
    map.on("zoomend", h);
    return () => { map.off("zoomend", h); };
  }, [map]);

  const groups = useMemo(() => {
    if (zoom >= 14) return pins.map((p) => ({ pins: [p], lat: p.lat, lng: p.lng }));
    const cell = 0.5 / Math.pow(2, zoom - 7);
    const m = new Map<string, Pin[]>();
    pins.forEach((p) => {
      const k = `${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
      m.set(k, [...(m.get(k) ?? []), p]);
    });
    return [...m.values()].map((g) => ({
      pins: g,
      lat: g.reduce((a, p) => a + p.lat, 0) / g.length,
      lng: g.reduce((a, p) => a + p.lng, 0) / g.length,
    }));
  }, [pins, zoom]);

  return (
    <>
      {groups.map((g, i) =>
        g.pins.length > 1 ? (
          <Marker key={`c${i}`} position={[g.lat, g.lng]} icon={clusterIcon(g.pins.length)}
            eventHandlers={{ click: () => map.flyTo([g.lat, g.lng], Math.min(zoom + 2, 16)) }} />
        ) : (
          <Marker key={g.pins[0]!.id} position={[g.lat, g.lng]} icon={pinIcon(g.pins[0]!)}
            eventHandlers={{ click: () => onSelect(g.pins[0]!) }}>
            <Popup>
              <div className="flex w-52 gap-3">
                {g.pins[0]!.photo && <img src={g.pins[0]!.photo} alt="" className="h-14 w-14 rounded-xl object-cover" />}
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: PIN_META[g.pins[0]!.type].color }}>{PIN_META[g.pins[0]!.type].label}</div>
                  <div className="truncate text-sm font-bold">{g.pins[0]!.title}</div>
                  <div className="text-xs opacity-70">{g.pins[0]!.subtitle} · {g.pins[0]!.distanceKm} km</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ),
      )}
    </>
  );
}

export default function PetMap({ pins, radiusKm, onSelect }: { pins: Pin[]; radiusKm: number; onSelect: (p: Pin) => void }) {
  return (
    <MapContainer center={CENTER} zoom={12} zoomControl={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Circle center={CENTER} radius={radiusKm * 1000}
        pathOptions={{ color: "#8B5CF6", weight: 1.5, fillColor: "#8B5CF6", fillOpacity: 0.06, dashArray: "6 6" }} />
      <Clustered pins={pins} onSelect={onSelect} />
    </MapContainer>
  );
}
