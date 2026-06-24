"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Send, CheckCircle } from "lucide-react";
import { Photo } from "@/types";
import axios from "axios";
import Image from "next/image";

interface DownloadRequestModalProps {
  photo: Photo | null;
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadRequestModal({ photo, eventId, isOpen, onClose }: DownloadRequestModalProps) {
  const [form, setForm] = useState({ guestName: "", guestEmail: "", guestPhone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await axios.post("/api/download-requests", {
        photoId: photo.id,
        eventId,
        ...form,
      });
      setStatus("success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setErrorMsg(msg || "काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setForm({ guestName: "", guestEmail: "", guestPhone: "", message: "" });
    setErrorMsg("");
    onClose();
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border-2 border-gold-200 dark:border-maroon-700
    bg-white dark:bg-maroon-900 text-maroon-900 dark:text-gold-100
    placeholder-maroon-300 dark:placeholder-maroon-600
    focus:outline-none focus:border-gold-400 dark:focus:border-gold-600
    transition-all text-sm`;

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-ivory dark:bg-maroon-950 rounded-t-3xl sm:rounded-2xl shadow-gold-lg border-2 border-gold-200 dark:border-maroon-800 overflow-hidden"
          >
            {/* Top stripe */}
            <div className="h-1 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500" />

            {/* Handle bar for mobile */}
            <div className="flex justify-center pt-2 pb-0 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-maroon-200 dark:bg-maroon-700" />
            </div>

            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-maroon-100 dark:hover:bg-maroon-800 transition-colors z-10">
              <X className="w-4 h-4 text-maroon-500" />
            </button>

            {status === "success" ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </motion.div>
                <h3 className="font-serif text-xl text-maroon-800 dark:text-gold-300 mb-2">Request Sent! 🪷</h3>
                <p className="text-sm text-maroon-500 dark:text-maroon-400 mb-1">
                  आपली download request photographer कडे पोहोचली आहे.
                </p>
                <p className="text-xs text-maroon-400 dark:text-maroon-500 mb-6">
                  Approval नंतर आपल्याला download link मिळेल.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-saffron-600 text-white font-semibold text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gold-200">
                    <Image src={photo.thumbnailUrl || photo.url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300 flex items-center gap-2">
                      <Download className="w-4 h-4 text-gold-500" /> Download Request
                    </h3>
                    <p className="text-xs text-maroon-500 dark:text-maroon-400 mt-0.5">
                      Photographer approval नंतर download होईल
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">
                      आपले नाव *
                    </label>
                    <input
                      required
                      value={form.guestName}
                      onChange={(e) => setForm((p) => ({ ...p, guestName: e.target.value }))}
                      placeholder="e.g. Priya Sharma"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">Phone</label>
                      <input
                        value={form.guestPhone}
                        onChange={(e) => setForm((p) => ({ ...p, guestPhone: e.target.value }))}
                        placeholder="9876543210"
                        type="tel"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">Email</label>
                      <input
                        value={form.guestEmail}
                        onChange={(e) => setForm((p) => ({ ...p, guestEmail: e.target.value }))}
                        placeholder="you@email.com"
                        type="email"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-maroon-600 dark:text-gold-500 mb-1">Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="कोणती specific request आहे का?"
                      rows={2}
                      className={inputCls + " resize-none"}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-saffron-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:from-maroon-800 hover:to-saffron-700 transition-all"
                  >
                    {status === "loading" ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {status === "loading" ? "Sending…" : "Request पाठवा 🪷"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
