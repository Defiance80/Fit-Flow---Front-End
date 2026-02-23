import { Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="bg-fitflow-surface py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-fitflow-text mb-4">See Fit Flow in Action</h2>
        <p className="text-fitflow-muted max-w-2xl mx-auto mb-10">
          Watch how fitness professionals use Fit Flow to manage clients, track health metrics with Apple Watch integration, build programs, and grow revenue — all from one platform.
        </p>
        <div
          className="relative max-w-4xl mx-auto aspect-video bg-fitflow-navy rounded-2xl border border-white/5 flex items-center justify-center cursor-pointer group"
          data-heygen-video="fitflow-demo"
        >
          <div className="w-20 h-20 rounded-full bg-fitflow-gold/90 group-hover:bg-fitflow-gold flex items-center justify-center transition shadow-lg shadow-fitflow-gold/20">
            <Play size={32} className="text-fitflow-navy ml-1" fill="currentColor" />
          </div>
          <p className="absolute bottom-6 text-fitflow-muted text-sm">Click to play demo video</p>
        </div>
      </div>
    </section>
  );
}
