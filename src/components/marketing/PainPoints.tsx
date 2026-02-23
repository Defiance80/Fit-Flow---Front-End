import { XCircle, CheckCircle } from "lucide-react";

interface PainPointsProps {
  pains: { problem: string; solution: string }[];
}

export default function PainPoints({ pains }: PainPointsProps) {
  return (
    <section className="bg-fitflow-surface py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-fitflow-text text-center mb-12">The Problem — And How Fit Flow Solves It</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {pains.map((p, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-950/30 border border-red-900/20 rounded-xl p-5 flex gap-3">
                <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-fitflow-muted text-sm">{p.problem}</p>
              </div>
              <div className="bg-green-950/30 border border-green-900/20 rounded-xl p-5 flex gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-fitflow-muted text-sm">{p.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
