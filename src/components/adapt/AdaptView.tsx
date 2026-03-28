import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useAdaptations, useAddAdaptation } from "../../lib/store";

export function AdaptView() {
  const [hit, setHit] = useState("");
  const [adaptation, setAdaptation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const addAdaptation = useAddAdaptation();
  const recentAdaptations = useAdaptations();
  const { trigger } = useWebHaptics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hit.trim() || !adaptation.trim()) return;

    addAdaptation(hit.trim(), adaptation.trim());
    trigger("success");
    setHit("");
    setAdaptation("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const recent = recentAdaptations.slice(0, 5);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      <h2 className="text-xl font-bold mb-1">Log Adaptation</h2>
      <p className="text-white/40 text-sm mb-6">The wheel turns.</p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">
            What hit you?
          </label>
          <textarea
            value={hit}
            onChange={(e) => setHit(e.target.value)}
            placeholder="The hit..."
            rows={2}
            className="glass-input resize-none"
          />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">
            What's the adaptation?
          </label>
          <textarea
            value={adaptation}
            onChange={(e) => setAdaptation(e.target.value)}
            placeholder="The adaptation..."
            rows={2}
            className="glass-input resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!hit.trim() || !adaptation.trim()}
          className="glass-button-primary w-full"
        >
          {submitted ? "Wheel turned." : "Turn the wheel"}
        </button>
      </form>

      {/* Recent */}
      {recent.length > 0 && (
        <div>
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
            Recent
          </h3>
          <div className="space-y-3">
            {recent.map((a) => (
              <div key={a.id} className="glass-card">
                <p className="text-white/50 text-sm">
                  <span className="text-red-400/70">Hit:</span> {a.hit}
                </p>
                <p className="text-white/90 text-sm mt-1">
                  <span className="text-[#00d4ff]/70">Adapt:</span>{" "}
                  {a.adaptation}
                </p>
                <p className="text-white/20 text-xs mt-2">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
