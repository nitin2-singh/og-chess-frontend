"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  Swords,
  Play,
  Search,
  Trophy,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Hourglass,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Adjust these imports to match your actual file structure
import { PlayerColor, GameStatus, GameResult } from "@/types/games";
import { useCreateRoom } from "./_hooks/use-create-room";
import { useRooms } from "./_hooks/use-fetch-room";
import { DOMAIN_NAME } from "@/lib/constant";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export default function RoomsPage() {
  // Backend Hooks
  const { createRoom, loading: isGenerating } = useCreateRoom();
  const { getRooms, data: roomsData, loading: isLoadingRooms } = useRooms();

  // Create Room State
  const [roomName, setRoomName] = useState("");
  const [colorPref, setColorPref] = useState<"white" | "random" | "black">(
    "random",
  );
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Join State
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();
  // Table & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Rooms Effect (with Debounce for Search)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getRooms({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
      });
    }, 400); // 400ms delay to prevent spamming the API while typing

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, getRooms]);

  const handleCreateRoom = async () => {
    // 1. Decide Color
    let finalColor: PlayerColor;
    if (colorPref === "random") {
      finalColor = Math.random() > 0.5 ? PlayerColor.WHITE : PlayerColor.BLACK;
    } else {
      finalColor =
        colorPref === "white" ? PlayerColor.WHITE : PlayerColor.BLACK;
    }

    // 2. Generate UUID if room name is empty
    const finalRoomName =
      roomName.trim() !== "" ? roomName.trim() : crypto.randomUUID();

    try {
      const response = await createRoom({
        name: finalRoomName,
        color: finalColor,
      });

      // Show the returned room code in the generated link
      if (response && response.data) {
        setGeneratedLink(`${DOMAIN_NAME}/play/${response.data.room_code}`);
      }

      // Refresh the table so the new room appears
      getRooms({ page: 1, limit: ITEMS_PER_PAGE, search: undefined });
      setCurrentPage(1);
      setSearchQuery("");
    } catch (error) {
      // Error is handled by your hook's toast
      console.error("Failed to create room", error);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const copySpecificLink = (roomCode: string) => {
    const link = `${DOMAIN_NAME}/play/${roomCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied!", {
      description: "You can now send this to your opponent.",
    });
  };

  const resetRoomForm = () => {
    setGeneratedLink(null);
    setRoomName("");
    setIsCopied(false);
  };

  const roomsList = roomsData?.rooms || [];
  const totalPages = roomsData?.total_pages || 1;
  const totalItems = roomsData?.total || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 transition-colors duration-300 relative overflow-hidden p-4 sm:p-8 mt-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-100 w-100 rounded-full bg-indigo-400 dark:bg-indigo-600 opacity-10 dark:opacity-20 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 pt-4 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Rooms Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Configure a new match or review your game history.
            </p>
          </div>
          <div>
            <Button
              onClick={() => router.push("/leaderboard")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-10 px-4 rounded-xl shadow-md transition-all flex items-center shrink-0"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Create Room Card */}
          <div className="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-500" /> Host a Match
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Room Name Input */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Room Name (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Friendly Match"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="h-11 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Play as
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "white",
                        label: "White",
                        style: "bg-white border-slate-200",
                      },
                      {
                        id: "random",
                        label: "Random",
                        style:
                          "bg-linear-to-r from-slate-200 to-slate-800 border-transparent",
                      },
                      {
                        id: "black",
                        label: "Black",
                        style: "bg-slate-900 border-slate-800",
                      },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setColorPref(c.id as "black" | "white" | "random")
                        }
                        className={`relative flex flex-col items-center justify-center py-2 rounded-xl border transition-all ${
                          colorPref === c.id
                            ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#0f172a] bg-slate-100 dark:bg-slate-800"
                            : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-sm mb-1.5 ${c.style} ${c.id === "white" ? "dark:bg-slate-200" : ""}`}
                        />
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 capitalize">
                          {c.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!generatedLink ? (
                <motion.div
                  key="create-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    onClick={handleCreateRoom}
                    disabled={isGenerating}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md dark:shadow-none"
                  >
                    {isGenerating ? "Creating Room..." : "Generate Link"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="share-link"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-sm flex items-center overflow-hidden">
                      <span className="truncate">{generatedLink}</span>
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      className="h-auto px-4 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shrink-0"
                    >
                      {isCopied ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={resetRoomForm}
                    className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/5"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Create another room
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Join Room Card */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-500" /> Join via Code
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Paste room code (e.g. x9f2a)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="h-12 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <Button
                onClick={() => {
                  const id = joinCode.split("/").pop();
                  if (id) router.push(`/play/${id}`);
                  else {
                    toast.error("Invalid Code");
                  }
                }}
                disabled={!joinCode.trim()}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 rounded-xl transition-all"
              >
                Join Match
              </Button>
            </div>
          </div>
        </div>

        {/* Shadcn UI Table Section */}
        <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-slate-500" /> Match History
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-sm rounded-lg"
              />
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto relative min-h-75">
            {isLoadingRooms && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  <RotateCcw className="w-5 h-5 animate-spin" /> Loading
                  rooms...
                </span>
              </div>
            )}

            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                <TableRow className="border-slate-200 dark:border-white/5">
                  <TableHead className="w-75 pl-6">Room / Players</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="pr-6">Date Created</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomsList.length > 0 ? (
                  roomsList.map((room) => {
                    const isFinished = room.status === GameStatus.FINISHED;

                    return (
                      <TableRow
                        key={room.id}
                        onClick={() => router.push(`/play/${room.room_code}`)}
                        className="border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {/* Room Name & Players */}
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white truncate">
                              {room.name}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {room.white_player
                                ? room.white_player.first_name
                                : "Waiting"}
                              <span className="text-xs px-1 text-slate-400">
                                vs
                              </span>
                              {room.black_player
                                ? room.black_player.first_name
                                : "Waiting"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status / Result */}
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                              room.status === GameStatus.WAITING
                                ? "bg-amber-100 text-amber-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                                : room.status === GameStatus.PLAYING
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {room.status === GameStatus.WAITING && (
                              <Hourglass className="w-3 h-3" />
                            )}
                            {room.status === GameStatus.PLAYING && (
                              <Play className="w-3 h-3" />
                            )}
                            {isFinished && <Trophy className="w-3 h-3" />}

                            <span className="capitalize">
                              {isFinished && room.result
                                ? room.result === GameResult.DRAW
                                  ? "Draw"
                                  : `${room.result} Won`
                                : room.status.toLowerCase()}
                            </span>
                          </span>
                        </TableCell>

                        {/* Code Details */}
                        <TableCell>
                          <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-slate-600 dark:text-slate-300">
                            {room.room_code}
                          </span>
                        </TableCell>

                        {/* Date Created */}
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400 pr-6">
                          {new Date(
                            Number(room.created_at * 1000),
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        {/* Action - Conditional Copy Link */}
                        <TableCell className="pr-6 text-right">
                          {!isFinished && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking the row
                                copySpecificLink(room.room_code);
                              }}
                              className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            >
                              <Copy className="w-4 h-4 mr-1.5 hidden sm:inline" />
                              Copy Link
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-slate-500 dark:text-slate-400"
                    >
                      {isLoadingRooms
                        ? ""
                        : `No rooms found${searchQuery ? ` matching "${searchQuery}"` : ""}.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-white/2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {totalItems}
                </span>{" "}
                rooms
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
