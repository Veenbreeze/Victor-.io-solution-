import { Link } from 'react-router-dom';
import { CheckCircle2, Zap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PortfolioCard from '../components/PortfolioCard.jsx';
import HeroSlideshow from '../components/HeroSlideshow.jsx';
import GitHubProjects from '../components/GitHubProjects.jsx';
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
      <HeroSlideshow />

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
         <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container-pad">
          <SectionHeader centered eyebrow="Portfolio" title="Built for real users, clean operations, and growth." />
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-pad">
          <SectionHeader
            centered
            eyebrow="GitHub"
            title="Live projects from GitHub."
            description="A dynamic view of public repositories, pulled directly from GitHub and ready to point at your username."
          />
          <div className="mt-10">
            <GitHubProjects />
          </div>
        </div>
      </section>

     <section className="bg-white py-20 dark:bg-slate-950">
  <div className="container-pad grid gap-8 lg:grid-cols-3">
    {testimonials.map((testimonial) => (
      <article
        key={testimonial.name}
        className="glass rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="flex justify-center">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-20 w-20 rounded-full border-4 border-brand-500 object-cover shadow-lg"
          />
        </div>

        <p className="mt-6 text-base leading-8 text-slate-700 dark:text-slate-200">
          "{testimonial.quote}"
        </p>

        <h3 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">
          {testimonial.name}
        </h3>

        <p className="text-sm font-medium text-brand-700 dark:text-brand-100">
          {testimonial.role}
        </p>
      </article>
    ))}
  </div>
</section>

      <section className="py-20">
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
