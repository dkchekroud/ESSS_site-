"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const data = await res.json();

        // Save token & role in localStorage
        localStorage.setItem("admin_token", data.token || "");
        localStorage.setItem("admin_email", email);
        localStorage.setItem("admin_role", data.role);

        alert("✅ Connexion réussie !");

        // Redirect based on role
        if (data.role === "superadmin") {
          router.push("/admin/super");
        } else if (data.role === "admin") {
          router.push("/admin/espace");
        } else {
          alert("Rôle non reconnu !");
        }
      } else if (res.status === 401) {
        setError("❌ Email ou mot de passe incorrect.");
      } else if (res.status === 404) {
        setError("⚠️ Aucun compte trouvé avec cet email.");
      } else {
        setError("Erreur interne du serveur. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-teal-600 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full"
      >
        {/* Left Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex items-center justify-center"
        >
          <img
            src="https://www.horizons.dz/wp-content/uploads/2024/07/travail-2-780x470.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-l-3xl"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 p-14 flex flex-col justify-center"
        >
          {/* Logo */}
          <div className="flex justify-center items-center mb-6">
            <img
              src="https://inscription.esss.dz/images/Logo-esss-300x300.png?v=1"
              alt="Logo ESSS"
              className="h-20 w-auto"
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
            Connexion
          </h2>

          {error && (
            <p className="text-red-600 text-center md:text-left mb-6">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gmail.com"
                className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-700 focus:outline-none text-black text-lg transition-all duration-300 hover:scale-105"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-700 focus:outline-none text-black text-lg transition-all duration-300 hover:scale-105"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-gradient-to-l from-blue-800 to-teal-700 text-white py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </motion.button>
          </form>

          <p className="text-center md:text-left text-sm text-gray-500 mt-6">
            Vous n'avez pas de compte ?{" "}
            <a
              href="/register"
              className="text-blue-700 font-medium hover:underline"
            >
              Inscrivez-vous
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
