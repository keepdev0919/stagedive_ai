"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CompletePage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const stageId = params.stageId as string;

  const duration = parseInt(searchParams.get("duration") || "0", 10);
  const stageName = searchParams.get("name") || "Stage";
  const startedAt = searchParams.get("startedAt");
  const endedAt = searchParams.get("endedAt");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");

  useEffect(() => {
    if (!stageId || !startedAt || !endedAt || duration <= 0) {
      setSaveState("idle");
      return;
    }

    setSaveState("saving");

    const saveSession = async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage_id: stageId,
            started_at: startedAt,
            ended_at: endedAt,
            duration_seconds: duration,
          }),
        });

        if (!response.ok) {
          throw new Error("Session save failed");
        }

        setSaveState("saved");
      } catch {
        setSaveState("failed");
      }
    };

    void saveSession();
  }, [duration, startedAt, endedAt, stageId]);

  const statusText = useMemo(() => {
    if (duration <= 0) return "Session did not have a valid duration.";
    if (saveState === "saving") return "Saving session...";
    if (saveState === "saved") return "Session has been saved to history.";
    if (saveState === "failed")
      return "Could not save this session (demo mode or auth issue).";
    return "Session was not saved.";
  }, [duration, saveState]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass rounded-2xl p-12 max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-emerald-400 text-5xl">
            check_circle
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Session Complete!
          </h2>
          <p className="text-slate-400">Great work facing your audience.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </p>
            <p className="text-xs text-slate-400 mt-1">Duration</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-bold text-white truncate">{stageName}</p>
            <p className="text-xs text-slate-400 mt-1">Stage</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">{statusText}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Back to Home
          </Link>
          <Link
            href="/history"
            className="w-full py-3 border border-white/10 text-white rounded-lg font-bold text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">history</span>
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
