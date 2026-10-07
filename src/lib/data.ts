import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

export type PinType = "lost" | "found" | "sighting" | "shelter" | "vet" | "emergency";
export type Urgency = "low" | "medium" | "high" | "critical";
export type Status = "pending" | "active" | "reunited";

export interface Pin {
  id: string;
  type: PinType;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  species?: "dog" | "cat" | "other" | undefined;
  urgency?: Urgency | undefined;
  status?: Status | undefined;
  photo?: string | undefined;
  date?: string;
  distanceKm: number;
}

export const PIN_META: Record<PinType, { label: string; color: string; icon: string }> = {
  lost: { label: "Lost", color: "var(--coral)", icon: "lost" },
  found: { label: "Found", color: "var(--mint)", icon: "found" },
  sighting: { label: "Sighting", color: "var(--amber)", icon: "sighting" },
  shelter: { label: "Shelter", color: "var(--violet)", icon: "shelter" },
  vet: { label: "Vet clinic", color: "oklch(0.62 0.15 240)", icon: "vet" },
  emergency: { label: "Emergency", color: "var(--destructive)", icon: "emergency" },
};

export const CENTER: [number, number] = [4.6533, -74.0836]; // Bogotá

const photos = [pet1, pet2, pet3, pet4];
const names = ["Max", "Luna", "Toby", "Nala", "Rocky", "Mia", "Simba", "Coco", "Bruno", "Kiara"];
const places = ["Chapinero", "Usaquén", "Teusaquillo", "La Candelaria", "Suba", "Kennedy", "Engativá", "Fontibón"];

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const types: PinType[] = ["lost", "lost", "lost", "found", "found", "sighting", "sighting", "shelter", "vet", "emergency"];
const urg: Urgency[] = ["low", "medium", "high", "critical"];
const stat: Status[] = ["pending", "active", "active", "reunited"];

export const PINS: Pin[] = Array.from({ length: 48 }, (_, i) => {
  const type = types[i % types.length]!;
  const r1 = rand(i + 1), r2 = rand(i + 101), r3 = rand(i + 201);
  const isPet = type === "lost" || type === "found" || type === "sighting";
  const name = names[i % names.length]!;
  return {
    id: `p${i}`,
    type,
    lat: CENTER[0] + (r1 - 0.5) * 0.18,
    lng: CENTER[1] + (r2 - 0.5) * 0.14,
    title: isPet ? name : type === "shelter" ? `Huellitas Shelter ${i}` : type === "vet" ? `VetCare ${places[i % places.length]!}` : "Flood zone — animals at risk",
    subtitle: places[i % places.length]!,
    species: isPet ? (i % 3 === 0 ? "cat" : "dog") : undefined,
    urgency: isPet || type === "emergency" ? urg[Math.floor(r3 * 4)]! : undefined,
    status: isPet ? stat[i % 4]! : undefined,
    photo: isPet ? photos[i % 4]! : undefined,
    date: `${1 + (i % 9)}h ago`,
    distanceKm: Math.round((1 + r3 * 19) * 10) / 10,
  };
});

export const ALERTS = PINS.filter((p) => p.type === "lost" || p.type === "found" || p.type === "sighting");

export const URGENCY_STYLE: Record<Urgency, string> = {
  low: "bg-mint/15 text-mint",
  medium: "bg-amber/20 text-amber",
  high: "bg-coral/15 text-coral",
  critical: "bg-destructive text-destructive-foreground",
};
export const STATUS_STYLE: Record<Status, string> = {
  pending: "bg-muted text-muted-foreground",
  active: "bg-violet/15 text-violet",
  reunited: "bg-mint/15 text-mint",
};

export const POSTS = [
  { id: 1, author: "Valentina R.", group: "Rescuers", time: "12m", text: "Max is HOME 🧡 After 9 days, a neighbor spotted him on the PawFinds radar near Parque 93. Thank you to the 214 people who shared!", photo: pet1, likes: 1284, comments: 96 },
  { id: 2, author: "Huellitas Shelter", group: "Shelters", time: "1h", text: "We just received 6 cats from the Suba flood zone. Looking for foster homes this weekend — volunteers welcome.", photo: pet2, likes: 532, comments: 41 },
  { id: 3, author: "Andrés M.", group: "Volunteers", time: "3h", text: "Night patrol team covered 14 km in Teusaquillo tonight. Two sightings confirmed and logged.", photo: pet3, likes: 211, comments: 18 },
];
