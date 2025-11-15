import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (pathname.startsWith("/admin/super") && payload.role !== "superadmin") {
      const denied = new URL("/access-denied", req.url);
      denied.searchParams.set("reason", "Accès réservé aux Super Administrateurs.");
      return NextResponse.redirect(denied);
    }

    if (pathname.startsWith("/admin/espace") && !["admin", "superadmin"].includes(payload.role)) {
      const denied = new URL("/access-denied", req.url);
      denied.searchParams.set("reason", "Accès réservé aux Administrateurs.");
      return NextResponse.redirect(denied);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT invalide :", err);
    const denied = new URL("/admin-login", req.url);
    denied.searchParams.set("reason", "Session expirée.");
    return NextResponse.redirect(denied);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
