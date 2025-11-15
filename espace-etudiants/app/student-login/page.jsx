"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔒 LOGIQUE DE CONNEXION ÉTUDIANT (inchangée)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${window.location.origin}/api/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(`Erreur ${res.status} : ${res.statusText}`);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Email ou mot de passe incorrect");
        return;
      }

      // ✅ Connexion réussie
      localStorage.setItem("user_role", "student");
      localStorage.setItem("user_email", email);

      alert("Connexion réussie !");
      router.push("/etudiant");
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError("Erreur serveur. Vérifiez la connexion au backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-white to-sky-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100"
      >
        {/* Logo ESSS */}
        <div className="flex justify-center mb-6">
          <img
            src="https://inscription.esss.dz/images/Logo-esss-300x300.png?v=1"
            alt="Logo ESSS"
            className="h-20 w-auto"
          />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-center text-sky-800 mb-6">
          Connexion Étudiant
        </h1>

        {/* Erreur */}
        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center mb-4 border border-red-200">
            {error}
          </p>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm mb-1 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@esss.dz"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 placeholder-gray-400 bg-white/60 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm mb-1 font-medium"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 placeholder-gray-400 bg-white/60 backdrop-blur-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-l from-sky-500 to-blue-800 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Se connecter
          </motion.button>
        </form>

        {/* Lien bas de page */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Vous n’avez pas de compte ?{" "}
          <a href="#" className="text-blue-700 font-medium hover:underline">
            Contactez votre administration
          </a>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} École Supérieure de la Sécurité Sociale
        </p>
      </motion.div>
    </div>
  );
}
