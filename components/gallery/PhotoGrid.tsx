"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Download, ZoomIn, Lock } from "lucide-react";
import { Photo } from "@/types";
import { getLikedPhotos, toggleLikedPhoto } from "@/lib/utils";
import { PhotoSkeleton } from "@/components/ui/LoadingSpinner";
import { DownloadRequestModal } from "@/components/gallery/DownloadRequestModal";
import axios from "axios";

interface PhotoGridProps {
  photos: Photo[];
  isLoading?: boolean;
  eventCode: string;
  eventId: string;
  downloadControl: "VIEW_ONLY" | "LOW_QUALITY" | "FULL_QUALITY";
  onPhotoClick: (photo: Photo, index: number) => void;
}

export function PhotoGrid({ photos, isLoading, eventCode, eventId, downloadControl, onPhotoClick }: PhotoGridProps) {
  const [likedPhotos, setLikedPhotos] = useState<string[]>(() => getLikedPhotos(eventCode));
  const [requestPhoto, setRequestPhoto] = useState<Photo | null>(null);

  const handleLike = useCallback(
    async (e: React.MouseEvent, photoId: string) => {
      e.stopPropagation();
      const isNowLiked = toggleLikedPhoto(eventCode, photoId);
      setLikedPhotos(getLikedPhotos(eventCode));
      await axios.post(`/api/photos/${photoId}/like`, { action: isNowLiked ? "like" : "unlike" });
    },
    [eventCode]
  );

  const handleRequestDownload = useCallback((e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    setRequestPhoto(photo);
  }, []);

  if (isLoading) {
    return (
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-2 sm:mb-3">
            <PhotoSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-serif text-maroon-700 dark:text-gold-300">अजून फोटो नाहीत</h3>
        <p className="text-maroon-500 dark:text-maroon-400 mt-2 text-sm">Photos लवकरच दिसतील.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => {
            const isLiked = likedPhotos.includes(photo.id);
            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                className="break-inside-avoid mb-2 sm:mb-3 group relative cursor-pointer"
                onClick={() => onPhotoClick(photo, index)}
              >
                <div className="relative rounded-xl overflow-hidden bg-maroon-100 dark:bg-maroon-900 ring-1 ring-gold-200/50 dark:ring-maroon-700/50 group-hover:ring-gold-400 transition-all duration-300 group-hover:shadow-gold">
                  <Image
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    width={400}
                    height={photo.height && photo.width ? Math.round((400 * photo.height) / photo.width) : 400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Bottom action bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {photo.caption && (
                      <p className="text-white text-xs mb-2 line-clamp-2 font-light">{photo.caption}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleLike(e, photo.id)}
                        className="flex items-center gap-1 text-white text-xs hover:scale-110 transition-transform active:scale-95"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-rose-400 text-rose-400" : "text-white"}`} />
                        <span className="text-xs">{photo.likes}</span>
                      </button>
                      <div className="flex gap-2 items-center">
                        {downloadControl !== "VIEW_ONLY" && (
                          <button
                            onClick={(e) => handleRequestDownload(e, photo)}
                            className="flex items-center gap-1 text-white hover:text-gold-300 transition-colors hover:scale-110 active:scale-95"
                            title="Download Request"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {downloadControl === "VIEW_ONLY" && (
                          <span title="Downloads disabled" className="text-white/50">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); onPhotoClick(photo, index); }}
                          className="text-white hover:text-gold-300 transition-colors hover:scale-110"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Guest upload badge */}
                  {photo.isGuestUpload && (
                    <div className="absolute top-2 left-2 bg-purple-500/90 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Guest
                    </div>
                  )}

                  {/* Like indicator when liked */}
                  {isLiked && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 fill-rose-400 text-rose-400 drop-shadow" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <DownloadRequestModal
        photo={requestPhoto}
        eventId={eventId}
        isOpen={!!requestPhoto}
        onClose={() => setRequestPhoto(null)}
      />
    </>
  );
}
