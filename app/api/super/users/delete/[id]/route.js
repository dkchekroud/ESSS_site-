// ============================================================
// 🔹 Route : /api/super/users/delete/[id]
// 🔹 Objectif : Supprimer un utilisateur selon son rôle
// ============================================================

import { prismaAdmin, prismaStudent, prismaTeacher } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (!role || !id) {
      return Response.json({ error: "Rôle et ID requis." }, { status: 400 });
    }

    if (role === "student") {
      await prismaStudent.student.delete({ where: { id } });
      return Response.json({ message: "🗑️ Étudiant supprimé avec succès." });
    }

    if (role === "teacher") {
      await prismaTeacher.teacher.delete({ where: { id } });
      return Response.json({ message: "🗑️ Enseignant supprimé avec succès." });
    }

    if (role === "admin") {
      await prismaAdmin.admin.delete({ where: { id } });
      return Response.json({ message: "🗑️ Admin supprimé avec succès." });
    }

    return Response.json({ error: "Rôle non valide." }, { status: 400 });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return Response.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

