"use client";

import { useEffect, useMemo, useState } from "react";
import { PRESET_STAGES, type StagePreset } from "@/data/presets";
import StageGrid, { type StageListItem } from "@/components/stage/StageGrid";
import { useLocale } from "@/lib/i18n/useLocale";

interface CommunityStageResponse {
  id: string;
  name: string;
  category: StagePreset["category"];
  capacity: string | null;
  feature: string | null;
  source_image_url: string | null;
  source_image_urls?: string[] | null;
  generated_image_url: string | null;
}

export default function HomePage() {
  const [communityStages, setCommunityStages] = useState<StageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLocale();

  useEffect(() => {
    const loadCommunityStages = async () => {
      try {
        const response = await fetch("/api/stages");
        if (!response.ok) {
          throw new Error("Unable to load community stages");
        }

        const body = await response.json();
        const stages = Array.isArray(body.stages) ? body.stages : [];
        const mapped: StageListItem[] = stages
          .map((stage: CommunityStageResponse) => {
            const imageUrl =
              stage.generated_image_url ||
              stage.source_image_url ||
              stage.source_image_urls?.[0] ||
              null;
            if (!imageUrl) return null;

            return {
              id: stage.id,
              name: stage.name,
              category: stage.category,
              capacity: stage.capacity || t("dashboard.communityCapacity"),
              feature: stage.feature || t("dashboard.communityFeature"),
              featureIcon: "groups",
              imageUrl,
              isPreset: false,
            };
          })
          .filter(Boolean) as StageListItem[];

        setCommunityStages(mapped);
        setError("");
      } catch {
        setCommunityStages([]);
        setError(t("dashboard.loadCommunityFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCommunityStages();
  }, [t]);

  const presetStages: StageListItem[] = PRESET_STAGES.map((stage: StagePreset) => ({
    id: stage.id,
    name: stage.name,
    category: stage.category,
    capacity: stage.capacity,
    feature: stage.feature,
    featureIcon: stage.featureIcon,
    imageUrl: stage.imageUrl,
    isPreset: true,
  }));

  const stages = useMemo(() => [...presetStages, ...communityStages], [communityStages]);

  return (
    <>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
            {t("dashboard.title")}
          </h2>
          <p className="text-slate-400">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            {t("dashboard.view.grid")}
          </button>
          <button className="px-4 py-2 rounded-lg bg-transparent text-slate-500 text-xs font-bold hover:bg-white/5">
            {t("dashboard.view.list")}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-500 mb-4">{t("dashboard.loadingCommunity")}</p>
      ) : null}

      {error ? <p className="text-xs text-rose-300 mb-4">{error}</p> : null}

      <StageGrid stages={stages} />
    </>
  );
}
