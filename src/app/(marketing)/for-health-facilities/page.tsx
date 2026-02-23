import { Metadata } from "next";
import { Hospital, Globe, Shield, BarChart3, Code, Building2 } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enterprise Health Facility Management Platform — Fit Flow",
  description: "Fit Flow provides enterprise-grade fitness and health facility management with white-label options, multi-location support, compliance tools, API integrations, and advanced analytics.",
};

const pains = [
  { problem: "Managing multiple locations with inconsistent systems and data silos", solution: "Fit Flow unifies all locations under one platform with centralized reporting and standardized workflows" },
  { problem: "Compliance requirements for health data handling", solution: "Enterprise security features including encryption, access controls, audit trails, and compliance-ready infrastructure" },
  { problem: "Need for custom branding but stuck with generic platforms", solution: "White-label options let you brand Fit Flow as your own platform for staff and patients" },
  { problem: "Integration challenges with existing EHR, billing, and HR systems", solution: "RESTful API with comprehensive documentation for custom integrations with your existing tech stack" },
];

const features = [
  { icon: Building2, title: "Multi-Location Management", desc: "Manage trainers, clients, schedules, and billing across all facilities from a centralized admin dashboard." },
  { icon: Globe, title: "White-Label Platform", desc: "Brand Fit Flow with your logo, colors, and domain. Present a seamless experience to staff and members." },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption, role-based access, audit trails, SSO support, and compliance-ready infrastructure." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Cross-location reporting, staff performance, revenue analytics, member trends, and operational KPIs." },
  { icon: Code, title: "API & Integrations", desc: "RESTful API for custom integrations with EHR, billing, HR systems, and third-party applications." },
  { icon: Hospital, title: "Compliance Tools", desc: "Data handling policies, consent management, access logging, and exportable compliance reports." },
];

const faqs = [
  { question: "Does Fit Flow support multi-location health facilities?", answer: "Yes. Fit Flow is built for multi-location organizations. Manage all facilities, staff, members, and operations from one centralized platform with location-level and organization-level reporting." },
  { question: "Does Fit Flow offer white-label options?", answer: "Yes. Enterprise clients can white-label Fit Flow with their own branding, logo, colors, and custom domain. Your staff and members see your brand, powered by Fit Flow." },
  { question: "What security features does Fit Flow provide for health data?", answer: "Fit Flow uses bank-level encryption, role-based access controls, audit trails, secure cloud infrastructure, and is built with compliance requirements in mind." },
  { question: "Can Fit Flow integrate with our existing systems?", answer: "Yes. Fit Flow provides a comprehensive RESTful API for integration with EHR platforms, billing systems, HR software, and other third-party applications. Our team provides integration support." },
  { question: "What kind of support do enterprise clients receive?", answer: "Enterprise clients get dedicated account management, priority support, custom onboarding, API integration assistance, and SLA-backed uptime guarantees." },
];

export default function ForHealthFacilities() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Health Facilities", url: "https://fitflow.shopbluewolf.com/for-health-facilities" },
      ]} />
      <VerticalHero icon={Hospital} title="Enterprise Health Facility Management Platform" subtitle="Fit Flow provides enterprise-grade fitness and health facility management with white-label options, multi-location support, compliance tools, and API integrations for large organizations." />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">Also built for <Link href="/for-personal-trainers" className="text-fitflow-blue hover:underline">personal trainers</Link>, <Link href="/for-fitness-coaches" className="text-fitflow-blue hover:underline">fitness coaches</Link>, <Link href="/for-physical-therapists" className="text-fitflow-blue hover:underline">physical therapists</Link>, <Link href="/for-wellness-coaches" className="text-fitflow-blue hover:underline">wellness coaches</Link>, and <Link href="/for-gyms" className="text-fitflow-blue hover:underline">gyms & studios</Link>.</p>
        </div>
      </div>
    </>
  );
}
