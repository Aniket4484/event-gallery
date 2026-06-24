"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import toast from "react-hot-toast";

const DOWNLOAD_OPTIONS = [
  { value: "VIEW_ONLY",    label: "View Only",            desc: "Guests can view but cannot download", emoji: "👁️" },
  { value: "LOW_QUALITY",  label: "Low Quality Download", desc: "Compressed photos allowed",          emoji: "📥" },
  { value: "FULL_QUALITY", label: "Full Quality Download", desc: "Original high-res photos",          emoji: "🖼️" },
];

const inputCls = `w-full px-4 py-2.5 rounded-xl border-2 border-gold-200 dark:border-maroon-700
  bg-white dark:bg-maroon-900 text-maroon-900 dark:text-gold-100
  placeholder-maroon-300 dark:placeholder-maroon-600
  focus:outline-none focus:border-gold-400 dark:focus:border-gold-600
  transition-all duration-200 text-sm`;

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", coupleNames: "", date: "", venue: "", description: "",
    downloadControl: "VIEW_ONLY", watermarkEnabled: false, watermarkText: "",
    guestUploadEnabled: false, primaryColor: "#800000",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));
  const toggle = (key: string) => () =>
    setForm((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/events", form);
      toast.success("Event तयार झाला! 🪷");
      router.push(`/admin/events/${res.data.data.id}`);
    } catch {
      toast.error("Event तयार होण्यास अयशस्वी");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-8 pt-16 md:pt-8 max-w-2xl">
      <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-maroon-500 hover:text-maroon-700 dark:hover:text-gold-400 transition-colors mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="mb-6">
        <h1 className="section-heading">Create New Event</h1>
        <p className="text-maroon-500 dark:text-maroon-400 mt-1 text-sm">नवीन Wedding Gallery तयार करा</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Event Details */}
        <Card title="Event Details" emoji="💍">
          <Field label="Gallery Name *">
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Sharma-Kulkarni Wedding 2024" className={inputCls} />
          </Field>
          <Field label="Couple Names *">
            <input required value={form.coupleNames} onChange={set("coupleNames")} placeholder="e.g. Priya & Rahul" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Wedding Date *">
              <input required type="date" value={form.date} onChange={set("date")} className={inputCls} />
            </Field>
            <Field label="Venue">
              <input value={form.venue} onChange={set("venue")} placeholder="e.g. Mangal Karyalay" className={inputCls} />
            </Field>
          </div>
          <Field label="Description (Optional)">
            <textarea value={form.description} onChange={set("description")} placeholder="Short wedding description…" rows={2} className={inputCls + " resize-none"} />
          </Field>
        </Card>

        {/* Download Control */}
        <Card title="Download Permission" emoji="📥">
          <div className="space-y-2">
            {DOWNLOAD_OPTIONS.map((opt) => (
              <label key={opt.value} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${form.downloadControl === opt.value ? "border-maroon-600 bg-maroon-50 dark:bg-maroon-900/50" : "border-gold-100 dark:border-maroon-800 hover:border-gold-300"}`}>
                <input type="radio" name="downloadControl" value={opt.value} checked={form.downloadControl === opt.value}
                  onChange={(e) => setForm((p) => ({ ...p, downloadControl: e.target.value }))} className="mt-0.5 accent-maroon-700" />
                <div>
                  <div className="font-semibold text-sm text-maroon-800 dark:text-gold-300">{opt.emoji} {opt.label}</div>
                  <div className="text-xs text-maroon-500 dark:text-maroon-400">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Extra options */}
        <Card title="Extra Options" emoji="⚙️">
          <Toggle label="Enable Watermark" desc="Watermark automatically added to all photos" checked={form.watermarkEnabled} onChange={toggle("watermarkEnabled")} />
          {form.watermarkEnabled && (
            <Field label="Watermark Text">
              <input value={form.watermarkText} onChange={set("watermarkText")} placeholder="e.g. © Priya & Rahul 2024" className={inputCls} />
            </Field>
          )}
          <div className="border-t border-gold-100 dark:border-maroon-800 my-1" />
          <Toggle label="Allow Guest Uploads" desc="Guests can upload their own photos (needs your approval)" checked={form.guestUploadEnabled} onChange={toggle("guestUploadEnabled")} />
        </Card>

        <Button type="submit" loading={isLoading} size="lg" className="w-full">
          🪷 &nbsp; Create Wedding Gallery
        </Button>
      </motion.form>
    </div>
  );
}

function Card({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-5 space-y-4 border-2 border-gold-100 dark:border-maroon-800">
      <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300 flex items-center gap-2">
        <span>{emoji}</span>{title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-maroon-700 dark:text-gold-400">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium text-sm text-maroon-800 dark:text-gold-300">{label}</div>
        <div className="text-xs text-maroon-500 dark:text-maroon-400">{desc}</div>
      </div>
      <button type="button" onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? "bg-maroon-700" : "bg-gold-200 dark:bg-maroon-700"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
