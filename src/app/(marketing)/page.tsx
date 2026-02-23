import { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import VideoSection from "@/components/marketing/VideoSection";
import WhoItsFor from "@/components/marketing/WhoItsFor";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import DashboardPreview from "@/components/marketing/DashboardPreview";
import Testimonials from "@/components/marketing/Testimonials";
import FaqSection from "@/components/marketing/FaqSection";
import CtaSection from "@/components/marketing/CtaSection";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import SoftwareAppSchema from "@/components/schema/SoftwareAppSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Fit Flow — Smart Fitness Management for Trainers, Coaches & Facilities",
  description: "Fit Flow is the all-in-one fitness management platform that helps personal trainers, fitness coaches, physical therapists, wellness coaches, and gym facilities manage clients, track health metrics, build programs, and grow their business.",
  keywords: "fitness management platform, personal trainer software, gym management app, client management for trainers, health metrics tracking, Apple Watch fitness app, trainer management system, Fit Flow",
  openGraph: {
    title: "Fit Flow — Smart Fitness Management for Trainers, Coaches & Facilities",
    description: "Manage clients, track health metrics, build training programs, and grow your fitness business with Fit Flow.",
    url: "https://fitflow.shopbluewolf.com",
    siteName: "Fit Flow",
    type: "website",
    images: [{ url: "/fitflow-logo.png", width: 512, height: 512, alt: "Fit Flow Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fit Flow — Smart Fitness Management Platform",
    description: "Manage clients, track health, grow your fitness business.",
    images: ["/fitflow-logo.png"],
  },
};

export default function MarketingHomePage() {
  return (
    <>
      <OrganizationSchema />
      <SoftwareAppSchema />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://fitflow.shopbluewolf.com" }]} />
      <Hero />
      <VideoSection />
      <WhoItsFor />
      <FeaturesGrid />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <FaqSection />
      <CtaSection />
    </>
  );
}
