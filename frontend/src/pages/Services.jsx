import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { serviceService } from '../services/api.js';
import { services as staticServices } from '../data/siteData.js';

export default function Services() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService
      .list()
      .then(({ data }) => {
        setItems(Array.isArray(data) && data.length ? data : staticServices);
      })
      .catch(() => setItems(staticServices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20">
      <div className="container-pad">
        <SectionHeader
          centered
          eyebrow="Services"
          title="Nine focused ways to move your brand, product, or career forward."
          description="Each service can stand alone or plug into a complete end-to-end delivery package."
        />
        {loading ? (
          <LoadingSpinner label="Loading services…" />
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(items || []).map((service, i) => (
              <ServiceCard key={service.id ?? service.title} service={service} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
