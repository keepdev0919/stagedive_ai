"use client";

import { useCreateStore } from "@/stores/useCreateStore";

const STEPS = [
  { icon: "image", label: "Background" },
  { icon: "groups", label: "Crowd" },
  { icon: "person", label: "Persona" },
];

export default function StepIndicator() {
  const { currentStep, setStep } = useCreateStore();

  return (
    <div className="flex items-center mb-12 relative">
      {/* Connecting Line */}
      <div className="absolute top-5 left-[16%] right-[16%] h-0.5 bg-white/5 -z-10" />

      {STEPS.map((step, index) => {
        const stepNum = (index + 1) as 1 | 2 | 3;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <div
            key={step.label}
            className="flex-1 flex flex-col items-center cursor-pointer"
            onClick={() => setStep(stepNum)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                isActive
                  ? "bg-primary text-white step-active"
                  : isCompleted
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-slate-800 border border-white/10 text-slate-500"
              }`}
            >
              {isCompleted ? (
                <span className="material-symbols-outlined text-sm">
                  check
                </span>
              ) : (
                <span className="material-symbols-outlined">{step.icon}</span>
              )}
            </div>
            <span
              className={`text-xs font-bold mt-3 uppercase tracking-wider ${
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-primary/60"
                    : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
