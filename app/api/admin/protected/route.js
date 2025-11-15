import { verifyAdminToken } from "@/lib/authMiddleware";

export async function GET(request) {
  const check = await verifyAdminToken(request);

  if (!check.valid) {
    return Response.json({ error: check.error }, { status: 401 });
  }

  return Response.json({
    message: "✅ Accès autorisé au Super Admin",
    admin: check.admin,
  });
}
