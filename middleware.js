import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const sessionToken = await getToken({ req: request, type: "csrf" });
  const { pathname } = request?.nextUrl;

  const withoutAuthenticationLinks = ["/auth/login", "/auth/register"];
  const withAuthenticationLinks = ["/favorites", "/watchlist", "/settings"];

  if (sessionToken) {
    if (withoutAuthenticationLinks?.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (withAuthenticationLinks?.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  runtime: "experimental-edge",
  unstable_allowDynamic: [
    "/lib/utilities.js",
    "/node_modules/function-bind/**",
  ],
  matcher: [
    "/auth/login",
    "/auth/register",
    "/favorites",
    "/watchlist",
    "/settings",
  ],
};
