import { NextResponse } from "next/server";
import { prismaMain } from "@/lib/prisma";



// ✅ Modifier une actualité
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await prismaMain.actualite.update({
      where: { id: Number(params.id) },
      data: {
        titre: body.titre,
        description: body.description,
        imageUrl: body.imageUrl,
        auteur: body.auteur,
        date: new Date(body.date),
      },
    });
    return NextResponse.json({ success: true, actualite: updated });
  } catch (error) {
    console.error("Erreur PUT actualité :", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ✅ Supprimer une actualité
export async function DELETE(req, { params }) {
  try {
    await prismaMain.actualite.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE actualité :", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
