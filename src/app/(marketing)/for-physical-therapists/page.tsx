import { Metadata } from "next";
import { HeartPulse, Watch, ClipboardList, BarChart3, Shield, CalendarDays } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Physical Therapy Client Management & Health Monitoring — Fit Flow",
  description: "Fit Flow helps physical therapists monitor patient health with biometric data, Apple Watch integration, recovery tracking, and treatment program management. Secure, data-driven PT software.",
};

const pains = [
  { problem: "Limited visibility into patient health between appointments", solution: "Apple Watch sync provides continuous biometric data — HRV, resting heart rate, sleep, activity — between visits" },
  { problem: "Manual documentation of recovery progress and treatment notes", solution: "Digital progress tracking with automated metrics, milestone markers, and exportable reports" },
  { problem: "Patients don't follow home exercise programs", solution: "Assign video-guided home exercise programs through the client portal with completion tracking" },
  { problem: "Concerns about health data security and compliance", solution: "Bank-level encryption and secure infrastructure designed to handle sensitive health information" },
];

const features = [
  { icon: HeartPulse, title: "Biometric Monitoring", desc: "Track blood pressure, HRV, resting heart rate, body composition, and recovery scores from wearable integrations." },
  { icon: Watch, title: "Apple Watch Integration", desc: "Continuous health data sync gives you real-time patient insights without manual reporting." },
  { icon: ClipboardList, title: "Treatment Programs", desc: "Build recovery programs with exercises, milestones, and automated progress assessments." },
  { icon: BarChart3, title: "Recovery Analytics", desc: "Visual recovery charts, range of motion tracking, pain scoring, and outcome measurements." },
  { icon: Shield, title: "Secure Data Handling", desc: "Encrypted storage, access controls, and audit trails for sensitive patient health data." },
  { icon: CalendarDays, title: "Appointment Management", desc: "Online booking, automated reminders, session notes, and recurring appointment scheduling." },
];

const faqs = [
  { question: "Is Fit Flow suitable for physical therapy practices?", answer: "Yes. Fit Flow provides biometric monitoring, recovery tracking, treatment program management, and Apple Watch integration specifically useful for physical therapists who need data-driven patient care." },
  { question: "Can I track patient biometric data with Fit Flow?", answer: "Yes. Fit Flow syncs data from Apple Watch and wearables including heart rate, HRV, sleep quality, activity levels, and more. You can also manually log blood pressure, body composition, and range of motion." },
  { question: "Is patient data secure in Fit Flow?", answer: "Fit Flow uses bank-level encryption, secure cloud infrastructure, and role-based access controls. We are committed to protecting sensitive health data." },
  { question: "Can patients access their own progress in Fit Flow?", answer: "Yes. Patients get a client portal where they can view their programs, log exercises, see progress, and communicate with their therapist." },
  { question: "Does Fit Flow integrate with EHR systems?", answer: "Fit Flow offers a RESTful API for custom integrations. Contact our team to discuss your specific EHR integration needs." },
];

export default function ForPhysicalTherapists() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Physical Therapists", url: "https://fitflow.shopbluewolf.com/for-physical-therapists" },
      ]} />
      <VerticalHero icon={HeartPulse} title="Physical Therapy Client Management & Health Monitoring Software" subtitle="Fit Flow gives physical therapists continuous patient health data through Apple Watch integration, biometric monitoring, recovery tracking, and treatment program management." />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">Also built for <Link href="/for-personal-trainers" className="text-fitflow-blue hover:underline">personal trainers</Link>, <Link href="/for-fitness-coaches" className="text-fitflow-blue hover:underline">fitness coaches</Link>, <Link href="/for-wellness-coaches" className="text-fitflow-blue hover:underline">wellness coaches</Link>, <Link href="/for-gyms" className="text-fitflow-blue hover:underline">gyms</Link>, and <Link href="/for-health-facilities" className="text-fitflow-blue hover:underline">health facilities</Link>.</p>
        </div>
      </div>
    </>
  );
}
