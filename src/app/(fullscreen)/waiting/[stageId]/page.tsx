"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback } from "react";
import BreathingGuide from "@/components/waiting/BreathingGuide";
import ProgressIndicator from "@/components/waiting/ProgressIndicator";
import { useLocale } from "@/lib/i18n/useLocale";

export default function WaitingPage() {
  const router = useRouter();
  const params = useParams();
  const stageId = params.stageId as string;
  const { t } = useLocale();

  const handleComplete = useCallback(() => {
    router.push(`/practice/${stageId}`);
  }, [router, stageId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-16 p-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">
            layers
          </span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight uppercase">
          Stage-Dive
        </h1>
      </div>

      {/* Breathing Guide */}
      <BreathingGuide />

      {/* Progress */}
      <ProgressIndicator onComplete={handleComplete} />

      {/* Tip */}
      <p className="text-xs text-slate-500 max-w-sm text-center">
        {t("waiting.tip")}
      </p>
    </div>
  );
}
