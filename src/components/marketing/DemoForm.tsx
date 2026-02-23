"use client";
import { useState } from "react";

const businessTypes = [
  "Personal Trainer",
  "Fitness Coach",
  "Physical Therapist",
  "Wellness Coach",
  "Gym / Studio",
  "Health Facility",
  "Other",
];

export default function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate with backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-fitflow-gold mb-2">Thank You!</h3>
        <p className="text-fitflow-muted">We&apos;ll be in touch within 24 hours to schedule your personalized Fit Flow demo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input type="text" name="name" required placeholder="Your Name" className="w-full bg-fitflow-navy border border-white/10 rounded-lg px-4 py-3 text-fitflow-text text-sm placeholder:text-fitflow-muted focus:outline-none focus:border-fitflow-blue" />
      <input type="email" name="email" required placeholder="Work Email" className="w-full bg-fitflow-navy border border-white/10 rounded-lg px-4 py-3 text-fitflow-text text-sm placeholder:text-fitflow-muted focus:outline-none focus:border-fitflow-blue" />
      <select name="businessType" required className="w-full bg-fitflow-navy border border-white/10 rounded-lg px-4 py-3 text-fitflow-text text-sm focus:outline-none focus:border-fitflow-blue">
        <option value="">Select Business Type</option>
        {businessTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <textarea name="message" rows={3} placeholder="Tell us about your business (optional)" className="w-full bg-fitflow-navy border border-white/10 rounded-lg px-4 py-3 text-fitflow-text text-sm placeholder:text-fitflow-muted focus:outline-none focus:border-fitflow-blue resize-none" />
      <button type="submit" className="w-full bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy font-semibold py-3 rounded-lg transition">
        Request Your Free Demo
      </button>
    </form>
  );
}
