// app/api/student/me/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();
    const student = await prisma.student.findUnique({ where: { email } });

    if (!student) {
      return NextResponse.json({ success: false, message: "Étudiant introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
