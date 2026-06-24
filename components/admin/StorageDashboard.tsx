"use client";

import { useQuery } from "@tanstack/react-query";
import { HardDrive, Zap, Image, Activity } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import axios from "axios";

interface UsageData {
  storage: { usage: number; limit: number };
  bandwidth: { usage: number; limit: number };
  objects: { usage: number; limit: number };
  transformations: { usage: number; limit: number };
}

function UsageBar({ label, usage, limit, icon: Icon, color }: {
  label: string;
  usage: number;
  limit: number;
  icon: React.ElementType;
  color: string;
}) {
  const pct = limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Icon className={`w-4 h-4 ${color}`} />
          {label}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {formatBytes(usage)} / {formatBytes(limit)}
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            pct > 85 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-gradient-to-r from-rose-400 to-pink-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-400">{pct.toFixed(1)}% used</div>
    </div>
  );
}

export function StorageDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => {
      const res = await axios.get<{ data: UsageData }>("/api/admin/storage");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading storage data..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-gray-400">
        <HardDrive className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Could not load storage data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Storage Used"
          value={formatBytes(data.storage.usage)}
          icon={HardDrive}
          color="text-rose-500"
          bg="bg-rose-50 dark:bg-rose-900/20"
        />
        <StatCard
          label="Bandwidth"
          value={formatBytes(data.bandwidth.usage)}
          icon={Activity}
          color="text-blue-500"
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Images Stored"
          value={data.objects.usage.toLocaleString()}
          icon={Image}
          color="text-amber-500"
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard
          label="Transformations"
          value={data.transformations.usage.toLocaleString()}
          icon={Zap}
          color="text-purple-500"
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      <div className="space-y-4">
        <UsageBar
          label="Storage"
          usage={data.storage.usage}
          limit={data.storage.limit}
          icon={HardDrive}
          color="text-rose-500"
        />
        <UsageBar
          label="Bandwidth"
          usage={data.bandwidth.usage}
          limit={data.bandwidth.limit}
          icon={Activity}
          color="text-blue-500"
        />
        <UsageBar
          label="Transformations"
          usage={data.transformations.usage}
          limit={data.transformations.limit}
          icon={Zap}
          color="text-purple-500"
        />
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, color, bg,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</div>
    </div>
  );
}
