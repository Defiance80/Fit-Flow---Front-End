import type { LucideIcon } from "lucide-react";

interface VerticalFeaturesProps {
  features: { icon: LucideIcon; title: string; desc: string }[];
}

export default function VerticalFeatures({ features }: VerticalFeaturesProps) {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-fitflow-text text-center mb-12">Features Built for You</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-fitflow-surface rounded-xl p-6 border border-white/5">
              <Icon size={24} className="text-fitflow-gold mb-3" />
              <h3 className="text-base font-semibold text-fitflow-text mb-2">{title}</h3>
              <p className="text-fitflow-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
