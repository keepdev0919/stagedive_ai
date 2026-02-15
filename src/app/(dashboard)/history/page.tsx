"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/useLocale";

interface SessionRecord {
  id: string;
  duration_seconds: number;
  ended_at: string;
  stages: {
    name: string;
  } | null;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLocale();

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/sessions");

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load sessions");
        }

        const { sessions } = await response.json();
        setSessions(Array.isArray(sessions) ? sessions : []);
        setError("");
      } catch (error) {
        console.error("History load error:", error);
        setError(t("history.loadError"));
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSessions();
  }, [t]);

  if (isLoading) {
    return (
      <div className="text-sm text-slate-400">{t("history.loading")}</div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
          {t("history.title")}
        </h2>
        <p className="text-slate-400">{t("history.subtitle")}</p>
      </div>

      {error ? (
        <div className="glass rounded-2xl p-6 text-sm text-rose-300 mb-6">
          {error}
        </div>
      ) : null}

      {sessions.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
            history
          </span>
          <h3 className="text-xl font-bold text-white mb-2">
            {t("history.emptyTitle")}
          </h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            {t("history.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="glass rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    play_arrow
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {session.stages?.name || t("history.unknownStage")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(session.ended_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white font-mono">
                  {Math.floor(session.duration_seconds / 60)}:
                  {String(session.duration_seconds % 60).padStart(2, "0")}
                </p>
                <p className="text-xs text-slate-400">
                  {t("history.durationLabel")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
