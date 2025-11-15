import { NextResponse } from "next/server";
import { prismaMain } from "../../../../../lib/prisma";

// 🔹 GET — Un seul programme (utile pour “En savoir plus” ou édition)
export async function GET(req, { params }) {
  try {
    const programme = await prismaMain.programme.findUnique({
      where: { id: Number(params.id) },
    });

    if (!programme) {
      return NextResponse.json({ error: "Programme introuvable" }, { status: 404 });
    }

    return NextResponse.json(programme);
  } catch (error) {
    console.error("Erreur GET /api/admin/programmes/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 PUT — Modifier un programme
export async function PUT(req, { params }) {
  try {
    const data = await req.json();

    const updated = await prismaMain.programme.update({
      where: { id: Number(params.id) },
      data: {
        titre: data.titre,
        description: data.description,
        niveau: data.niveau,
        details: data.details || "",
      },
    });

    return NextResponse.json({ success: true, programme: updated });
  } catch (error) {
    console.error("Erreur PUT /api/admin/programmes/[id]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE — Supprimer un programme
export async function DELETE(req, { params }) {
  try {
    await prismaMain.programme.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/programmes/[id]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
