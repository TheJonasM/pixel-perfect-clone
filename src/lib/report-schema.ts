import { z } from "zod";

export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const reportSchema = z
  .object({
    type: z.enum(["lost", "found", "sighting"]),
    species: z.enum(["dog", "cat", "other"]),
    pet_name: z.string().trim().min(1, "Name is required").max(60, "Max 60 characters"),
    description: z.string().trim().max(1500, "Max 1500 characters"),
    area: z.string().trim().min(1, "Neighborhood or area is required").max(80, "Max 80 characters"),
    lat: z.number({ invalid_type_error: "Pick a location on the map" }).min(-90).max(90),
    lng: z.number({ invalid_type_error: "Pick a location on the map" }).min(-180).max(180),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    urgency: z.enum(["low", "medium", "high", "critical"]),
    photoCount: z.number().int().min(0).max(MAX_PHOTOS, `Up to ${MAX_PHOTOS} photos`),
    phone: z.string().trim().max(30, "Max 30 characters").regex(/^[+\d\s()-]*$/, "Only digits, spaces and + ( ) -"),
    email: z.union([z.literal(""), z.string().trim().email("Invalid email").max(255)]),
    share_phone: z.boolean(),
    share_email: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.share_phone && !v.phone) ctx.addIssue({ code: "custom", path: ["phone"], message: "Add a phone to share it" });
    if (v.share_email && !v.email) ctx.addIssue({ code: "custom", path: ["email"], message: "Add an email to share it" });
  });

export type ReportInput = z.infer<typeof reportSchema>;

export function photoError(file: { type: string; size: number }): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return "Only JPG, PNG or WebP images";
  if (file.size > MAX_PHOTO_BYTES) return "Each photo must be 5 MB or less";
  return null;
}

/** Only fields the owner opted to share are exposed. */
export function visibleContact(c: { phone: string | null; email: string | null; share_phone: boolean; share_email: boolean }) {
  return { phone: c.share_phone ? c.phone : null, email: c.share_email ? c.email : null };
}
