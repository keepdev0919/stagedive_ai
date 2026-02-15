"use client";

import { useCreateStore } from "@/stores/useCreateStore";
import ImageUploader from "./ImageUploader";
import { ImagePerspective } from "@/types/stage";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";

const IMAGE_PERSPECTIVES: {
  value: ImagePerspective;
  title: TranslationKey;
  description: TranslationKey;
}[] = [
  {
    value: "stage_to_audience",
    title: "create.imagePerspective.stageToAudience.title",
    description: "create.imagePerspective.stageToAudience.description",
  },
  {
    value: "audience_to_stage",
    title: "create.imagePerspective.audienceToStage.title",
    description: "create.imagePerspective.audienceToStage.description",
  },
];

export default function EnvironmentStep() {
  const { imagePerspective, setImagePerspective } = useCreateStore();
  const { t } = useLocale();

  return (
    <section className="glass rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          01
        </span>
        <h3 className="text-xl font-bold text-white">{t("create.environment.title")}</h3>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200">
          {t("create.imagePerspective.sectionTitle")}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {IMAGE_PERSPECTIVES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setImagePerspective(item.value)}
              className={`relative rounded-lg border p-4 text-left transition-all ${
                imagePerspective === item.value
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-white/10 bg-slate-900 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">
                  {item.value === "stage_to_audience" ? "videocam" : "groups"}
                </span>
                <p className="font-bold text-white text-sm">{t(item.title)}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(item.description)}
              </p>
            </button>
          ))}
        </div>
      </div>
      <ImageUploader />
    </section>
  );
}
