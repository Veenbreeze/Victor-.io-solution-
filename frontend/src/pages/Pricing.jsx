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
              className={`rounded-lg border p-6 ${
                plan.featured
                  ? 'border-brand-500 bg-brand-600 text-white shadow-glow'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
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
