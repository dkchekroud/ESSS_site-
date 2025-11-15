import { NextResponse } from "next/server";
import { prismaMain } from "../../../lib/prisma";



// ✅ Récupérer le contenu d’une page spécifique
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "Paramètre slug manquant" }, { status: 400 });

  const contenu = await prismaMain.contenu.findUnique({
    where: { page: slug },
  });

  return NextResponse.json(contenu || {});
}
