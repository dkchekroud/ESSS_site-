"use client";
import React, { useEffect, useState } from "react";
import { Layers, Users, GraduationCap, Inbox, Home } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (data.ok) setStats(data.data);
      } catch (e) {
        console.error("Erreur dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Tableau de bord administrateur
      </h1>
      <p className="text-gray-500 mb-10">
        Vue d’ensemble des statistiques globales.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card icon={<Layers />} title="Programmes" value={stats.programmes} />
        <Card icon={<Users />} title="Étudiants" value={stats.students} />
        <Card icon={<GraduationCap />} title="Enseignants" value={stats.teachers} />
        <Card icon={<Inbox />} title="Messages" value={stats.contacts} />
        <Card icon={<Home />} title="Accueil (CMS)" value={stats.accueil} />
      </div>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between p-5">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <div className="p-2 rounded-xl bg-gray-100 text-gray-700">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 px-5 pb-5">{value}</p>
    </div>
  );
}
