import prismaAdmins from "@/lib/prismaAdmins";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const data = await request.json();
    const { nom, prenom, email, password } = data;

    if (!nom || !prenom || !email || !password) {
      return Response.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }

    // Vérifie si un admin existe déjà
    const existing = await prismaAdmins.admin.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Cet admin existe déjà." }, { status: 400 });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du super admin
    const newAdmin = await prismaAdmins.admin.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: "superadmin",
      },
    });

    return Response.json({
      message: "Super admin créé avec succès ✅",
      admin: { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role },
    });
  } catch (error) {
    console.error("Erreur création admin:", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
