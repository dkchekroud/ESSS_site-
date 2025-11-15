import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 🔹 Appliquer uniquement sur les routes /admin/*
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // 🚫 Si aucun token → rediriger vers /admin-login
  if (!token) {
    console.log("🔒 Aucun token détecté");
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    console.log("✅ Token décodé :", payload);

    // ✅ Vérification des rôles
    if (pathname.startsWith("/admin/super")) {
      if (payload.role !== "superadmin") {
        console.log("🚫 Accès refusé : non superadmin");
        const deniedUrl = new URL("/access-denied", req.url);
        deniedUrl.searchParams.set("reason", "Accès réservé aux Super Administrateurs.");
        return NextResponse.redirect(deniedUrl);
      }
    }

    if (pathname.startsWith("/admin/espace")) {
      if (!["admin", "superadmin"].includes(payload.role)) {
        console.log("🚫 Accès refusé : rôle non autorisé");
        const deniedUrl = new URL("/access-denied", req.url);
        deniedUrl.searchParams.set("reason", "Accès réservé aux Administrateurs.");
        return NextResponse.redirect(deniedUrl);
      }
    }

    // ✅ Autoriser sinon
    return NextResponse.next();
  } catch (err) {
    console.error("⛔ Erreur de vérification JWT :", err.message);
    const deniedUrl = new URL("/admin-login", req.url);
    deniedUrl.searchParams.set("reason", "Session expirée ou invalide.");
    return NextResponse.redirect(deniedUrl);
  }
}

// 🔧 Important : le matcher doit couvrir tout l’espace admin
export const config = {
  matcher: ["/admin/:path*"],
};
