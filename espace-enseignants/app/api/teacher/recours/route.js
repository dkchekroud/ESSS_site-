// app/api/teacher/recours/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_ENSEIGNANTS } } });

export async function POST(request) {
  try {
    const { email, action, recoursId, newStatus } = await request.json();

    const enseignant = await prisma.teacher.findUnique({ where: { email } });
    if (!enseignant) return NextResponse.json({ success: false, message: "Enseignant introuvable" }, { status: 404 });

    if (action === "list") {
      const recoursList = await prisma.recours.findMany({
        where: { enseignantId: enseignant.id },
        orderBy: { date_envoi: "desc" },
      });
      return NextResponse.json({ success: true, data: recoursList });
    }

    if (action === "update") {
      const updated = await prisma.recours.update({
        where: { id: recoursId },
        data: { statut: newStatus },
      });
      return NextResponse.json({ success: true, message: "Recours mis à jour", data: updated });
    }

    return NextResponse.json({ success: false, message: "Action invalide" });
  } catch (error) {
    console.error("Erreur API /teacher/recours :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
