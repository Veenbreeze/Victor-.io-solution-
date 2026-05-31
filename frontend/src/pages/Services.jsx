import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { services } from '../data/siteData.js';

export default function Services() {
  return (
    <section className="py-20">
      <div className="container-pad">
        <SectionHeader
          centered
          eyebrow="Services"
          title="Nine focused ways to move your brand, product, or career forward."
          description="Each service can stand alone or plug into a complete end-to-end delivery package."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
