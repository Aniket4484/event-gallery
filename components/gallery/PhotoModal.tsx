"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Download, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { Photo } from "@/types";
import { getLikedPhotos, toggleLikedPhoto } from "@/lib/utils";
import { DownloadRequestModal } from "@/components/gallery/DownloadRequestModal";
import axios from "axios";
import toast from "react-hot-toast";

interface PhotoModalProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  eventCode: string;
  downloadControl: "VIEW_ONLY" | "LOW_QUALITY" | "FULL_QUALITY";
}

export function PhotoModal({ photos, initialIndex, isOpen, onClose, eventCode, downloadControl }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likedPhotos, setLikedPhotos] = useState<string[]>(() => getLikedPhotos(eventCode));
  const [isZoomed, setIsZoomed] = useState(false);
  const [showDownloadRequest, setShowDownloadRequest] = useState(false);

  const photo = photos[currentIndex];

  useEffect(() => setCurrentIndex(initialIndex), [initialIndex]);
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo("prev");
      if (e.key === "ArrowRight") goTo("next");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, currentIndex]);

  const goTo = useCallback(
    (dir: "prev" | "next") => {
      setIsZoomed(false);
      setCurrentIndex((i) =>
        dir === "prev" ? (i - 1 + photos.length) % photos.length : (i + 1) % photos.length
      );
    },
    [photos.length]
  );

  const handleLike = async () => {
    if (!photo) return;
    const isNowLiked = toggleLikedPhoto(eventCode, photo.id);
    setLikedPhotos(getLikedPhotos(eventCode));
    await axios.post(`/api/photos/${photo.id}/like`, { action: isNowLiked ? "like" : "unlike" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: window.location.href, title: "Wedding Photo" });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied! 🪷");
    }
  };

  if (!photo) return null;
  const isLiked = likedPhotos.includes(photo.id);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-white/10 rounded-full text-white text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {photos.length}
            </div>

            {/* Actions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
              <ActionBtn onClick={handleLike} title="Like">
                <Heart className={`w-5 h-5 transition-colors ${isLiked ? "fill-rose-400 text-rose-400" : "text-white"}`} />
              </ActionBtn>
              {downloadControl !== "VIEW_ONLY" && (
                <ActionBtn onClick={() => setShowDownloadRequest(true)} title="Request Download">
                  <Download className="w-5 h-5 text-white" />
                </ActionBtn>
              )}
              <ActionBtn onClick={handleShare} title="Share">
                <Share2 className="w-5 h-5 text-white" />
              </ActionBtn>
              <ActionBtn onClick={() => setIsZoomed((z) => !z)} title="Zoom">
                {isZoomed ? <ZoomOut className="w-5 h-5 text-white" /> : <ZoomIn className="w-5 h-5 text-white" />}
              </ActionBtn>
            </div>

            {photo.caption && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 max-w-lg text-center px-6 py-2 bg-black/50 rounded-xl text-white text-sm backdrop-blur-sm">
                {photo.caption}
              </div>
            )}

            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <button onClick={() => goTo("prev")} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={() => goTo("next")} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`relative z-10 flex items-center justify-center ${isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"} transition-transform duration-300`}
                onClick={() => setIsZoomed((z) => !z)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || "Wedding photo"}
                  width={1200}
                  height={900}
                  className="max-w-[88vw] max-h-[78vh] object-contain rounded-xl shadow-2xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      <DownloadRequestModal
        photo={showDownloadRequest ? photo : null}
        eventId={photo.eventId}
        isOpen={showDownloadRequest}
        onClose={() => setShowDownloadRequest(false)}
      />
    </>
  );
}

function ActionBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button onClick={onClick} title={title} className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 border border-white/10 backdrop-blur-sm">
      {children}
    </button>
  );
}
