import { useState } from "react";
import { Shield, Plus, Trash2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import {
  useIdentities,
  useAddIdentity,
  useToggleIdentity,
  useRemoveIdentity,
} from "../../lib/store";

export function IdentityView() {
  const [newStatement, setNewStatement] = useState("");
  const identities = useIdentities();
  const addIdentity = useAddIdentity();
  const toggleIdentity = useToggleIdentity();
  const removeIdentity = useRemoveIdentity();
  const { trigger } = useWebHaptics();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    let statement = newStatement.trim();
    if (!statement.toLowerCase().startsWith("i am")) {
      statement = "I am someone who " + statement;
    }

    addIdentity(statement);
    trigger("success");
    setNewStatement("");
  };

  const active = identities.filter((i) => i.active);
  const inactive = identities.filter((i) => !i.active);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      <h2 className="text-xl font-bold mb-1">Identity</h2>
      <p className="text-white/40 text-sm mb-6">
        Who you are. Not who you're trying to be.
      </p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          value={newStatement}
          onChange={(e) => setNewStatement(e.target.value)}
          placeholder="I am someone who..."
          className="glass-input flex-1"
        />
        <button type="submit" className="glass-button px-4">
          <Plus size={18} />
        </button>
      </form>

      {/* Active */}
      {active.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
            Active
          </h3>
          <div className="space-y-2">
            {active.map((identity) => (
              <div
                key={identity.id}
                className="glass-card flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Shield
                    size={16}
                    className="text-[#00d4ff] shrink-0"
                  />
                  <p className="text-white/90 text-sm truncate">
                    {identity.statement}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => {
                      trigger("nudge");
                      toggleIdentity(identity.id);
                    }}
                    className="text-white/30 hover:text-yellow-400 transition-colors text-xs"
                  >
                    pause
                  </button>
                  <button
                    onClick={() => {
                      trigger("error");
                      removeIdentity(identity.id);
                    }}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paused */}
      {inactive.length > 0 && (
        <div>
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
            Paused
          </h3>
          <div className="space-y-2">
            {inactive.map((identity) => (
              <div
                key={identity.id}
                className="glass-card flex items-center justify-between opacity-50"
              >
                <p className="text-white/50 text-sm truncate">
                  {identity.statement}
                </p>
                <button
                  onClick={() => {
                    trigger("success");
                    toggleIdentity(identity.id);
                  }}
                  className="text-white/30 hover:text-[#00d4ff] transition-colors text-xs shrink-0"
                >
                  activate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
