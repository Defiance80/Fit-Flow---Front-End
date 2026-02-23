import DemoForm from "./DemoForm";

export default function CtaSection() {
  return (
    <section id="pricing" className="bg-fitflow-navy py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text mb-4">Ready to Transform Your Fitness Business?</h2>
        <p className="text-fitflow-muted max-w-2xl mx-auto mb-10">
          Join 500+ fitness professionals who use Fit Flow to manage clients, track health data, and grow revenue. Request a free demo today.
        </p>
        <DemoForm />
      </div>
    </section>
  );
}
