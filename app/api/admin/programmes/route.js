import { NextResponse } from "next/server";
import { prismaMain } from "../../../../lib/prisma";

// 🔹 GET — Liste complète (vue admin)
export async function GET() {
  try {
    const programmes = await prismaMain.programme.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(programmes);
  } catch (error) {
    console.error("Erreur GET admin/programmes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 POST — Ajouter un nouveau programme
export async function POST(req) {
  try {
    const data = await req.json();

    const prog = await prismaMain.programme.create({
      data: {
        titre: data.titre,
        description: data.description,
        niveau: data.niveau,
        details: data.details || "",
      },
    });

    return NextResponse.json({ success: true, programme: prog });
  } catch (error) {
    console.error("Erreur POST admin/programmes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
