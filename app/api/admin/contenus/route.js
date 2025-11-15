import { NextResponse } from "next/server";
import { prismaMain } from "../../../../lib/prisma";


/* ============================================================
   ✅ GET → récupérer tous les contenus (liste complète)
   ============================================================ */
export async function GET() {
  try {
    const contenus = await prismaMain.contenu.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(contenus);
  } catch (error) {
    console.error("Erreur GET contenus:", error);
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
  }
}

/* ============================================================
   ✅ POST → créer ou mettre à jour un contenu
   (utilisé quand l’admin enregistre une page)
   ============================================================ */
export async function POST(req) {
  try {
    const { page, titre, texte, image } = await req.json();

    if (!page)
      return NextResponse.json({ error: "Nom de page manquant" }, { status: 400 });

    const updated = await prismaMain.contenu.upsert({
      where: { page },
      update: { titre, texte, image },
      create: { page, titre, texte, image },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur POST contenus:", error);
    return NextResponse.json({ error: "Erreur lors de l’enregistrement" }, { status: 500 });
  }
}

/* ============================================================
   ✅ DELETE → supprimer un contenu (rarement utilisé)
   ============================================================ */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    if (!page)
      return NextResponse.json({ error: "Paramètre page manquant" }, { status: 400 });

    await prismaMain.contenu.delete({ where: { page } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE contenus:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
