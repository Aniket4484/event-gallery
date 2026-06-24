"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/admin/EventCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Event } from "@/types";
import axios from "axios";

const inputCls = `w-full pl-11 pr-4 py-3 rounded-2xl
  border-2 border-gold-200 dark:border-maroon-700
  bg-white/90 dark:bg-maroon-900/90
  text-maroon-900 dark:text-gold-100
  placeholder-maroon-300 dark:placeholder-maroon-600
  focus:outline-none focus:border-gold-400 dark:focus:border-gold-600
  transition-all text-sm shadow-sm`;

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axios.get<{ data: Event[] }>("/api/events");
      return res.data.data;
    },
  });

  const filtered = (data || []).filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.coupleNames.toLowerCase().includes(search.toLowerCase()) ||
      e.code.includes(search.toUpperCase())
  );

  return (
    <div className="p-5 md:p-8 pt-16 md:pt-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="section-heading">Events</h1>
          <p className="text-maroon-500 dark:text-maroon-400 mt-1 text-sm">
            आपल्या wedding galleries manage करा
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-gradient-to-r from-maroon-700 to-saffron-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-maroon-800 hover:to-saffron-700 transition-all shadow-maroon hover:shadow-maroon-lg hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> New Event
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, couple names, or event code…"
          className={inputCls}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="Events लोड होत आहेत…" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-ivory/60 dark:bg-maroon-900/40 rounded-2xl border-2 border-dashed border-gold-200 dark:border-maroon-800">
          <div className="text-6xl mb-4">💍</div>
          <h3 className="font-serif text-xl text-maroon-700 dark:text-gold-300">
            {search ? "कोणताही event सापडला नाही" : "अजून कोणताही event नाही"}
          </h3>
          <p className="text-maroon-500 dark:text-maroon-400 mt-2 mb-6 text-sm">
            {search ? "वेगळा search करा" : "पहिली Wedding Gallery तयार करा"}
          </p>
          {!search && (
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-maroon-700 to-saffron-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-maroon transition-all"
            >
              <Plus className="w-4 h-4" /> Create First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={(id) => qc.setQueryData<Event[]>(["events"], (old) => old?.filter((e) => e.id !== id) || [])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
