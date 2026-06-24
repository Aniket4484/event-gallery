export type DownloadControl = "VIEW_ONLY" | "LOW_QUALITY" | "FULL_QUALITY";
export type Category = "HALDI" | "MEHENDI" | "WEDDING" | "RECEPTION" | "CANDID";

export interface Admin {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  coupleNames: string;
  date: string;
  venue?: string | null;
  description?: string | null;
  code: string;
  coverImage?: string | null;
  downloadControl: DownloadControl;
  watermarkEnabled: boolean;
  watermarkText?: string | null;
  guestUploadEnabled: boolean;
  isActive: boolean;
  primaryColor: string;
  adminId: string;
  photos?: Photo[];
  analytics?: Analytics | null;
  _count?: { photos: number };
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  publicId: string;
  filename: string;
  size: number;
  width?: number | null;
  height?: number | null;
  category: Category;
  caption?: string | null;
  likes: number;
  isApproved: boolean;
  isGuestUpload: boolean;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: string;
  eventId: string;
  totalViews: number;
  totalDownloads: number;
  guestCount: number;
  dailyViews: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface CloudinaryUsage {
  plan: string;
  last_updated: string;
  transformations: { usage: number; limit: number };
  objects: { usage: number; limit: number };
  bandwidth: { usage: number; limit: number };
  storage: { usage: number; limit: number };
}

export interface DownloadRequest {
  id: string;
  photoId: string;
  photo?: { url: string; thumbnailUrl?: string | null; filename: string } | null;
  eventId: string;
  event?: { name: string; coupleNames: string; code: string } | null;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  message?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  token?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
