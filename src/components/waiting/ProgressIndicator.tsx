"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";

interface ProgressIndicatorProps {
  onComplete: () => void;
}

const STAGES: Array<{
  labelKey: Extract<TranslationKey, `progress.${string}`>;
  duration: number;
}> = [
  { labelKey: "progress.analyzing", duration: 2000 },
  { labelKey: "progress.generateAudience", duration: 3000 },
  { labelKey: "progress.createVideo", duration: 3000 },
  { labelKey: "progress.finalizing", duration: 2000 },
];

export default function ProgressIndicator({
  onComplete,
}: ProgressIndicatorProps) {
  const { t } = useLocale();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current stage
      let accumulated = 0;
      for (let i = 0; i < STAGES.length; i++) {
        accumulated += STAGES[i].duration;
        if (elapsed < accumulated) {
          setCurrentStage(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-sm text-slate-300 font-medium">
          {t(STAGES[currentStage]?.labelKey ?? "progress.analyzing")}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-slate-500 text-right">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
