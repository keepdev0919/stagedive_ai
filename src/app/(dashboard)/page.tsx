import { PRESET_STAGES } from "@/data/presets";
import StageGrid from "@/components/stage/StageGrid";

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
            Popular Stages
          </h2>
          <p className="text-slate-400">
            Hand-picked venues to sharpen your public speaking performance.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            GRID
          </button>
          <button className="px-4 py-2 rounded-lg bg-transparent text-slate-500 text-xs font-bold hover:bg-white/5">
            LIST
          </button>
        </div>
      </div>

      {/* Stage Grid */}
      <StageGrid stages={PRESET_STAGES} />
    </>
  );
}
