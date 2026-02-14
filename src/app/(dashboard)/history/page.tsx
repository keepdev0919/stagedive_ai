"use client";

import { useEffect, useState } from "react";

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
        setError("Unable to load practice history.");
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-slate-400">Loading history...</div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
          Practice History
        </h2>
        <p className="text-slate-400">
          Track your progress and review past sessions.
        </p>
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
          <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Start practicing with a stage to see your history here. Every session
            builds confidence.
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
                    {session.stages?.name || "Unknown Stage"}
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
                <p className="text-xs text-slate-400">Duration</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
