
"use client";
import React, { useState, useEffect } from "react";

export default function AdminActualitesPage() {
  const [actualites, setActualites] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    imageUrl: "",
    auteur: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // Charger toutes les actualités
  const fetchActualites = async () => {
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setActualites(data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  useEffect(() => {
    fetchActualites();
  }, []);

  // Ajouter une nouvelle actualité

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const method = form.id ? "PUT" : "POST"; // ✅ Si id existe → on modifie
    const url = form.id
      ? `/api/admin/actualites/${form.id}`
      : `/api/admin/actualites`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert(form.id ? "✅ Actualité modifiée avec succès !" : "✅ Actualité ajoutée !");
      setForm({ id: null, titre: "", description: "", imageUrl: "", auteur: "", date: "" });
      fetchActualites(); // 🔄 Recharge la liste
    } else {
      alert("❌ Erreur lors de l’enregistrement.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-8">📰 Gérer les Actualités</h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 mb-12 max-w-3xl mx-auto border border-emerald-100"
      >
        <h2 className="text-xl font-semibold text-emerald-700 mb-6">
          Ajouter une nouvelle actualité
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Titre</label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
              className="w-full border border-emerald-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Auteur</label>
            <input
              type="text"
              value={form.auteur}
              onChange={(e) => setForm({ ...form, auteur: e.target.value })}
              className="w-full border border-emerald-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full border border-emerald-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              required
              className="w-full border border-emerald-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full border border-emerald-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400"
          ></textarea>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Ajout..." : "➕ Ajouter"}
          </button>
        </div>
      </form>

  
      {/* Liste */}
<div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {actualites.length > 0 ? (
    actualites.map((a) => (
      <div
        key={a.id}
        className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100 hover:shadow-lg transition"
      >
        <img src={a.imageUrl} alt={a.titre} className="w-full h-48 object-cover" />
        <div className="p-5">
          <h3 className="text-lg font-semibold text-emerald-800">{a.titre}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{a.description}</p>
          <div className="text-xs text-gray-500 mt-2">
            {a.auteur || "Anonyme"} — {new Date(a.date).toLocaleDateString()}
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <button
              onClick={() => setForm(a)}
              className="text-blue-600 hover:underline"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={async () => {
                if (!confirm("Supprimer cette actualité ?")) return;
                const res = await fetch(`/api/admin/actualites/${a.id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  alert("🗑️ Supprimée avec succès !");
                  fetchActualites();
                } else {
                  alert("❌ Erreur de suppression !");
                }
              }}
              className="text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="col-span-3 text-center text-gray-500">
      Aucune actualité disponible pour le moment.
    </p>
  )}
</div>

    </div>
  );
}
