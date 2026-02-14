"use client";

import { useState, useEffect } from "react";

const PHASES = [
  { label: "Breathe In...", duration: 4000 },
  { label: "Hold...", duration: 7000 },
  { label: "Breathe Out...", duration: 8000 },
];

export default function BreathingGuide() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, currentPhase.duration);
    return () => clearTimeout(timer);
  }, [phaseIndex, currentPhase.duration]);

  const isExpanding = phaseIndex === 0;
  const isHolding = phaseIndex === 1;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className={`w-48 h-48 rounded-full border-2 border-primary/30 flex items-center justify-center transition-all ease-in-out ${
            isExpanding
              ? "scale-125 duration-[4000ms]"
              : isHolding
                ? "scale-125 duration-[7000ms]"
                : "scale-100 duration-[8000ms]"
          }`}
        >
          {/* Inner circle */}
          <div
            className={`w-32 h-32 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center transition-all ease-in-out ${
              isExpanding
                ? "scale-110 duration-[4000ms]"
                : isHolding
                  ? "scale-110 duration-[7000ms]"
                  : "scale-90 duration-[8000ms]"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Phase Label */}
      <p className="text-2xl font-bold text-white tracking-wide animate-pulse">
        {currentPhase.label}
      </p>
      <p className="text-sm text-slate-400">4-7-8 Breathing Technique</p>
    </div>
  );
}
