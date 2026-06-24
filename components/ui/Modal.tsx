"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, size = "md", className }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-[95vw]" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={cn(
              "relative w-full bg-ivory dark:bg-maroon-950 rounded-2xl shadow-gold-lg overflow-hidden border-2 border-gold-200 dark:border-maroon-800",
              sizes[size],
              className
            )}
          >
            {/* Gold top stripe */}
            <div className="h-0.5 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500" />
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold-100 dark:border-maroon-800">
                <h2 className="font-serif font-semibold text-maroon-800 dark:text-gold-300">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-maroon-100 dark:hover:bg-maroon-800 transition-colors"
                >
                  <X className="w-4 h-4 text-maroon-500 dark:text-maroon-400" />
                </button>
              </div>
            )}
            <div className={cn(!title && "pt-4")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
