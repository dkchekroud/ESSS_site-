// Permet de modifier les informations d’un utilisateur (nom, prénom, email, mot de passe, rôle)
//  /app/api/super/users/update/[id]/route.js


import prismaAdmins from "@/lib/prismaAdmins";
import prismaEtudiants from "@/lib/prismaEtudiants";
import prismaEnseignants from "@/lib/prismaEnseignants";

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { role, nom, prenom, email, matricule, filiere, grade, specialite } = body;

    if (!role || !id) {
      return Response.json({ error: "Rôle et ID requis." }, { status: 400 });
    }

    if (role === "student") {
      await prismaEtudiants.student.update({
        where: { id },
        data: { nom, prenom, email, matricule, filiere },
      });
      return Response.json({ message: "✅ Étudiant mis à jour avec succès." });
    }

    if (role === "teacher") {
      await prismaEnseignants.teacher.update({
        where: { id },
        data: { nom, prenom, email, grade, specialite },
      });
      return Response.json({ message: "✅ Enseignant mis à jour avec succès." });
    }

    if (role === "admin") {
      await prismaAdmins.admin.update({
        where: { id },
        data: { nom, prenom, email },
      });
      return Response.json({ message: "✅ Admin mis à jour avec succès." });
    }

    return Response.json({ error: "Rôle non valide." }, { status: 400 });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error);
    return Response.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
