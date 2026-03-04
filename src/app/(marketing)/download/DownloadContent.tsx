"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {  Dumbbell,  Watch,  TrendingUp,  CalendarDays,  UtensilsCrossed,  MessageSquare,  Smartphone,  UserPlus,  Rocket,  Shield,  Heart,  Target,} from "lucide-react";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";

/* ── Apple & Google SVG icons ── */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.67c.58.35 1.3.3 1.83-.02l14.77-8.5-3.41-3.42L3.18 23.67zM.53 1.34C.2 1.7 0 2.2 0 2.8v18.4c0 .6.2 1.1.53 1.46l.06.06L12.5 12 .59 1.28.53 1.34zM22.43 10.34l-3.65-2.1-3.6 3.6 3.6 3.6 3.65-2.1c1.05-.6 1.05-2.4 0-3zM5.01.34L19.78 8.84 16.37 12.26 5.01.34c-.55-.33-1.26-.38-1.83-.02L5.01.34z" />
    </svg>
  );
}

/* ── Download Buttons (prominent) ── */
function DownloadButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Link
        href="#"
        className="group relative flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/5 border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-fitflow-blue/40 hover:shadow-[0_0_30px_rgba(30,136,229,0.15)] hover:scale-[1.02]"
      >
        <AppleIcon className="w-8 h-8 text-white" />
        <div>
          <p className="text-[#94A3B8] text-xs leading-none">Download on the</p>
          <p className="text-white text-lg font-semibold leading-tight">App Store</p>
        </div>
      </Link>
      <Link
        href="#"
        className="group relative flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/5 border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-fitflow-blue/40 hover:shadow-[0_0_30px_rgba(30,136,229,0.15)] hover:scale-[1.02]"
      >
        <GooglePlayIcon className="w-8 h-8 text-white" />
        <div>
          <p className="text-[#94A3B8] text-xs leading-none">Get it on</p>
          <p className="text-white text-lg font-semibold leading-tight">Google Play</p>
        </div>
      </Link>
    </div>
  );
}

/* ── Data ── */
const benefits = [
  { icon: Dumbbell, title: "Personalized Programs", desc: "Access training programs built specifically for you by your trainer. Every exercise, set, and rep — right on your phone." },
  { icon: Watch, title: "Health Metrics Sync", desc: "Connect your Apple Watch or wearable to automatically share health data with your trainer — heart rate, sleep, steps, and more." },
  { icon: TrendingUp, title: "Track Your Progress", desc: "See your transformation with visual progress charts, body composition tracking, workout history, and personal records." },
  { icon: CalendarDays, title: "Easy Scheduling", desc: "Book sessions, manage your calendar, and get automatic reminders so you never miss a workout." },
  { icon: UtensilsCrossed, title: "Nutrition & Meal Plans", desc: "Follow meal plans and nutrition guidance from your trainer. Track meals and stay on top of your diet goals." },
  { icon: MessageSquare, title: "Direct Messaging", desc: "Message your trainer directly through the app. Ask questions, share updates, and stay connected between sessions." },
];

const steps = [
  { icon: Smartphone, num: "01", title: "Download the App", desc: "Get Fit Flow from the App Store or Google Play. It's free to download." },
  { icon: UserPlus, num: "02", title: "Connect With Your Trainer", desc: "Your trainer will send you an invite link or code. Accept it to join their platform." },
  { icon: Rocket, num: "03", title: "Start Training", desc: "Access your programs, track your health, book sessions, and watch your progress grow." },
];

const trustBadges = [
  { icon: Shield, label: "End-to-End Encrypted" },
  { icon: Heart, label: "Apple Watch & HealthKit" },
  { icon: Shield, label: "HIPAA-Conscious Design" },
  { icon: Target, label: "Your Data, Your Control" },
];

