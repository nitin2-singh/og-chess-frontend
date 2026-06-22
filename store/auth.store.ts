import { cookies } from "@/lib/cookie";
import { User } from "@/types/auth";
import { create } from "zustand";

interface AuthStore {
  user: User | null;

  isAuthenticated: boolean;

  setUser: (user: User) => void;

  clearUser: () => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  logout: () => {
    cookies.clear();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
