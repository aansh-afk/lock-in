import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../lib/auth";

export function HistoryView() {
  const { userId } = useAuth();
  const adaptations = useQuery(api.adaptations.list, userId ? { userId } : "skip");

  // Group by date
  const grouped = (adaptations ?? []).reduce(
    (acc, a) => {
      const date = new Date(a._creationTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(a);
      return acc;
    },
    {} as Record<string, NonNullable<typeof adaptations>>
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      <h2 className="text-xl font-bold mb-1">History</h2>
      <p className="text-white/40 text-sm mb-6">Proof the wheel turns.</p>

      {(!adaptations || adaptations.length === 0) && (
        <div className="glass-card text-center">
          <p className="text-white/40 text-sm">
            No adaptations yet. Go turn the wheel.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-sm py-1 z-10">
              {date} &middot; {items.length} adaptation
              {items.length !== 1 ? "s" : ""}
            </h3>
            <div className="space-y-2">
              {items.map((a) => (
                <div key={a._id} className="glass-card">
                  <p className="text-white/50 text-sm">
                    <span className="text-red-400/60 font-medium">
                      &#8595;
                    </span>{" "}
                    {a.hit}
                  </p>
                  <p className="text-white/90 text-sm mt-1">
                    <span className="text-[#00d4ff]/60 font-medium">
                      &#8593;
                    </span>{" "}
                    {a.adaptation}
                  </p>
                  <p className="text-white/15 text-xs mt-2">
                    {new Date(a._creationTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
