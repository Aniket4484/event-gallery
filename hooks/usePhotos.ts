"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Photo } from "@/types";

export function usePhotos(eventId: string, category?: string) {
  return useQuery({
    queryKey: ["photos", eventId, category],
    queryFn: async () => {
      const params = category && category !== "ALL" ? `?category=${category}` : "";
      const res = await axios.get<{ data: Photo[]; pagination: { total: number } }>(
        `/api/events/${eventId}/photos${params}`
      );
      return res.data;
    },
    enabled: !!eventId,
    refetchInterval: 8000,
    staleTime: 1000 * 5,
  });
}
