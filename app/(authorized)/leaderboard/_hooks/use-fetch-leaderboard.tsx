"use client";

import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios-instance";

export interface LeaderboardEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  wins: number;
}

export interface LeaderboardResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: LeaderboardEntry[];
}

export function useLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardResponse | null>(null);

  const fetchLeaderboard = useCallback(
    async (params: { page: number; limit: number; search?: string }) => {
      try {
        setLoading(true);
        const { data: responseData } = await axiosInstance.get<LeaderboardResponse>(
          "/leaderboard",
          {
            params,
          },
        );
        setData(responseData);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err?.response?.data?.message || "Failed to fetch leaderboard");
        } else {
          setError("Failed to fetch leaderboard");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    data,
    getLeaderboard: fetchLeaderboard,
  };
}
