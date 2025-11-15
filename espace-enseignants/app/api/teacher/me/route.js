import { NextResponse } from "next/server";
import { prismaTeacher } from "@lib/prisma";




export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email manquant" },
        { status: 400 }
      );
    }

    // ✅ Récupération de l’enseignant avec ses relations
    const enseignant = await prismaTeacher.teacher.findUnique({
      where: { email },
      include: {
        cours: true,    // <-- PAS D’ACCOLADE SUPPLÉMENTAIRE ICI !
        notes: true,
        emplois: true,
        recours: true,
      },
    });

    if (!enseignant) {
      return NextResponse.json(
        { success: false, message: "Enseignant introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enseignant });
  } catch (error) {
    console.error("Erreur API /teacher/me :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
