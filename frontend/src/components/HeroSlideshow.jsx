import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',
    label: 'Full stack delivery'
  },
  {
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85',
    label: 'Modern digital studios'
  },
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85',
    label: 'Strategy, systems, and launch'
  },
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=85',
    label: 'Creative business solutions'
  }
];

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 text-white">
      <AnimatePresence mode="sync">
        <motion.img
          key={activeSlide.image}
          src={activeSlide.image}
          alt={activeSlide.label}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(245,184,75,0.16),transparent_30%)]" />

      <div className="container-pad flex min-h-[calc(100vh-80px)] items-center py-20">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.p
            className="mb-5 inline-flex rounded-md border border-brand-300/40 bg-white/10 px-4 py-2 text-sm font-bold text-brand-50 backdrop-blur-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {activeSlide.label}
          </motion.p>
          <motion.h1
            className="max-w-5xl text-5xl font-black tracking-normal sm:text-7xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            Transforming Ideas Into Digital Solutions
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-200"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26 }}
          >
            Web Development • Systems • Creative Solutions
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.34 }}
          >
            <Link className="btn-primary" to="/services">
              Explore Services <ArrowRight size={18} />
            </Link>
            <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white" to="/portfolio">
              View Portfolio
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="container-pad absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? 'w-10 bg-brand-100' : 'w-4 bg-white/40 hover:bg-white/70'
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
