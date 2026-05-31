import SectionHeader from '../components/SectionHeader.jsx';
import PortfolioCard from '../components/PortfolioCard.jsx';
import { portfolioItems } from '../data/siteData.js';

export default function Portfolio() {
  return (
    <section className="py-20">
      <div className="container-pad">
        <SectionHeader
          centered
          eyebrow="Portfolio"
          title="Production-minded work across dashboards, websites, and learning systems."
          description="Portfolio cards include images, descriptions, technologies, source links, and live demo links as requested."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
