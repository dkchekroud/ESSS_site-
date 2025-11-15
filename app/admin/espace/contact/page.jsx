"use client";
import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Erreur de chargement");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Erreur lors du chargement des messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">⏳ Chargement des messages...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">📩 Boîte de réception des contacts</h1>

      {messages.length === 0 ? (
        <p className="text-gray-600">Aucun message reçu pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h2 className="font-semibold text-lg text-green-800">{m.fullName}</h2>
                <span className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">{m.email}</p>
              <p className="font-medium mt-2 text-green-700">Sujet : {m.subject}</p>
              <p className="mt-1 text-gray-700">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
