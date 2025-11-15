"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

import {
  BookOpen,
  Users,
  GraduationCap,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Award,
  Library,
  Globe,
  ChevronUp,
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSlider from "./Heroslider/page";
import GoogleTranslate from "./Goggletranselate/page";
import NewsCarousel from "./Carausel/page";

export default function HomeEnhanced() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const translateRef = useRef(null);
  const [programmes, setProgrammes] = useState([]); // ✅ Dynamique
const [loginOpen, setLoginOpen] = useState(false);
const loginRef = useRef(null);

  // -------- fetch dynamic accueil --------
const [accueil, setAccueil] = useState(null);

useEffect(() => {
  fetch("/api/accueil")
    .then((res) => res.json())
    .then(setAccueil)
    .catch((err) => console.error("Erreur chargement accueil:", err));
}, []);

// -------- scroll state --------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

// -------- fetch dynamic programmes --------
  useEffect(() => {
    fetch("/api/programmes")
      .then((res) => res.json())
      .then(setProgrammes)
      .catch((err) => console.error("Erreur chargement programmes:", err));
  }, []);

// -------- fetch dynamic actualites --------
  const [actualites, setActualites] = useState([]);

useEffect(() => {
  fetch("/api/actualites")
    .then((res) => res.json())
    .then(setActualites)
    .catch((err) => console.error("Erreur actualités:", err));
}, []);

    // -------- redirection login --------
  const handlePostuler = () => router.push("/Login");
  // -------- animations --------
  const container = { visible: { transition: { staggerChildren: 0.2 } } };
  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // -------- languages --------
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "es", label: "Español" },
    { code: "it", label: "Italiano" },
    { code: "de", label: "Deutsch" },
  ];
  const textVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const imagesVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };
  // Google translate loader (kept similar to your original)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const styleId = "gt-hide-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget { display: none !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-combo { display:block !important; }
      `;
      document.head.appendChild(style);
    }

    window.googleTranslateElementInit = function () {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: "fr", includedLanguages: languages.map((l) => l.code).join(","), autoDisplay: false, layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          "google_translate_element_hidden"
        );
      } catch (e) {}
    };

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const setGoogleTranslate = (targetLang) => {
    if (typeof window === "undefined") return;
    const sourceLang = "fr";
    const cookieVal = `/` + sourceLang + `/` + targetLang;
    const domain = window.location.hostname;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    try { document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/`; } catch (e) {}
    try {
      if (!domain.includes(":") && domain !== "localhost") {
        document.cookie = `googtrans=${cookieVal}; domain=${domain}; expires=${expires}; path=/`;
      } else {
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/`;
      }
    } catch (e) {}

    setTimeout(() => {
      const el = document.querySelector(".goog-te-combo");
      if (el) {
        el.value = targetLang;
        const ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", true, true);
        el.dispatchEvent(ev);
      } else {
        window.location.reload();
      }
    }, 150);
  };

  const toggleAccordion = (i) => setActiveAccordion((p) => (p === i ? null : i));

  // content data
  const features = [
    { 
      icon: BookOpen, 
      title: "Formation d’Excellence", 
      description: "Des programmes spécialisés en sécurité sociale, gestion, droit et protection sociale, conçus par des experts du domaine." 
    },
    { 
      icon: Users, 
      title: "Recherche & Innovation Sociale", 
      description: "Projets appliqués, études de terrain et partenariats institutionnels pour renforcer le système de sécurité sociale en Algérie et ailleurs." 
    },
    { 
      icon: GraduationCap, 
      title: "Diplômes Reconnus", 
      description: "Certifications nationales reconnues par le secteur, ouvrant des perspectives professionnelles dans les institutions publiques et privées." 
    },
  ];
  

  const faqs = [
    { question: "Quels sont les programmes offerts ?", answer: "Licence, Master et Doctorat en sociologie, psychologie, sciences politiques, anthropologie, éducation, etc." },
    { question: "Comment s'inscrire à l'université ?", answer: "Inscription via le portail : dossier académique, lettre de motivation et entretien. Période : janvier-juin pour la rentrée de septembre." },
    { question: "Quelles sont les opportunités de bourses ?", answer: "Bourses d'excellence, sociales et de recherche. Critères : mérite, situation financière et implication dans la recherche." },
  ];

  const testimonials = [
    { name: "Yasmine B.", role: "Alumna - Administration publique", text: "Les programmes m'ont donné les compétences concrètes pour réussir dans le secteur public." },
    { name: "Kamel R.", role: "Chercheur", text: "Encadrement de haute qualité et opportunités de collaboration internationales." },
    { name: "Nour E.", role: "Étudiante - Master", text: "Ambiance stimulante, enseignants accessibles et projets concrets." },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const stats = [
    { label: "Étudiants", value: 1240 },
    { label: "Programmes", value: 18 },
    { label: "Partenaires", value: 52 },
  ];

const partners = [
  { 
    name: "ESSS", 
    logo: "https://inscription.esss.dz/images/Logo-esss-300x300.png?v=1",
    link: "https://esss.dz" 
  },
  { 
    name: "Ministère du Travail", 
    logo: "https://lh3.googleusercontent.com/p/AF1QipNqF76gA2cEPPWF-cnf_ipVuNTEVw3hx9TnPtX-=s1360-w1360-h1020-rw",
    link: "https://www.mtess.gov.dz/" 
  },
  { 
    name: "CNAS", 
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/c/c2/CNAS_logo.png/1200px-CNAS_logo.png",
    link: "https://www.cnas.dz/" 
  },
  { 
    name: "CASNOS", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6FAsIciYplw_97SsDe0f98gRSBHZ44tEuw&s",
    link: "https://www.casnos.com.dz/" 
  },
];

  const events = [
    { title: "Journée Portes Ouvertes", date: "2025-11-15", location: "Campus Principal", desc: "Rencontrez les équipes pédagogiques et découvrez les locaux." },
    { title: "Colloque International", date: "2026-02-20", location: "Amphithéâtre A", desc: "Thèmes : protection sociale et politiques publiques." },
  ];

  // helper: format date
  const formatDate = (d) => new Date(d).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 text-slate-900">
      <Head>
        <title>ESSS - Homepage</title>
      </Head>

      <GoogleTranslate />
      <div id="google_translate_element_hidden" style={{ display: "none" }} />

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-white px-4 py-2 rounded shadow">Aller au contenu</a>

{/* Header */}
<header
  className={`w-full fixed top-0 z-50 transition-all duration-300 ${
    scrolled ? "bg-white/90 backdrop-blur-lg shadow-md" : "bg-transparent"
  }`}
>
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
    {/* Left section */}
    <div className="flex items-center gap-4">
      <button
        aria-label="Ouvrir le menu navigation"
        className="md:hidden p-2"
        onClick={() => setMobileMenuOpen((s) => !s)}
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <a href="#" className="flex items-center gap-3 no-underline">
        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-700">
          <img
            src="https://inscription.esss.dz/images/Logo-esss-300x300.png?v=1"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden sm:block">
          <span className="block font-bold text-lg text-blue-800">ESSS</span>
          <span className="text-sm text-red-800">
            École Supérieure de la Sécurité Sociale
          </span>
        </div>
      </a>
    </div>

    {/* Center nav */}
    <nav
      className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center space-x-8"
      aria-label="Menu principal"
    >
      {["Accueil", "Programmes","Actualités", "Contact","Evénements"].map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className="relative text-sm font-semibold text-gray-600 transition duration-300 group"
        >
          {item}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
        </a>
      ))}
    </nav>

    {/* Right side: Langue + Login */}
    <div className="flex items-center gap-4">
      {/* Langue button */}
      <div className="relative" ref={translateRef}>
        <button
          onClick={() => setTranslateOpen((s) => !s)}
          aria-haspopup="menu"
          aria-expanded={translateOpen}
          className="ml-2 flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 bg-white text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Choisir la langue"
        >
          <Globe size={16} className="text-blue-800" />
          <span className="hidden sm:inline">Langue</span>
          <ChevronDown size={16} />
        </button>

        <AnimatePresence>
          {translateOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
              role="menu"
              aria-label="Sélection de la langue"
            >
              <li className="px-3 py-2 text-sm text-slate-600 border-b">
                Choisir :
              </li>
              {languages.map((l) => (
                <li key={l.code}>
                  <button
                    onClick={() => {
                      setTranslateOpen(false);
                      setGoogleTranslate(l.code);
                    }}
                    role="menuitem"
                    className="w-full text-left px-3 py-2 hover:bg-blue-50"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setTranslateOpen(false);
                    setGoogleTranslate("fr");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-slate-700"
                >
                  Français (original)
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

{/* Login Dropdown */}
<div className="relative" ref={loginRef}>
  <button
    onClick={() => setLoginOpen((s) => !s)}
    className="bg-gradient-to-r from-blue-700  to-teal-500 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-300/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
  >
    Login <ChevronDown size={16} className="text-white drop-shadow-sm" />
  </button>

  <AnimatePresence>
    {loginOpen && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 overflow-hidden z-50"
      >
        <div className="flex flex-col divide-y divide-blue-50">
          <a
            href="http://localhost:3001/teacher-login"
            className="px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 font-medium flex items-center justify-between transition-all duration-200"
          >
            Espace Enseignant
            <span className="text-blue-500 text-xs font-semibold">→</span>
          </a>
          <a
            href="http://localhost:3002/student-login"
            className="px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 font-medium flex items-center justify-between transition-all duration-200"
          >
            Espace Étudiant
            <span className="text-blue-500 text-xs font-semibold">→</span>
          </a>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

    </div>
  </div>
</header>


<main id="main" className="pt-14">
        {/* hero */}
        <section aria-label="Hero" className="relative">
          <HeroSlider />

          <div className="max-w-7xl mx-auto px-6 -mt-28 relative z-20">

          </div>
        </section>

        {/* About + Media gallery */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-20 mt-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        {/* Section À propos (contenu dynamique) */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={textVariant}
>
  <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
    À propos de nous
  </span>

  <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-800 via-red-900 to-green-900 bg-clip-text text-transparent">
    {accueil?.titre || "Ecole supérieure de la Sécurité Sociale"}
  </h2>

  <p className="text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
    {accueil?.contenu ||
      "Chargement du contenu depuis l’administration..."}
  </p>

  {accueil?.imageUrl && (
    <img
      src={accueil.imageUrl}
      alt="Illustration accueil"
      className="rounded-2xl shadow-lg mb-6 w-full"
    />
  )}

  <a
    href="#programmes"
    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-800 to-teal-500 text-white rounded-full font-semibold"
  >
    Découvrir nos programmes <ArrowRight size={18} />
  </a>
</motion.div>


        {/* Media Gallery */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imagesVariant}
        >
          {[
            
"https://www.esss.dz/wp-content/uploads/2022/07/0B1A3802-1500x1000.jpg",
            "https://www.esss.dz/wp-content/uploads/2022/07/IMG_3464-1500x1000.jpg",
            "https://www.esss.dz/wp-content/uploads/2025/01/IMG_5903-1500x1000.jpg",
            "https://www.esss.dz/wp-content/uploads/2022/06/150150985_4340617922633658_3748066942996574101_o-1500x1000.jpg",          ].map((src, i) => (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <img
                src={src}
                alt={`media-${i}`}
                className="w-full h-48 object-cover hover:scale-105 transition-transform"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Features */}
    {/* ====== Programmes dynamiques ====== */}
        <section id="programmes" className="max-w-7xl mx-auto px-6 py-16">
      {/* Section title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-extrabold">
          Une formation <span className="bg-gradient-to-r from-blue-800 to-red-900  bg-clip-text text-transparent">d'excellence</span>
        </h2>
        <p className="text-slate-600 mt-3">
          Les piliers fondamentaux pour votre réussite académique et professionnelle.
        </p>
      </motion.div>

      {/* Features grid */}
      <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
      >
        {programmes.length > 0 ? (
            programmes.map((p) => (
              <motion.article
                key={p.id}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition"
                variants={cardVariant}
              >
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-900 to-teal-200 shadow-lg">
                  <BookOpen className="text-white" size={26} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {p.titre}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {p.description}
                </p>
                <button
                  onClick={() => router.push(`/programmes/${p.id}`)}
                  className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-blue-700"
                >
                  En savoir plus <ArrowRight size={16} />
                </button>
          </motion.article>
        ))
          ) : (
            <p className="text-center text-slate-500 col-span-3">
              Aucun programme disponible pour le moment.
            </p>
          )}
        </motion.div>
    </section>
{/* ===================== CAMPUS SECTION ===================== */}
<section className="relative z-10 py-24 bg-fixed bg-center bg-cover" 
  style={{ backgroundImage: "url('https://www.esss.dz/wp-content/uploads/2022/06/150150985_4340617922633658_3748066942996574101_o-1500x1000.jpg')" }}  // 🔹 remplace par ton image
>
  {/* Overlay sombre pour la lisibilité */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40"></div>

  {/* Contenu */}
  <div className="relative mt-12 rounded-3xl p-10 text-white max-w-5xl mx-auto text-center shadow-2xl backdrop-blur-sm">
    <div className="flex flex-col items-center" data-aos="fade-up">
      <Library size={48} className="mb-4 text-white/90" />
      <h3 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
        Découvrez notre campus
      </h3>
      <p className="text-white/90 mb-8 text-lg max-w-2xl">
        Explorez nos infrastructures modernes et plongez dans une expérience d’apprentissage unique.
      </p>

      <a
        href="#"
        className="inline-flex items-center gap-3 px-8 py-3 bg-white text-blue-700 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Visite virtuelle <ArrowRight size={18} />
      </a>
    </div>

    {/* Stats */}
    <div
      className="flex flex-wrap justify-center gap-10 mt-10"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="text-center transform hover:scale-105 transition duration-300"
        >
          <div className="text-4xl font-extrabold">{s.value.toLocaleString()}</div>
          <div className="text-sm text-white/80">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="max-w-7xl mx-auto px-6 py-24">
  <motion.div
    className="text-center mb-20"
    initial={{ opacity: 0, y: -40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-l from-red-900  to-blue-400  bg-clip-text text-transparent">
      Témoignages
    </h2>
    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
      Découvrez les retours inspirants de nos étudiants et partenaires
    </p>
  </motion.div>

  {/* Testimonials Grid */}
  <div className="grid md:grid-cols-3 gap-10">
    {testimonials.map((t, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: i * 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2 flex flex-col justify-between"
      >
        {/* Quote Icon */}
        <div className="text-blue-700 mb-4 text-3xl">“</div>

        {/* Testimonial Text */}
        <p className="text-gray-700 italic text-base md:text-lg leading-relaxed mb-6">
          {t.text}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{t.name}</div>
            <div className="text-sm text-gray-500">{t.role}</div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
  <div className="mt-16 border-t border-gray-200 w-24 mx-auto"></div>
</section>
<NewsCarousel/>
{/* ===================== ACTUALITÉS DYNAMIQUES ===================== */}


{/* ===================== PARTNERS ===================== */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h3
    className="text-2xl font-bold mb-8 text-center text-blue-900"
    data-aos="fade-up"
  >
    Nos partenaires
  </h3>

  <motion.div
    className="flex items-center gap-8 overflow-x-auto py-6 scrollbar-hide"
    initial={{ x: 50, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    {partners.map((p, i) => (
      <a
        key={i}
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-none w-44 bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        title={p.name}
      >
        <img
          src={p.logo}
          alt={p.name}
          className="object-contain h-14 grayscale hover:grayscale-0 transition-all duration-300"
        />
      </a>
    ))}
  </motion.div>
</section>

<section
  className="relative z-10 py-24 bg-fixed bg-center bg-cover overflow-hidden"
  style={{
    backgroundImage:
      "url('https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr2zphR1yA-lS6nhFadUFeyk9gkzW0LssUi0s1iAgvYn5zFCteeHQO7iGtkdGHhWczPFkHB2DhyXuOv0oQKX6KxyaJT36lW_gGJw2rs354M3UgvwKg0_YmdyglTMFSEuJvcWdG5=s1360-w1360-h1020-rw')",
    backgroundAttachment: "fixed",
  }}
>
  {/* Overlay sombre animé */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40 animate-gradientMove"></div>



  {/* ===================== EVENTS + FAQ ===================== */}
  <div id="Evénements" className="relative max-w-7xl mx-auto px-6 py-24 z-20">
    <div
      className="grid md:grid-cols-2 gap-12"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Événements */}
      <div data-aos="fade-right" data-aos-delay="200">
        <h2 className="text-3xl font-bold mb-6 text-white">Événements à venir</h2>
        <div className="space-y-6">
          {events.map((e, idx) => (
            <article
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={idx * 150}
              className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow hover:shadow-xl border border-slate-100 transition duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg text-slate-800">{e.title}</div>
                  <div className="text-sm text-slate-500">
                    {formatDate(e.date)} • {e.location}
                  </div>
                </div>
                <a
                  href="#"
                  className="text-blue-700 font-medium hover:underline hover:text-blue-800 transition"
                >
                  S’inscrire
                </a>
              </div>
              <p className="text-slate-600 mt-3">{e.desc}</p>
            </article>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div data-aos="fade-left" data-aos-delay="400">
        <h2 className="text-3xl font-bold mb-6 text-white">Questions fréquentes</h2>

        <div className="space-y-4">
          {[
            {
              question: "Comment puis-je m’inscrire à l’université ESSS ?",
              answer:
                "Vous pouvez vous inscrire en ligne via notre portail d’admission ou vous rendre directement à notre bureau d’inscription avec les documents requis.",
            },
            {
              question: "Quels sont les programmes disponibles ?",
              answer:
                "Nous proposons plusieurs formations dans les domaines de la sécurité sociale, de la gestion, de l’informatique et des sciences économiques.",
            },
            {
              question: "Y a-t-il des bourses d’études disponibles ?",
              answer:
                "Oui, ESSS offre plusieurs types de bourses en fonction du mérite académique et de la situation sociale des étudiants.",
            },
            {
              question: "Puis-je visiter le campus avant de m’inscrire ?",
              answer:
                "Bien sûr ! Vous pouvez planifier une visite guidée du campus en contactant notre service des admissions.",
            },
            {
              question: "L’université propose-t-elle des logements étudiants ?",
              answer:
                "Oui, nous disposons de logements modernes à proximité du campus, réservés à nos étudiants.",
            },
          ].map((faq, idx) => (
            <article
              key={idx}
              data-aos="fade-right"
              data-aos-delay={idx * 150}
              className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <header>
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-50 transition duration-300"
                  aria-expanded={activeAccordion === idx}
                  aria-controls={`faq-${idx}`}
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      activeAccordion === idx
                        ? "rotate-180 text-blue-600"
                        : "text-slate-500"
                    }`}
                  />
                </button>
              </header>

              {/* Contenu */}
              <div
                id={`faq-${idx}`}
                className={`px-6 transition-all duration-500 ease-in-out ${
                  activeAccordion === idx
                    ? "max-h-60 opacity-100 pb-4"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


<section id="contact" className="max-w-7xl mx-auto px-6 py-24">
  <motion.h2
    className="text-3xl md:text-4xl font-bold text-center mb-12"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    Nous sommes à votre écoute
  </motion.h2>

  <div className="grid md:grid-cols-2 gap-12">
    {/* ✅ Contact Form connecté à /api/contact */}
    <motion.form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = {
          fullName: e.target.fullName.value,
          email: e.target.email.value,
          subject: e.target.subject.value,
          message: e.target.message.value,
        };

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          const data = await res.json();

          if (res.ok && data.success) {
            alert("✅ Message envoyé avec succès !");
            e.target.reset();
          } else {
            alert("❌ Erreur lors de l’envoi : " + (data.error || "Inconnue"));
          }
        } catch (err) {
          console.error(err);
          alert("⚠️ Impossible de contacter le serveur.");
        }
      }}
      className="bg-white p-10 rounded-3xl shadow-lg space-y-5 border border-slate-100"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="grid md:grid-cols-2 gap-5">
        <input
          name="fullName"
          placeholder="Nom complet"
          className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>
      <input
        name="subject"
        placeholder="Sujet"
        className="p-4 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        className="p-4 border rounded-lg w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-800 to-teal-500 text-white rounded-full font-semibold transition-transform hover:scale-105"
        >
          Envoyer
        </button>
      </div>
    </motion.form>

    {/* Contact Info inchangée */}
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-slate-100 hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
          <Phone />
        </div>
        <div>
          <div className="font-semibold text-slate-800">Campus Principal</div>
          <div className="text-sm text-slate-600">
            Avenue de l’Université, Cité Universitaire, Alger
          </div>
          <a
            href="tel:+2132123456"
            className="text-blue-700 font-medium hover:underline"
          >
            +213 (0)21 12 34 56
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4 border border-slate-100 hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
          <Mail />
        </div>
        <div>
          <div className="font-semibold text-slate-800">Contact général</div>
          <div className="text-sm text-slate-600">contact@usss.dz</div>
          <a href="#" className="text-blue-700 font-medium hover:underline">
            Formulaire & support
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-800 to-teal-500 p-8 rounded-3xl text-center text-white shadow-xl hover:scale-[1.02] transition">
        <div className="font-semibold text-lg mb-2">Besoin d’aide ?</div>
        <p className="text-white/90">
          Notre équipe d’admission vous accompagne à chaque étape.
        </p>
        <a
          href="#admission"
          className="inline-flex items-center gap-2 mt-4 px-5 py-3 bg-white text-blue-700 rounded-full font-semibold shadow hover:scale-105 transition-transform"
        >
          Contactez-nous <ArrowRight size={16} />
        </a>
      </div>
    </motion.div>
  </div>
</section>


</main>
{/* Footer */}
<footer className="mt-12 bg-gradient-to-r from-blue-900 to-teal-800 text-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    {/* Grid for desktop, stacked on mobile */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      
      {/* Logo + Description + Social */}
      <div className="md:col-span-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <img 
              src="https://www.esss.dz/wp-content/uploads/2022/07/Logo-esss-300x300.png" 
              alt="Logo ESSS" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-lg">ESSS</div>
            <div className="text-sm text-white/80">Sécurité Sociale</div>
          </div>
        </div>
        <p className="text-white/80 max-w-md mb-4">
          Former les leaders de demain à travers l'excellence académique et la recherche innovante.
        </p>

        {/* Social Media */}
        <div className="flex gap-4 mt-4 text-2xl">
          <a 
            href="https://www.facebook.com/esssalgerie" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-400 transition-colors"
          >
            <FaFacebookF />
          </a>
          <a 
            href="https://www.linkedin.com/company/ecole-superieure-de-securite-sociale" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-300 transition-colors"
          >
            <FaLinkedinIn />
          </a>
          <a 
            href="https://twitter.com/ESSSAlgerie" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-500 transition-colors"
          >
            <FaTwitter />
          </a>
          <a 
            href="https://www.instagram.com/esssalgerie" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-pink-500 transition-colors"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Liens rapides */}
      <div>
        <h4 className="font-semibold mb-3">Liens rapides</h4>
        <ul className="space-y-2 text-white/80">
          {["À propos", "Programmes", "Recherche", "Bibliothèque", "Actualités"].map((l) => (
            <li key={l}>
              <a href="#" className="hover:text-white transition-colors">{l}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Maps */}
      <div>
        <h4 className="font-semibold mb-3">Nous trouver</h4>
        <div className="rounded-xl overflow-hidden shadow-lg">
 <div className="rounded-xl overflow-hidden shadow-lg">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.651989430031!2d2.9974897000000005!3d36.754923600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb1e7f84e0d7b%3A0xed087f45743c5dca!2sEcole%20Sup%C3%A9rieure%20de%20la%20S%C3%A9curit%C3%A9%20Sociale%20(ESSS)!5e0!3m2!1sfr!2sdz!4v1762813039923!5m2!1sfr!2sdz"
    width="100%"
    height="100%"
    className="h-48 sm:h-40 md:h-48 w-full"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-white/70 text-sm text-center md:text-left">
        © {new Date().getFullYear()} ESSS. Tous droits réservés.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <a href="#" className="text-white/70 hover:text-white text-sm">Confidentialité</a>
        <a href="#" className="text-white/70 hover:text-white text-sm">Conditions</a>
      </div>
    </div>
  </div>
</footer>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Remonter en haut" className={`fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-br from-white to-blue-700 text-white transition-transform ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <ChevronUp size={20} />
      </button>
    </div>
  );
}


