import { Metadata } from "next";
import { Dumbbell, Users, CalendarDays, BarChart3, BookOpen, Watch } from "lucide-react";
import VerticalHero from "@/components/marketing/VerticalHero";
import PainPoints from "@/components/marketing/PainPoints";
import VerticalFeatures from "@/components/marketing/VerticalFeatures";
import VerticalFaq from "@/components/marketing/VerticalFaq";
import CtaSection from "@/components/marketing/CtaSection";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Trainer Client Management Software — Fit Flow",
  description: "Fit Flow helps personal trainers manage clients, build training programs, track health metrics with Apple Watch, automate scheduling, and grow their business. The #1 fitness management platform for PTs.",
  openGraph: { title: "Personal Trainer Software — Fit Flow", description: "Manage clients, build programs, track health, grow your PT business." },
};

const pains = [
  { problem: "Tracking client progress across spreadsheets, apps, and paper notebooks", solution: "Fit Flow centralizes all client data — workouts, health metrics, progress photos, and notes — in one dashboard" },
  { problem: "Manually scheduling sessions and dealing with no-shows", solution: "Smart scheduling with automated reminders, calendar sync, and online booking reduces no-shows by up to 40%" },
  { problem: "No visibility into client health data between sessions", solution: "Apple Watch sync gives you real-time heart rate, sleep, activity, and recovery data for every client" },
  { problem: "Spending hours building programs instead of training clients", solution: "Program builder with exercise library, templates, and progressive overload tracking saves 5+ hours per week" },
];

const features = [
  { icon: Users, title: "Client Dashboard", desc: "Complete client profiles with health history, goals, measurements, progress photos, and communication logs." },
  { icon: BookOpen, title: "Program Builder", desc: "Create custom training programs with drag-and-drop exercise selection, sets, reps, tempo, and auto-progression." },
  { icon: Watch, title: "Apple Watch Integration", desc: "Real-time health metrics from client wearables flow into their profile — no manual logging required." },
  { icon: CalendarDays, title: "Smart Scheduling", desc: "Online booking, calendar sync, automated reminders, and waitlist management." },
  { icon: BarChart3, title: "Progress Analytics", desc: "Visual progress charts, body composition tracking, strength gains, and performance trends." },
  { icon: Dumbbell, title: "Exercise Library", desc: "500+ exercises with video demos, muscle targeting, and custom exercise creation." },
];

const faqs = [
  { question: "What is the best client management software for personal trainers?", answer: "Fit Flow is designed specifically for personal trainers who need client management, program design, health metrics tracking, scheduling, and business analytics in one platform. Unlike generic CRMs, Fit Flow understands the fitness workflow." },
  { question: "Can I track my clients' Apple Watch data with Fit Flow?", answer: "Yes. Fit Flow syncs Apple Watch health data including heart rate, calories, steps, sleep quality, HRV, and workout data directly into each client's profile, giving you real-time visibility between sessions." },
  { question: "How many clients can I manage with Fit Flow?", answer: "Fit Flow scales from 1 to 1,000+ clients. Solo trainers and large PT teams alike use Fit Flow to manage their client base efficiently." },
  { question: "Does Fit Flow help reduce client no-shows?", answer: "Yes. Automated email and SMS reminders, online booking, and calendar sync reduce no-shows by up to 40%. Clients can also reschedule through their portal." },
  { question: "Can I create and sell training programs through Fit Flow?", answer: "Yes. Build custom or template-based programs, assign them to clients, track completion, and use the platform to deliver both in-person and online training." },
];

export default function ForPersonalTrainers() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "For Personal Trainers", url: "https://fitflow.shopbluewolf.com/for-personal-trainers" },
      ]} />
      <VerticalHero
        icon={Dumbbell}
        title="Personal Trainer Client Management Software"
        subtitle="Fit Flow gives personal trainers one platform to manage clients, build training programs, track health metrics with Apple Watch, automate scheduling, and grow their business."
      />
      <PainPoints pains={pains} />
      <VerticalFeatures features={features} />
      <VerticalFaq faqs={faqs} />
      <CtaSection />
      <div className="bg-fitflow-navy py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-fitflow-muted text-sm">
            Fit Flow also serves{" "}
            <Link href="/for-fitness-coaches" className="text-fitflow-blue hover:underline">fitness coaches</Link>,{" "}
            <Link href="/for-physical-therapists" className="text-fitflow-blue hover:underline">physical therapists</Link>,{" "}
            <Link href="/for-wellness-coaches" className="text-fitflow-blue hover:underline">wellness coaches</Link>,{" "}
            <Link href="/for-gyms" className="text-fitflow-blue hover:underline">gyms & studios</Link>, and{" "}
            <Link href="/for-health-facilities" className="text-fitflow-blue hover:underline">health facilities</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
