"use client";

import { useCreateStore } from "@/stores/useCreateStore";
import { EventType } from "@/types/stage";
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

export default function PersonaStep() {
  const { eventType, customContext, setEventType, setCustomContext } =
    useCreateStore();
  const { t } = useLocale();

  const isCustomEventType = eventType === "other";

  return (
    <section className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          03
        </span>
        <h3 className="text-lg font-bold text-white">{t("create.persona.title")}</h3>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200">
          {t("create.persona.title")}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setEventType(type.value);
                if (type.value !== "other") setCustomContext("");
              }}
              className={`relative rounded-lg border p-3 text-left transition-all ${
                eventType === type.value
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-white/10 bg-slate-900 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-primary">
                  {type.icon}
                </span>
                <p className="font-bold text-white text-sm">{t(type.label)}</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {t(type.description)}
              </p>
            </button>
          ))}
        </div>
        {isCustomEventType && (
          <div className="space-y-2 pt-3">
            <label className="text-sm font-bold text-slate-200 block">
              {t("create.customContext.label")}
            </label>
            <textarea
              value={customContext}
              onChange={(event) => setCustomContext(event.target.value)}
              placeholder={t("create.customContext.placeholder")}
              maxLength={500}
              className="w-full min-h-[72px] rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        )}
      </div>
    </section>
  );
}
