// app/api/student/emploi/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🔹 Récupère les emplois du temps selon la filière, section et année
export async function POST(request) {
  try {
    const { filiere, section, annee } = await request.json();

    if (!filiere || !section || !annee) {
      return NextResponse.json(
        { success: false, message: "Données manquantes" },
        { status: 400 }
      );
    }

    const emplois = await prisma.emploi.findMany({
      where: { filiere, section, annee },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data: emplois });
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
