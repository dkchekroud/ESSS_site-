import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_ENSEIGNANTS } } });

export async function POST(request) {
  try {
    const { email, action, titre, description, fichier } = await request.json();

    const enseignant = await prisma.teacher.findUnique({ where: { email } });
    if (!enseignant) return NextResponse.json({ success: false, message: "Enseignant introuvable" }, { status: 404 });

    if (action === "list") {
      const coursList = await prisma.cours.findMany({
        where: { enseignantId: enseignant.id },
        orderBy: { date_upload: "desc" },
      });
      return NextResponse.json({ success: true, data: coursList });
    }

    if (action === "add") {
      const newCours = await prisma.cours.create({
        data: {
          titre,
          description,
          fichier,
          enseignantId: enseignant.id,
        },
      });
      return NextResponse.json({ success: true, message: "Cours ajouté", data: newCours });
    }

    return NextResponse.json({ success: false, message: "Action non valide" }, { status: 400 });
  } catch (error) {
    console.error("Erreur API /teacher/cours :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

