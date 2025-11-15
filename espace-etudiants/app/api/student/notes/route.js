// app/api/student/notes/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🔹 Récupère les notes de l’étudiant selon son email ou matricule
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email manquant" },
        { status: 400 }
      );
    }

    // Vérifie si l’étudiant existe
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Étudiant introuvable" },
        { status: 404 }
      );
    }

    // Récupère ses notes
    const notes = await prisma.note.findMany({
      where: { studentId: student.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

