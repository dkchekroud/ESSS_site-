"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Moon,
  ChevronDown,
  Home,
  BookOpen,
  Newspaper,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ActualitesPage from "../../actualites/page";
import { Layers, Users, GraduationCap, Inbox } from "lucide-react";


/* =======================================================
   🔒 Protection de l’espace admin
======================================================= */
export default function ProtectedESSAdminApp() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("admin_role");
    const email = localStorage.getItem("admin_email");

    if (!role || role !== "admin") {
      alert("🚫 Accès refusé. Espace réservé aux administrateurs.");
      router.replace("/admin-login");
      return;
    }

    setAdmin({ email, role });
    setAuthorized(true);
    setChecking(false);
  }, [router]);

  if (checking)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Vérification de l’accès...
      </div>
    );

  if (!authorized)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        🚫 Accès refusé
      </div>
    );

  return <ESSAdminApp admin={admin} router={router} />;
}

/* =======================================================
   🧭 Application principale du Dashboard
======================================================= */
function ESSAdminApp({ admin, router }) {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("/");

  const pages = {
    "/": <DashboardPage />,
    "/accueil": <AccueilPage />,
    "/programmes": <GestionPage section="programmes" />,
    "/contact": <ContactPage />,
    "/actualites": <ActualitesPage />,
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-teal-100 font-sans">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        page={page}
        setPage={setPage}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          admin={admin}
          router={router}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
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

/* ===================== Sidebar ===================== */
function Sidebar({ collapsed, setCollapsed, page, setPage }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/contact/unread");
        const data = await res.json();
        setUnread(data.unread || 0);
      } catch (error) {
        console.error("Erreur compteur messages:", error);
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { name: "Tableau de bord", to: "/", icon: <Home size={18} /> },
    { name: "Gérer Accueil", to: "/accueil", icon: <Home size={18} /> },
    { name: "Gérer Programmes", to: "/programmes", icon: <BookOpen size={18} /> },
    { name: "Gérer Contact", to: "/contact", icon: <Phone size={18} />, badge: unread },
    { name: "Gérer Actualités", to: "/actualites", icon: <Newspaper size={18} /> },
  ];

  return (
    <aside
      className={`flex-shrink-0 bg-gradient-to-b from-green-700 to-teal-800 text-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center px-4 gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
          ESS
        </div>
        {!collapsed && <h2 className="text-lg font-semibold">Admin</h2>}
      </div>

      <nav className="py-4 px-2 flex-1 overflow-auto">
        {links.map((l) => (
          <button
            key={l.to}
            onClick={() => setPage(l.to)}
            className={`relative w-full flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition-colors hover:bg-white/10 ${
              page === l.to ? "bg-white/10 font-semibold" : "text-white/90"
            }`}
          >
            {l.icon}
            {!collapsed && <span>{l.name}</span>}
            {l.badge > 0 && (
              <span className="absolute right-4 top-1 bg-red-600 text-xs font-bold rounded-full px-2 py-0.5">
                {l.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <Menu />
          {!collapsed && <span>Réduire / Agrandir</span>}
        </button>
      </div>
    </aside>
  );
}

/* ===================== Navbar ===================== */
function Navbar({ setCollapsed, admin, router }) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="text-teal-700 hover:text-green-700"
        >
          <Menu />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
          <Search size={16} className="text-teal-400" />
          <input
            className="bg-transparent text-sm focus:outline-none"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-teal-600 hover:text-green-700">
          <Moon />
        </button>
        <button className="relative text-teal-600 hover:text-green-700">
          <Bell />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-lime-400" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-erUOQght_VvS9h9OS_0J6wvFFIQHtIRgGjv-e1RBZ3fP02XlcM59WPkFb9cN-0U2uik&usqp=CAU"
            alt="Admin"
            className="w-9 h-9 rounded-full border"
          />
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-sm font-medium">{admin?.email || "Admin"}</span>
            <ChevronDown />
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Voulez-vous vous déconnecter ?")) {
              localStorage.clear();
              alert("Déconnexion réussie !");
              router.push("/admin-login");
            }
          }}
          className="bg-gradient-to-r from-green-700 to-teal-700 hover:opacity-90 text-white px-3 py-1 rounded-md text-sm"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

/* ===================== Tableau de bord ===================== */

function DashboardPage() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
      <div className="flex justify-center items-center h-60 text-gray-600">
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
        Tableau de bord de gestion du contenu
      </h2>
      <p className="text-gray-600">
        Vue d’ensemble des statistiques globales du site ESSS.
      </p>

      {/* Cartes de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card icon={<Layers />} title="Programmes" value={stats.programmes} />
        <Card icon={<Users />} title="Étudiants" value={stats.students} />
        <Card icon={<GraduationCap />} title="Enseignants" value={stats.teachers} />
        <Card icon={<Inbox />} title="Messages" value={stats.contacts} />
        <Card icon={<Home />} title="Accueil (CMS)" value={stats.accueil} />
      </div>

      {/* Section activités récentes */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold mb-3 text-gray-800">📊 Activité récente</h3>
          <p className="text-sm text-gray-500">
            Tu pourras afficher ici les 5 derniers programmes ou messages.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold mb-3 text-gray-800">🧾 À faire</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Valider les nouveaux programmes</li>
            <li>Répondre aux messages de contact</li>
            <li>Compléter les profils enseignants</li>
          </ul>
        </div>
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


/* ===================== PAGE ACCUEIL DYNAMIQUE ===================== */
function AccueilPage() {
  const [accueil, setAccueil] = useState({ titre: "", contenu: "", imageUrl: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/accueil")
      .then((res) => res.json())
      .then((data) => {
        if (data?.titre) setAccueil(data);
      })
      .catch((err) => console.error("Erreur chargement:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccueil((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/accueil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accueil),
    });
    const data = await res.json();
    setMessage(data.success ? "✅ Sauvegarde réussie !" : "❌ Erreur serveur");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-2xl p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-teal-700">🏠 Gérer le contenu d’accueil</h2>

      <div className="space-y-4">
        <input
          type="text"
          name="titre"
          value={accueil.titre}
          onChange={handleChange}
          placeholder="Titre principal"
          className="border border-gray-300 rounded-md p-3 w-full"
        />
        <textarea
          name="contenu"
          value={accueil.contenu}
          onChange={handleChange}
          placeholder="Texte de présentation"
          className="border border-gray-300 rounded-md p-3 w-full h-40"
        />
        <input
          type="text"
          name="imageUrl"
          value={accueil.imageUrl}
          onChange={handleChange}
          placeholder="URL de l’image d’illustration"
          className="border border-gray-300 rounded-md p-3 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-700 to-teal-600 text-white px-5 py-3 rounded-lg font-medium hover:opacity-90"
        >
          Enregistrer
        </button>
        {message && <p className="text-green-600 font-semibold">{message}</p>}
      </div>
    </motion.div>
  );
}

/* ===================== Gérer les messages de contact ===================== */
function ContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(data);
        await fetch("/api/contact/mark-all-read", { method: "POST" });
      } catch (error) {
        console.error("Erreur chargement messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  if (loading) return <p>Chargement des messages...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-2xl p-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-700">
        📩 Gérer les messages de contact
      </h2>
      {messages.length === 0 ? (
        <p className="text-gray-600">Aucun message reçu pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="font-semibold text-green-800">{m.fullName}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{m.email}</p>
              <p className="font-medium mt-2 text-green-700">Sujet : {m.subject}</p>
              <p className="mt-1 text-gray-700">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ===================== Gestion Programmes ===================== */
function GestionPage({ section }) {
  if (section !== "programmes")
    return <div className="text-gray-500">Section en développement…</div>;

  const [form, setForm] = useState({
    id: null,
    titre: "",
    description: "",
    niveau: "Licence",
    details: "",
  });
  const [message, setMessage] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/programmes")
      .then((res) => res.json())
      .then(setProgrammes)
      .catch(() => setProgrammes([]));
  }, [section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.titre || !form.description) {
      alert("Veuillez remplir le titre et la description.");
      return;
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/admin/programmes/${form.id}`
      : "/api/admin/programmes";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      if (isEditing) {
        setProgrammes((prev) =>
          prev.map((p) => (p.id === form.id ? data.programme : p))
        );
        setMessage("✅ Programme modifié avec succès !");
      } else {
        setProgrammes((prev) => [...prev, data.programme]);
        setMessage("✅ Programme ajouté avec succès !");
      }

      setForm({ id: null, titre: "", description: "", niveau: "Licence", details: "" });
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } else {
      alert("Erreur lors de l’enregistrement : " + data.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce programme ?")) return;
    const res = await fetch(`/api/admin/programmes/${id}`, { method: "DELETE" });
    if (res.ok) setProgrammes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (p) => {
    setForm(p);
    setIsEditing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-2xl p-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-teal-700">
        Gérer les Programmes
      </h2>

      {/* ===== Formulaire ===== */}
      <div className="space-y-4">
        <input
          type="text"
          name="titre"
          value={form.titre}
          onChange={handleChange}
          placeholder="Titre du programme"
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        <select
          name="niveau"
          value={form.niveau}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option>Licence</option>
          <option>Master</option>
          <option>Doctorat</option>
        </select>
        <textarea
          name="details"
          rows={5}
          value={form.details}
          onChange={handleChange}
          placeholder="Détails du programme"
          className="border border-gray-300 rounded-md p-2 w-full"
        />

        <button
          onClick={handleSubmit}
          className={`${isEditing ? "bg-orange-600" : "bg-teal-700"} text-white px-4 py-2 rounded-lg hover:opacity-90`}
        >
          {isEditing ? "Modifier le programme" : "Ajouter le programme"}
        </button>

        {message && <p className="text-green-600 font-semibold">{message}</p>}
      </div>

      {/* ===== Liste ===== */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Liste des programmes
        </h3>
        <table className="w-full border text-sm rounded-lg overflow-hidden">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="p-2 border">Titre</th>
              <th className="p-2 border">Niveau</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{p.titre}</td>
                <td className="p-2 border">{p.niveau}</td>
                <td className="p-2 border text-gray-600 line-clamp-2">
                  {p.description}
                </td>
                <td className="p-2 border text-center space-x-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ===================== Fallback ===================== */
function NotFound() {
  return <div>❌ Page introuvable</div>;
}
