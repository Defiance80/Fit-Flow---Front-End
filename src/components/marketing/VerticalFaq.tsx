"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FaqSchema from "@/components/schema/FaqSchema";

interface VerticalFaqProps {
  faqs: { question: string; answer: string }[];
}

export default function VerticalFaq({ faqs }: VerticalFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="bg-fitflow-surface py-16 md:py-24">
      <FaqSchema faqs={faqs} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-fitflow-text text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-fitflow-navy rounded-xl border border-white/5 overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-fitflow-text font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown size={18} className={`text-fitflow-muted transition-transform flex-shrink-0 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5"><p className="text-fitflow-muted text-sm leading-relaxed">{faq.answer}</p></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
