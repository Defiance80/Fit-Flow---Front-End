import { Users, BookOpen, Watch, CalendarDays, UtensilsCrossed, BarChart3, HeartPulse, LayoutDashboard } from "lucide-react";

const features = [
  { icon: Users, title: "Client Management", desc: "Centralized client profiles, health histories, communication logs, and progress dashboards. Know every client at a glance." },
  { icon: BookOpen, title: "Training Programs", desc: "Build, assign, and track custom training programs with exercise libraries, sets, reps, and progressive overload tracking." },
  { icon: Watch, title: "Health Metrics & Apple Watch Sync", desc: "Sync real-time health data from Apple Watch and wearables — heart rate, calories, steps, sleep, and more — directly into client profiles." },
  { icon: CalendarDays, title: "Smart Scheduling", desc: "Automated booking, calendar sync, reminders, and availability management. Reduce no-shows and keep your schedule full." },
  { icon: UtensilsCrossed, title: "Meal Planning & Nutrition", desc: "Create meal plans, track macros, and provide nutrition guidance. Pair diet with training for complete client support." },
  { icon: BarChart3, title: "Progress Tracking & Analytics", desc: "Visual progress charts, body composition tracking, workout history, and performance analytics to keep clients motivated." },
  { icon: HeartPulse, title: "Biometric Monitoring", desc: "Track blood pressure, resting heart rate, HRV, body fat percentage, and other biometrics to make data-driven training decisions." },
  { icon: LayoutDashboard, title: "Business Dashboard & Revenue", desc: "Revenue tracking, client acquisition metrics, session utilization, and business analytics to grow your fitness business." },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="bg-fitflow-surface py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text text-center mb-4">Everything You Need to Run Your Fitness Business</h2>
        <p className="text-fitflow-muted text-center max-w-2xl mx-auto mb-12">
          Fit Flow combines client management, health tracking, scheduling, nutrition, and business analytics into one powerful fitness management platform.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-fitflow-navy rounded-xl p-6 border border-white/5">
              <Icon size={28} className="text-fitflow-gold mb-3" />
              <h3 className="text-base font-semibold text-fitflow-text mb-2">{title}</h3>
              <p className="text-fitflow-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
