"use client";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Hero() {
  const { ref: heroRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510]"
    >
      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-fitflow-blue/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fitflow-gold/6 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fitflow-blue/20 to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Copy */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fitflow-blue/20 bg-fitflow-blue/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-fitflow-blue animate-pulse" />
              <span className="text-fitflow-blue text-sm font-medium tracking-wide">
                AI-Powered Fitness Management
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="text-white">Train Smarter.</span>
              <br />
              <span className="text-white">Manage Better.</span>
              <br />
              <span className="bg-gradient-to-r from-fitflow-blue via-fitflow-gold to-fitflow-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_4s_ease-in-out_infinite]">
                Grow Faster.
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[#94A3B8] max-w-xl leading-relaxed">
              The all-in-one platform for personal trainers, coaches, and
              fitness facilities. Track health metrics. Build programs.
              Scale your business.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group relative px-8 py-4 rounded-xl font-semibold text-base text-[#050510] bg-gradient-to-r from-fitflow-blue to-fitflow-blue-dark overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(30,136,229,0.4)] hover:scale-[1.02]"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fitflow-gold to-fitflow-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 rounded-xl font-semibold text-base text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
              >
                Watch Demo
              </Link>
            </div>

            {/* Credibility badges */}
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                <svg className="w-4 h-4 text-fitflow-blue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-[#94A3B8] text-xs font-medium">Built for Trainers, Coaches & Facilities</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                <svg className="w-4 h-4 text-fitflow-gold shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-[#94A3B8] text-xs font-medium">Apple Watch & HealthKit</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                <svg className="w-4 h-4 text-green-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-[#94A3B8] text-xs font-medium">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                <svg className="w-4 h-4 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <span className="text-[#94A3B8] text-xs font-medium">HIPAA-Conscious Design</span>
              </div>
            </div>

            {/* App Store badges */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="#"
                className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-fitflow-blue/10"
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[#64748B] text-[11px] leading-none">
                    Download on the
                  </p>
                  <p className="text-white text-base font-semibold leading-tight">
                    App Store
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-fitflow-blue/10"
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.67c.58.35 1.3.3 1.83-.02l14.77-8.5-3.41-3.42L3.18 23.67zM.53 1.34C.2 1.7 0 2.2 0 2.8v18.4c0 .6.2 1.1.53 1.46l.06.06L12.5 12 .59 1.28.53 1.34zM22.43 10.34l-3.65-2.1-3.6 3.6 3.6 3.6 3.65-2.1c1.05-.6 1.05-2.4 0-3zM5.01.34L19.78 8.84 16.37 12.26 5.01.34c-.55-.33-1.26-.38-1.83-.02L5.01.34z" />
                </svg>
                <div>
                  <p className="text-[#64748B] text-[11px] leading-none">
                    Get it on
                  </p>
                  <p className="text-white text-base font-semibold leading-tight">
                    Google Play
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right — Phone Mockups */}
          <div
            className={`relative flex justify-center items-center transition-all duration-1000 delay-300 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Glow behind phones */}
            <div className="absolute w-[400px] h-[400px] bg-fitflow-blue/15 rounded-full blur-[80px]" />

            {/* Main phone */}
            <div className="relative z-10 w-[280px] md:w-[300px] animate-float">
              <div className="relative bg-[#1A1A2E] rounded-[3rem] p-2 shadow-2xl shadow-fitflow-blue/20 border border-white/10">
                {/* Screen */}
                <div className="rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] aspect-[9/19.5]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-3 pb-2">
                    <span className="text-white text-xs font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-white/40 rounded-sm">
                        <div className="w-3/4 h-full bg-white/60 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  {/* App content placeholder */}
                  <div className="px-4 pt-4 space-y-4">
                    <div className="text-center">
                      <p className="text-fitflow-blue text-xs font-medium">Good Morning</p>
                      <p className="text-white text-lg font-bold mt-1">Today&apos;s Overview</p>
                    </div>
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Clients", value: "24", color: "from-fitflow-blue/20 to-fitflow-blue/5" },
                        { label: "Sessions", value: "8", color: "from-fitflow-gold/20 to-fitflow-gold/5" },
                        { label: "Revenue", value: "$2.4K", color: "from-green-500/20 to-green-500/5" },
                        { label: "Rating", value: "4.9★", color: "from-purple-500/20 to-purple-500/5" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={`bg-gradient-to-br ${stat.color} border border-white/5 rounded-xl p-3`}
                        >
                          <p className="text-[#64748B] text-[10px]">{stat.label}</p>
                          <p className="text-white text-base font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    {/* Upcoming sessions */}
                    <div className="space-y-2">
                      <p className="text-[#94A3B8] text-xs font-medium">Upcoming</p>
                      {[
                        { name: "Sarah M.", time: "10:00 AM", type: "HIIT" },
                        { name: "James K.", time: "11:30 AM", type: "Strength" },
                        { name: "Lisa R.", time: "2:00 PM", type: "Yoga" },
                      ].map((session) => (
                        <div
                          key={session.name}
                          className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fitflow-blue/30 to-fitflow-gold/30" />
                            <div>
                              <p className="text-white text-xs font-medium">{session.name}</p>
                              <p className="text-[#64748B] text-[10px]">{session.type}</p>
                            </div>
                          </div>
                          <p className="text-fitflow-blue text-[10px] font-medium">{session.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full" />
              </div>
            </div>

            {/* Secondary phone (tilted behind) */}
            <div className="absolute -left-8 md:-left-16 top-12 z-0 w-[220px] md:w-[240px] opacity-60 rotate-[-8deg] animate-float-delayed hidden md:block">
              <div className="bg-[#1A1A2E] rounded-[2.5rem] p-2 shadow-xl border border-white/5">
                <div className="rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] aspect-[9/19.5]">
                  <div className="px-4 pt-8 space-y-3">
                    <p className="text-white text-sm font-bold">Client Health</p>
                    {/* Heart rate visualization */}
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-[#64748B] text-[10px]">Heart Rate</p>
                      <p className="text-red-400 text-xl font-bold">72 BPM</p>
                      <div className="mt-2 flex items-end gap-[2px] h-8">
                        {[40, 55, 45, 70, 60, 80, 65, 75, 50, 85, 70, 60, 75, 55, 65].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-red-500/30 to-red-400 rounded-sm"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>
                    {/* Steps */}
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-[#64748B] text-[10px]">Steps Today</p>
                      <p className="text-fitflow-blue text-xl font-bold">8,432</p>
                      <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full">
                        <div className="w-[84%] h-full bg-fitflow-blue rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[#64748B] text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-[scroll-dot_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
