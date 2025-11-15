import { prismaMain } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const unreadCount = await prismaMain.contactMessage.count({
      where: { read: false },
    });

    return new Response(JSON.stringify({ unread: unreadCount }), { status: 200 });
  } catch (error) {
    console.error("Erreur GET unread:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
}
