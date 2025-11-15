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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ======================================================
   🔐 Protection d’accès Étudiant
====================================================== */
export default function StudentDashboardProtected() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const email = localStorage.getItem("user_email");

    if (!role || role !== "student") {
      alert("🚫 Accès refusé. Espace réservé aux étudiants.");
      router.replace("/student-login");
      return;
    }

    setStudent({ email, role });
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

  return <StudentDashboard student={student} router={router} />;
}

/* ======================================================
   🧭 Interface principale
====================================================== */
function StudentDashboard({ student, router }) {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("/");

  const pages = {
    "/": <DashboardPage />,
    "/cours": <StudentCoursPage />,
    "/emplois": <StudentEmploiPage />,
    "/notes": <StudentNotesPage />,
    "/recours": <StudentRecoursPage />,
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        page={page}
        setPage={setPage}
        router={router}
      />

      <div className="flex-1 flex flex-col">
        <Navbar setCollapsed={setCollapsed} collapsed={collapsed} student={student} />

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
   🧩 Sidebar
====================================================== */
function Sidebar({ collapsed, setCollapsed, page, setPage, router }) {
  const links = [
    { name: "Accueil", to: "/", icon: <Home /> },
    { name: "Mes cours", to: "/cours", icon: <BookOpen /> },
    { name: "Emploi du temps", to: "/emplois", icon: <Calendar /> },
    { name: "Mes notes", to: "/notes", icon: <BarChart3 /> },
    { name: "Mes recours", to: "/recours", icon: <BookOpen /> },
    { name: "Statistiques", to: "/statistiques", icon: <BarChart3 /> },
  ];

  return (
    <aside
      className={`flex-shrink-0 bg-gradient-to-b from-blue-700 to-sky-500 text-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center px-4 gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
          ESS
        </div>
        {!collapsed && <h2 className="text-lg font-semibold"> Étudiant</h2>}
      </div>

      <nav className="py-4 px-2 flex-1 overflow-auto">
        {links.map((l) => (
          <button
            key={l.to}
            onClick={() => setPage(l.to)}
            className={`w-full flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition-colors hover:bg-white/10 ${
              page === l.to ? "bg-white/60 font-semibold" : "text-white/90"
            }`}
          >
            <div className="w-6 h-6">{l.icon}</div>
            {!collapsed && <span>{l.name}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/60">
        <button
          onClick={() => {
            if (confirm("Voulez-vous vous déconnecter ?")) {
              localStorage.clear();
              router.push("/student-login");
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
   🔹 Navbar
====================================================== */
function Navbar({ setCollapsed, collapsed, student }) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="text-slate-700 hover:text-indigo-600"
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
            src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
            alt="Student"
            className="w-9 h-9 rounded-full border border-gray-200"
          />
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-sm font-medium">{student?.email}</span>
            <ChevronDown />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ======================================================
   📊 Page d’accueil Étudiant
====================================================== */
function DashboardPage() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) return;

    fetch("/api/student/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudentInfo(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Chargement des données...</p>;

  if (!studentInfo)
    return <p className="text-center text-red-500">Aucune donnée trouvée.</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
        Tableau de bord Étudiant
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-950 mb-4">
            Informations personnelles
          </h3>
          <ul className="text-gray-700  font-semibold space-y-2">
            <li><b>Nom :</b> {studentInfo.nom}</li>
            <li><b>Prénom :</b> {studentInfo.prenom}</li>
            <li><b>Email :</b> {studentInfo.email}</li>
            <li><b>Matricule :</b> {studentInfo.matricule}</li>
            <li><b>Filière :</b> {studentInfo.filiere}</li>
            <li><b>Section :</b> {studentInfo.section}</li>
            <li><b>Année :</b> {studentInfo.annee}</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
          <img
            src={
              studentInfo.photo ||
              "https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
            }
            alt="Profil"
            className="w-32 h-32 rounded-full border border-gray-200 mb-4"
          />
          <p className="text-blue-950 font-semibold">
            {studentInfo.nom} {studentInfo.prenom}
          </p>
          <p className="text-gray-500 text-sm">{studentInfo.filiere}</p>
        </div>
      </div>

      <p className="text-gray-600 text-center">
        Bienvenue dans votre espace étudiant 
        Vous pouvez consulter vos cours, vos notes, et votre emploi du temps dans le menu latéral.
      </p>
    </div>
  );
}

/* ======================================================
   📚 Mes cours
====================================================== */
function StudentCoursPage() {
  const [coursList, setCoursList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) return;

    fetch("/api/student/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          const etu = data.data;
          setStudent(etu);

          const resCours = await fetch("/api/student/cours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filiere: etu.filiere,
              section: etu.section,
              annee: etu.annee,
            }),
          });

          const coursData = await resCours.json();
          if (coursData.success) setCoursList(coursData.data);
          else setError("Impossible de charger les cours.");
        } else {
          setError("Étudiant introuvable.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Chargement des cours...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  if (coursList.length === 0)
    return (
      <div className="text-center text-gray-500">
        <p>📚 Aucun cours disponible pour le moment.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
        Mes cours
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursList.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{c.titre}</h3>
              <p className="text-gray-600 text-sm mb-3">{c.description || "—"}</p>
              <p className="text-sm text-gray-500">
                👨‍🏫 <b>Enseignant :</b> {c.enseignant}
              </p>
              <p className="text-sm text-gray-500">
                🎓 {c.filiere} — Section {c.section} — {c.annee}
              </p>
            </div>

            {c.fichierPDF && (
              <a
                href={c.fichierPDF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-center bg-gradient-to-l from-blue-800 to-teal-600 text-white py-2 rounded-xl font-medium transition-all hover:scale-105"
              >
                📄 Consulter le cours
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


/* ======================================================
   🗓️ Emploi du temps
====================================================== */
function StudentEmploiPage() {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) return;

    // Charger les infos étudiant
    fetch("/api/student/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          const etu = data.data;
          setStudent(etu);

          // Charger les emplois du temps correspondants
          const resEmp = await fetch("/api/student/emplois", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filiere: etu.filiere,
              section: etu.section,
              annee: etu.annee,
            }),
          });

          const empData = await resEmp.json();
          if (empData.success) setEmplois(empData.data);
          else setError("Impossible de charger les emplois du temps.");
        } else {
          setError("Étudiant introuvable.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Chargement des emplois du temps...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  if (emplois.length === 0)
    return (
      <div className="text-center text-gray-500">
        <p>📅 Aucun emploi du temps disponible pour le moment.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
        Emploi du temps
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emplois.map((e) => (
          <motion.div
            key={e.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{e.titre}</h3>
              <p className="text-gray-500 text-sm mb-3">
                🎓 {e.filiere} — Section {e.section} — {e.annee}
              </p>
            </div>

            <a
              href={e.fichier}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-center bg-gradient-to-l from-blue-800 to-teal-600 text-white py-2 rounded-xl font-medium transition-all hover:scale-105"
            >
              📄 Consulter le fichier
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   🧾 Mes notes
====================================================== */
function StudentNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moyenne, setMoyenne] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) return;

    fetch("/api/student/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotes(data.data);
          if (data.data.length > 0) {
            // Calcul moyenne pondérée
            const total = data.data.reduce(
              (acc, n) => acc + n.note * n.coefficient,
              0
            );
            const coefSum = data.data.reduce(
              (acc, n) => acc + n.coefficient,
              0
            );
            setMoyenne((total / coefSum).toFixed(2));
          }
        } else setError(data.message || "Impossible de charger les notes");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des notes");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Chargement des notes...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  if (notes.length === 0)
    return (
      <div className="text-center text-gray-500">
        <p>📑 Aucune note disponible pour le moment.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
        Mes notes
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3">Matière</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Coefficient</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3">Remarque</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr
                key={n.id}
                className="border-b hover:bg-indigo-50 transition-colors"
              >
                <td className="px-4 py-2 font-medium">{n.matiere}</td>
                <td className="px-4 py-2">{n.note}</td>
                <td className="px-4 py-2">{n.coefficient}</td>
                <td className="px-4 py-2">{n.semestre}</td>
                <td className="px-4 py-2 text-gray-500">
                  {n.remarque || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {moyenne && (
        <div className="mt-6 text-center text-lg font-semibold text-indigo-700">
          Moyenne générale : {moyenne} / 20
        </div>
      )}
    </div>
  );
}

/* ======================================================
   ✉️ Recours Étudiant
====================================================== */
function StudentRecoursPage() {
  const [recoursList, setRecoursList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ sujet: "", message: "" });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const mail = localStorage.getItem("user_email");
    setEmail(mail);
    if (!mail) return;

    fetch("/api/student/recours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "list", email: mail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRecoursList(data.data);
        else setError(data.message || "Erreur de chargement");
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur serveur");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sujet || !form.message)
      return alert("Veuillez remplir le sujet et le message.");

    const res = await fetch("/api/student/recours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", email, ...form }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Recours envoyé !");
      setRecoursList([data.data, ...recoursList]);
      setForm({ sujet: "", message: "" });
    } else alert(data.message || "Erreur lors de l’envoi");
  };

  if (loading)
    return <p className="text-center text-gray-500">Chargement des recours...</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
        Mes recours / réclamations
      </h2>

      {/* 📝 Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 mb-8 space-y-4"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Sujet</label>
          <input
            type="text"
            value={form.sujet}
            onChange={(e) => setForm({ ...form, sujet: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ex : Recours sur la note de Statistiques"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            rows="4"
            placeholder="Expliquez votre demande ici..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-l from-blue-800 to-teal-600 text-white py-2 px-5 rounded-xl font-medium hover:scale-105 transition-all"
        >
          Envoyer le recours
        </button>
      </form>

      {/* 📋 Liste des recours */}
      {recoursList.length === 0 ? (
        <p className="text-gray-500 text-center">
          Aucun recours envoyé pour le moment.
        </p>
      ) : (
        <div className="grid gap-4">
          {recoursList.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-indigo-500"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-indigo-700">
                  {r.sujet}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    r.statut === "Traité"
                      ? "bg-green-100 text-green-700"
                      : r.statut === "En cours"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.statut}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{r.message}</p>
              {r.reponse && (
                <p className="text-sm text-gray-600 border-t pt-2 italic">
                  💬 Réponse : {r.reponse}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Envoyé le {new Date(r.date_envoi).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



/* ======================================================
   🧩 Placeholder / NotFound
====================================================== */
function Placeholder({ title }) {
  return (
    <div className="text-center py-20 text-gray-500">
      <h3 className="text-xl font-semibold text-indigo-700 mb-3">{title}</h3>
      <p>🧩 Cette section sera disponible prochainement.</p>
    </div>
  );
}

function NotFound() {
  return <p>❌ Page introuvable</p>;
}
