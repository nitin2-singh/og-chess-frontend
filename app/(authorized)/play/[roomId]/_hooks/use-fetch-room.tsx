"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import { useGameStore } from "@/store/game.store";

export function useRoom(id: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setRoom } = useGameStore();
  const fetchRoom = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(`/rooms/${id}`);

      setRoom(data);
      setError(null);
    } catch (err) {
      if (err instanceof AxiosError)
        setError(err?.response?.data?.message || "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    refetch: fetchRoom,
  };
}
