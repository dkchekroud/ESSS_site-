import { prismaMain } from "@/lib/prisma";

export async function POST() {
  try {
    await prismaMain.contactMessage.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erreur mark-all-read:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
