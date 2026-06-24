"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, Play, Heart, Camera, Sparkles, Download, ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoModal } from "@/components/gallery/PhotoModal";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { Slideshow } from "@/components/gallery/Slideshow";
import { GuestUpload } from "@/components/gallery/GuestUpload";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Event, Photo } from "@/types";
import { CATEGORIES, formatDate } from "@/lib/utils";
import type { CategoryValue } from "@/lib/utils";
import axios from "axios";

export default function GalleryPage() {
  const { eventCode } = useParams<{ eventCode: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<{ photo: Photo; index: number } | null>(null);
  const [category, setCategory] = useState<CategoryValue>("ALL");
  const [search, setSearch] = useState("");
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showGuestUpload, setShowGuestUpload] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const { data: event, isLoading: eventLoading, error } = useQuery({
    queryKey: ["gallery-event", eventCode],
    queryFn: async () => {
      const res = await axios.get<{ data: Event }>(`/api/events/code/${eventCode}`);
      return res.data.data;
    },
    retry: 1,
  });

  const { data: photosData, isLoading: photosLoading, refetch } = useQuery({
    queryKey: ["gallery-photos", event?.id, category],
    queryFn: async () => {
      const params = category !== "ALL" ? `?category=${category}` : "";
      const res = await axios.get<{ data: Photo[]; pagination: { total: number } }>(
        `/api/events/${event!.id}/photos${params}`
      );
      return res.data;
    },
    enabled: !!event?.id,
    refetchInterval: 8000,
  });

  const photos = photosData?.data || [];

  const filteredPhotos = search
    ? photos.filter((p) =>
        p.caption?.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : photos;

  const categoryCounts = CATEGORIES.filter((c) => c.value !== "ALL").reduce((acc, cat) => {
    return { ...acc, [cat.value]: photos.filter((p) => p.category === cat.value).length };
  }, {} as Record<string, number>);

  const handlePhotoClick = useCallback((photo: Photo, index: number) => {
    setSelectedPhoto({ photo, index });
  }, []);

  if (eventLoading) return <PageLoader text="Gallery लोड होत आहे…" />;

  if (error || !event) {
    return (
      <div className="min-h-screen bg-marathi-gradient dark:bg-marathi-dark flex items-center justify-center p-4">
        <div className="text-center bg-ivory/95 dark:bg-maroon-950/95 p-10 rounded-3xl border-2 border-gold-200 dark:border-maroon-800 shadow-gold-lg max-w-sm w-full">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-serif text-xl text-maroon-800 dark:text-gold-300 mb-2">Gallery सापडली नाही</h1>
          <p className="text-maroon-500 dark:text-maroon-400 text-sm">
            Event code <span className="font-mono font-bold text-maroon-700 dark:text-gold-400">{eventCode}</span> चुकीचा आहे किंवा inactive आहे.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF5E6] dark:bg-maroon-950">
      {showSlideshow && photos.length > 0 && (
        <Slideshow photos={photos} coupleName={event.coupleNames} onExit={() => setShowSlideshow(false)} />
      )}

      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-maroon-800/95 dark:bg-maroon-950/95 backdrop-blur-md border-b border-gold-500/20">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg flex-shrink-0 filter drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]">🪷</span>
            <div className="min-w-0">
              <div className="font-script text-gold-400 text-base leading-none truncate">{event.coupleNames}</div>
              <div className="text-maroon-300/80 text-xs truncate mt-0.5">{event.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {photos.length > 0 && (
              <button
                onClick={() => setShowSlideshow(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/15 text-gold-300 text-xs font-medium hover:bg-gold-500/25 transition-colors border border-gold-500/25"
              >
                <Play className="w-3 h-3 fill-gold-400" /> Slideshow
              </button>
            )}
            {event.guestUploadEnabled && (
              <button
                onClick={() => setShowGuestUpload(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-500/15 text-saffron-300 text-xs font-medium hover:bg-saffron-500/25 transition-colors border border-saffron-500/25"
              >
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Add Photos</span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold-400/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-saffron-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-maroon-600/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Ornamental top */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-gold-400/60" />
              <span className="text-gold-400/80 text-lg">✦</span>
              <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]">🪷</span>
              <span className="text-gold-400/80 text-lg">✦</span>
              <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-gold-400/60" />
            </div>

            {/* Couple names */}
            <h1 className="font-script text-5xl sm:text-7xl text-gold-400 mb-1 leading-none"
              style={{ textShadow: "0 0 40px rgba(212,175,55,0.3)" }}>
              {event.coupleNames}
            </h1>

            <div className="flex items-center justify-center gap-2 my-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/50" />
              <span className="text-gold-500/70 text-sm tracking-[0.3em] uppercase font-serif">शुभ विवाह</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/50" />
            </div>

            <p className="font-serif text-maroon-200 text-sm sm:text-base">
              {event.name}
              {event.date && <span className="text-maroon-300/70"> · {formatDate(event.date)}</span>}
            </p>
            {event.venue && (
              <p className="text-maroon-400 text-xs sm:text-sm mt-1">📍 {event.venue}</p>
            )}
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mt-6 text-sm"
          >
            <div className="flex items-center gap-1.5 text-maroon-300">
              <Camera className="w-3.5 h-3.5 text-gold-400" />
              <span>{photos.length} photos</span>
            </div>
            <div className="w-px h-4 bg-maroon-700" />
            <div className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Live</span>
            </div>
            {photos.length > 0 && (
              <>
                <div className="w-px h-4 bg-maroon-700 hidden sm:block" />
                <button
                  onClick={() => setShowSlideshow(true)}
                  className="sm:hidden flex items-center gap-1.5 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Slideshow
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="h-8 bg-gradient-to-b from-transparent to-[#FDF5E6] dark:to-maroon-950" />
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-6 pb-12">
        {/* Search + filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 space-y-4"
        >
          {/* Search */}
          <div className={`relative transition-all duration-300 ${searchFocused ? "scale-[1.01]" : ""}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Photos search करा…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl
                border-2 border-gold-200 dark:border-maroon-700
                bg-white/90 dark:bg-maroon-900/90
                text-maroon-800 dark:text-gold-200
                placeholder-maroon-300 dark:placeholder-maroon-600
                focus:outline-none focus:border-gold-400 dark:focus:border-gold-500
                shadow-sm transition-all text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-maroon-400 hover:text-maroon-600">
                <span className="text-sm">✕</span>
              </button>
            )}
          </div>

          {/* Category filter */}
          <CategoryFilter selected={category} onChange={setCategory} counts={categoryCounts} />
        </motion.div>

        {/* Download notice banner */}
        {event.downloadControl !== "VIEW_ONLY" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5 flex items-start gap-3 bg-gold-50 dark:bg-maroon-900/50 border border-gold-200 dark:border-maroon-700 rounded-2xl px-4 py-3"
          >
            <Sparkles className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-maroon-600 dark:text-maroon-300">
              <span className="font-semibold text-maroon-700 dark:text-gold-400">Download करायचे आहे?</span>{" "}
              Photo वर hover करा आणि <Download className="w-3 h-3 inline" /> बटण दाबा. Photographer approval नंतर link मिळेल.
            </div>
          </motion.div>
        )}

        {/* Photo grid */}
        <PhotoGrid
          photos={filteredPhotos}
          isLoading={photosLoading}
          eventCode={eventCode}
          eventId={event.id}
          downloadControl={event.downloadControl}
          onPhotoClick={handlePhotoClick}
        />

        {/* Likes counter */}
        {photos.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-maroon-400 dark:text-maroon-600">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-sm">
              {photos.reduce((s, p) => s + p.likes, 0)} likes across all photos
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-14 pb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300/50" />
            <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">🪷</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300/50" />
          </div>
          <p className="font-script text-maroon-500 dark:text-maroon-500 text-xl">{event.coupleNames}</p>
          <p className="text-xs mt-1 tracking-[0.3em] uppercase text-maroon-300 dark:text-maroon-700">
            शुभ विवाह · WeddingSnaps
          </p>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal
            photos={filteredPhotos}
            initialIndex={selectedPhoto.index}
            isOpen={!!selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            eventCode={eventCode}
            downloadControl={event.downloadControl}
          />
        )}
      </AnimatePresence>

      <Modal isOpen={showGuestUpload} onClose={() => setShowGuestUpload(false)} title="📸 आपले फोटो Share करा" size="md">
        <div className="p-6">
          <p className="text-sm text-maroon-500 dark:text-maroon-400 mb-4">
            आपले candid moments share करा! Photographer review नंतर gallery मध्ये दिसतील.
          </p>
          <GuestUpload eventId={event.id} onSuccess={() => { setShowGuestUpload(false); refetch(); }} />
        </div>
      </Modal>
    </div>
  );
}
