"use client";
import Image from "next/image";

export default function DashboardPreview() {
  return (
    <section className="bg-fitflow-surface py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text mb-4">Your Fitness Business, One Dashboard</h2>
        <p className="text-fitflow-muted max-w-2xl mx-auto mb-10">
          See client health metrics, upcoming sessions, training program progress, revenue analytics, and more — all in one beautiful, intuitive dashboard designed for fitness professionals.
        </p>
        <div className="max-w-5xl mx-auto bg-fitflow-navy rounded-2xl p-2 border border-white/5 shadow-2xl shadow-fitflow-blue/5">
          <Image
            src="/fitflow-dashboard-preview.png"
            alt="Fit Flow fitness management dashboard — client management, health metrics, scheduling, and business analytics"
            width={1200}
            height={700}
            className="rounded-xl w-full h-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="aspect-[16/9] bg-gradient-to-br from-fitflow-blue/10 via-fitflow-surface to-fitflow-gold/5 rounded-xl flex items-center justify-center">
            <p className="text-fitflow-muted text-sm">Dashboard Preview Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
