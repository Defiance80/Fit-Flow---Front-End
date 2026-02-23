"use client";
import Link from "next/link";
import Image from "next/image";
import { Activity, Users, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fitflow-text leading-tight">
            Manage Clients. Track Health. <span className="text-fitflow-gold">Grow Your Fitness Business.</span>
          </h1>
          <p className="mt-6 text-lg text-fitflow-muted max-w-lg">
            Fit Flow is the all-in-one fitness management platform that helps personal trainers, coaches, physical therapists, and gym facilities streamline operations, monitor client health metrics, build training programs, and scale their business.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy px-6 py-3 rounded-lg font-semibold transition text-base">
              Request a Demo
            </Link>
            <Link href="/courses" className="border border-fitflow-blue text-fitflow-blue hover:bg-fitflow-blue/10 px-6 py-3 rounded-lg font-semibold transition text-base">
              Login
            </Link>
          </div>
        </div>
        {/* Right — Dashboard Preview */}
        <div className="relative">
          <div className="bg-fitflow-surface rounded-2xl p-2 shadow-2xl shadow-fitflow-blue/10 border border-white/5">
            <Image
              src="/fitflow-dashboard-preview.png"
              alt="Fit Flow fitness management dashboard showing client tracking, health metrics, and training programs"
              width={700}
              height={450}
              className="rounded-xl w-full h-auto"
              priority
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Fallback if image doesn't exist */}
            <div className="aspect-video bg-gradient-to-br from-fitflow-blue/20 to-fitflow-gold/10 rounded-xl flex items-center justify-center">
              <span className="text-fitflow-muted text-sm">Dashboard Preview</span>
            </div>
          </div>
        </div>
      </div>
      {/* Trust bar */}
      <div className="container mx-auto px-4 mt-16">
        <p className="text-center text-fitflow-muted text-sm mb-6">Trusted by 500+ fitness professionals worldwide</p>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Users, label: "10,000+ Clients Managed" },
            { icon: Activity, label: "1M+ Health Data Points" },
            { icon: TrendingUp, label: "98% Client Retention" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-fitflow-muted text-sm">
              <Icon size={18} className="text-fitflow-blue" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
