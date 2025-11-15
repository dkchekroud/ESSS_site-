import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

/**
 * Middleware d'authentification JWT
 * Vérifie que la requête contient un token valide
 */
export async function verifyAdminToken(request) {
  try {
    // Récupération du header Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { valid: false, error: "Token manquant ou invalide." };
    }

    const token = authHeader.split(" ")[1];

    // Vérification du token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Vérifie que le rôle est admin/superadmin
    if (!decoded || (decoded.role !== "admin" && decoded.role !== "superadmin")) {
      return { valid: false, error: "Accès refusé : rôle non autorisé." };
    }

    // Retourne les infos de l’admin
    return { valid: true, admin: decoded };
  } catch (error) {
    console.error("Erreur de vérification JWT :", error);
    return { valid: false, error: "Token invalide ou expiré." };
  }
}
