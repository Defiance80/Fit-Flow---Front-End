import { Dumbbell, Users, HeartPulse, Leaf, Building2, Hospital } from "lucide-react";
import Link from "next/link";

const verticals = [
  { icon: Dumbbell, title: "Personal Trainers", desc: "Manage clients, build custom training programs, track progress, and automate scheduling. Fit Flow gives personal trainers a single dashboard to run their entire business.", href: "/for-personal-trainers" },
  { icon: Users, title: "Fitness Coaches", desc: "Handle group coaching, class scheduling, meal plans, and client communication. Scale your coaching practice with tools built for multi-client workflows.", href: "/for-fitness-coaches" },
  { icon: HeartPulse, title: "Physical Therapists", desc: "Monitor patient health, track recovery with biometric data and Apple Watch integration, and manage treatment programs — all HIPAA-aware and secure.", href: "/for-physical-therapists" },
  { icon: Leaf, title: "Wellness Coaches", desc: "Track holistic health metrics, design lifestyle programs, and support clients with nutrition, mindfulness, and wellness goal setting from one platform.", href: "/for-wellness-coaches" },
  { icon: Building2, title: "Gyms & Studios", desc: "Facility management, multi-trainer support, class scheduling, member billing, and analytics. Run your gym smarter with Fit Flow.", href: "/for-gyms" },
  { icon: Hospital, title: "Health Facilities", desc: "Enterprise-grade features, white-label options, compliance tools, multi-location management, and API integrations for health organizations.", href: "/for-health-facilities" },
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text text-center mb-4">Who Is Fit Flow For?</h2>
        <p className="text-fitflow-muted text-center max-w-2xl mx-auto mb-12">
          Whether you&apos;re a solo personal trainer or a multi-location health facility, Fit Flow adapts to your workflow and scales with your business.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {verticals.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="group bg-fitflow-surface rounded-xl p-6 border border-white/5 hover:border-fitflow-blue/30 transition">
              <Icon size={32} className="text-fitflow-blue mb-4" />
              <h3 className="text-lg font-semibold text-fitflow-text mb-2 group-hover:text-fitflow-gold transition">{title}</h3>
              <p className="text-fitflow-muted text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
