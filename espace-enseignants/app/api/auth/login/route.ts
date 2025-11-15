// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prismaTeacher } from "../../../../../lib/prisma"; 

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // ✅ Recherche de l'enseignant dans la base "esss_teachers"
    const enseignant = await prismaTeacher.teacher.findUnique({
      where: { email },
    });

    if (!enseignant) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // ✅ Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, enseignant.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // ✅ Succès
    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      enseignant: {
        id: enseignant.id,
        nom: enseignant.nom,
        prenom: enseignant.prenom,
        email: enseignant.email,
        grade: enseignant.grade,
        specialite: enseignant.specialite,
        module_enseigne: enseignant.module_enseigne,
      },
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
