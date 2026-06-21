"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Zap,
  ChevronRight,
  Swords,
  Link as LinkIcon,
  History,
  Coffee,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function HonestChessLanding() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-300">
      {/* Dynamic Grid Background - Light & Dark Mode Supported */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-20 dark:opacity-20 blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-32 sm:pt-40 pb-20 max-w-7xl mx-auto text-center">
        {/* Animated Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium mb-8 shadow-sm backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          v1.0 is live. No sign-up required.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1] text-slate-900 dark:text-white"
        >
          Simple 1v1 Chess. <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-indigo-500 to-purple-600 dark:from-white dark:to-white/40">
            Play instantly.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-light px-4"
        >
          A fast, no-nonsense chess board built for playing with friends.
          Generate a link, send it over, and start moving pieces. No algorithms,
          no wait times.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-lg rounded-xl font-semibold shadow-lg shadow-indigo-500/20 dark:shadow-none"
          >
            Start a Game
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 bg-white dark:bg-transparent text-slate-700 dark:text-white shadow-sm dark:shadow-none"
          >
            How it works
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Floating Chess Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.4 }}
          className="mt-24 w-full max-w-5xl relative px-4 sm:px-0"
        >
          {/* Glowing backdrop for the image/board */}
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-400 to-purple-400 dark:from-indigo-500 dark:to-purple-600 rounded-2xl blur opacity-30 dark:opacity-20 animate-pulse"></div>

          <div className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl p-2 md:p-4 flex items-center justify-center min-h-100 overflow-hidden">
            {/* Fake Dashboard UI */}
            <div className="w-full h-full flex flex-col gap-4">
              <div className="h-10 w-full border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400 dark:bg-emerald-500/50"></div>
              </div>
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-125 h-125 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl"
                ></motion.div>
                <Swords className="w-24 h-24 sm:w-32 sm:h-32 text-slate-200 dark:text-white/10 z-10" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Honest Moving Marquee */}
      <div className="w-full bg-slate-100 dark:bg-white/5 border-y border-slate-200 dark:border-white/10 py-4 overflow-hidden flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex gap-8 sm:gap-16 items-center w-max px-4 sm:px-8 text-sm sm:text-base text-slate-700 dark:text-slate-300"
        >
          {/* Duplicating content for seamless loop */}
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <Users className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />{" "}
                <span>2 Players Currently Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-mono">1. e4</span>{" "}
                <span>Guest_42 started a game</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />{" "}
                <span>Room &apos;x9f2a&apos; was just created</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="text-orange-400 w-4 h-4 sm:w-5 sm:h-5" />{" "}
                <span>No ads, no tracking. Just chess.</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Realistic Bento Grid Features */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-20 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-slate-900 dark:text-white">
            Everything you need. <br className="md:hidden" /> Nothing you
            don&apos;t.
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto sm:mx-0">
            We skipped the global leaderboards and AI fraud detection. This is
            just a really fast, perfectly synced board for you and a friend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[300px]">
          {/* Feature 1 - Large Card */}
          <InteractiveCard className="md:col-span-2 relative overflow-hidden bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 min-h-62.5 md:min-h-0 shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-50">
              <LinkIcon className="w-16 h-16 sm:w-24 sm:h-24 text-slate-400 dark:text-white/5" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-end p-6 sm:p-8">
              <div className="mb-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
                <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Share a Link to Play
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
                Click create, copy the URL, and paste it to a friend. As soon as
                they join, the game begins. No lobbies or friend requests
                needed.
              </p>
            </div>
          </InteractiveCard>

          {/* Feature 2 - Small Card */}
          <InteractiveCard className="relative overflow-hidden bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 min-h-50 md:min-h-0 shadow-sm dark:shadow-none">
            <div className="relative z-10 flex flex-col h-full justify-end p-6 sm:p-8">
              <div className="mb-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center border border-purple-200 dark:border-purple-500/30">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Move History
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Standard PGN notation tracks every move so you can review the
                game afterwards.
              </p>
            </div>
          </InteractiveCard>

          {/* Feature 3 - Small Card */}
          <InteractiveCard className="relative overflow-hidden bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 min-h-50 md:min-h-0 shadow-sm dark:shadow-none">
            <div className="relative z-10 flex flex-col h-full justify-end p-6 sm:p-8">
              <div className="mb-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 dark:bg-yellow-500/20 flex items-center justify-center border border-amber-200 dark:border-yellow-500/30">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Real-Time Sync
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Powered by fast WebSockets. When you drop a piece, it updates on
                their screen instantly.
              </p>
            </div>
          </InteractiveCard>

          {/* Feature 4 - Large Card */}
          <InteractiveCard className="md:col-span-2 relative overflow-hidden bg-slate-100 dark:bg-linear-to-br dark:from-slate-900 dark:to-indigo-950/30 border-slate-200 dark:border-white/10 border min-h-62.5 md:min-h-0 shadow-sm dark:shadow-none">
            <div className="absolute -right-10 -bottom-10 sm:-right-20 sm:-bottom-20 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-end p-6 sm:p-8">
              <div className="mb-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Completely Free. No Ads.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
                Chess shouldn&apos;t have pop-ups or require a premium
                subscription to play with a friend. We built this because we
                just wanted to play.
              </p>
            </div>
          </InteractiveCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 sm:py-4 px-4 sm:px-6 mt-10 sm:mt-20 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-white/10">
              <Crown className="w-4 h-4 text-indigo-600 dark:text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              OgChess
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} OgChess. Built for fun.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Hover Spotlight Card Component - Updated for Light/Dark mode compatibility
function InteractiveCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // To handle the spotlight color in light vs dark mode
  const { theme } = useTheme();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const spotlightColor =
    theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl border transition-colors duration-300 ${className}`}
    >
      {/* Spotlight Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition duration-300 hidden sm:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
