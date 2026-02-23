import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import { Target, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Fit Flow — Our Mission to Transform Fitness Management",
  description: "Learn about Fit Flow, the fitness management platform by GoKoncentrate Inc. Our mission is to empower personal trainers, coaches, and fitness facilities with technology that simplifies client management and health tracking.",
};

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "About", url: "https://fitflow.shopbluewolf.com/about" },
      ]} />

      {/* Hero */}
      <section className="bg-fitflow-navy py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Image src="/fitflow-logo.png" alt="Fit Flow Logo" width={80} height={80} className="mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold text-fitflow-text mb-6">About Fit Flow</h1>
          <p className="text-lg text-fitflow-muted leading-relaxed">
            Fit Flow is a fitness management platform built by <strong className="text-fitflow-text">GoKoncentrate Inc.</strong> to empower personal trainers, fitness coaches, physical therapists, wellness coaches, and gym facilities with the technology they need to manage clients, track health metrics, and grow their business.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-fitflow-surface py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-fitflow-text text-center mb-12">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Target, title: "Empower Fitness Professionals", desc: "We believe every trainer, coach, and therapist deserves powerful tools to manage their practice. Fit Flow replaces the chaos of spreadsheets, scattered apps, and manual tracking with one unified platform." },
              { icon: Zap, title: "Data-Driven Health Decisions", desc: "By integrating Apple Watch and wearable data directly into client profiles, Fit Flow enables fitness professionals to make health decisions based on real biometric data — not guesswork." },
              { icon: Heart, title: "Built by Fitness People, for Fitness People", desc: "Our team understands the fitness industry. We build features that solve real problems trainers face daily — from scheduling headaches to client retention challenges." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <Icon size={36} className="text-fitflow-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-fitflow-text mb-3">{title}</h3>
                <p className="text-fitflow-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-fitflow-navy py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-fitflow-text text-center mb-8">The Fit Flow Story</h2>
          <div className="text-fitflow-muted leading-relaxed space-y-4 text-sm">
            <p>Fit Flow was born from a simple observation: fitness professionals spend more time on admin tasks than actually training clients. Between scheduling, tracking, billing, and communication, the average trainer loses 10+ hours per week to operations.</p>
            <p>We built Fit Flow to give that time back. By combining client management, health metrics tracking, program design, scheduling, nutrition planning, and business analytics into one platform, Fit Flow lets fitness professionals focus on what they do best — transforming lives.</p>
            <p>Our wolf logo represents the duality at the heart of Fit Flow: the precision of ice and the power of fire. Like the best fitness professionals, Fit Flow balances analytical data with passionate coaching to deliver exceptional results.</p>
            <p>Today, Fit Flow serves 500+ fitness professionals worldwide — from solo personal trainers to multi-location gym chains — and we&apos;re just getting started.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fitflow-surface py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-fitflow-text mb-4">Ready to Join the Fit Flow Community?</h2>
          <p className="text-fitflow-muted mb-8">See how Fit Flow can transform your fitness business.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact" className="bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy px-6 py-3 rounded-lg font-semibold transition">Request a Demo</Link>
            <Link href="/" className="border border-fitflow-blue text-fitflow-blue hover:bg-fitflow-blue/10 px-6 py-3 rounded-lg font-semibold transition">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
