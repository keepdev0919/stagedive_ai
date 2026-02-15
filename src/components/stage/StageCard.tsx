"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/useLocale";
import { type TranslationKey } from "@/lib/i18n/translations";
import { CATEGORY_CONFIG, StageCategory } from "@/types/stage";

interface StageCardProps {
  stage: {
    id: string;
    name: string;
    category: StageCategory;
    capacity: string;
    feature: string;
    featureIcon?: string;
    imageUrl: string;
    isPreset?: boolean;
  };
}

export default function StageCard({ stage }: StageCardProps) {
  const { t } = useLocale();
  const categoryConfig = CATEGORY_CONFIG[stage.category];
  const featureIcon = stage.featureIcon || "groups";
  const categoryLabelKey: Record<StageCategory, TranslationKey> = {
    hackathon: "stage.category.hackathon",
    concert_hall: "stage.category.concert_hall",
    ted_stage: "stage.category.ted_stage",
    meeting_room: "stage.category.meeting_room",
    auditorium: "stage.category.auditorium",
    tech_hub: "stage.category.tech_hub",
  };

  return (
    <div className="group relative bg-slate-card rounded-xl overflow-hidden aspect-[4/3] border border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:shadow-glow">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url('${stage.imageUrl}')` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span
          className={`${categoryConfig.color} px-2 py-1 rounded-sm text-[10px] font-bold text-white tracking-widest uppercase`}
        >
          {t(categoryLabelKey[stage.category])}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
          {stage.name}
        </h3>
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-300">
          <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">groups</span>
            {stage.capacity} {t("stage.card.capacityLabel")}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              {featureIcon}
            </span>
            {stage.feature}
          </span>
        </div>

        {/* Hover Button */}
        <Link
          href={`/practice/${stage.id}`}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          {t("stage.card.startPractice")}
        </Link>
      </div>
    </div>
  );
}
