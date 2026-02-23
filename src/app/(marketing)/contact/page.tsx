import { Metadata } from "next";
import DemoForm from "@/components/marketing/DemoForm";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Fit Flow — Request a Demo of Our Fitness Management Platform",
  description: "Request a free demo of Fit Flow, the all-in-one fitness management platform for trainers, coaches, and facilities. Contact our team to learn how Fit Flow can transform your fitness business.",
};

export default function ContactPage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://fitflow.shopbluewolf.com" },
        { name: "Contact", url: "https://fitflow.shopbluewolf.com/contact" },
      ]} />

      <section className="bg-fitflow-navy py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-fitflow-text mb-4">Request a Free Fit Flow Demo</h1>
            <p className="text-lg text-fitflow-muted">
              See how Fit Flow can help you manage clients, track health metrics, and grow your fitness business. Fill out the form below and our team will reach out within 24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Form */}
            <div className="bg-fitflow-surface rounded-xl p-8 border border-white/5">
              <h2 className="text-xl font-bold text-fitflow-text mb-6">Get Your Personalized Demo</h2>
              <DemoForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-fitflow-text mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: "info@fitflow.app" },
                    { icon: MapPin, label: "Company", value: "GoKoncentrate Inc." },
                    { icon: Clock, label: "Response Time", value: "Within 24 hours" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={20} className="text-fitflow-blue mt-0.5" />
                      <div>
                        <p className="text-fitflow-text text-sm font-medium">{label}</p>
                        <p className="text-fitflow-muted text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-fitflow-surface rounded-xl p-6 border border-white/5">
                <h3 className="text-fitflow-text font-semibold mb-3">What to Expect from Your Demo</h3>
                <ol className="space-y-2 text-fitflow-muted text-sm list-decimal list-inside">
                  <li>A 15-minute discovery call to understand your business</li>
                  <li>Live walkthrough of Fit Flow features relevant to you</li>
                  <li>Q&A with our product specialist</li>
                  <li>Custom pricing based on your needs</li>
                  <li>Free trial access to explore the platform</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
