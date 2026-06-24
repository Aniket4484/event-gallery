"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, Download, Users, Image, Camera } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import axios from "axios";
import { CATEGORIES } from "@/lib/utils";

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  guestCount: number;
  photoCount: number;
  guestPhotos: number;
  categoryBreakdown: { category: string; _count: number }[];
}

interface AnalyticsDashboardProps {
  eventId: string;
}

export function AnalyticsDashboard({ eventId }: AnalyticsDashboardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", eventId],
    queryFn: async () => {
      const res = await axios.get<{ data: AnalyticsData }>(`/api/analytics/${eventId}`);
      return res.data.data;
    },
    refetchInterval: 1000 * 30,
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  if (!data) return null;

  const stats = [
    { label: "Total Views", value: data.totalViews, icon: Eye, color: "from-blue-400 to-blue-600" },
    { label: "Downloads", value: data.totalDownloads, icon: Download, color: "from-green-400 to-green-600" },
    { label: "Guests", value: data.guestCount, icon: Users, color: "from-purple-400 to-purple-600" },
    { label: "Photos", value: data.photoCount, icon: Image, color: "from-rose-400 to-pink-600" },
    { label: "Guest Uploads", value: data.guestPhotos, icon: Camera, color: "from-amber-400 to-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Category breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-serif font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Photos by Category
          </h3>
          <div className="space-y-3">
            {data.categoryBreakdown.map(({ category, _count }) => {
              const cat = CATEGORIES.find((c) => c.value === category);
              const pct = data.photoCount > 0 ? (_count / data.photoCount) * 100 : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {cat?.emoji} {cat?.label || category}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {_count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
