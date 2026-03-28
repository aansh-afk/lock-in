import { useState, useEffect } from "react";
import {
  useAdaptations,
  useIdentities,
  useStreak,
} from "../../lib/store";

const SPOKE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const CX = 100;
const CY = 100;
const OUTER_R = 75;
const OUTER2_R = 80;
const HUB_R = 22;
const NODE_R = 8;
const CENTER_R = 4;

function spokeEnd(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

function spokeStart(angleDeg: number) {
  return spokeEnd(angleDeg, HUB_R);
}

export function WheelView() {
  const adaptations = useAdaptations();
  const identities = useIdentities();
  const streak = useStreak();
  const [rotation, setRotation] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  const todayCount = adaptations.filter((a) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return a.createdAt >= today.getTime();
  }).length;

  const totalCount = adaptations.length;
  const activeIdentities = identities.filter((i) => i.active);

  useEffect(() => {
    if (totalCount > prevCount && prevCount !== 0) {
      setRotation((r) => r + 45);
    }
    setPrevCount(totalCount);
  }, [totalCount, prevCount]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      {/* Mahoraga Wheel */}
      <div className="flex justify-center mb-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition:
                "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <defs>
            </defs>

            {/* Second outer ring (thinner, larger) */}
            <circle
              cx={CX}
              cy={CY}
              r={OUTER2_R}
              fill="none"
              stroke="#FAD399"
              strokeWidth="1"
              opacity="0.2"
            />

            {/* Primary outer ring (thick) */}
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R}
              fill="none"
              stroke="#FAD399"
              strokeWidth="3"
              opacity="0.7"
            />

            {/* 8 Spokes: from inner hub edge to outer ring */}
            {SPOKE_ANGLES.map((angle, i) => {
              const start = spokeStart(angle);
              const end = spokeEnd(angle, OUTER_R);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#FAD399"
                  strokeWidth="1.5"
                  opacity="0.35"
                />
              );
            })}

            {/* 8 Nodes at spoke tips on outer ring */}
            {SPOKE_ANGLES.map((angle, i) => {
              const pos = spokeEnd(angle, OUTER_R);
              return (
                <g key={`node-${i}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R}
                    fill="rgba(255,255,255,0.05)"
                    stroke="#FAD399"
                    strokeWidth="2"
                    className="wheel-node"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  />
                </g>
              );
            })}

            {/* Inner hub */}
            <circle
              cx={CX}
              cy={CY}
              r={HUB_R}
              fill="none"
              stroke="#FAD399"
              strokeWidth="2.5"
              opacity="0.8"
            />

            {/* Center dot */}
            <circle
              cx={CX}
              cy={CY}
              r={CENTER_R}
              fill="#FAD399"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Adaptation Counter */}
      <div className="text-center mb-8">
        <p className="text-5xl font-bold text-white">{todayCount}</p>
        <p className="text-white/40 text-sm mt-1">
          {todayCount === 1 ? "adaptation" : "adaptations"} today
        </p>
      </div>

      {/* Quick Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card text-center">
          <p className="text-2xl font-bold text-white">{todayCount}</p>
          <p className="text-white/40 text-xs mt-1">today</p>
        </div>
        <div className="glass-card text-center">
          <p className="text-2xl font-bold text-white">{totalCount}</p>
          <p className="text-white/40 text-xs mt-1">total</p>
        </div>
        <div className="glass-card text-center">
          <p className="text-2xl font-bold text-white">
            {activeIdentities.length}
          </p>
          <p className="text-white/40 text-xs mt-1">identities</p>
        </div>
        <div className="glass-card text-center">
          <p className="text-2xl font-bold text-white">{streak}</p>
          <p className="text-white/40 text-xs mt-1">day streak</p>
        </div>
      </div>

      {/* Active Identity */}
      {activeIdentities.length > 0 && (
        <div className="glass-card">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
            Identity
          </p>
          <p className="text-white/90 italic text-sm">
            &ldquo;{activeIdentities[0].statement}&rdquo;
          </p>
        </div>
      )}

      {/* Motto */}
      <div className="mt-6 text-center">
        <p className="text-white/15 text-sm">
          The wheel turns. Always forward.
        </p>
      </div>
    </div>
  );
}
