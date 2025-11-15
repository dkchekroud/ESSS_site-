import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_ENSEIGNANTS } } });

export async function POST(request) {
  try {
    const { email, action, emploi } = await request.json();

    const enseignant = await prisma.teacher.findUnique({ where: { email } });
    if (!enseignant) return NextResponse.json({ success: false, message: "Enseignant introuvable" }, { status: 404 });

    if (action === "list") {
      const emplois = await prisma.emploiDuTemps.findMany({
        where: { enseignantId: enseignant.id },
        orderBy: { jour: "asc" },
      });
      return NextResponse.json({ success: true, data: emplois });
    }

    if (action === "add") {
      const newEmploi = await prisma.emploiDuTemps.create({
        data: { ...emploi, enseignantId: enseignant.id },
      });
      return NextResponse.json({ success: true, message: "Emploi ajouté", data: newEmploi });
    }

    return NextResponse.json({ success: false, message: "Action invalide" });
  } catch (error) {
    console.error("Erreur API /teacher/emploi :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
