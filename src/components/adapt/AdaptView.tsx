import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWebHaptics } from "web-haptics/react";
import { useAuth } from "../../lib/auth";

export function AdaptView() {
  const { userId } = useAuth();
  const [hit, setHit] = useState("");
  const [adaptation, setAdaptation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const addAdaptation = useMutation(api.adaptations.add);
  const recentAdaptations = useQuery(api.adaptations.list, userId ? { userId } : "skip");
  const { trigger } = useWebHaptics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hit.trim() || !adaptation.trim()) return;

    await addAdaptation({ hit: hit.trim(), adaptation: adaptation.trim(), userId: userId! });
    trigger("success");
    setHit("");
    setAdaptation("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const recent = recentAdaptations?.slice(0, 5) ?? [];

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
              <div key={a._id} className="glass-card">
                <p className="text-white/50 text-sm">
                  <span className="text-red-400/70">Hit:</span> {a.hit}
                </p>
                <p className="text-white/90 text-sm mt-1">
                  <span className="text-[#00d4ff]/70">Adapt:</span>{" "}
                  {a.adaptation}
                </p>
                <p className="text-white/20 text-xs mt-2">
                  {new Date(a._creationTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
