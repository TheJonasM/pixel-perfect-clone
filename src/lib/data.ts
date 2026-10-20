import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

export type PinType = "lost" | "found" | "sighting";
export type Urgency = "low" | "medium" | "high" | "critical";
export type Status = "pending" | "active" | "reunited";
export type Species = "dog" | "cat" | "other";

export interface Pin {
  id: string;
  ownerId: string;
  type: PinType;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  description: string;
  species: Species;
  urgency: Urgency;
  status: Status;
  photo?: string | undefined;
  photoUrls: string[];
  photoPaths: string[];
  date: string;
  eventDate: string;
  createdAt: string;
  authorName: string;
  linkedReportId: string | null;
  distanceKm: number;
}

export const PIN_META: Record<PinType, { label: string; color: string }> = {
  lost: { label: "Lost", color: "var(--coral)" },
  found: { label: "Found", color: "var(--mint)" },
  sighting: { label: "Sighting", color: "var(--amber)" },
};

export const CENTER: [number, number] = [4.6533, -74.0836]; // Bogotá

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

/** Illustrative sample posts — the Community page labels them as examples. */
export const POSTS = [
  { id: 1, author: "Valentina R.", group: "Rescuers", time: "12m", text: "Max is HOME 🧡 After 9 days, a neighbor spotted him on the PawFinds radar near Parque 93. Thank you to everyone who shared!", photo: pet1, likes: 1284, comments: 96 },
  { id: 2, author: "Huellitas Shelter", group: "Shelters", time: "1h", text: "We just received 6 cats from the Suba flood zone. Looking for foster homes this weekend — volunteers welcome.", photo: pet2, likes: 532, comments: 41 },
  { id: 3, author: "Andrés M.", group: "Volunteers", time: "3h", text: "Night patrol team covered 14 km in Teusaquillo tonight. Two sightings confirmed and logged.", photo: pet3, likes: 211, comments: 18 },
];
