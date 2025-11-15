import { prismaMain } from "@/lib/prisma";

export async function GET() {
  try {
    const accueil = await prismaMain.accueil.findFirst({
      orderBy: { id: "desc" },
    });
    return new Response(JSON.stringify(accueil || {}), { status: 200 });
  } catch (error) {
    console.error("Erreur API Accueil:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
