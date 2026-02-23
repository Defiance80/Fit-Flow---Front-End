import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Personal Trainer, FitPro Studios",
    text: "Fit Flow transformed how I manage my 40+ clients. The Apple Watch integration means I see real-time health data without asking clients to manually log anything. My client retention went up 35% in three months.",
  },
  {
    name: "Dr. Sarah Mitchell",
    role: "Physical Therapist, RehabMotion Clinic",
    text: "As a PT, I need accurate biometric data to make treatment decisions. Fit Flow gives me heart rate variability, recovery scores, and progress tracking in one place. It's become essential to my practice.",
  },
  {
    name: "James Rodriguez",
    role: "Owner, Peak Performance Gym",
    text: "Managing 12 trainers and 500+ members was chaos before Fit Flow. Now we have unified scheduling, automated billing, trainer performance analytics, and client management. Revenue is up 28% this year.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text text-center mb-4">What Fitness Professionals Say About Fit Flow</h2>
        <p className="text-fitflow-muted text-center max-w-2xl mx-auto mb-12">
          Join hundreds of trainers, coaches, and gym owners who trust Fit Flow to manage their fitness business.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-fitflow-surface rounded-xl p-6 border border-white/5">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-fitflow-gold fill-fitflow-gold" />
                ))}
              </div>
              <p className="text-fitflow-muted text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-fitflow-text font-semibold text-sm">{t.name}</p>
                <p className="text-fitflow-muted text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
