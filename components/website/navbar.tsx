"use client";
import { Crown, Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WebsiteNavbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-purple-600">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 hidden xs:block">
            OgChess
          </span>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href={"/login"}>
            <Button
              variant="ghost"
              className="hidden md:inline-flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>

          <Link href={"/signup"}>
            <Button className="h-9 sm:h-10 px-4 sm:px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-all font-medium text-xs sm:text-sm shadow-md">
              Sign Up
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
