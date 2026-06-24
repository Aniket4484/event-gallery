"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { Download, Copy, ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface QRCodeModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ event, isOpen, onClose }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const galleryUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/gallery/${event.code}`
      : `/gallery/${event.code}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(galleryUrl);
    toast.success("Gallery link copied! 📋");
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 500; canvas.height = 500;
      ctx!.fillStyle = "#FDF5E6";
      ctx!.fillRect(0, 0, 500, 500);
      ctx!.drawImage(img, 50, 50, 400, 400);
      const a = document.createElement("a");
      a.download = `QR-${event.code}-${event.name}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🪷 Gallery QR Code" size="sm">
      <div className="p-6 space-y-5">
        {/* QR code */}
        <div className="flex flex-col items-center gap-4">
          <div
            ref={qrRef}
            className="p-4 bg-ivory rounded-2xl border-2 border-gold-300 shadow-gold"
          >
            <QRCode value={galleryUrl} size={180} level="H" fgColor="#800000" />
          </div>
          <div className="text-center">
            <div className="font-script text-2xl text-maroon-700 dark:text-gold-400">{event.coupleNames}</div>
            <div className="text-sm text-maroon-500 dark:text-maroon-400">{formatDate(event.date)}</div>
            {event.venue && <div className="text-xs text-maroon-400 dark:text-maroon-500">{event.venue}</div>}
          </div>
        </div>

        {/* Event code */}
        <div className="text-center">
          <p className="text-xs text-maroon-400 dark:text-maroon-500 mb-1 uppercase tracking-widest">Event Code</p>
          <div className="text-3xl font-mono font-bold tracking-[0.3em] text-gold-400 bg-maroon-800 dark:bg-maroon-900 px-6 py-3 rounded-xl inline-block">
            {event.code}
          </div>
        </div>

        {/* URL */}
        <div className="bg-maroon-50 dark:bg-maroon-900/50 rounded-xl p-3 border border-gold-100 dark:border-maroon-800">
          <p className="text-xs text-maroon-400 mb-1">Gallery Link</p>
          <p className="text-xs text-maroon-700 dark:text-gold-400 break-all font-mono">{galleryUrl}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={copyLink} variant="secondary" size="sm" className="flex-1">
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </Button>
          <Button onClick={downloadQR} variant="gold" size="sm" className="flex-1">
            <Download className="w-3.5 h-3.5" /> Download QR
          </Button>
        </div>

        <a href={galleryUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-sm text-maroon-600 dark:text-gold-500 hover:text-maroon-800 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> Open Gallery
        </a>
      </div>
    </Modal>
  );
}
