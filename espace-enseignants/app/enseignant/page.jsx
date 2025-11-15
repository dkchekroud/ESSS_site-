"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ======================================================
    Protection d’accès Enseignant
====================================================== */
export default function TeacherDashboardProtected() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const email = localStorage.getItem("user_email");

    if (!role || role !== "teacher") {
      alert("🚫 Accès refusé. Espace réservé aux enseignants.");
      router.replace("/teacher-login");
      return;
    }

    setTeacher({ email, role });
    setAuthorized(true);
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Vérification de l’accès...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        🚫 Accès refusé
      </div>
    );
  }

  return <TeacherDashboard teacher={teacher} router={router} />;
}

/* ======================================================
    Interface principale (Base Dashboard)
====================================================== */
function TeacherDashboard({ teacher, router }) {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("/");

  const pages = {
    "/": <DashboardPage />,
    "/cours": <Placeholder title="Cours" />,
    "/notes": <Placeholder title="Notes" />,
    "/emplois": <Placeholder title="Emplois du temps" />,
    "/recours": <Placeholder title="Recours étudiants" />,
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        page={page}
        setPage={setPage}
        router={router}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          teacher={teacher}
        />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {pages[page] || <NotFound />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ======================================================
   📋 Sidebar (menu latéral enseignant)
====================================================== */
function Sidebar({ collapsed, setCollapsed, page, setPage, router }) {
  const links = [
    { name: "Accueil", to: "/", icon: <Home /> },
    { name: "Cours", to: "/cours", icon: <BookOpen /> },
    { name: "Notes", to: "/notes", icon: <BarChart3 /> },
    { name: "Emploi du temps", to: "/emplois", icon: <Calendar /> },
    { name: "Recours étudiants", to: "/recours", icon: <Inbox /> },
  ];

  return (
    <aside
      className={`flex-shrink-0 bg-gradient-to-b from-blue-900 to-blue-500 text-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* === En-tête du menu === */}
      <div className="h-16 flex items-center px-4 gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
          ESS
        </div>
        {!collapsed && (
          <h2 className="text-lg font-semibold">Enseignant</h2>
        )}
      </div>

      {/* === Liens === */}
      <nav className="py-4 px-2 flex-1 overflow-auto">
        {links.map((l) => (
          <button
            key={l.to}
            onClick={() => setPage(l.to)}
            className={`w-full flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition-colors ${
              page === l.to
                ? "bg-white/20 font-semibold"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            <div className="w-6 h-6">{l.icon}</div>
            {!collapsed && <span>{l.name}</span>}
          </button>
        ))}
      </nav>

      {/* === Déconnexion === */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {
            if (confirm("Voulez-vous vous déconnecter ?")) {
              localStorage.clear();
              router.push("/teacher-login");
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <LogOut />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

/* ======================================================
    Navbar
====================================================== */
function Navbar({ setCollapsed, collapsed, teacher }) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="text-slate-700 hover:text-teal-600"
        >
          <Menu />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg">
          <Search size={16} className="text-slate-400" />
          <input
            className="bg-transparent text-sm focus:outline-none"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-600 hover:text-blue-600">
          <Bell />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Teacher"
            className="w-9 h-9 rounded-full border"
          />
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-sm font-medium">{teacher?.email}</span>
            <ChevronDown />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ======================================================
   🏠 Tableau de bord Enseignant
====================================================== */
function DashboardPage() {
  const email = localStorage.getItem("user_email");
  const [info, setInfo] = useState(null);
  const [stats, setStats] = useState({
    cours: 0,
    notes: 0,
    emplois: 0,
    recours: 0,
  });

  useEffect(() => {
    if (!email) return;

    fetch("/api/teacher/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const t = data.data;
          setInfo(t);
          setStats({
            cours: t.cours?.length || 0,
            notes: t.notes?.length || 0,
            emplois: t.emplois?.length || 0,
            recours: t.recours?.length || 0,
          });
        }
      })
      .catch((err) => console.error("Erreur chargement enseignant :", err));
  }, []);

  if (!info)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Chargement des informations...  info
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-sky-300 to-blue-600 bg-clip-text text-transparent">
        Tableau de bord Enseignant
      </h2>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mb-10">
        <StatCard label="Cours" value={stats.cours} color="from-cyan-500 to-teal-600" />
        <StatCard label="Notes" value={stats.notes} color="from-orange-500 to-yellow-500" />
        <StatCard label="Emplois du temps" value={stats.emplois} color="from-indigo-500 to-blue-600" />
        <StatCard label="Recours étudiants" value={stats.recours} color="from-rose-500 to-red-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-sky-700 mb-4">
            Informations personnelles
          </h3>
          <ul className="text-gray-700 space-y-2">
            <li><b>Nom :</b> {info.nom}</li>
            <li><b>Prénom :</b> {info.prenom}</li>
            <li><b>Email :</b> {info.email}</li>
            <li><b>Grade :</b> {info.grade || "—"}</li>
            <li><b>Spécialité :</b> {info.specialite || "—"}</li>
            <li><b>Module enseigné :</b> {info.module_enseigne || "—"}</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
          <img
            src={info.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profil"
            className="w-32 h-32 rounded-full border mb-4"
          />
          <p className="text-sky-700 font-semibold text-lg">
            {info.nom} {info.prenom}
          </p>
          <p className="text-gray-500 text-sm">{info.module_enseigne}</p>
        </div>
      </div>

      <p className="text-gray-600 text-center">
        Bienvenue <span className="font-semibold">{info.nom}</span> 👋  
        Vous pouvez gérer vos cours, vos notes, vos emplois du temps et les recours étudiants depuis le menu latéral.
      </p>
    </div>
  );
}

/* ======================================================
   📊 Composant Statistique
====================================================== */
function StatCard({ label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-r ${color} text-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center`}
    >
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </motion.div>
  );
}

/* ======================================================
   Placeholder + 404
====================================================== */
function Placeholder({ title }) {
  return (
    <div className="text-center py-20 text-gray-500">
      <h3 className="text-xl font-semibold text-teal-700 mb-3">{title}</h3>
      <p>Cette section sera disponible prochainement.</p>
    </div>
  );
}

function NotFound() {
  return <p>Page introuvable</p>;
}
