import Link from "next/link";
import { Users, BarChart3, HeartPulse, Watch } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Founding Member Pricing",
    desc: "Lock in the lowest price we will ever offer — guaranteed for life.",
  },
  {
    icon: HeartPulse,
    title: "Shape the Product",
    desc: "Your feedback directly influences our roadmap. Build the tool you actually need.",
  },
  {
    icon: Users,
    title: "Priority Support",
    desc: "Direct access to our founding team for onboarding, questions, and feature requests.",
  },
  {
    icon: Watch,
    title: "First Access to New Features",
    desc: "Be the first to try Apple Watch integrations, AI programming tools, and more.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fitflow-gold/20 bg-fitflow-gold/5 mb-6">
            <Watch className="w-4 h-4 text-fitflow-gold" />
            <span className="text-fitflow-gold text-sm font-medium">Limited Spots Available</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text mb-4">
            Join Our Early Access Program
          </h2>
          <p className="text-fitflow-muted max-w-2xl mx-auto">
            We&apos;re onboarding a select group of fitness professionals to help us build the ultimate management platform. Here&apos;s what you get as a founding member.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((b) => (
            <div key={b.title} className="bg-fitflow-surface rounded-xl p-6 border border-white/5 hover:border-fitflow-blue/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-fitflow-blue/10 flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-fitflow-blue" />
              </div>
              <h3 className="text-fitflow-text font-semibold text-sm mb-2">{b.title}</h3>
              <p className="text-fitflow-muted text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            Apply for Early Access
          </Link>
          <p className="text-fitflow-muted text-sm mt-4">No credit card required · Free during early access</p>
        </div>
      </div>
    </section>
  );
}
