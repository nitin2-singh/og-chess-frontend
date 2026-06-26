"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Medal,
} from "lucide-react";
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
import { useLeaderboard } from "./_hooks/use-fetch-leaderboard";

const ITEMS_PER_PAGE = 8;

export default function LeaderboardPage() {
  const router = useRouter();
  const { loading, error, data, getLeaderboard } = useLeaderboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getLeaderboard({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, getLeaderboard]);

  const leaderboardList = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || 0;

  // Render rank medal or number
  const renderRank = (index: number) => {
    const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
    if (globalRank === 1) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
          <span className="font-bold text-yellow-500">1</span>
        </div>
      );
    }
    if (globalRank === 2) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Medal className="w-5 h-5 text-slate-400 fill-slate-400/20" />
          <span className="font-bold text-slate-400">2</span>
        </div>
      );
    }
    if (globalRank === 3) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Medal className="w-5 h-5 text-amber-600 fill-amber-600/20" />
          <span className="font-bold text-amber-600">3</span>
        </div>
      );
    }
    return <span className="font-mono text-slate-500">{globalRank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 transition-colors duration-300 relative overflow-hidden p-4 sm:p-8 mt-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-100 w-100 rounded-full bg-indigo-400 dark:bg-indigo-600 opacity-10 dark:opacity-20 blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10 pt-4 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500 shrink-0" />{" "}
              Leaderboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              See the top players ranked by matches won.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/rooms")}
              className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 gap-2 h-10 px-4 rounded-xl shadow-md transition-all flex items-center shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Rooms
            </Button>
          </div>
        </div>

        {/* Search Bar Toolbar */}
        <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-500" /> Player Standings
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-sm rounded-lg"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="p-0 overflow-x-auto">
            {error ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-10 h-10 mb-2" />
                <p className="font-semibold">Failed to load standings</p>
                <p className="text-xs opacity-75">{error}</p>
              </div>
            ) : loading && leaderboardList.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-indigo-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="font-medium">Fetching standings...</p>
              </div>
            ) : leaderboardList.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                <Trophy className="w-10 h-10 mb-2 opacity-35" />
                <p className="font-medium text-sm">No players found</p>
                <p className="text-xs opacity-75">
                  Try adjusting your search criteria or register new users.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#020617]/50">
                    <TableHead className="w-20 text-center font-bold">
                      Rank
                    </TableHead>
                    <TableHead className="font-bold">Player Name</TableHead>
                    <TableHead className="font-bold">Email Address</TableHead>
                    <TableHead className="w-28 text-center font-bold">
                      Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardList.map((entry, index) => (
                    <TableRow
                      key={entry.id}
                      className="border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-center font-medium py-3.5">
                        {renderRank(index)}
                      </TableCell>
                      <TableCell className="font-semibold py-3.5">
                        {entry.first_name} {entry.last_name}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 font-mono py-3.5 text-xs sm:text-sm">
                        {entry.email}
                      </TableCell>
                      <TableCell className="text-center py-3.5">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 text-sm">
                          <Trophy className="w-3.5 h-3.5 shrink-0" />
                          {entry.wins}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Table Footer / Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#020617]/30 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing page{" "}
                <span className="font-bold text-slate-700 dark:text-white">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700 dark:text-white">
                  {totalPages}
                </span>{" "}
                ({totalItems} total)
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || loading}
                  className="bg-white dark:bg-transparent border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
