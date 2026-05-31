import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PortfolioCard from '../components/PortfolioCard.jsx';
import { portfolioItems, pricingPlans, services, testimonials } from '../data/siteData.js';

const stats = [
  ['48+', 'projects delivered'],
  ['9', 'service lines'],
  ['99%', 'client-first execution'],
  ['24/7', 'deployment-ready support']
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-35"
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85"
            alt="Modern team workspace"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>
        <div className="container-pad relative grid min-h-[calc(100vh-80px)] items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <p className="mb-4 inline-flex rounded-md border border-brand-400/40 bg-brand-400/10 px-4 py-2 text-sm font-bold text-brand-100">
              Full stack systems, design, tutoring, and digital growth
            </p>
            <h1 className="max-w-4xl text-5xl font-black tracking-normal sm:text-7xl">VICTOR.IO SOLUTIONS</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              We build premium web products, business systems, creative assets, and service workflows that help ambitious
              founders launch, operate, and scale with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/contact">
                Start a project <ArrowRight size={18} />
              </Link>
              <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white" to="/portfolio">
                View portfolio
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="glass rounded-lg p-6 text-slate-950 dark:text-white"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="grid gap-4">
              {[
                ['Discovery', 'Clear scope, milestones, risks, and technical architecture.'],
                ['Build', 'Full stack implementation with secure APIs and polished UI.'],
                ['Deploy', 'Vercel and Render-ready release with production environment guidance.']
              ].map(([title, body], index) => (
                <div key={title} className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <h2 className="font-bold">{title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950">
        <div className="container-pad grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
              <p className="text-3xl font-black text-brand-700 dark:text-brand-100">{value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Services"
            title="Everything needed to launch and operate with polish."
            description="Choose focused support or combine services into a complete product delivery package."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <SectionHeader centered eyebrow="Portfolio" title="Built for real users, clean operations, and growth." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="glass rounded-lg p-6">
              <p className="text-base leading-8 text-slate-700 dark:text-slate-200">“{testimonial.quote}”</p>
              <p className="mt-6 font-bold text-slate-950 dark:text-white">{testimonial.name}</p>
              <p className="text-sm text-brand-700 dark:text-brand-100">{testimonial.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <SectionHeader centered eyebrow="Pricing" title="Simple starting points, flexible execution." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.featured
                    ? 'border-brand-500 bg-brand-600 text-white shadow-glow'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <p className="text-lg font-bold">{plan.name}</p>
                <p className="mt-3 text-4xl font-black">{plan.price}</p>
                <p className={`mt-3 text-sm leading-7 ${plan.featured ? 'text-brand-50' : 'text-slate-600 dark:text-slate-300'}`}>
                  {plan.description}
                </p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 size={16} /> {feature}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad">
          <div className="rounded-lg bg-slate-950 p-8 text-white shadow-2xl md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-100">Contact CTA</p>
                <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Ready to build something crisp?</h2>
                <p className="mt-4 max-w-2xl text-slate-300">
                  Bring the idea. We will help shape the architecture, user experience, roadmap, and release path.
                </p>
              </div>
              <Link to="/contact" className="btn-primary">
                Book a consult <Zap size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
