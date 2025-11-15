import { prismaAdmin } from "@/lib/prisma"; // ✅ Base ESSS_Admins
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 🧩 Vérif champs requis
    if (!email || !password) {
      return Response.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // 🔹 Chercher l'administrateur par email
    const admin = await prismaAdmin.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return Response.json(
        { error: "Aucun compte trouvé avec cet email." },
        { status: 404 }
      );
    }

    // 🔹 Vérifier le mot de passe
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return Response.json(
        { error: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

    // 🔹 Générer un JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // 🔹 Créer le cookie sécurisé
    const cookieStore = cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 2 * 60 * 60, // 2 heures
    });

    console.log("🔐 Connexion réussie :", admin.email, "→ rôle :", admin.role);

    // ✅ Réponse selon le rôle
    return Response.json({
      message: "Connexion réussie ✅",
      role: admin.role,
      redirectTo:
        admin.role === "superadmin"
          ? "/admin/super"
          : "/admin/espace", // à adapter à ton app
    });
  } catch (error) {
    console.error("Erreur serveur login:", error);
    return Response.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
