"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Crown, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";

export default function WebsiteNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const { user, logout } = useAuthStore();

  const avatar =
    user &&
    `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(
      `${user.first_name} ${user.last_name}`,
    )}&backgroundType=gradientLinear`;

  if (pathname.includes("/play/")) return null;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 shadow-lg shadow-indigo-500/20">
            <Crown className="h-5 w-5 text-white" />
          </div>

          <span className="hidden bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400 sm:block">
            OgChess
          </span>
        </button>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden md:flex">
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="rounded-full px-6">Sign Up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Avatar className="h-8 w-8 border-2 border-slate-200 shadow-md dark:border-slate-700">
                    <AvatarImage src={avatar ?? ""} />

                    <AvatarFallback>
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 rounded-2xl">
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={avatar ?? ""} />

                      <AvatarFallback>{user.first_name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold">
                        {user.first_name} {user.last_name}
                      </h4>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.push("/rooms")}
                  className="cursor-pointer py-3"
                >
                  <User className="mr-2 h-4 w-4" />
                  Rooms
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => {
                    logout();
                    router.replace("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
