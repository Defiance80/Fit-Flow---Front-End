import { Metadata } from "next";
import { Building2, Users, CalendarDays, CreditCard, BarChart3, Settings } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gym Management Software — Multi-Trainer & Facility Management — Fit Flow",
  description: "Fit Flow helps gyms and studios manage trainers, members, class scheduling, billing, and facility operations. All-in-one gym management platform with health metrics tracking.",
};

const pains = [
  { problem: "Managing multiple trainers with different schedules, clients, and programs", solution: "Unified trainer dashboard with individual performance metrics, scheduling, and client assignment" },
  { problem: "Member billing, renewals, and payment tracking across systems", solution: "Integrated billing with automated renewals, payment tracking, and revenue reporting" },
  { problem: "No visibility into trainer performance or member engagement", solution: "Analytics dashboard showing trainer utilization, member retention, class attendance, and revenue per trainer" },
  { problem: "Class scheduling conflicts and capacity management headaches", solution: "Smart class scheduling with capacity limits, waitlists, auto-reminders, and real-time availability" },
];

const features = [
  { icon: Users, title: "Multi-Trainer Management", desc: "Manage trainer schedules, assign clients, track performance, and set commission structures from one admin panel." },
  { icon: CalendarDays, title: "Class & Session Scheduling", desc: "Group classes, 1-on-1 sessions, recurring bookings, capacity management, and automated reminders." },
  { icon: CreditCard, title: "Billing & Payments", desc: "Member subscriptions, session packages, auto-renewals, payment tracking, and revenue reporting." },
  { icon: BarChart3, title: "Facility Analytics", desc: "Track member retention, trainer utilization, revenue trends, class popularity, and peak hours." },
  { icon: Building2, title: "Facility Management", desc: "Manage rooms, equipment, capacity, and operational settings for your gym or studio." },
  { icon: Settings, title: "Admin Controls", desc: "Role-based access, trainer permissions, brand customization, and operational settings." },
];

const faqs = [
  { question: "Is Fit Flow suitable for multi-trainer gyms?", answer: "Yes. Fit Flow is built for gyms with multiple trainers. Manage schedules, assign clients, track performance, and handle billing for your entire team from one platform." },
  { question: "Does Fit Flow handle gym membership billing?", answer: "Yes. Fit Flow supports membership subscriptions, session packages, auto-renewals, and payment tracking. Integrate with major payment processors for seamless billing." },
  { question: "Can I see analytics for my gym's performance?", answer: "Yes. The facility analytics dashboard shows member retention rates, trainer utilization, revenue trends, class attendance, and operational metrics." },
  { question: "Does Fit Flow support class scheduling with capacity limits?", answer: "Yes. Set capacity limits, manage waitlists, send automated reminders, and let members book classes online through their portal." },
  { question: "Can trainers manage their own clients within Fit Flow?", answer: "Yes. Trainers get their own dashboard to manage clients, create programs, and track sessions — while gym owners see everything at the facility level." },
];

export default function ForGyms() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Gyms & Studios", url: "https://fitflow.shopbluewolf.com/for-gyms" },
      ]} />
      <VerticalHero icon={Building2} title="Gym Management Software — Multi-Trainer & Facility Management" subtitle="Fit Flow gives gyms and studios one platform to manage trainers, members, class scheduling, billing, and facility operations — with built-in health metrics tracking." />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">Also built for <Link href="/for-personal-trainers" className="text-fitflow-blue hover:underline">personal trainers</Link>, <Link href="/for-fitness-coaches" className="text-fitflow-blue hover:underline">fitness coaches</Link>, <Link href="/for-physical-therapists" className="text-fitflow-blue hover:underline">physical therapists</Link>, <Link href="/for-wellness-coaches" className="text-fitflow-blue hover:underline">wellness coaches</Link>, and <Link href="/for-health-facilities" className="text-fitflow-blue hover:underline">health facilities</Link>.</p>
        </div>
      </div>
    </>
  );
}
