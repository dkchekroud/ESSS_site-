// ============================================================
// 🔹 Route : /api/super/users/create
// 🔹 Objectif : Permet au SuperAdmin de créer dynamiquement
//               des comptes étudiants, enseignants ou admins
// ============================================================

import { prismaAdmin, prismaStudent, prismaTeacher } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      role,
      nom,
      prenom,
      email,
      password,
      photo,
      matricule,
      filiere,
      section,
      annee,
      grade,
      specialite,
      module_enseigne,
      id_admin,
    } = body;

    // 🔸 Validation basique
    if (!nom || !prenom || !email || !password || !role) {
      return Response.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // ============================================================
    // 👩‍🎓 Étudiant
    // ============================================================
    if (role === "student") {
      await prismaStudent.student.create({
        data: {
          nom,
          prenom,
          email,
          password: hashed,
          matricule,
          filiere,
          section,
          annee,
          photo,
        },
      });
      return Response.json({
        message: "Étudiant créé avec succès 🎓",
        role: "student",
      });
    }

    // ============================================================
    // 👨‍🏫 Enseignant
    // ============================================================
    if (role === "teacher") {
      await prismaTeacher.teacher.create({
        data: {
          nom,
          prenom,
          email,
          password: hashed,
          grade,
          specialite,
          matricule,
          module_enseigne,
          photo,
        },
      });
      return Response.json({
        message: "Enseignant créé avec succès 👨‍🏫",
        role: "teacher",
      });
    }

    // ============================================================
    // 🧑‍💼 Administrateur
    // ============================================================
    if (role === "admin") {
      await prismaAdmin.admin.create({
        data: {
          nom,
          prenom,
          email,
          password: hashed,
          role: "admin",
          id_admin,
          photo_identite: photo,
        },
      });
      return Response.json({
        message: "Administrateur créé avec succès 🧑‍💼",
        role: "admin",
      });
    }

    // ============================================================
    // ❌ Rôle non reconnu
    // ============================================================
    return Response.json(
      { error: "Rôle inconnu. Utilisez 'student', 'teacher' ou 'admin'." },
      { status: 400 }
    );
  } catch (err) {
    console.error("❌ Erreur création utilisateur:", err);
    return Response.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
