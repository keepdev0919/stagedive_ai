"use client";

import { useCreateStore } from "@/stores/useCreateStore";
import { AudienceDensity } from "@/types/stage";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";

const DENSITY_OPTIONS: {
  value: AudienceDensity;
  label: TranslationKey;
  sublabel: TranslationKey;
}[] = [
  {
    value: 40,
    label: "create.audience.option.40.label",
    sublabel: "create.audience.option.40.sublabel",
  },
  {
    value: 80,
    label: "create.audience.option.80.label",
    sublabel: "create.audience.option.80.sublabel",
  },
  {
    value: 120,
    label: "create.audience.option.120.label",
    sublabel: "create.audience.option.120.sublabel",
  },
];

export default function AudienceStep() {
  const { audienceDensity, setAudienceDensity } = useCreateStore();
  const { t } = useLocale();

  return (
    <section className="glass rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          02
        </span>
        <h3 className="text-xl font-bold text-white">{t("create.audience.title")}</h3>
      </div>
      <p className="text-slate-400 text-sm">
        {t("create.audience.description")}
      </p>
      <div className="grid grid-cols-3 gap-4 bg-slate-900/50 p-2 rounded-xl border border-white/5">
        {DENSITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setAudienceDensity(option.value)}
            className={`py-4 px-6 rounded-lg font-bold transition-all text-center ${
              audienceDensity === option.value
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="block text-lg">{t(option.label)}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-70">
              {t(option.sublabel)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
