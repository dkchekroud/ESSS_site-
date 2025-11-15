"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Appel à ton API /api/auth/login (déjà existante)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe incorrect.");
        return;
      }

      // ✅ Si la connexion réussit → stocker les infos enseignant
      localStorage.setItem("user_role", "teacher");
      localStorage.setItem("user_email", email);

      alert("Connexion réussie !");
      router.push("/enseignant"); // Redirection vers espace enseignant
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-700 to-sky-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Connexion Enseignant
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Veuillez entrer vos identifiants ESSS
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="ex: prof@esss.dz"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium"
          >
            Se connecter
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          <p>
            Vous n’êtes pas enseignant ?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Retour à la connexion principale
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
