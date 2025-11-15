// ============================================================
// 🔹 Route : /api/super/users/list
// 🔹 Objectif : Retourner tous les comptes de toutes les bases
// 🔹 Sources : Base Admins / Base Students / Base Teachers
// ============================================================

import { prismaAdmin, prismaStudent, prismaTeacher } from "@/lib/prisma";

export async function GET() {
  try {
    // =======================================================
    // 📦 Récupération simultanée des données des 3 bases
    // =======================================================
    const [admins, students, teachers] = await Promise.all([
      prismaAdmin.admin.findMany({
        orderBy: { nom: "asc" },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          photo_identite: true,
          createdAt: true,
        },
      }),

      prismaStudent.student.findMany({
        orderBy: { nom: "asc" },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          filiere: true,
          section: true,
          annee: true,
          photo: true,
          createdAt: true,
        },
      }),

      prismaTeacher.teacher.findMany({
        orderBy: { nom: "asc" },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          grade: true,
          specialite: true,
          module_enseigne: true,
          photo: true,
          createdAt: true,
        },
      }),
    ]);

    // =======================================================
    // 🧠 Fusion logique (optionnelle)
    // =======================================================
    const allUsers = [
      ...admins.map((a) => ({ ...a, type: "admin" })),
      ...students.map((s) => ({ ...s, type: "student" })),
      ...teachers.map((t) => ({ ...t, type: "teacher" })),
    ];

    // =======================================================
    // ✅ Réponse JSON structurée
    // =======================================================
    return Response.json({
      success: true,
      message: "✅ Liste complète des utilisateurs récupérée avec succès.",
      totals: {
        admins: admins.length,
        students: students.length,
        teachers: teachers.length,
        all: allUsers.length,
      },
      data: {
        admins,
        students,
        teachers,
        allUsers,
      },
    });
  } catch (error) {
    console.error("❌ Erreur liste utilisateurs:", error);
    return Response.json(
      {
        success: false,
        error: "Erreur interne du serveur",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
