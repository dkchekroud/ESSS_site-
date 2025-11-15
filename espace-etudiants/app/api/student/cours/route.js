// app/api/student/cours/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { filiere, section, annee } = await request.json();
    const cours = await prisma.cours.findMany({ where: { filiere, section, annee } });
    return NextResponse.json({ success: true, data: cours });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
