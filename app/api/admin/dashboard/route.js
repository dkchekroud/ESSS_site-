import { NextResponse } from "next/server";
import {
  prismaMain,
  prismaAdmin,
  prismaStudent,
  prismaTeacher,
} from "@/lib/prisma";

// Helper pour éviter les erreurs si un client n’a pas le modèle
async function safeCount(fn) {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const [
      totalPrograms,
      totalStudents,
      totalTeachers,
      totalMessages,
      totalAccueil,
    ] = await Promise.all([
      // base principale
      safeCount(() => prismaMain.programme.count()),
      // base étudiants
      safeCount(() => prismaStudent.student.count()),
      // base enseignants
      safeCount(() => prismaTeacher.teacher.count()),
      // base principale - messages de contact
      safeCount(() => prismaMain.contactMessage.count()),
      // base principale - accueil CMS
      safeCount(() => prismaMain.accueil.count()),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        programmes: totalPrograms,
        students: totalStudents,
        teachers: totalTeachers,
        contacts: totalMessages,
        accueil: totalAccueil,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}


