import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Layers,
  MapPin,
  Quote,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PortfolioCard from '../components/PortfolioCard.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import GitHubProjects from '../components/GitHubProjects.jsx';
import EventsBanner from '../components/EventsBanner.jsx';
import { portfolioItems, pricingPlans, services as staticServices, testimonials } from '../data/siteData.js';
import { eventService, serviceService } from '../services/api.js';
import { formatDate } from '../utils/format.js';

const stats = [
  { value: '48+', label: 'Projects delivered', icon: Rocket },
  { value: '9', label: 'Service lines', icon: Layers },
  { value: '99%', label: 'Client-first execution', icon: TrendingUp },
  { value: '24/7', label: 'Deployment-ready support', icon: Compass }
];

const process = [
  { step: '01', title: 'Discover', body: 'We map the goal, audience, and technical constraints — no vague briefs.' },
  { step: '02', title: 'Design', body: 'Modern, accessible UI that fits brand and business workflow.' },
  { step: '03', title: 'Build', body: 'Production-grade code, real database modeling, secure auth, clean CI/CD.' },
  { step: '04', title: 'Launch', body: 'Deploy to Vercel + Render, monitor health, hand over docs and access.' }
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export default function Home() {
  const [liveServices, setLiveServices] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    serviceService
      .list()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length) setLiveServices(data);
      })
      .catch(() => {});

    eventService
      .upcoming(6)
      .then(({ data }) => setUpcomingEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const displayServices = (liveServices ?? staticServices).slice(0, 6);

  return (
    <>
      <HeroSlideshow />

      {/* Stats */}
      <section className="relative -mt-16 pb-12">
        <div className="container-pad">
          <motion.div
            className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4"
            {...fadeUp}
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events (only if any) */}
      {upcomingEvents.length > 0 && (
        <section className="pb-4 pt-8">
          <div className="container-pad">
            <motion.div {...fadeUp}>
              <SectionHeader
                eyebrow="Upcoming"
                title="Events you don't want to miss."
                description="Workshops, launches, and community sessions hosted by our team."
              />
            </motion.div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.slice(0, 6).map((event, i) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                  className="card-elevated relative overflow-hidden p-6"
                >
                  {event.cover_url && (
                    <img
                      src={event.cover_url}
                      alt={event.title}
                      className="mb-5 h-36 w-full rounded-xl object-cover"
                    />
                  )}
                  <span className="badge border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900/60 dark:bg-brand-900/30 dark:text-brand-200">
                    <CalendarDays size={12} /> {formatDate(event.starts_at)}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{event.title}</h3>
                  {event.location && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <MapPin size={13} /> {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {event.description}
                    </p>
                  )}
                  {event.link_url && (
                    <a
                      href={event.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost mt-5 w-full justify-center"
                    >
                      View details <ArrowRight size={14} />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-20">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader
              eyebrow="Services"
              title="Everything needed to launch and operate with polish."
              description="Choose focused support or combine services into a complete product delivery package."
            />
          </motion.div>
          <motion.div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3" {...fadeUp}>
            {displayServices.map((service, i) => (
              <ServiceCard key={service.id ?? service.title} service={service} index={i} />
            ))}
          </motion.div>
          <motion.div className="mt-12 flex justify-center" {...fadeUp}>
            <Link to="/services" className="btn-ghost">
              See all services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader
              centered
              eyebrow="How we work"
              title="A clean process that respects time and budget."
              description="No drawn-out discovery, no vendor lock-in. Just a shipping rhythm that gets the product live."
            />
          </motion.div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <motion.article
                key={p.step}
                className="card-elevated relative p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
              >
                <span className="absolute right-6 top-6 text-3xl font-black text-slate-100 dark:text-slate-800">
                  {p.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <Sparkles size={20} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{p.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader centered eyebrow="Portfolio" title="Built for real users, clean operations, and growth." />
          </motion.div>
          <motion.div className="mt-12 grid gap-10 md:grid-cols-2 xl:grid-cols-3" {...fadeUp}>
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.title} item={item} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* GitHub */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader
              centered
              eyebrow="GitHub"
              title="Live projects, straight from GitHub."
              description="A dynamic view of public repositories — point it at any username."
            />
          </motion.div>
          <div className="mt-12">
            <GitHubProjects />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader centered eyebrow="Testimonials" title="What clients say about working with us." />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.article
                key={t.name}
                className="card-elevated relative overflow-hidden p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              >
                <Quote className="absolute -right-2 -top-2 text-brand-100 dark:text-brand-900/40" size={88} />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-14 w-14 rounded-full border-2 border-brand-500 object-cover shadow-md"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-950 dark:text-white">{t.name}</h3>
                      <p className="text-xs font-semibold text-brand-700 dark:text-brand-200">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">"{t.quote}"</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <motion.div {...fadeUp}>
            <SectionHeader centered eyebrow="Pricing" title="Simple starting points, flexible execution." />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                className={`relative rounded-2xl border p-7 transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.featured
                    ? 'border-brand-500 bg-brand-gradient text-white shadow-glow'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-900 shadow">
                    Most popular
                  </span>
                )}
                <p className="text-lg font-bold">{plan.name}</p>
                <p className="mt-3 text-4xl font-black">{plan.price}</p>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    plan.featured ? 'text-brand-50' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 size={16} /> {feature}
                    </p>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    plan.featured
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'border border-slate-200 text-slate-900 hover:border-brand-500 hover:text-brand-700 dark:border-slate-700 dark:text-white'
                  }`}
                >
                  Choose {plan.name} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-pad">
          <motion.div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 text-white shadow-2xl md:p-14" {...fadeUp}>
            <div className="absolute inset-0 bg-mesh opacity-70" />
            <div className="absolute inset-0 bg-grid opacity-25" />
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-200">Let's build</p>
                <h2 className="font-display mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                  Ready to build something <span className="gradient-text">crisp?</span>
                </h2>
                <p className="mt-5 max-w-2xl text-slate-300">
                  Bring the idea — we'll help shape the architecture, user experience, roadmap, and release path.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">
                  Book a consult <Zap size={18} />
                </Link>
                <Link to="/services" className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white">
                  See services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <EventsBanner />
    </>
  );
}
