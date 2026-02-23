import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface VerticalHeroProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export default function VerticalHero({ icon: Icon, title, subtitle }: VerticalHeroProps) {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Icon size={48} className="text-fitflow-blue mx-auto mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-fitflow-text mb-6 leading-tight">{title}</h1>
        <p className="text-lg text-fitflow-muted mb-8">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy px-6 py-3 rounded-lg font-semibold transition">
            Request a Demo
          </Link>
          <Link href="/#features" className="border border-fitflow-blue text-fitflow-blue hover:bg-fitflow-blue/10 px-6 py-3 rounded-lg font-semibold transition">
            See All Features
          </Link>
        </div>
      </div>
    </section>
  );
}
