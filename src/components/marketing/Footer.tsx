import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Who It's For", href: "/#who-its-for" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Personal Trainers", href: "/for-personal-trainers" },
      { label: "For Fitness Coaches", href: "/for-fitness-coaches" },
      { label: "For Physical Therapists", href: "/for-physical-therapists" },
      { label: "For Wellness Coaches", href: "/for-wellness-coaches" },
      { label: "For Gyms & Studios", href: "/for-gyms" },
      { label: "For Health Facilities", href: "/for-health-facilities" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-fitflow-navy border-t border-white/5 py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/fitflow-logo.png" alt="Fit Flow" width={40} height={40} className="object-contain" />
              <span className="text-lg font-bold text-fitflow-text">Fit Flow</span>
            </Link>
            <p className="text-fitflow-muted text-sm leading-relaxed">
              The all-in-one fitness management platform for trainers, coaches, and facilities.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-fitflow-text font-semibold text-sm mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-fitflow-muted hover:text-fitflow-text text-sm transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-fitflow-muted text-xs">© 2025 Fit Flow by GoKoncentrate Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
