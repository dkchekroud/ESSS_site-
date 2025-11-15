import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // 🔒 Supprimer le cookie JWT
    cookieStore.delete("admin_token");

    console.log("✅ Déconnexion effectuée, cookie supprimé.");

    return Response.json({ message: "Déconnexion réussie ✅" }, { status: 200 });
  } catch (error) {
    console.error("Erreur déconnexion :", error);
    return Response.json({ error: "Erreur interne lors de la déconnexion." }, { status: 500 });
  }
}
