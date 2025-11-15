import { prismaMain } from "@/lib/prisma";

// ✅ POST — Enregistrer un message depuis le formulaire public
export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, subject, message } = body;

    console.log("📩 Données reçues:", body);

    if (!fullName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis." }),
        { status: 400 }
      );
    }

    // ✅ Insertion dans la base
    const newMessage = await prismaMain.contactMessage.create({
      data: {
        fullName,
        email,
        subject,
        message,
        read: false,
      },
    });

    console.log("✅ Message enregistré:", newMessage);

    return new Response(
      JSON.stringify({ success: true, data: newMessage }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur POST /api/contact:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// ✅ GET — Récupérer tous les messages (pour admin)
export async function GET() {
  try {
    const messages = await prismaMain.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur GET /api/contact:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

