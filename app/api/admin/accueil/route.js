import { NextResponse } from "next/server";
import { prismaMain } from "@/lib/prisma"; // ⚠️ adapte si ton instance s’appelle autrement

// 🟢 GET – Récupérer le contenu actuel
export async function GET() {
  try {
    const accueil = await prismaMain.accueil.findFirst();
    return NextResponse.json(accueil || {});
  } catch (err) {
    console.error("Erreur GET /accueil:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🟢 POST – Créer ou mettre à jour le contenu
export async function POST(req) {
  try {
    const data = await req.json();
    const existing = await prismaMain.accueil.findFirst();

    if (existing) {
      const updated = await prismaMain.accueil.update({
        where: { id: existing.id },
        data,
      });
      return NextResponse.json({ success: true, accueil: updated });
    } else {
      const created = await prismaMain.accueil.create({ data });
      return NextResponse.json({ success: true, accueil: created });
    }
  } catch (err) {
    console.error("Erreur POST /accueil:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
