"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Chess } from "chess.js";
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard";
import {
  User,
  Flag,
  Share2,
  Loader2,
  Swords,
  Clock,
  History,
  Trophy,
  AlertCircle,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useGameStore } from "@/store/game.store";
import { useAuthStore } from "@/store/auth.store";
import { GameStatus, GameResult } from "@/types/games";
import { useRoom } from "./_hooks/use-fetch-room";

import { useGameSocket, playSound, SOUNDS } from "./_hooks/use-game-socket";
import { useMove } from "./_hooks/use-move";
import { DOMAIN_NAME } from "@/lib/constant";

export default function DefaultPlayPage() {
  const { roomId } = useParams<{ roomId: string }>();

  // Backend & Auth State
  const { loading, error, refetch } = useRoom(roomId);
  const { room } = useGameStore();
  const { user: currentUser } = useAuthStore();

  // Local Chess Engine State
  const [game, setGame] = useState(new Chess());
  const [drawOfferFrom, setDrawOfferFrom] = useState<string | null>(null);
  const movesEndRef = useRef<HTMLTableRowElement>(null);

  const { makeMove, resignGame, offerDraw, acceptDraw, declineDraw } =
    useMove();

  const isWhite = room?.white_player?.id === currentUser?.id;
  const isBlack = room?.black_player?.id === currentUser?.id;

  // We pass 'refetch' into the socket so it can reload data when players join or the game ends
  useGameSocket(
    roomId,
    setGame,
    refetch,
    (offeredById) => {
      if (offeredById !== currentUser?.id) {
        setDrawOfferFrom(offeredById);
      }
    },
    () => {
      setDrawOfferFrom(null);
    },
  );

  // Unlock audio context on first user click/keydown to bypass strict browser autoplay limits
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio(SOUNDS.MOVE);
      audio.volume = 0.01;
      audio
        .play()
        .then(() => {
          document.removeEventListener("click", unlock);
          document.removeEventListener("keydown", unlock);
        })
        .catch(() => {});
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    movesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [game]);

  // Handle piece drop logic (Optimistic Update)
  function onDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (room?.status !== GameStatus.PLAYING) return false;
    if (!targetSquare) return false;

    const currentTurn = game.turn();
    const isMyTurn =
      (currentTurn === "w" && isWhite) || (currentTurn === "b" && isBlack);

    if (!isMyTurn) {
      toast.error("It is not your turn!");
      return false;
    }

    // 1. Save current state in case the server rejects the move
    const previousFen = game.fen();
    const gameCopy = new Chess(previousFen);

    try {
      // 2. Validate locally
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move) {
        // 3. Update the UI instantly (Optimistic Update)
        setGame(gameCopy);
        useGameStore.getState().setFen(gameCopy.fen());
        if (room) {
          useGameStore.setState({
            room: {
              ...room,
              moves: [...(room.moves || []), move.san],
            },
          });
        }

        // Play correct sound instantly based on move consequence
        if (gameCopy.isCheckmate()) {
          playSound(SOUNDS.CHECKMATE);
        } else if (gameCopy.inCheck()) {
          playSound(SOUNDS.CHECK);
        } else if (move.captured || move.san.includes("x")) {
          playSound(SOUNDS.CAPTURE);
        } else {
          playSound(SOUNDS.MOVE);
        }

        // 4. Send to backend, pass a callback to revert if it fails (e.g., not your turn)
        makeMove(sourceSquare, targetSquare, () => {
          setGame(new Chess(previousFen)); // Revert board
          useGameStore.getState().setFen(previousFen); // Revert store FEN
          if (room) {
            useGameStore.setState({
              room: {
                ...room,
                moves: room.moves ? room.moves.slice(0, -1) : [],
              },
            });
          }
        });

        return true;
      }
    } catch (e) {
      console.log("Error", e);
      return false; // Invalid move locally
    }
    return false;
  }

  const handleCopyLink = () => {
    if (room?.room_code) {
      const link = `${DOMAIN_NAME}/play/${room.room_code}`;
      navigator.clipboard.writeText(link);
      toast.success("Link copied!", {
        description: "Send this to your opponent to start.",
      });
    }
  };

  const moveHistory = room?.moves || [];
  const chunkedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    chunkedMoves.push({
      turn: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || "",
    });
  }

  // Loading State
  if (loading && !room) {
    return (
      <div className="h-dvh bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium animate-pulse">Loading Room Data...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-dvh bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center text-slate-900 dark:text-slate-50 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Room not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <Button
          onClick={() => (window.location.href = "/rooms")}
          className="bg-slate-900 text-white dark:bg-white dark:text-slate-950"
        >
          Back to Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 transition-colors duration-300 flex flex-col overflow-hidden">
      {/* Navbar / Header Area */}
      <header className="border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30">
            <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-tight truncate max-w-35 sm:max-w-xs">
              {room?.name || "Friendly Match"}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
              Code: {room?.room_code}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-7 sm:h-8 px-2 sm:px-3 bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
          >
            <Share2 className="w-3.5 h-3.5 sm:mr-1.5" />{" "}
            <span className="hidden sm:inline">Share Link</span>
          </Button>
        </div>
      </header>

      {/* Main Game Layout */}
      <main className="flex-1 w-full max-w-350 mx-auto p-2 sm:p-4 flex flex-col lg:flex-row items-center lg:items-stretch justify-start lg:justify-center gap-3 sm:gap-4 lg:gap-6 overflow-hidden">
        {/* LEFT: Chess Board Container */}
        <div className="flex flex-col items-center justify-center w-full max-w-[min(100vw-16px,450px)] lg:max-w-[min(85vh,100%)] shrink-0 gap-3">
          {drawOfferFrom && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-medium text-indigo-900 dark:text-indigo-200">
                  Opponent has offered a draw.
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => {
                    acceptDraw();
                    setDrawOfferFrom(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 sm:h-8 text-xs px-2.5 sm:px-3"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    declineDraw();
                    setDrawOfferFrom(null);
                  }}
                  className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 h-7 sm:h-8 text-xs px-2.5 sm:px-3"
                >
                  Decline
                </Button>
              </div>
            </motion.div>
          )}

          <div className="w-full aspect-square rounded-md overflow-hidden shadow-2xl ring-2 sm:ring-4 ring-slate-200/50 dark:ring-white/5 relative">
            {/* Overlay: WAITING */}
            {room?.status === GameStatus.WAITING && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-[#020617]/70 backdrop-blur-sm flex flex-col items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center mx-4 max-w-[85%]"
                >
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 animate-spin mb-3 sm:mb-4" />
                  <h2 className="text-base sm:text-lg font-bold mb-1">
                    Waiting for opponent
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Share the room code to start.
                  </p>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-9 sm:h-10 text-sm"
                  >
                    Copy Link
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Overlay: FINISHED */}
            {room?.status === GameStatus.FINISHED && (
              <div className="absolute inset-0 z-10 bg-white/60 dark:bg-[#020617]/70 backdrop-blur-sm flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#0f172a] p-4 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 flex flex-col items-center text-center mx-4 max-w-[85%]"
                >
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mb-3 sm:mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">
                    Match Finished
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
                    {room?.result === GameResult.DRAW
                      ? "It's a Draw!"
                      : `${room?.result} won.`}
                  </p>
                  <div className="w-full">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm h-9 sm:h-10"
                      onClick={() => (window.location.href = "/rooms")}
                    >
                      Back to Rooms
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: onDrop,
                animationDurationInMs: 200,
                darkSquareStyle: { backgroundColor: "#475569" },
                lightSquareStyle: { backgroundColor: "#cbd5e1" },
                allowDragging: room?.status === GameStatus.PLAYING,
                boardOrientation: isBlack ? "black" : "white",
                canDragPiece: ({ piece }) => {
                  if (room?.status !== GameStatus.PLAYING) return false;
                  const currentTurn = game.turn();
                  const isMyTurn =
                    (currentTurn === "w" && isWhite) ||
                    (currentTurn === "b" && isBlack);
                  if (!isMyTurn) return false;
                  return (
                    (currentTurn === "w" && piece.pieceType.startsWith("w")) ||
                    (currentTurn === "b" && piece.pieceType.startsWith("b"))
                  );
                },
              }}
            />
          </div>
        </div>

        {/* RIGHT/BOTTOM: Sidebar */}
        <div className="flex-1 w-full lg:max-w-100 flex flex-col bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm shrink min-h-50">
          {/* Top Player (Opponent) */}
          <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-xs sm:text-sm truncate">
                  {room?.black_player
                    ? `${room.black_player.first_name} ${room.black_player.last_name}`
                    : "Waiting..."}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Black
                </p>
              </div>
            </div>
          </div>

          {/* Moves Tab Header */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#020617]/50 shrink-0">
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Move History
            </h2>
          </div>

          {/* Move History List */}
          <div className="flex-1 overflow-y-auto">
            {chunkedMoves.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">
                  {room?.status === GameStatus.WAITING
                    ? "Waiting to start..."
                    : "Make your first move!"}
                </p>
              </div>
            ) : (
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="sticky top-0 bg-slate-100 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs shadow-sm z-10">
                  <tr>
                    <th className="px-3 sm:px-4 py-1.5 sm:py-2 w-12 sm:w-16 text-center border-r border-slate-200 dark:border-white/5">
                      #
                    </th>
                    <th className="px-3 sm:px-4 py-1.5 sm:py-2 w-1/2 border-r border-slate-200 dark:border-white/5">
                      White
                    </th>
                    <th className="px-3 sm:px-4 py-1.5 sm:py-2 w-1/2">Black</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-700 dark:text-slate-300">
                  {chunkedMoves.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                    >
                      <td className="px-3 sm:px-4 py-1.5 sm:py-2 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-white/2 border-r border-slate-100 dark:border-white/5">
                        {row.turn}.
                      </td>
                      <td className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium border-r border-slate-100 dark:border-white/5">
                        {row.white}
                      </td>
                      <td className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium">
                        {row.black}
                      </td>
                    </tr>
                  ))}
                  <tr ref={movesEndRef} />
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom Player (You) */}
          <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-xs sm:text-sm truncate">
                  {room?.white_player
                    ? `${room.white_player.first_name} ${room.white_player.last_name}`
                    : "Waiting..."}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  White
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-2 sm:p-3 border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#020617]/50 flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={offerDraw}
              disabled={room?.status !== GameStatus.PLAYING}
              className="flex-1 bg-white dark:bg-transparent border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 h-8 sm:h-10 text-xs sm:text-sm"
            >
              <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
              Draw
            </Button>
            <Button
              variant="destructive"
              onClick={resignGame}
              disabled={room?.status !== GameStatus.PLAYING}
              className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
            >
              <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />{" "}
              Resign
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
