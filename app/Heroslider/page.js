"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Globe,
} from "lucide-react";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image:
       "https://www.esss.dz/wp-content/uploads/2022/07/IMG_3464-1500x1000.jpg",
      badge: "",
      title: ["Excellence", "Innovation", "Engagement"],
      colors: [
        "from-blue-800 via-indigo-700 to-blue-500",
        "from-amber-600 via-orange-600 to-red-500",
        "from-teal-600 via-cyan-600 to-blue-600",
      ],
      subtitle:
        "Une institution d’excellence dédiée aux sciences sociales, formant les futurs acteurs du changement.",
      stats: [
        { icon: GraduationCap, value: "15 000+", label: "Étudiants" },
        { icon: Users, value: "500+", label: "Enseignants & Chercheurs" },
        { icon: Award, value: "98%", label: "Taux de Réussite" },
      ],
    },
    {
      image:
        "https://www.esss.dz/wp-content/uploads/2022/07/IMG_4502-1500x844.jpg",
      badge: " ",
      title: ["Apprenez", "Différemment", "Réussissez"],
      colors: [
        "from-purple-700 via-pink-700 to-rose-600",
        "from-rose-600 via-orange-600 to-amber-600",
        "from-teal-600 via-emerald-600 to-green-600",
      ],
      subtitle:
        "Des approches pédagogiques innovantes favorisant la créativité, la réflexion critique et la réussite durable.",
      stats: [
        { icon: BookOpen, value: "120+", label: "Programmes de formation" },
        { icon: Globe, value: "40+", label: "Partenariats internationaux" },
        { icon: Award, value: "Top 5", label: "Universités Sociales" },
      ],
    },
    {
      image:
        "https://www.esss.dz/wp-content/uploads/2025/01/IMG_8343-1500x1000.jpg",
      badge: "",
      title: ["Étudiez", "Au Cœur", "Du Monde"],
      colors: [
        "from-cyan-700 via-blue-700 to-indigo-600",
        "from-indigo-600 via-violet-600 to-purple-600",
        "from-orange-600 via-red-600 to-pink-600",
      ],
      subtitle:
        "Un campus ouvert sur le monde, offrant un environnement multiculturel et des opportunités d’échange uniques.",
      stats: [
        { icon: Globe, value: "80+", label: "Nationalités Représentées" },
        { icon: Users, value: "200+", label: "Partenaires Académiques" },
        { icon: Award, value: "Top 5", label: "Classement Régional" },
      ],
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="relative overflow-hidden h-screen"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover scale-105 animate-zoomSlow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-center text-center px-6 z-20">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}


              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-white space-y-2 animate-fadeSlide">
                {slide.title.map((t, i) => (
                  <span
                    key={i}
                    className={`block bg-gradient-to-r ${slide.colors[i]} bg-clip-text text-transparent`}
                  >
                    {t}
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg md:text-xl text-white/90 animate-fadeSlide max-w-3xl mx-auto">
                {slide.subtitle}
              </p>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 animate-fadeSlide">
                {slide.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/25 hover:scale-110 transition-all duration-300 cursor-default"
                  >
                    <stat.icon className="text-white" size={24} />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeSlide">
                <a
                  href="#programmes"
                  className="px-8 py-4 bg-white text-blue-800 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Découvrir nos Programmes
                  <ArrowRight size={20} className="group-hover:translate-x-1" />
                </a>
                <a
                  href="#admission"
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-800 transition-all hover:scale-105"
                >
                  Candidature & Inscriptions
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Quote */}
      <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/80 italic text-lg animate-fadeSlide z-30">
        “Former les esprits d’aujourd’hui pour bâtir le monde de demain.”
      </p>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition hover:scale-110"
        aria-label="Précédent"
      >
        <ChevronLeft size={28} className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition hover:scale-110"
        aria-label="Suivant"
      >
        <ChevronRight size={28} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full border-2 border-white/50 ${
              currentSlide === index
                ? "w-12 h-3 bg-white"
                : "w-3 h-3 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
        <div key={currentSlide} className="h-1 bg-white animate-progress"></div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlide {
          animation: fadeSlide 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes zoomSlow {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }
        .animate-zoomSlow {
          animation: zoomSlow 6s ease-in-out infinite alternate;
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
