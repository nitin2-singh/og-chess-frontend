"use client";

import { useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { toast } from "sonner";

import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/store/game.store";
import { MoveMadeEvent } from "@/types/socket";

export const SOUNDS = {
  MOVE: "/sounds/move.mp3",
  CAPTURE: "/sounds/capture.mp3",
  CHECK: "/sounds/check.mp3",
  CHECKMATE: "/sounds/gameover.mp3",
};

export const playSound = (url: string) => {
  if (typeof window !== "undefined") {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch((err) => console.log("Audio play blocked/failed:", err));
  }
};

export const useGameSocket = (
  roomCode: string,
  setGame: React.Dispatch<React.SetStateAction<Chess>>,
  refetchRoom: () => void,
  onDrawOffered?: (offeredById: string) => void,
  onDrawDeclined?: () => void,
) => {
  // 1. Extract Zustand setters individually to avoid triggering re-renders
  const setFen = useGameStore((state) => state.setFen);
  const setSocketRoomId = useGameStore((state) => state.setSocketRoomId);
  const setConnected = useGameStore((state) => state.setConnected);

  // 2. Keep the latest callbacks in refs.
  const setGameRef = useRef(setGame);
  const refetchRoomRef = useRef(refetchRoom);
  const onDrawOfferedRef = useRef(onDrawOffered);
  const onDrawDeclinedRef = useRef(onDrawDeclined);

  useEffect(() => {
    setGameRef.current = setGame;
    refetchRoomRef.current = refetchRoom;
    onDrawOfferedRef.current = onDrawOffered;
    onDrawDeclinedRef.current = onDrawDeclined;
  }, [setGame, refetchRoom, onDrawOffered, onDrawDeclined]);

  // 3. Main Socket Effect
  useEffect(() => {
    if (!roomCode) return;

    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);

      socket.emit(
        "join-room",
        { roomId: roomCode },
        (response: {
          status?: string;
          error?: string;
          roomId?: string;
          fen: string;
          message?: string;
        }) => {
          if (response?.status === "error" || response?.error) {
            toast.error(response?.message || "Failed to join room");
            return;
          }
          if (response?.roomId) {
            setSocketRoomId(response.roomId);
            setFen(response.fen);
            setGameRef.current(new Chess(response.fen));
            refetchRoomRef.current(); // Refresh details from REST API
          }
        },
      );
    };

    // If socket is already connected when component mounts, trigger logic
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);

    socket.on("player-joined", () => {
      toast.info("Opponent joined!");
      refetchRoomRef.current();
    });

    socket.on("player-reconnected", () => {
      toast.info("Opponent reconnected!");
      refetchRoomRef.current();
    });

    socket.on("move-made", (payload: MoveMadeEvent) => {
      // Determine if the move was made by me by comparing the payload FEN with our store's current FEN.
      // (The active player updates the store's FEN synchronously inside onDrop)
      const isMyMove = useGameStore.getState().fen === payload.fen;

      setGameRef.current(new Chess(payload.fen));
      setFen(payload.fen);

      // Update the moves list in the store with the authoritative list from the server payload.
      // This is broadcasted to both players and is the single source of truth.
      const roomState = useGameStore.getState().room;
      if (roomState) {
        useGameStore.setState({
          room: {
            ...roomState,
            moves: payload.moves || [],
          },
        });
      }

      // Play appropriate sound ONLY if the move was made by the opponent.
      // The active player already played the correct sound (move, capture, check, checkmate)
      // synchronously inside onDrop.
      if (!isMyMove) {
        if (payload.checkmate) {
          playSound(SOUNDS.CHECKMATE);
        } else if (payload.check) {
          playSound(SOUNDS.CHECK);
        } else if (payload.move.captured || payload.move.san.includes("x")) {
          playSound(SOUNDS.CAPTURE);
        } else {
          playSound(SOUNDS.MOVE);
        }
      }

      if (payload.gameOver) {
        refetchRoomRef.current();
      }
    });

    socket.on("game-over", (payload: { reason: string }) => {
      if (
        payload.reason === "resignation" ||
        payload.reason === "draw-agreement"
      ) {
        playSound(SOUNDS.CHECKMATE);
      }
      let message = "Match finished!";
      if (payload.reason === "resignation") {
        message = "Match won by resignation.";
      } else if (payload.reason === "draw-agreement") {
        message = "Match drawn by agreement.";
      }
      toast.success(message);
      refetchRoomRef.current();
    });

    socket.on("draw-offered", (payload: { offeredById: string }) => {
      if (onDrawOfferedRef.current) {
        onDrawOfferedRef.current(payload.offeredById);
      }
    });

    socket.on("draw-declined", () => {
      if (onDrawDeclinedRef.current) {
        onDrawDeclinedRef.current();
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("player-joined");
      socket.off("player-reconnected");
      socket.off("move-made");
      socket.off("game-over");
      socket.off("draw-offered");
      socket.off("draw-declined");
      socket.off("disconnect");
    };

    // Notice we removed setGame and refetchRoom from this array
  }, [roomCode, setConnected, setFen, setSocketRoomId]);
};
