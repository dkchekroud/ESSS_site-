import { NextResponse } from "next/server";
import { prismaMain } from "@/lib/prisma";


// ✅ GET — Liste des actualités
export async function GET() {
  try {
    const actualites = await prismaMain.actualite.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(actualites);
  } catch (err) {
    console.error("Erreur GET /actualites:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ✅ POST — Ajouter une actualité
export async function POST(req) {
  try {
    const body = await req.json();
    const nouvelle = await prismaMain.actualite.create({
      data: {
        titre: body.titre,
        description: body.description,
        imageUrl: body.imageUrl,
        auteur: body.auteur,
        date: new Date(body.date),
      },
    });
    return NextResponse.json(nouvelle);
  } catch (err) {
    console.error("Erreur POST /actualites:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
