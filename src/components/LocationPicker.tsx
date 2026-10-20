import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CENTER } from "@/lib/data";

const icon = L.divIcon({
  className: "", iconSize: [36, 36], iconAnchor: [18, 18],
  html: `<div class="pf-marker"><span class="dot" style="background:var(--coral)">●</span></div>`,
});

function Clicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LocationPicker({ value, onPick, readOnly }: { value: { lat: number; lng: number } | null; onPick?: (lat: number, lng: number) => void; readOnly?: boolean }) {
  return (
    <MapContainer center={value ? [value.lat, value.lng] : CENTER} zoom={value ? 14 : 12} className="h-full w-full" scrollWheelZoom={!readOnly}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {!readOnly && onPick && <Clicker onPick={onPick} />}
      {value && <Marker position={[value.lat, value.lng]} icon={icon} />}
    </MapContainer>
  );
}
