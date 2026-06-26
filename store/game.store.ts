import { RoomResponseDto } from "@/types/games";
import { create } from "zustand";

interface GameStore {
  room: RoomResponseDto | null;

  socketRoomId: string | null;

  fen: string;

  connected: boolean;

  setRoom: (room: RoomResponseDto) => void;

  setFen: (fen: string) => void;

  setSocketRoomId: (id: string) => void;

  setConnected: (value: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  room: null,

  socketRoomId: null,

  fen: "",

  connected: false,

  setRoom: (room) => set({ room }),

  setFen: (fen) => set({ fen }),

  setSocketRoomId: (socketRoomId) => set({ socketRoomId }),

  setConnected: (connected) => set({ connected }),
}));
