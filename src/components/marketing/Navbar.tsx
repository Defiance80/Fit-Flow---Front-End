"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Who It's For", href: "/#who-its-for" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-fitflow-navy/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/fitflow-logo.png" alt="Fit Flow — Fitness Management Platform" width={48} height={48} />
          <span className="text-xl font-bold text-fitflow-text hidden sm:inline">Fit Flow</span>
        </Link>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-fitflow-muted hover:text-fitflow-text transition text-sm">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/courses" className="border border-fitflow-blue text-fitflow-blue px-4 py-2 rounded-lg text-sm hover:bg-fitflow-blue/10 transition">
            Login
          </Link>
          <Link href="/contact" className="bg-fitflow-gold hover:bg-fitflow-gold-dark text-fitflow-navy px-4 py-2 rounded-lg text-sm font-semibold transition">
            Request a Demo
          </Link>
        </div>
        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-fitflow-text">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-fitflow-navy border-t border-white/5 px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-fitflow-muted hover:text-fitflow-text text-sm py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/courses" className="block border border-fitflow-blue text-fitflow-blue px-4 py-2 rounded-lg text-sm text-center">Login</Link>
          <Link href="/contact" className="block bg-fitflow-gold text-fitflow-navy px-4 py-2 rounded-lg text-sm font-semibold text-center">Request a Demo</Link>
        </div>
      )}
    </nav>
  );
}
