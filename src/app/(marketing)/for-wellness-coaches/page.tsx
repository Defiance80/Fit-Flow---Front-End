import { Metadata } from "next";
import { Leaf, Heart, UtensilsCrossed, BarChart3, CalendarDays, MessageSquare } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wellness Coach Platform — Holistic Health Tracking Software — Fit Flow",
  description: "Fit Flow helps wellness coaches track holistic health metrics, design lifestyle programs, manage nutrition, and support clients with data-driven wellness coaching. All-in-one wellness platform.",
};

const pains = [
  { problem: "No unified platform to track holistic health — sleep, stress, nutrition, activity", solution: "Fit Flow aggregates health data from wearables, manual inputs, and nutrition logs into one holistic view" },
  { problem: "Clients struggle to see the connection between habits and outcomes", solution: "Visual dashboards correlate sleep, nutrition, activity, and mood to show clients the impact of their choices" },
  { problem: "Difficulty maintaining client engagement between coaching sessions", solution: "Automated check-ins, in-app messaging, and habit tracking keep clients accountable daily" },
  { problem: "Time-consuming program creation for each new client", solution: "Template library for wellness programs — stress management, sleep optimization, nutrition reset — assigns in seconds" },
];

const features = [
  { icon: Heart, title: "Holistic Health Tracking", desc: "Track sleep, stress, mood, activity, nutrition, hydration, and mindfulness metrics in one client profile." },
  { icon: Leaf, title: "Lifestyle Programs", desc: "Build wellness programs covering nutrition, movement, sleep hygiene, stress management, and habit formation." },
  { icon: UtensilsCrossed, title: "Nutrition & Meal Plans", desc: "Create personalized nutrition plans, track macros, and guide clients toward healthier eating habits." },
  { icon: BarChart3, title: "Wellness Analytics", desc: "Correlate health metrics to show clients how their habits impact energy, mood, sleep, and overall wellness." },
  { icon: CalendarDays, title: "Session Scheduling", desc: "Book coaching sessions, set recurring appointments, and send automated reminders." },
  { icon: MessageSquare, title: "Client Check-Ins", desc: "Automated daily or weekly check-ins keep clients engaged and provide you with continuous feedback." },
];

const faqs = [
  { question: "Is Fit Flow suitable for wellness coaches?", answer: "Absolutely. Fit Flow supports holistic health tracking including sleep, stress, nutrition, activity, and mood — perfect for wellness coaches who take a whole-person approach to client care." },
  { question: "Can I track client habits and lifestyle metrics?", answer: "Yes. Fit Flow tracks habits, sleep quality, hydration, stress levels, mood, nutrition, and activity. Clients can self-report or sync data from Apple Watch and wearables." },
  { question: "Does Fit Flow support nutrition coaching?", answer: "Yes. Create meal plans, track macros, set nutrition goals, and monitor client adherence — all integrated with their health profile." },
  { question: "How does Fit Flow help with client accountability?", answer: "Automated check-ins, habit tracking, progress dashboards, and in-app messaging keep clients engaged and accountable between sessions." },
];

export default function ForWellnessCoaches() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Wellness Coaches", url: "https://fitflow.shopbluewolf.com/for-wellness-coaches" },
      ]} />
      <VerticalHero icon={Leaf} title="Wellness Coach Platform — Holistic Health Tracking Software" subtitle="Fit Flow gives wellness coaches a unified platform to track holistic health metrics, design lifestyle programs, deliver nutrition guidance, and keep clients engaged with data-driven insights." />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">Also built for <Link href="/for-personal-trainers" className="text-fitflow-blue hover:underline">personal trainers</Link>, <Link href="/for-fitness-coaches" className="text-fitflow-blue hover:underline">fitness coaches</Link>, <Link href="/for-physical-therapists" className="text-fitflow-blue hover:underline">physical therapists</Link>, <Link href="/for-gyms" className="text-fitflow-blue hover:underline">gyms</Link>, and <Link href="/for-health-facilities" className="text-fitflow-blue hover:underline">health facilities</Link>.</p>
        </div>
      </div>
    </>
  );
}
