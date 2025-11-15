"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    fetch("/api/programmes")
      .then((res) => res.json())
      .then(setProgrammes)
      .catch(() => setProgrammes([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-10">
        Nos Programmes
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programmes.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
          >
            <div className="p-5">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                {p.titre}
              </h3>
              <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                {p.description}
              </p>
              <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 text-xs rounded-full mb-4">
                {p.niveau}
              </span>
              <br />
              {/* 🔹 Lien vers la page détail */}
              <Link
                href={`/programmes/${p.id}`}
                className="inline-flex items-center text-sm text-blue-600 font-medium hover:underline"
              >
                En savoir plus →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
