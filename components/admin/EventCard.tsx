"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Image, QrCode, ExternalLink, Settings, Trash2, Eye, Download, Users, Lock } from "lucide-react";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QRCodeModal } from "@/components/admin/QRCodeModal";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

const DL_LABEL = {
  VIEW_ONLY:    { label: "View Only",    icon: Eye,      cls: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
  LOW_QUALITY:  { label: "Low Quality",  icon: Download, cls: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  FULL_QUALITY: { label: "Full Quality", icon: Download, cls: "text-green-600 bg-green-50 dark:bg-green-900/20" },
};

export function EventCard({ event, onDelete }: EventCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dl = DL_LABEL[event.downloadControl];
  const DlIcon = dl.icon;

  const handleDelete = async () => {
    if (!confirm(`"${event.name}" हा event delete करायचा आहे का? सर्व photos हटतील.`)) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/events/${event.id}`);
      toast.success("Event deleted");
      onDelete(event.id);
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-ivory/95 dark:bg-maroon-900/80 rounded-2xl overflow-hidden border-2 border-gold-100 dark:border-maroon-800 hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-gold transition-all duration-300"
      >
        {/* Cover header */}
        <div
          className="h-28 relative flex items-end p-4"
          style={{
            background: event.coverImage
              ? `url(${event.coverImage}) center/cover`
              : `linear-gradient(135deg, #800000 0%, #a01010 60%, #d4af37 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 flex items-end justify-between w-full">
            <div>
              <h3 className="font-serif text-white font-semibold leading-tight line-clamp-1">{event.name}</h3>
              <p className="font-script text-gold-300 text-sm">{event.coupleNames}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${event.isActive ? "bg-green-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
              {event.isActive ? "Live" : "Off"}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs text-maroon-500 dark:text-maroon-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.date)}</span>
            {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Tag icon={Image} label={`${event._count?.photos || 0} photos`} cls="text-maroon-600 bg-maroon-50 dark:bg-maroon-800 dark:text-maroon-300" />
            <Tag icon={DlIcon} label={dl.label} cls={dl.cls} />
            {event.guestUploadEnabled && <Tag icon={Users} label="Guest Upload" cls="text-purple-600 bg-purple-50 dark:bg-purple-900/20" />}
            {event.watermarkEnabled && <Tag icon={Lock} label="Watermark" cls="text-gray-600 bg-gray-100 dark:bg-maroon-800 dark:text-maroon-400" />}
          </div>

          {/* Analytics */}
          {event.analytics && (
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-gold-100 dark:border-maroon-800">
              <Stat label="Views"     value={event.analytics.totalViews} />
              <Stat label="Downloads" value={event.analytics.totalDownloads} />
              <Stat label="Guests"    value={event.analytics.guestCount} />
            </div>
          )}

          {/* Event code */}
          <div className="font-mono text-xs bg-maroon-700 text-gold-300 px-3 py-1.5 rounded-lg tracking-widest text-center">
            {event.code}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setShowQR(true)} variant="secondary" size="sm">
              <QrCode className="w-3.5 h-3.5" /> QR Code
            </Button>
            <Link href={`/admin/events/${event.id}`} className="block">
              <Button variant="primary" size="sm" className="w-full">
                <Settings className="w-3.5 h-3.5" /> Manage
              </Button>
            </Link>
          </div>

          <div className="flex justify-between">
            <Link href={`/gallery/${event.code}`} target="_blank" className="flex items-center gap-1 text-xs text-maroon-500 hover:text-gold-600 transition-colors">
              <ExternalLink className="w-3 h-3" /> View Gallery
            </Link>
            <button onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </motion.div>

      <QRCodeModal event={event} isOpen={showQR} onClose={() => setShowQR(false)} />
    </>
  );
}

function Tag({ icon: Icon, label, cls }: { icon: React.ElementType; label: string; cls: string }) {
  return (
    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${cls}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-base font-bold text-maroon-800 dark:text-gold-300">{value}</div>
      <div className="text-xs text-maroon-400 dark:text-maroon-500">{label}</div>
    </div>
  );
}
