"use client";

import { useState, useEffect } from "react";

interface ProgressIndicatorProps {
  onComplete: () => void;
}

const STAGES = [
  { label: "Analyzing your environment...", duration: 2000 },
  { label: "Generating audience view...", duration: 3000 },
  { label: "Creating video simulation...", duration: 3000 },
  { label: "Finalizing your stage...", duration: 2000 },
];

export default function ProgressIndicator({
  onComplete,
}: ProgressIndicatorProps) {
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
          {STAGES[currentStage]?.label}
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
