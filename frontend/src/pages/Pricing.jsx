import { CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { pricingPlans } from '../data/siteData.js';

export default function Pricing() {
  return (
    <section className="py-20">
      <div className="container-pad">
        <SectionHeader
          centered
          eyebrow="Pricing"
          title="Pick the right starting point, then tailor the scope."
          description="Packages are transparent starting points. Final estimates depend on features, integrations, content, and support needs."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-clay p-6 transition duration-300 hover:-translate-y-1.5 ${
                plan.featured ? 'bg-brand-gradient text-white' : 'clay text-slate-900 dark:text-white'
              }`}
              style={
                plan.featured
                  ? { boxShadow: '-9px -9px 18px rgba(255,255,255,0.25), 9px 9px 22px rgba(8,60,78,0.5)' }
                  : undefined
              }
            >
              <h2 className="text-xl font-black">{plan.name}</h2>
              <p className="mt-4 text-4xl font-black">{plan.price}</p>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
