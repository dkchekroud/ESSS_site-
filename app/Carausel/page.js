"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const newsData = [
  {
    id: 1,
    title: "Annonce du Ministère de l’Enseignement Supérieur",
    description:
      "Le ministère publie une nouvelle directive concernant l’organisation des examens pour le semestre en cours.",
    date: "28 Octobre 2025",
    source: "Ministère de l’Enseignement Supérieur",
    image:
      "https://www.esss.dz/wp-content/uploads/2022/07/IMG_3464-1500x1000.jpg",
  },
  {
    id: 2,
    title: "Journée scientifique de l’école",
    description:
      "Une journée scientifique dédiée à l’intelligence artificielle et la cybersécurité s’est tenue à l’école.",
    date: "25 Octobre 2025",
    source: "École Supérieure de la Sécurité Sociale",
    image:
      "https://www.esss.dz/wp-content/uploads/2025/01/20240715_103540-1500x1125.jpg",
  },
  {
    id: 3,
    title: "Visite du Ministre sur le campus",
    description:
      "Le ministre a félicité les étudiants pour leurs résultats et annoncé de nouveaux partenariats.",
    date: "22 Octobre 2025",
    source: "Ministère de l’Enseignement Supérieur",
    image:
      "https://www.esss.dz/wp-content/uploads/2022/07/IMG_4502-1500x844.jpg",
  },
  {
    id: 4,
    title: "Célébration de la Journée de l’Étudiant",
    description:
      "Des activités culturelles et sportives ont marqué la Journée de l’Étudiant sur le campus.",
    date: "20 Octobre 2025",
    source: "École Supérieure",
    image:
      "https://www.esss.dz/wp-content/uploads/2022/07/IMG_6152-1500x1000.jpg",
  },
  {
    id: 5,
    title: "Hackathon universitaire 2025",
    description:
      "Les étudiants ont présenté des projets innovants dans le cadre du hackathon annuel.",
    date: "18 Octobre 2025",
    source: "École Supérieure de la Sécurité Sociale",
    image:
      "https://www.esss.dz/wp-content/uploads/2022/06/150150985_4340617922633658_3748066942996574101_o-1500x1000.jpg",
  },
  {
    id: 6,
    title: "Ouverture des inscriptions pédagogiques",
    description:
      "Les inscriptions pour l’année universitaire 2025/2026 sont désormais ouvertes.",
    date: "15 Octobre 2025",
    source: "Ministère de l’Enseignement Supérieur",
    image:
      "https://www.esss.dz/wp-content/uploads/2025/01/IMG_8343-1500x1000.jpg",
  },
];

export default function NewsCarousel() {
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 3;
  const totalSlides = Math.ceil(newsData.length / itemsPerPage);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 7000);
    return () => clearInterval(interval);
  }, []);

  const startIndex = current * itemsPerPage;
  const visibleNews = newsData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="mt-10 max-w-8xl mx-auto bg-gradient-to-r from-sky-600 to-rose-800 text-white  shadow-2xl p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
          Actualités 
        </h2>
        <div className="flex gap-3">
          <button
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition"
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {visibleNews.map((news) => (
            <div
              key={news.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:scale-[1.02] transition-transform"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {news.title}
                </h3>
                <p className="text-sm text-blue-100 mb-3 line-clamp-3">
                  {news.description}
                </p>
                <div className="flex justify-between text-xs text-teal-200/90">
                  <span>{news.source}</span>
                  <span className="text-blue-200">{news.date}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
