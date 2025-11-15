import { NextResponse } from "next/server";
import { prismaMain } from "@/lib/prisma";

// ✅ Route publique : retourne toutes les actualités
export async function GET() {
  try {
    const actualites = await prismaMain.actualite.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(actualites);
  } catch (error) {
    console.error("❌ Erreur GET /api/actualites :", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des actualités" },
      { status: 500 }
    );
  }
}
