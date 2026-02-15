import { StagePreset } from "@/types/stage";
import StageCard from "./StageCard";

export type StageListItem = {
  id: string;
  name: string;
  category: StagePreset["category"];
  capacity: string;
  feature: string;
  featureIcon?: string;
  imageUrl: string;
  isPreset?: boolean;
};

interface StageGridProps {
  stages: StageListItem[];
}

export default function StageGrid({ stages }: StageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
