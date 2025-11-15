// app/api/student/recours/route.js
// app/api/student/recours/route.js
import { NextResponse } from "next/server";
import { prismaStudent, prismaTeacher } from "../../../../../lib/prisma";


export async function POST(req) {
  try {
    const { action, studentEmail, sujet, message } = await req.json();

    // 🧩 Vérifie que l'étudiant existe
    const student = await prismaStudent.student.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Étudiant introuvable" },
        { status: 404 }
      );
    }

    // ======================================
    // 📨 ACTION 1 : Envoyer un recours
    // ======================================
    if (action === "create") {
      if (!sujet || !message) {
        return NextResponse.json(
          { success: false, message: "Sujet et message requis" },
          { status: 400 }
        );
      }

      // 🔹 Trouver un enseignant correspondant à la filière de l’étudiant
      const enseignant = await prismaTeacher.teacher.findFirst({
        where: {
          module_enseigne: { contains: student.filiere },
        },
      });

      const newRecours = await prismaTeacher.recours.create({
        data: {
          sujet,
          message,
          statut: "En attente",
          studentId: student.id,
          studentEmail: student.email,
          teacherId: enseignant ? enseignant.id : null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Recours envoyé avec succès",
        data: newRecours,
      });
    }

    // ======================================
    // 📋 ACTION 2 : Consulter les recours
    // ======================================
    if (action === "list") {
      const recoursList = await prismaTeacher.recours.findMany({
        where: { studentId: student.id },
        orderBy: { date_envoi: "desc" },
        include: { teacher: true },
      });

      return NextResponse.json({
        success: true,
        data: recoursList.map((r) => ({
          id: r.id,
          sujet: r.sujet,
          message: r.message,
          statut: r.statut,
          reponse: r.reponse,
          date_envoi: r.date_envoi,
          enseignant: r.teacher
            ? `${r.teacher.nom} ${r.teacher.prenom}`
            : "Non assigné",
        })),
      });
    }

    // ======================================
    // ❌ ACTION non reconnue
    // ======================================
    return NextResponse.json(
      { success: false, message: "Action non reconnue" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

