"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProgrammeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/programmes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgramme(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p>Programme introuvable 😕</p>
        <button
          onClick={() => router.push("/programmes")}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg"
        >
          Retour aux programmes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">{programme.titre}</h1>
        <p className="text-gray-600 mb-6 italic">{programme.niveau}</p>
        <p className="text-gray-700 mb-6">{programme.description}</p>

        {/* 🔹 Section détails (rich content) */}
        {programme.details ? (
          <div className="prose max-w-none text-gray-800">
            {programme.details.split("\n").map((line, i) => (
              <p key={i} className="mb-3">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun détail supplémentaire pour ce programme.</p>
        )}

        <button
          onClick={() => router.push("/programmes")}
          className="mt-8 px-5 py-2 bg-teal-700 text-white rounded-lg hover:opacity-90"
        >
          ← Retour à la liste
        </button>
      </div>
    </div>
  );
}
