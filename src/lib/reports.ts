import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CENTER, type Pin, type PinType, type Species, type Status, type Urgency } from "./data";

type Row = Database["public"]["Tables"]["reports"]["Row"];
export const BUCKET = "report-photos";

export function distanceKm(lat: number, lng: number, from: [number, number] = CENTER) {
  const R = 6371, toR = (d: number) => (d * Math.PI) / 180;
  const dLat = toR(lat - from[0]), dLng = toR(lng - from[1]);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toR(from[0])) * Math.cos(toR(lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

async function signPhotos(rows: Row[]) {
  const paths = [...new Set(rows.flatMap((r) => r.photos))];
  const map = new Map<string, string>();
  if (paths.length) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 6);
    data?.forEach((d) => d.path && d.signedUrl && map.set(d.path, d.signedUrl));
  }
  return map;
}

function toPin(r: Row, urls: Map<string, string>): Pin {
  const photoUrls = r.photos.map((p) => urls.get(p)).filter((u): u is string => !!u);
  return {
    id: r.id, ownerId: r.owner_id, type: r.type as PinType, lat: r.lat, lng: r.lng,
    title: r.pet_name, subtitle: r.area, description: r.description,
    species: r.species as Species, urgency: r.urgency as Urgency, status: r.status as Status,
    photo: photoUrls[0], photoUrls, photoPaths: r.photos,
    date: timeAgo(r.created_at), eventDate: r.event_date, createdAt: r.created_at,
    authorName: r.author_name, linkedReportId: r.linked_report_id,
    distanceKm: distanceKm(r.lat, r.lng),
  };
}

async function rowsToPins(rows: Row[]) {
  const urls = await signPhotos(rows);
  return rows.map((r) => toPin(r, urls));
}

export const reportsQuery = () =>
  queryOptions({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw new Error(error.message);
      return rowsToPins(data);
    },
  });

export const reportQuery = (id: string) =>
  queryOptions({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      return (await rowsToPins([data]))[0]!;
    },
  });

export const myReportsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-reports", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").eq("owner_id", userId).order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return rowsToPins(data);
    },
  });

export async function shareReport(id: string, title: string) {
  const url = `${window.location.origin}/reports/${id}`;
  try {
    if (navigator.share) { await navigator.share({ title: `${title} — PawFinds`, url }); return "shared"; }
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "cancelled";
  }
}
