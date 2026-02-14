"use client";

import ImageUploader from "./ImageUploader";

export default function EnvironmentStep() {
  return (
    <section className="glass rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
          01
        </span>
        <h3 className="text-xl font-bold text-white">Environment Setup</h3>
      </div>
      <ImageUploader />
    </section>
  );
}
