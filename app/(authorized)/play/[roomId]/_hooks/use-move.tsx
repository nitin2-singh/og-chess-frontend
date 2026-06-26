"use client";

import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/store/game.store";
import { toast } from "sonner";

export const useMove = () => {
  const socketRoomId = useGameStore((state) => state.socketRoomId);

  const makeMove = (from: string, to: string, onRevert?: () => void) => {
    if (!socketRoomId) return;

    getSocket().emit(
      "move",
      {
        roomId: socketRoomId,
        from,
        to,
        promotion: "q",
      },
      (response: any) => {
        // If NestJS returns an error or success: false via WsException
        if (response?.status === "error" || response?.error) {
          toast.error(response.message || "Invalid move");
          if (onRevert) onRevert(); // Fire the revert callback to reset the board
        }
      },
    );
  };

  const resignGame = () => {
    if (!socketRoomId) return;
    getSocket().emit("resign", { roomId: socketRoomId }, (response: any) => {
      if (response?.status === "error" || response?.error) {
        toast.error(response.message || "Failed to resign");
      }
    });
  };

  const offerDraw = () => {
    if (!socketRoomId) return;
    getSocket().emit("offer-draw", { roomId: socketRoomId }, (response: any) => {
      if (response?.status === "error" || response?.error) {
        toast.error(response.message || "Failed to offer draw");
      } else {
        toast.success("Draw offered to opponent!");
      }
    });
  };

  const acceptDraw = () => {
    if (!socketRoomId) return;
    getSocket().emit("accept-draw", { roomId: socketRoomId }, (response: any) => {
      if (response?.status === "error" || response?.error) {
        toast.error(response.message || "Failed to accept draw");
      }
    });
  };

  const declineDraw = () => {
    if (!socketRoomId) return;
    getSocket().emit("decline-draw", { roomId: socketRoomId }, (response: any) => {
      if (response?.status === "error" || response?.error) {
        toast.error(response.message || "Failed to decline draw");
      }
    });
  };

  return {
    makeMove,
    resignGame,
    offerDraw,
    acceptDraw,
    declineDraw,
  };
};
