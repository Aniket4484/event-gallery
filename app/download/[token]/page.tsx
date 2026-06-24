"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Download, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function DownloadPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["download", token],
    queryFn: async () => {
      const res = await axios.get<{ data: { url: string; filename: string } }>(
        `/api/download-requests/${token}`
      );
      return res.data.data;
    },
    retry: false,
  });

  const handleDownload = () => {
    if (!data) return;
    const a = document.createElement("a");
    a.href = data.url;
    a.download = data.filename;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-400/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative w-full max-w-sm bg-ivory dark:bg-maroon-950 rounded-3xl overflow-hidden border-2 border-gold-200 dark:border-maroon-800 shadow-gold-lg"
      >
        {/* Top stripe */}
        <div className="h-1.5 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500" />

        <div className="p-8 text-center">
          {isLoading && (
            <div className="py-8">
              <Loader2 className="w-10 h-10 text-gold-400 animate-spin mx-auto mb-4" />
              <p className="text-maroon-500 text-sm">Checking your request…</p>
            </div>
          )}

          {error && (
            <div className="py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="font-serif text-xl text-maroon-800 dark:text-gold-300 mb-2">Link Invalid</h2>
              <p className="text-sm text-maroon-500 dark:text-maroon-400">
                हा download link invalid आहे किंवा अजून approve झाला नाही. Photographer शी संपर्क करा.
              </p>
            </div>
          )}

          {data && (
            <div className="space-y-5">
              <div>
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-serif text-xl text-maroon-800 dark:text-gold-300">Download Ready! 🪷</h2>
                <p className="text-sm text-maroon-500 dark:text-maroon-400 mt-1">
                  आपला photo download करण्यास तयार आहे
                </p>
              </div>

              {/* Photo preview */}
              <div className="rounded-2xl overflow-hidden border-2 border-gold-200 dark:border-maroon-700 shadow-gold">
                <Image
                  src={data.url}
                  alt="Your photo"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-maroon-700 to-saffron-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-maroon-800 hover:to-saffron-700 transition-all shadow-maroon hover:shadow-maroon-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-5 h-5" /> Photo Download करा
              </button>

              <p className="text-xs text-maroon-400 dark:text-maroon-600">
                WeddingSnaps · शुभ विवाह
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
