"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Event } from "@/types";

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axios.get<{ data: Event }>(`/api/events/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useEventByCode(code: string) {
  return useQuery({
    queryKey: ["gallery-event", code],
    queryFn: async () => {
      const res = await axios.get<{ data: Event }>(`/api/events/code/${code}`);
      return res.data.data;
    },
    enabled: !!code,
  });
}
