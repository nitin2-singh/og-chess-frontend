"use client";

import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function PseduoComponent() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const callRefresh = async () => {
      const res = await axiosInstance.get("/auth/me");
      if (res.data) {
        setUser(res.data);
      }
    };

    callRefresh();
  }, [setUser]);

  return null;
}
