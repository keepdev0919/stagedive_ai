"use client";

import { useCreateStore } from "@/stores/useCreateStore";
import { Persona } from "@/types/stage";

const PERSONAS: {
  value: Persona;
  icon: string;
  title: string;
  description: string;
  uiStyle: string;
}[] = [
  {
    value: "presenter",
    icon: "record_voice_over",
    title: "Presenter",
    description:
      "Optimized for speaking, presentations, and screen-sharing interactions.",
    uiStyle: "Slate",
  },
  {
    value: "musician",
    icon: "music_note",
    title: "Musician",
    description:
      "Optimized for high-fidelity audio, stage lighting, and performance visualizers.",
    uiStyle: "Neon",
  },
];

export default function PersonaStep() {
  const { persona, setPersona } = useCreateStore();

  return (
    <section className="glass rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          03
        </span>
        <h3 className="text-xl font-bold text-white">Persona Selection</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {PERSONAS.map((p) => {
          const isSelected = persona === p.value;
          return (
            <div
              key={p.value}
              onClick={() => setPersona(p.value)}
              className="relative group cursor-pointer"
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl transition-all blur-sm ${
                  isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10"
                }`}
              />

              {/* Card */}
              <div
                className={`relative bg-slate-900 rounded-xl p-6 transition-all ${
                  isSelected
                    ? "border-2 border-primary shadow-glow"
                    : "border border-white/5 hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-slate-800 text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {p.icon}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {p.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isSelected ? "text-primary" : "text-slate-500"
                    }`}
                  >
                    Active UI: {p.uiStyle}
                  </span>
                  <span
                    className={`material-symbols-outlined text-primary transition-opacity ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  >
                    check_circle
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
