//Permettre au SuperAdmin d’ajouter une image

import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    // Vérifie le type MIME (sécurité)
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return Response.json({ error: "Format non autorisé (jpg, jpeg, png uniquement)." }, { status: 400 });
    }

    // Crée le nom unique
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + "-" + file.name.replace(/\s+/g, "_");
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Écrit le fichier dans /public/uploads
    await writeFile(path.join(uploadDir, filename), buffer);

    // Retourne l’URL accessible
    const url = `/uploads/${filename}`;
    return Response.json({ message: "✅ Upload réussi", url });
  } catch (err) {
    console.error("Erreur upload:", err);
    return Response.json({ error: "Erreur serveur durant l’upload." }, { status: 500 });
  }
}
