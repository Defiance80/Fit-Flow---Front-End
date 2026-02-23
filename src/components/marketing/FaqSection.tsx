"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FaqSchema from "@/components/schema/FaqSchema";

export const homeFaqs = [
  { question: "What is Fit Flow?", answer: "Fit Flow is an all-in-one fitness management platform designed for personal trainers, fitness coaches, physical therapists, wellness coaches, and gym facilities. It combines client management, health metrics tracking, training program design, scheduling, nutrition planning, and business analytics in one platform." },
  { question: "Who is Fit Flow designed for?", answer: "Fit Flow is built for fitness professionals including personal trainers, fitness coaches, physical therapists, wellness coaches, gym owners, studio operators, and health facilities. Whether you manage 5 clients or 5,000 members, Fit Flow scales to your needs." },
  { question: "Does Fit Flow integrate with Apple Watch and wearables?", answer: "Yes. Fit Flow syncs real-time health data from Apple Watch, including heart rate, calories burned, steps, sleep quality, HRV, and workout data. This data flows directly into client profiles so trainers can make data-driven decisions." },
  { question: "How much does Fit Flow cost?", answer: "Fit Flow offers flexible pricing plans for solo trainers, small teams, and enterprise facilities. Contact our sales team for a personalized demo and pricing quote. We offer a free trial so you can experience the platform before committing." },
  { question: "Is my client data secure with Fit Flow?", answer: "Absolutely. Fit Flow uses bank-level encryption, secure cloud infrastructure, and follows industry best practices for data security. We are committed to protecting your clients' health data and personal information." },
  { question: "How long does onboarding take?", answer: "Most fitness professionals are fully set up within 24 hours. Fit Flow provides guided onboarding, video tutorials, and dedicated support to help you import clients, set up services, and start using the platform immediately." },
  { question: "Can Fit Flow handle multiple locations?", answer: "Yes. Fit Flow supports multi-location management for gyms, studio chains, and health facility networks. Manage trainers, clients, schedules, and billing across all locations from a single dashboard." },
  { question: "Does Fit Flow offer an API for custom integrations?", answer: "Yes. Fit Flow provides a RESTful API for custom integrations with existing systems including EHR platforms, payment processors, website builders, and third-party applications. Contact us for API documentation." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-fitflow-surface py-16 md:py-24">
      <FaqSchema faqs={homeFaqs} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text text-center mb-4">Frequently Asked Questions About Fit Flow</h2>
        <p className="text-fitflow-muted text-center max-w-2xl mx-auto mb-12">
          Everything you need to know about the Fit Flow fitness management platform.
        </p>
        <div className="max-w-3xl mx-auto space-y-3">
          {homeFaqs.map((faq, i) => (
            <div key={i} className="bg-fitflow-navy rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-fitflow-text font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown size={18} className={`text-fitflow-muted transition-transform flex-shrink-0 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-fitflow-muted text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
