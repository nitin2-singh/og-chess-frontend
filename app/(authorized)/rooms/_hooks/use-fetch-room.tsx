"use client";

import { axiosInstance } from "@/lib/axios-instance";
import { GetRoomsDto, PaginatedRoomsDto } from "@/types/games";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useRooms() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<PaginatedRoomsDto | null>(null);

  const getRooms = useCallback(async (query: GetRoomsDto) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get<PaginatedRoomsDto>("/rooms", {
        params: query,
      });

      setData(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data?.message ?? "Failed to fetch rooms.");

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    getRooms,
  };
}
