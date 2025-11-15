// app/api/student/login/route.js
// app/api/student/login/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("🔹 Tentative de connexion:", email, password);

    // Vérifie si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      console.log("❌ Étudiant introuvable:", email);
      return NextResponse.json(
        { success: false, message: "Étudiant introuvable" },
        { status: 404 }
      );
    }

    console.log("✅ Étudiant trouvé:", student.email);

    // 🔐 Compare le mot de passe hashé avec bcrypt
    const passwordMatch = await bcrypt.compare(password, student.password);

    if (!passwordMatch) {
      console.log("❌ Mot de passe incorrect");
      return NextResponse.json(
        { success: false, message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    console.log("✅ Connexion réussie !");
    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      student: {
        id: student.id,
        nom: student.nom,
        prenom: student.prenom,
        email: student.email,
        filiere: student.filiere,
        section: student.section,
        annee: student.annee,
      },
    });
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
