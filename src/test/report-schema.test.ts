import { describe, expect, it } from "vitest";
import { photoError, reportSchema, visibleContact } from "@/lib/report-schema";

const base = {
  type: "lost", species: "dog", pet_name: "Max", description: "", area: "Chapinero",
  lat: 4.65, lng: -74.08, event_date: "2026-10-19", urgency: "high", photoCount: 1,
  phone: "", email: "", share_phone: false, share_email: false,
};

describe("report rules", () => {
  it("accepts a valid report", () => expect(reportSchema.safeParse(base).success).toBe(true));
  it("requires a pet name", () => expect(reportSchema.safeParse({ ...base, pet_name: " " }).success).toBe(false));
  it("allows at most 4 photos", () => expect(reportSchema.safeParse({ ...base, photoCount: 5 }).success).toBe(false));
  it("cannot share a phone that was not given", () => expect(reportSchema.safeParse({ ...base, share_phone: true }).success).toBe(false));
  it("rejects photos over 5 MB", () => expect(photoError({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).not.toBeNull());
  it("rejects non-image files", () => expect(photoError({ type: "application/pdf", size: 10 })).not.toBeNull());
  it("hides contact fields the owner did not authorize", () => {
    expect(visibleContact({ phone: "300", email: "a@b.co", share_phone: false, share_email: true })).toEqual({ phone: null, email: "a@b.co" });
  });
});
