"use client";

import { axiosInstance } from "@/lib/axios-instance";
import { CreateRoomDto, RoomResponseDto } from "@/types/games";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCreateRoom() {
  const [loading, setLoading] = useState(false);

  const [room, setRoom] = useState<RoomResponseDto | null>(null);

  const createRoom = useCallback(async (data: CreateRoomDto) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post<RoomResponseDto>(
        "/rooms",
        data,
      );

      setRoom(response.data);

      toast.success("Room created successfully.");

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message ?? "Failed to create room.");
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    room,
    loading,
    createRoom,
  };
}
