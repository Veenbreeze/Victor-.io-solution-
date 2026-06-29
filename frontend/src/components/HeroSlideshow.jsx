import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

import cons1 from '../assets/cons1.jpeg';
import cons3 from '../assets/cons3.jpeg';
import cons4 from '../assets/cons4.jpeg';
import cons5 from '../assets/cons5.jpeg';

const slides = [
  { image: cons1, label: 'Full-stack delivery', tagline: 'Web, systems & APIs' },
  { image: cons5, label: 'Modern digital studio', tagline: 'Design that converts' },
  { image: cons3, label: 'Strategy, systems, launch', tagline: 'From idea to production' },
  { image: cons4, label: 'Creative business solutions', tagline: 'Built for growth' }
];

const trustBadges = ['React', 'Node.js', 'PostgreSQL', 'Django', 'Tailwind', 'Vercel'];

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSlide.image}
          src={activeSlide.image}
          alt={activeSlide.label}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/55 via-slate-950/75 to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-mesh opacity-50 mix-blend-overlay" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="absolute -left-32 top-32 -z-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -right-24 bottom-24 -z-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="container-pad flex min-h-[calc(100vh-80px)] items-center py-20">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.span
            className="badge mb-6 border-white/20 bg-white/10 text-white backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Sparkles size={14} className="text-brand-200" /> {activeSlide.tagline}
          </motion.span>

          <motion.h1
            className="font-display max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Transforming ideas into{' '}
            <span className="bg-gradient-to-br from-brand-200 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
              digital solutions
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/90"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            A boutique studio building production-ready websites, business systems, and creative
            growth assets — for founders, freelancers, and teams ready to ship.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            <Link className="btn-primary" to="/services">
              Explore services <ArrowRight size={18} />
            </Link>
            <Link
              className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white"
              to="/portfolio"
            >
              View portfolio
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-200">
                Trusted across 3 continents
              </span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur"
                >
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.label}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? 'w-10 bg-brand-200' : 'w-4 bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${slide.label}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
