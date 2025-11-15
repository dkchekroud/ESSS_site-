"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  LayoutDashboard,
} from "lucide-react";

export default function SuperAdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState({ admins: [], students: [], teachers: [] });
  const [activeTab, setActiveTab] = useState("dashboard");

  const [form, setForm] = useState({
    role: "student",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    matricule: "",
    filiere: "",
    section: "",
    annee: "",
    grade: "",
    specialite: "",
    module_enseigne: "",
    id_admin: "",
  });

  const [sortBy, setSortBy] = useState("alphabetique");
  const [search, setSearch] = useState("");

  // ✅ Vérification du rôle
  useEffect(() => {
    const role = localStorage.getItem("admin_role");
    if (role !== "superadmin") {
      alert("🚫 Accès réservé aux Super Administrateurs.");
      router.replace("/admin-login");
    } else {
      setAuthorized(true);
      setChecking(false);
    }
  }, [router]);

  // ✅ Chargement des utilisateurs
  async function fetchUsers() {
    try {
      const res = await fetch("/api/super/users/list", { cache: "no-store" });
      const data = await res.json();
      const payload = data.data || {};
      setUsers({
        admins: payload.admins || [],
        students: payload.students || [],
        teachers: payload.teachers || [],
      });
    } catch (err) {
      console.error("Erreur chargement :", err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Déconnexion
  const handleLogout = async () => {
    if (!confirm("Déconnexion ?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.clear();
    router.push("/admin-login");
  };

  // ✅ Création
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/super/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchUsers();
    // Reset form
    setForm({
      role: "student",
      nom: "",
      prenom: "",
      email: "",
      password: "",
      matricule: "",
      filiere: "",
      section: "",
      annee: "",
      grade: "",
      specialite: "",
      module_enseigne: "",
      id_admin: "",
    });
  }

  // ✅ Suppression
  async function handleDelete(id, role) {
    if (!confirm("Supprimer ce compte ?")) return;
    const res = await fetch(`/api/super/users/delete/${id}?role=${role}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message || data.error);
    fetchUsers();
  }

  // ✅ Modification
  async function handleEdit(u, role) {
    const newNom = prompt("Nouveau nom :", u.nom);
    const newPrenom = prompt("Nouveau prénom :", u.prenom);
    const newEmail = prompt("Nouvel email :", u.email);
    if (!newNom || !newPrenom || !newEmail) return alert("Champs manquants.");
    const res = await fetch(`/api/super/users/update/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, nom: newNom, prenom: newPrenom, email: newEmail }),
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchUsers();
  }

  // ✅ Tri + filtre
  function sortList(list = []) {
    if (!Array.isArray(list)) return [];
    if (sortBy === "alphabetique") return [...list].sort((a, b) => a.nom.localeCompare(b.nom));
    if (sortBy === "date") return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  function filterList(list) {
    if (!search.trim()) return list;
    return list.filter(
      (u) =>
        u.nom?.toLowerCase().includes(search.toLowerCase()) ||
        u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (checking) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!authorized) {
    return <div className="flex justify-center items-center h-screen text-red-500">Accès refusé</div>;
  }

  // ✅ Layout complet
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard size={28} />
          <h1 className="text-2xl font-bold">SuperAdmin</h1>
        </div>

        <nav className="flex flex-col gap-3 text-lg">
          <button className={`px-4 py-2 rounded text-left hover:bg-blue-800 ${activeTab === "dashboard" && "bg-blue-800"}`} onClick={() => setActiveTab("dashboard")}>
            Tableau de bord
          </button>
          <button className={`px-4 py-2 rounded text-left hover:bg-blue-800 ${activeTab === "admins" && "bg-blue-800"}`} onClick={() => setActiveTab("admins")}>
             Admins
          </button>
          <button className={`px-4 py-2 rounded text-left hover:bg-blue-800 ${activeTab === "students" && "bg-blue-800"}`} onClick={() => setActiveTab("students")}>
             Étudiants
          </button>
          <button className={`px-4 py-2 rounded text-left hover:bg-blue-800 ${activeTab === "teachers" && "bg-blue-800"}`} onClick={() => setActiveTab("teachers")}>
             Enseignants
          </button>
          <button className={`px-4 py-2 rounded text-left hover:bg-blue-800 ${activeTab === "create" && "bg-blue-800"}`} onClick={() => setActiveTab("create")}>
             Créer un compte
          </button>
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full justify-center"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* === CONTENU === */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* === DASHBOARD === */}
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tableau de bord</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4 border-l-4 border-red-600">
                <Users className="text-red-600" size={30} />
                <div>
                  <h3 className="font-semibold text-gray-600">Admins</h3>
                  <p className="text-2xl font-bold">{users.admins.length}</p>
                </div>
              </div>

              <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4 border-l-4 border-green-600">
                <GraduationCap className="text-green-600" size={30} />
                <div>
                  <h3 className="font-semibold text-gray-600">Étudiants</h3>
                  <p className="text-2xl font-bold">{users.students.length}</p>
                </div>
              </div>

              <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4 border-l-4 border-blue-600">
                <BookOpen className="text-blue-600" size={30} />
                <div>
                  <h3 className="font-semibold text-gray-600">Enseignants</h3>
                  <p className="text-2xl font-bold">{users.teachers.length}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* === FORMULAIRE DE CRÉATION === */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
              <PlusCircle /> Créer un nouveau compte
            </h3>

            <div className="grid md:grid-cols-5 gap-3">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border p-2 rounded col-span-5"
              >
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
                <option value="admin">Admin</option>
              </select>

              <input placeholder="Nom" className="border p-2 rounded" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              <input placeholder="Prénom" className="border p-2 rounded" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
              <input placeholder="Email" type="email" className="border p-2 rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Mot de passe" type="password" className="border p-2 rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

              {/* Étudiant */}
              {form.role === "student" && (
                <>
                  <input placeholder="Matricule" className="border p-2 rounded col-span-2" value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
                  <input placeholder="Filière" className="border p-2 rounded col-span-2" value={form.filiere} onChange={(e) => setForm({ ...form, filiere: e.target.value })} />
                  <select value={form.annee} onChange={(e) => setForm({ ...form, annee: e.target.value })} className="border p-2 rounded col-span-2">
                    <option value="">-- Année d’étude --</option>
                    <option value="1re année">1re année</option>
                    <option value="2e année">2e année</option>
                    <option value="3e année">3e année</option>
                  </select>
                </>
              )}

              {/* Enseignant */}
              {form.role === "teacher" && (
                <>
                  <input placeholder="Grade" className="border p-2 rounded col-span-2" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
                  <input placeholder="Spécialité" className="border p-2 rounded col-span-2" value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
                </>
              )}

              {/* Admin */}
              {form.role === "admin" && (
                <input placeholder="Identifiant interne" className="border p-2 rounded col-span-2" value={form.id_admin} onChange={(e) => setForm({ ...form, id_admin: e.target.value })} />
              )}

              <button className="col-span-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">
                Créer le compte
              </button>
            </div>
          </form>
        )}

        {/* === LISTES === */}
        {["admins", "students", "teachers"].includes(activeTab) && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <Search size={18} />
              <input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="alphabetique">Ordre alphabétique</option>
                <option value="date">Date de création</option>
              </select>
            </div>

            <h3 className="text-2xl font-bold mb-4 capitalize">
              {activeTab === "admins" && " Liste des Admins"}
              {activeTab === "students" && " Liste des Étudiants"}
              {activeTab === "teachers" && "Liste des Enseignants"}
            </h3>

            <ul className="bg-white rounded-lg shadow divide-y">
              {filterList(sortList(users[activeTab])).map((u) => (
                <li key={u.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                  <span>
                    <strong>{u.nom} {u.prenom}</strong> — {u.email}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(u, activeTab)} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded flex items-center gap-1 text-sm">
                      <Edit size={14} /> Modifier
                    </button>
                    <button onClick={() => handleDelete(u.id, activeTab)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
