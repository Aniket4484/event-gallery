"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, X, Download, Clock, CheckCircle, XCircle, User, Phone, Mail, Image as ImageIcon, Copy, MessageCircle } from "lucide-react";
import { DownloadRequest } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED";

export default function RequestsPage() {
  const [status, setStatus] = useState<StatusFilter>("PENDING");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["download-requests", status],
    queryFn: async () => {
      const res = await axios.get<{ data: DownloadRequest[] }>(`/api/admin/download-requests?status=${status}`);
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      await axios.patch(`/api/admin/download-requests/${id}`, { status: action });
      toast.success(action === "APPROVED" ? "Request approved! ✅" : "Request rejected");
      qc.invalidateQueries({ queryKey: ["download-requests"] });
    } catch {
      toast.error("काहीतरी चूक झाली");
    }
  };

  const requests = data || [];

  const TABS: { id: StatusFilter; label: string; icon: React.ElementType; color: string }[] = [
    { id: "PENDING",  label: "Pending",  icon: Clock,        color: "text-amber-600" },
    { id: "APPROVED", label: "Approved", icon: CheckCircle,  color: "text-green-600" },
    { id: "REJECTED", label: "Rejected", icon: XCircle,      color: "text-red-500"   },
  ];

  const pendingCount = status !== "PENDING" && data
    ? 0
    : requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="p-5 md:p-8 pt-16 md:pt-8 space-y-6">
      <div>
        <h1 className="section-heading">Download Requests</h1>
        <p className="text-maroon-500 dark:text-maroon-400 text-sm mt-1">
          Guests च्या download requests manage करा
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-ivory/80 dark:bg-maroon-900/80 rounded-2xl p-1.5 border-2 border-gold-100 dark:border-maroon-800 w-fit">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setStatus(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              status === id
                ? "bg-white dark:bg-maroon-800 text-maroon-800 dark:text-gold-300 shadow-sm"
                : "text-maroon-500 dark:text-maroon-400 hover:text-maroon-700"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${status === id ? color : ""}`} />
            {label}
            {id === "PENDING" && pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-maroon-50 dark:bg-maroon-900/50 animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-ivory/60 dark:bg-maroon-900/40 rounded-2xl border-2 border-dashed border-gold-200 dark:border-maroon-800">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-serif text-maroon-600 dark:text-gold-400">
            {status === "PENDING" ? "कोणताही pending request नाही" : `No ${status.toLowerCase()} requests`}
          </p>
        </div>
      ) : (
        <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} status={status} onAction={handleAction} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function RequestCard({
  request,
  status,
  onAction,
}: {
  request: DownloadRequest;
  status: StatusFilter;
  onAction: (id: string, action: "APPROVED" | "REJECTED") => void;
}) {
  const photo = request.photo;
  const event = request.event;

  const getDownloadPageUrl = () => {
    if (!request.token) return "";
    return `${window.location.origin}/download/${request.token}`;
  };

  const copyLink = async () => {
    const url = getDownloadPageUrl();
    await navigator.clipboard.writeText(url);
    toast.success("Download link copied! 📋");
  };

  const openWhatsApp = () => {
    const url = getDownloadPageUrl();
    const phone = request.guestPhone?.replace(/\D/g, "") || "";
    const msg = encodeURIComponent(
      `नमस्कार ${request.guestName} 🪷\n\nआपली photo download request approve झाली आहे!\n\nखालील link वर click करा आणि photo download करा:\n${url}\n\n— WeddingSnaps`
    );
    const waUrl = phone
      ? `https://wa.me/91${phone}?text=${msg}`
      : `https://wa.me/?text=${msg}`;
    window.open(waUrl, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl border-2 border-gold-100 dark:border-maroon-800 overflow-hidden"
    >
      <div className="flex gap-3 p-3.5">
        {/* Photo thumbnail */}
        <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-maroon-100 dark:bg-maroon-800 border border-gold-200/50">
          {photo ? (
            <Image
              src={photo.thumbnailUrl || photo.url}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-maroon-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {event && (
            <p className="text-xs text-maroon-400 dark:text-maroon-500 truncate mb-0.5">
              {event.coupleNames}
            </p>
          )}
          <div className="flex items-center gap-1 text-sm font-semibold text-maroon-800 dark:text-gold-300">
            <User className="w-3 h-3 text-gold-500 flex-shrink-0" />
            <span className="truncate">{request.guestName}</span>
          </div>
          <div className="space-y-0.5 mt-1">
            {request.guestPhone && (
              <div className="flex items-center gap-1 text-xs text-maroon-500 dark:text-maroon-400">
                <Phone className="w-3 h-3 text-maroon-400" />
                <span>{request.guestPhone}</span>
              </div>
            )}
            {request.guestEmail && (
              <div className="flex items-center gap-1 text-xs text-maroon-500 dark:text-maroon-400">
                <Mail className="w-3 h-3 text-maroon-400" />
                <span className="truncate">{request.guestEmail}</span>
              </div>
            )}
          </div>
          {request.message && (
            <p className="text-xs text-maroon-500 dark:text-maroon-400 mt-1 italic line-clamp-2">
              "{request.message}"
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3.5 pb-3.5">
        {status === "PENDING" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAction(request.id, "APPROVED")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
            <button
              onClick={() => onAction(request.id, "REJECTED")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        )}

        {status === "APPROVED" && request.token && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Approved — Guest ला link पाठवा
            </div>
            <div className="flex gap-2">
              {/* WhatsApp button */}
              <button
                onClick={openWhatsApp}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b558] text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
              {/* Copy link button */}
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-gold-300 text-xs font-semibold transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </div>
            {/* Direct download for admin */}
            <a
              href={`/api/download-requests/${request.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-maroon-400 hover:text-maroon-600 transition-colors"
            >
              <Download className="w-3 h-3" /> Preview download link
            </a>
          </div>
        )}

        {status === "REJECTED" && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </div>
        )}
      </div>
    </motion.div>
  );
}
