"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";

const PHASES: Array<{
  labelKey: Extract<TranslationKey, `breathing.${string}`>;
  duration: number;
}> = [
  { labelKey: "breathing.phase.in", duration: 4000 },
  { labelKey: "breathing.phase.hold", duration: 7000 },
  { labelKey: "breathing.phase.out", duration: 8000 },
];

export default function BreathingGuide() {
  const { t } = useLocale();
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
        {t(currentPhase.labelKey)}
      </p>
      <p className="text-sm text-slate-400">{t("breathing.technique")}</p>
    </div>
  );
}
