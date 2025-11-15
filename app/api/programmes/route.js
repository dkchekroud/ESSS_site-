import { NextResponse } from "next/server";
import { prismaMain } from "../../../lib/prisma";

// 🟢 GET — Liste publique des programmes
export async function GET() {
  try {
    const programmes = await prismaMain.programme.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(programmes);
  } catch (error) {
    console.error("Erreur GET /api/programmes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
