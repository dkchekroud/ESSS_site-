import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_ENSEIGNANTS } } });

export async function POST(request) {
  try {
    const { email, action, noteData } = await request.json();

    const enseignant = await prisma.teacher.findUnique({ where: { email } });
    if (!enseignant) return NextResponse.json({ success: false, message: "Enseignant introuvable" }, { status: 404 });

    if (action === "list") {
      const notes = await prisma.note.findMany({
        where: { enseignantId: enseignant.id },
        orderBy: { date_saisie: "desc" },
      });
      return NextResponse.json({ success: true, data: notes });
    }

    if (action === "add") {
      const newNote = await prisma.note.create({
        data: { ...noteData, enseignantId: enseignant.id },
      });
      return NextResponse.json({ success: true, message: "Note enregistrée", data: newNote });
    }

    return NextResponse.json({ success: false, message: "Action non valide" });
  } catch (error) {
    console.error("Erreur API /teacher/notes :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
