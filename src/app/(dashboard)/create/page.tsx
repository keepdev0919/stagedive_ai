"use client";

import Link from "next/link";
import StepIndicator from "@/components/create/StepIndicator";
import EnvironmentStep from "@/components/create/EnvironmentStep";
import AudienceStep from "@/components/create/AudienceStep";
import PersonaStep from "@/components/create/PersonaStep";
import ActionBar from "@/components/create/ActionBar";
import { useLocale } from "@/lib/i18n/useLocale";

export default function CreateStagePage() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {t("create.page.title")}
          </h2>
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            {t("create.page.exitWizard")}
          </Link>
        </div>
        <p className="text-slate-400 max-w-xl">
          {t("create.page.headerDescription")}
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* All Steps (visible at once, like the Stitch design) */}
      <div className="space-y-12">
        <EnvironmentStep />
        <AudienceStep />
        <PersonaStep />
      </div>

      {/* Action Bar */}
      <ActionBar />
    </div>
  );
}
