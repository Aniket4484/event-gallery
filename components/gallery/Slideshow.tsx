"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, X, Settings2 } from "lucide-react";
import { Photo } from "@/types";

interface SlideshowProps {
  photos: Photo[];
  coupleName: string;
  onExit: () => void;
}

const INTERVALS = [3000, 5000, 8000, 10000];

export function Slideshow({ photos, coupleName, onExit }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalMs, setIntervalMs] = useState(5000);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % photos.length),
    [photos.length]
  );
  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(next, intervalMs);
    return () => clearInterval(interval);
  }, [isPlaying, next, intervalMs]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const show = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 4000);
    };
    show();
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key === " ") setIsPlaying((p) => !p);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onExit]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Photo */}
      <AnimatePresence mode="sync">
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={photo.url}
            alt={photo.caption || "Wedding photo"}
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Couple name watermark */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="font-script text-white/60 text-2xl md:text-4xl">{coupleName}</div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          key={`${photo.id}-progress`}
          className="h-full bg-gradient-to-r from-rose-400 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying ? "100%" : `${(currentIndex / photos.length) * 100}%` }}
          transition={isPlaying ? { duration: intervalMs / 1000, ease: "linear" } : { duration: 0 }}
        />
      </div>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-auto">
              <div className="text-white font-script text-xl opacity-80">{coupleName}</div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings((s) => !s)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Settings2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={onExit}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Side nav */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
              <div className="text-white/70 text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white space-y-3 min-w-48"
          >
            <p className="text-sm font-medium text-white/70">Slide Interval</p>
            {INTERVALS.map((ms) => (
              <button
                key={ms}
                onClick={() => setIntervalMs(ms)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  intervalMs === ms ? "bg-rose-500 text-white" : "hover:bg-white/10"
                }`}
              >
                {ms / 1000} seconds
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
