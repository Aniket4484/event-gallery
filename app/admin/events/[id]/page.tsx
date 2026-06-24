"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, QrCode, Settings, Upload, BarChart2, Trash2, Check, X as XIcon,
  ExternalLink, RefreshCw, Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UploadZone } from "@/components/admin/UploadZone";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { QRCodeModal } from "@/components/admin/QRCodeModal";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { Event, Photo, DownloadControl } from "@/types";
import { CATEGORIES, formatDate, formatBytes } from "@/lib/utils";
import type { CategoryValue } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

type Tab = "photos" | "upload" | "analytics" | "settings";

const inputCls = `w-full px-4 py-2.5 rounded-xl border-2 border-gold-200 dark:border-maroon-700
  bg-white dark:bg-maroon-900 text-maroon-900 dark:text-gold-100
  placeholder-maroon-300 dark:placeholder-maroon-600
  focus:outline-none focus:border-gold-400 dark:focus:border-gold-600 transition-all text-sm`;

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("photos");
  const [category, setCategory] = useState<CategoryValue>("ALL");
  const [showQR, setShowQR] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axios.get<{ data: Event }>(`/api/events/${id}`);
      return res.data.data;
    },
  });

  const { data: photosData, refetch: refetchPhotos } = useQuery({
    queryKey: ["event-photos", id, category],
    queryFn: async () => {
      const params = category !== "ALL" ? `?category=${category}` : "";
      const res = await axios.get<{ data: Photo[]; pagination: { total: number } }>(
        `/api/events/${id}/photos${params}`
      );
      return res.data;
    },
    enabled: !!id,
    refetchInterval: tab === "photos" ? 10000 : false,
  });

  const photos = photosData?.data || [];
  const totalPhotos = photosData?.pagination?.total || 0;

  const categoryCounts = CATEGORIES.filter((c) => c.value !== "ALL").reduce(
    (acc, cat) => ({ ...acc, [cat.value]: 0 }),
    {} as Record<string, number>
  );

  const handleDeletePhoto = async (photoId: string) => {
    await axios.delete(`/api/photos/${photoId}`);
    toast.success("Photo deleted");
    refetchPhotos();
  };

  const handleApprovePhoto = async (photoId: string, isApproved: boolean) => {
    await axios.patch(`/api/photos/${photoId}`, { isApproved });
    toast.success(isApproved ? "Photo approved ✅" : "Photo rejected");
    refetchPhotos();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading event..." />
      </div>
    );
  }

  if (!event) return null;

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: "photos",    emoji: "📸", label: `Photos (${totalPhotos})` },
    { id: "upload",    emoji: "⬆️", label: "Upload" },
    { id: "analytics", emoji: "📊", label: "Analytics" },
    { id: "settings",  emoji: "⚙️", label: "Settings" },
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-0">
      {/* Top hero strip */}
      <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 px-5 md:px-8 pt-6 pb-5 border-b border-maroon-700">
        <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-maroon-300 hover:text-gold-400 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-white">{event.name}</h1>
            <p className="font-script text-gold-400 text-xl mt-0.5">{event.coupleNames}</p>
            <p className="text-sm text-maroon-300 mt-1">
              {formatDate(event.date)}{event.venue ? ` · ${event.venue}` : ""}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap items-start">
            <div className="font-mono text-sm bg-maroon-700/80 text-gold-300 px-3 py-1.5 rounded-xl font-semibold tracking-widest border border-gold-500/20">
              {event.code}
            </div>
            <Button onClick={() => setShowQR(true)} variant="secondary" size="sm">
              <QrCode className="w-4 h-4" /> QR Code
            </Button>
            <a href={`/gallery/${event.code}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-maroon-200 border border-maroon-600 hover:border-gold-500">
                <ExternalLink className="w-4 h-4" /> View Gallery
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-8">
        {/* Tabs */}
        <div className="flex gap-1.5 bg-ivory/80 dark:bg-maroon-900/80 rounded-2xl p-1.5 mb-6 overflow-x-auto border-2 border-gold-100 dark:border-maroon-800 w-fit">
          {TABS.map(({ id: tabId, emoji, label }) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                tab === tabId
                  ? "bg-white dark:bg-maroon-800 text-maroon-800 dark:text-gold-300 shadow-sm"
                  : "text-maroon-500 dark:text-maroon-400 hover:text-maroon-700 dark:hover:text-maroon-300"
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "photos" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <CategoryFilter selected={category} onChange={setCategory} counts={categoryCounts} />
                </div>
                <Button onClick={() => refetchPhotos()} variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
              </div>

              {photos.length === 0 ? (
                <div className="text-center py-20 bg-ivory/60 dark:bg-maroon-900/40 rounded-2xl border-2 border-dashed border-gold-200 dark:border-maroon-800">
                  <div className="text-5xl mb-4">📷</div>
                  <p className="font-serif text-maroon-600 dark:text-gold-400 mb-1">अजून फोटो नाहीत</p>
                  <p className="text-sm text-maroon-400 mb-4">Upload tab मधून photos add करा</p>
                  <Button onClick={() => setTab("upload")}>
                    <Upload className="w-4 h-4" /> Upload Photos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {photos.map((photo) => (
                    <AdminPhotoCard
                      key={photo.id}
                      photo={photo}
                      onDelete={handleDeletePhoto}
                      onApprove={handleApprovePhoto}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "upload" && (
            <div className="max-w-2xl bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-6 border-2 border-gold-100 dark:border-maroon-800">
              <h2 className="font-serif text-xl font-semibold text-maroon-800 dark:text-gold-300 mb-4 flex items-center gap-2">
                ⬆️ Upload Photos
              </h2>
              <UploadZone
                eventId={event.id}
                onUploadSuccess={() => {
                  refetchPhotos();
                  toast.success("Photos uploaded! 🪷");
                }}
              />
            </div>
          )}

          {tab === "analytics" && <AnalyticsDashboard eventId={event.id} />}

          {tab === "settings" && (
            <EventSettingsForm event={event} onSave={() => qc.invalidateQueries({ queryKey: ["event", id] })} />
          )}
        </motion.div>
      </div>

      <QRCodeModal event={event} isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
}

function AdminPhotoCard({
  photo,
  onDelete,
  onApprove,
}: {
  photo: Photo;
  onDelete: (id: string) => void;
  onApprove: (id: string, approved: boolean) => void;
}) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-maroon-100 dark:bg-maroon-800 group ring-1 ring-gold-200/30 dark:ring-maroon-700/50">
      <Image
        src={photo.thumbnailUrl || photo.url}
        alt={photo.caption || ""}
        fill
        className="object-cover"
        sizes="150px"
      />
      {!photo.isApproved && (
        <div className="absolute inset-0 bg-amber-500/20 flex items-end justify-center pb-2">
          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">Pending</span>
        </div>
      )}
      {photo.isGuestUpload && (
        <div className="absolute top-1 left-1 text-xs bg-purple-500/90 text-white px-1.5 py-0.5 rounded-full">Guest</div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        {!photo.isApproved && (
          <button
            onClick={() => onApprove(photo.id, true)}
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <Check className="w-4 h-4 text-white" />
          </button>
        )}
        <button
          onClick={() => onDelete(photo.id)}
          className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="absolute bottom-1 right-1 text-[10px] text-white/50">
        {formatBytes(photo.size)}
      </div>
    </div>
  );
}

function EventSettingsForm({ event, onSave }: { event: Event; onSave: () => void }) {
  const [form, setForm] = useState({
    name: event.name,
    coupleNames: event.coupleNames,
    venue: event.venue || "",
    downloadControl: event.downloadControl,
    watermarkEnabled: event.watermarkEnabled,
    watermarkText: event.watermarkText || "",
    guestUploadEnabled: event.guestUploadEnabled,
    isActive: event.isActive,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`/api/events/${event.id}`, form);
      toast.success("Settings saved! 🪷");
      onSave();
    } catch {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const DL_OPTIONS = [
    { value: "VIEW_ONLY",    label: "View Only",            desc: "Download allowed नाही", emoji: "👁️" },
    { value: "LOW_QUALITY",  label: "Low Quality Download", desc: "Request केल्यावर compressed photo", emoji: "📥" },
    { value: "FULL_QUALITY", label: "Full Quality Download", desc: "Request केल्यावर original photo", emoji: "🖼️" },
  ];

  return (
    <div className="max-w-xl space-y-4">
      <div className="bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-5 space-y-4 border-2 border-gold-100 dark:border-maroon-800">
        <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300">💍 General</h3>
        {[
          { key: "name",        label: "Gallery Name" },
          { key: "coupleNames", label: "Couple Names" },
          { key: "venue",       label: "Venue" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">{label}</label>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              className={inputCls}
            />
          </div>
        ))}
        <SettingToggle
          label="Event Active"
          desc="Guests can access the gallery"
          checked={form.isActive}
          onChange={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
        />
      </div>

      <div className="bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-5 space-y-3 border-2 border-gold-100 dark:border-maroon-800">
        <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300">📥 Download Permission</h3>
        {DL_OPTIONS.map((opt) => (
          <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.downloadControl === opt.value ? "border-maroon-600 bg-maroon-50 dark:bg-maroon-900/50" : "border-gold-100 dark:border-maroon-800 hover:border-gold-300"}`}>
            <input type="radio" name="dl" value={opt.value} checked={form.downloadControl === opt.value}
              onChange={() => setForm((p) => ({ ...p, downloadControl: opt.value as DownloadControl }))} className="mt-0.5 accent-maroon-700" />
            <div>
              <div className="font-medium text-sm text-maroon-800 dark:text-gold-300">{opt.emoji} {opt.label}</div>
              <div className="text-xs text-maroon-500">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-5 space-y-4 border-2 border-gold-100 dark:border-maroon-800">
        <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300">⚙️ Extra Options</h3>
        <SettingToggle
          label="Enable Watermark"
          desc="Automatically added to all photos"
          checked={form.watermarkEnabled}
          onChange={() => setForm((p) => ({ ...p, watermarkEnabled: !p.watermarkEnabled }))}
        />
        {form.watermarkEnabled && (
          <div>
            <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">Watermark Text</label>
            <input value={form.watermarkText} onChange={(e) => setForm((p) => ({ ...p, watermarkText: e.target.value }))} className={inputCls} placeholder="e.g. © Priya & Rahul 2024" />
          </div>
        )}
        <div className="border-t border-gold-100 dark:border-maroon-800" />
        <SettingToggle
          label="Allow Guest Uploads"
          desc="Guests can upload photos (needs approval)"
          checked={form.guestUploadEnabled}
          onChange={() => setForm((p) => ({ ...p, guestUploadEnabled: !p.guestUploadEnabled }))}
        />
      </div>

      <Button onClick={handleSave} loading={isSaving} size="lg" className="w-full">
        🪷 Save Settings
      </Button>
    </div>
  );
}

function SettingToggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium text-sm text-maroon-800 dark:text-gold-300">{label}</div>
        <div className="text-xs text-maroon-500 dark:text-maroon-400">{desc}</div>
      </div>
      <button type="button" onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? "bg-maroon-700" : "bg-gold-200 dark:bg-maroon-700"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
