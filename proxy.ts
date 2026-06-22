import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup"];

const PROTECTED_ROUTES = ["/rooms"];

const COOKIE_NAME = process.env.AUTH_COOKIE ?? "access_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isAuthenticated = Boolean(token);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Logged in user visiting login/signup
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  // Guest visiting protected page
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/rooms/:path*"],
};
