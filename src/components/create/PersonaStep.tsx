"use client";

import { useCreateStore } from "@/stores/useCreateStore";
import { AudienceMood, EventType } from "@/types/stage";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";

const EVENT_TYPES: {
  value: EventType;
  icon: string;
  label: TranslationKey;
  description: TranslationKey;
}[] = [
  {
    value: "presentation",
    icon: "mic",
    label: "create.eventType.presentation.title",
    description: "create.eventType.presentation.description",
  },
  {
    value: "performance",
    icon: "music_note",
    label: "create.eventType.performance.title",
    description: "create.eventType.performance.description",
  },
  {
    value: "lecture",
    icon: "school",
    label: "create.eventType.lecture.title",
    description: "create.eventType.lecture.description",
  },
  {
    value: "interview",
    icon: "chat",
    label: "create.eventType.interview.title",
    description: "create.eventType.interview.description",
  },
  {
    value: "event",
    icon: "celebration",
    label: "create.eventType.event.title",
    description: "create.eventType.event.description",
  },
  {
    value: "other",
    icon: "tune",
    label: "create.eventType.other.title",
    description: "create.eventType.other.description",
  },
];

const AUDIENCE_MOODS: {
  value: AudienceMood;
  label: TranslationKey;
}[] = [
  {
    value: "auto",
    label: "create.audienceMood.auto",
  },
  {
    value: "calm_attention",
    label: "create.audienceMood.calm_attention",
  },
  {
    value: "warm_support",
    label: "create.audienceMood.warm_support",
  },
  {
    value: "formal_event",
    label: "create.audienceMood.formal_event",
  },
  {
    value: "high_energy",
    label: "create.audienceMood.high_energy",
  },
];

export default function PersonaStep() {
  const {
    eventType,
    audienceMood,
    customContext,
    setEventType,
    setAudienceMood,
    setCustomContext,
  } = useCreateStore();
  const { t } = useLocale();

  const isCustomEventType = eventType === "other";

  return (
    <section className="glass rounded-xl p-8 space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          03
        </span>
        <h3 className="text-xl font-bold text-white">
          {t("create.persona.title")}
        </h3>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200">
          {t("create.persona.title")}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setEventType(type.value);
                if (type.value !== "other") setCustomContext("");
              }}
              className={`relative rounded-lg border p-4 text-left transition-all ${
                eventType === type.value
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-white/10 bg-slate-900 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">
                  {type.icon}
                </span>
                <p className="font-bold text-white text-sm">{t(type.label)}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(type.description)}
              </p>
            </button>
          ))}
        </div>
        {isCustomEventType && (
          <div className="space-y-2 pt-4">
            <label className="text-sm font-bold text-slate-200 block">
              {t("create.customContext.label")}
            </label>
            <textarea
              value={customContext}
              onChange={(event) => setCustomContext(event.target.value)}
              placeholder={t("create.customContext.placeholder")}
              maxLength={500}
              className="w-full min-h-[96px] rounded-lg border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200">
          {t("create.audienceMood.sectionTitle")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_MOODS.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setAudienceMood(mood.value)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                audienceMood === mood.value
                  ? "bg-primary text-white"
                  : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {t(mood.label)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
