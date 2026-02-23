import { Metadata } from "next";
import { Users, CalendarDays, UtensilsCrossed, BarChart3, MessageSquare, BookOpen } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fitness Coaching Software for Group & Online Coaches — Fit Flow",
  description: "Fit Flow helps fitness coaches manage group coaching, class scheduling, meal plans, client communication, and business growth. Built for coaches who manage multiple clients at scale.",
};

const pains = [
  { problem: "Juggling multiple apps for scheduling, communication, and program delivery", solution: "Fit Flow combines scheduling, messaging, program delivery, and nutrition in one unified platform" },
  { problem: "Difficulty scaling from 1-on-1 to group coaching", solution: "Group management tools let you assign programs to cohorts, schedule group sessions, and track everyone's progress" },
  { problem: "Clients forget meal plans or don't follow nutrition guidance", solution: "Built-in meal planning with automated delivery keeps nutrition front and center for every client" },
  { problem: "No clear picture of which clients are engaged vs. at risk of churning", solution: "Client engagement analytics show activity levels, program completion, and early warning signs for retention" },
];

const features = [
  { icon: Users, title: "Group Management", desc: "Create client groups, assign shared programs, and manage cohort-based coaching at scale." },
  { icon: CalendarDays, title: "Class Scheduling", desc: "Schedule group sessions, manage capacity, send reminders, and handle waitlists automatically." },
  { icon: UtensilsCrossed, title: "Meal Planning", desc: "Create and assign meal plans with macros, recipes, and shopping lists for individual or group delivery." },
  { icon: MessageSquare, title: "Client Communication", desc: "In-app messaging, announcements, and automated check-ins keep clients engaged between sessions." },
  { icon: BookOpen, title: "Program Templates", desc: "Build reusable program templates for common goals — fat loss, muscle gain, endurance — and assign in seconds." },
  { icon: BarChart3, title: "Engagement Analytics", desc: "Track client activity, program completion rates, and identify at-risk clients before they churn." },
];

const faqs = [
  { question: "What is the best software for fitness coaches?", answer: "Fit Flow is built for fitness coaches who manage multiple clients, run group programs, and need scheduling, nutrition, communication, and analytics in one platform." },
  { question: "Can I manage both 1-on-1 and group coaching in Fit Flow?", answer: "Yes. Fit Flow supports individual client management and group coaching with shared programs, group scheduling, and cohort-level analytics." },
  { question: "Does Fit Flow include meal planning for coaches?", answer: "Yes. Create custom meal plans with macros, assign them to clients or groups, and track nutrition adherence from the coaching dashboard." },
  { question: "How does Fit Flow help with client retention?", answer: "Engagement analytics, automated check-ins, progress tracking, and in-app messaging keep clients accountable and connected to their coach." },
];

export default function ForFitnessCoaches() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Fitness Coaches", url: "https://fitflow.shopbluewolf.com/for-fitness-coaches" },
      ]} />
      <VerticalHero icon={Users} title="Fitness Coaching Software for Group & Online Coaches" subtitle="Fit Flow helps fitness coaches manage group programs, automate scheduling, deliver meal plans, and track client engagement — all from one platform." />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">Also built for <Link href="/for-personal-trainers" className="text-fitflow-blue hover:underline">personal trainers</Link>, <Link href="/for-physical-therapists" className="text-fitflow-blue hover:underline">physical therapists</Link>, <Link href="/for-wellness-coaches" className="text-fitflow-blue hover:underline">wellness coaches</Link>, <Link href="/for-gyms" className="text-fitflow-blue hover:underline">gyms</Link>, and <Link href="/for-health-facilities" className="text-fitflow-blue hover:underline">health facilities</Link>.</p>
        </div>
      </div>
    </>
  );
}
