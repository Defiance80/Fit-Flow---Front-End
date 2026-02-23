import { UserPlus, Link2, Rocket } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "1", title: "Sign Up & Set Up Your Profile", desc: "Create your Fit Flow account in minutes. Set up your business profile, services, pricing, and availability. No credit card required for the demo." },
  { icon: Link2, step: "2", title: "Connect & Onboard Clients", desc: "Invite clients via email or link. They join your portal, complete health intake forms, sync their Apple Watch or wearable, and you see everything in one dashboard." },
  { icon: Rocket, step: "3", title: "Grow Your Fitness Business", desc: "Deliver programs, track health metrics, automate scheduling, and use analytics to retain clients and increase revenue. Fit Flow scales with you." },
];

export default function HowItWorks() {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text text-center mb-4">How Fit Flow Works</h2>
        <p className="text-fitflow-muted text-center max-w-2xl mx-auto mb-12">
          Get started in three simple steps and start managing your fitness business like a pro.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fitflow-blue/10 border border-fitflow-blue/20 mb-4">
                <Icon size={28} className="text-fitflow-blue" />
              </div>
              <div className="text-fitflow-gold font-bold text-sm mb-2">Step {step}</div>
              <h3 className="text-lg font-semibold text-fitflow-text mb-2">{title}</h3>
              <p className="text-fitflow-muted text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
