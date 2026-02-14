"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/practice/VideoPlayer";
import SessionTimer from "@/components/practice/SessionTimer";
import { PRESET_STAGES } from "@/data/presets";

type CustomStage = {
  id: string;
  name: string | null;
  source_image_url: string | null;
  generated_image_url: string | null;
  video_url: string | null;
};

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const stageId = params.stageId as string;

  const [startTime] = useState(() => new Date());
  const [showControls, setShowControls] = useState(true);
  const [stageName, setStageName] = useState("Practice Session");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const preset = PRESET_STAGES.find((s) => s.id === stageId);

    if (preset) {
      setStageName(preset.name);
      setImageUrl(preset.imageUrl);
      setVideoUrl(undefined);
      setIsLoading(false);
      return;
    }

    const loadStage = async () => {
      try {
        const response = await fetch(`/api/stages/${stageId}`);

        if (!response.ok) {
          throw new Error("Stage not found");
        }

        const { stage }: { stage: CustomStage } = await response.json();
        if (!cancelled && stage) {
          setStageName(stage.name || "Practice Session");
          setImageUrl(
            stage.generated_image_url || stage.source_image_url || "",
          );
          setVideoUrl(stage.video_url || undefined);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setStageName("Practice Session");
          setImageUrl(PRESET_STAGES[0]?.imageUrl || "");
          setVideoUrl(undefined);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadStage();

    return () => {
      cancelled = true;
    };
  }, [stageId]);

  const handleEndSession = useCallback(() => {
    const durationSeconds = Math.floor(
      (Date.now() - startTime.getTime()) / 1000,
    );
    const endedAt = new Date();

    router.push(
      `/complete/${stageId}?duration=${durationSeconds}&name=${encodeURIComponent(stageName)}&startedAt=${encodeURIComponent(startTime.toISOString())}&endedAt=${encodeURIComponent(endedAt.toISOString())}`,
    );
  }, [router, stageId, startTime, stageName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-sm">Loading stage...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h2 className="text-white text-xl font-bold mb-2">
            Stage unavailable
          </h2>
          <p className="text-slate-400 text-sm">
            Could not load stage media for this practice session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden cursor-pointer"
      onClick={() => setShowControls((prev) => !prev)}
    >
      {/* Background Video/Image */}
      <VideoPlayer imageUrl={imageUrl} videoUrl={videoUrl} />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 z-10 flex flex-col justify-between p-8 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push("/");
            }}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-bold hover:bg-black/80 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Exit
          </button>

          <SessionTimer startTime={startTime} />
        </div>

        {/* Center: Stage Name */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {stageName}
          </h2>
          <p className="text-slate-300 mt-2 text-sm">
            Click anywhere to toggle controls
          </p>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEndSession();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined text-lg">stop</span>
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
