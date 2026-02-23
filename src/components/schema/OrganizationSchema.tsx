"use client";
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fit Flow",
    legalName: "GoKoncentrate Inc.",
    url: "https://fitflow.shopbluewolf.com",
    logo: "https://fitflow.shopbluewolf.com/fitflow-logo.png",
    description: "Fit Flow is the all-in-one fitness management platform that helps personal trainers, fitness coaches, physical therapists, wellness coaches, and gym facilities manage clients, track health metrics, build programs, and grow their business.",
    foundingDate: "2024",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@fitflow.app",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