/* ── Page ── */
export default function DownloadContent() {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal({ threshold: 0.1 });
  const { ref: benefitsRef, isVisible: benefitsVis } = useScrollReveal({ threshold: 0.05 });
  const { ref: stepsRef, isVisible: stepsVis } = useScrollReveal({ threshold: 0.1 });
  const { ref: trustRef, isVisible: trustVis } = useScrollReveal({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVis } = useScrollReveal({ threshold: 0.1 });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://fitflow.shopbluewolf.com" },
          { name: "Download", url: "https://fitflow.shopbluewolf.com/download" },
        ]}
      />

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510]"
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-fitflow-blue/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-fitflow-gold/8 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fitflow-blue/20 to-transparent" />
        </div>

        <div
          className={`relative z-10 container mx-auto px-4 py-32 text-center max-w-3xl transition-all duration-1000 ease-out ${heroVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fitflow-gold/20 bg-fitflow-gold/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-fitflow-gold animate-pulse" />
            <span className="text-fitflow-gold text-sm font-medium tracking-wide">
              Your Trainer&apos;s Platform of Choice
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
            Your Fitness Journey,
            <br />
            <span className="bg-gradient-to-r from-fitflow-blue via-fitflow-gold to-fitflow-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_4s_ease-in-out_infinite]">
              One Powerful App.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Connect with your trainer, track your health, follow your programs, and see your progress — all in one place.
          </p>

          <div className="mt-10 flex justify-center">
            <DownloadButtons />
          </div>

          <p className="mt-6 text-[#64748B] text-sm">Available on iOS and Android</p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-fitflow-navy to-transparent pointer-events-none" />
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section ref={benefitsRef} className="relative py-24 md:py-32 bg-fitflow-navy">
        <div
          className={`container mx-auto px-4 transition-all duration-1000 ease-out ${benefitsVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-fitflow-text">
              Everything You Need, Right in Your Pocket
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group p-6 rounded-2xl bg-fitflow-surface border border-white/5 hover:border-fitflow-blue/20 transition-all duration-300 hover:shadow-lg hover:shadow-fitflow-blue/5"
              >
                <div className="w-12 h-12 rounded-xl bg-fitflow-blue/10 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-fitflow-blue" />
                </div>
                <h3 className="text-lg font-semibold text-fitflow-text mb-2">{b.title}</h3>
                <p className="text-fitflow-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsRef} className="relative py-24 md:py-32 bg-fitflow-surface">
        <div
          className={`container mx-auto px-4 transition-all duration-1000 ease-out ${stepsVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-fitflow-text">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-fitflow-blue/10 border border-fitflow-blue/20 flex items-center justify-center mx-auto mb-6">
                  <s.icon className="w-7 h-7 text-fitflow-blue" />
                </div>
                <span className="text-fitflow-blue/40 text-sm font-mono font-bold">{s.num}</span>
                <h3 className="text-xl font-semibold text-fitflow-text mt-1 mb-3">{s.title}</h3>
                <p className="text-fitflow-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <section ref={trustRef} className="relative py-16 bg-fitflow-navy">
        <div
          className={`container mx-auto px-4 transition-all duration-700 ease-out ${trustVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5"
              >
                <t.icon className="w-4 h-4 text-fitflow-blue shrink-0" />
                <span className="text-[#94A3B8] text-xs font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} className="relative py-24 md:py-32 bg-fitflow-surface overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fitflow-blue/8 rounded-full blur-[120px]" />
        </div>
        <div
          className={`relative z-10 container mx-auto px-4 text-center max-w-2xl transition-all duration-1000 ease-out ${ctaVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-fitflow-text mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-fitflow-muted text-lg mb-10">
            Download Fit Flow and connect with your trainer today.
          </p>
          <div className="flex justify-center">
            <DownloadButtons />
          </div>
          <p className="mt-8 text-[#64748B] text-sm">
            Don&apos;t have a trainer yet?{" "}
            <Link href="/contact" className="text-fitflow-blue hover:underline">
              Find one on Fit Flow.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
