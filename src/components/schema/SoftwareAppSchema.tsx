"use client";
export default function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fit Flow",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    description: "Fit Flow is a fitness management platform for personal trainers, coaches, physical therapists, and gym facilities to manage clients, track health metrics, build training programs, and grow their business.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free demo available. Contact for pricing.",
    },
    author: {
      "@type": "Organization",
      name: "GoKoncentrate Inc.",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
