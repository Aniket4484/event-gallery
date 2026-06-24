import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEventCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const CATEGORIES = [
  { value: "ALL", label: "All Photos", emoji: "✨" },
  { value: "WEDDING", label: "Wedding", emoji: "💍" },
  { value: "RECEPTION", label: "Reception", emoji: "🥂" },
  { value: "HALDI", label: "Haldi", emoji: "🌼" },
  { value: "MEHENDI", label: "Mehendi", emoji: "🌿" },
  { value: "CANDID", label: "Candid", emoji: "📸" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function getGuestId(): string {
  if (typeof window === "undefined") return "";
  let guestId = localStorage.getItem("wedding_guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("wedding_guest_id", guestId);
  }
  return guestId;
}

export function getLikedPhotos(eventCode: string): string[] {
  if (typeof window === "undefined") return [];
  const key = `liked_photos_${eventCode}`;
  const liked = localStorage.getItem(key);
  return liked ? JSON.parse(liked) : [];
}

export function toggleLikedPhoto(eventCode: string, photoId: string): boolean {
  const key = `liked_photos_${eventCode}`;
  const liked = getLikedPhotos(eventCode);
  const isLiked = liked.includes(photoId);
  if (isLiked) {
    localStorage.setItem(key, JSON.stringify(liked.filter((id) => id !== photoId)));
  } else {
    localStorage.setItem(key, JSON.stringify([...liked, photoId]));
  }
  return !isLiked;
}

// Local storage mode — both return original URL (no quality reduction needed)
export function getLowQualityUrl(url: string): string {
  return url;
}
