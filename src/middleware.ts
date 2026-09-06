import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isBienestarRoute = pathname.startsWith("/bienestar");

  if (!isAdminRoute && !isDashboardRoute && !isBienestarRoute) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isBienestarRoute && role !== "SUPERUSER") {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
  }

  if ((isAdminRoute || isDashboardRoute) && role !== "ADMIN" && role !== "SUPERUSER") {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/bienestar/:path*"],
};
