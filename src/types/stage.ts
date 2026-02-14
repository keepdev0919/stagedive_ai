export type StageCategory =
  | "hackathon"
  | "concert_hall"
  | "ted_stage"
  | "meeting_room"
  | "auditorium"
  | "tech_hub";

export type AudienceDensity = 40 | 80 | 120;

export type Persona = "presenter" | "musician";

export type StageStatus = "draft" | "generating" | "ready" | "failed";

export interface StagePreset {
  id: string;
  name: string;
  category: StageCategory;
  capacity: string;
  feature: string;
  featureIcon: string;
  imageUrl: string;
  isPreset: true;
}

export interface Stage {
  id: string;
  user_id: string;
  name: string;
  category: StageCategory;
  capacity: string;
  feature: string;
  source_image_url: string | null;
  generated_image_url: string | null;
  video_url: string | null;
  audience_density: AudienceDensity;
  persona: Persona;
  status: StageStatus;
  isPreset: false;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_CONFIG: Record<
  StageCategory,
  { label: string; color: string }
> = {
  hackathon: { label: "HACKATHON VENUE", color: "bg-primary" },
  concert_hall: { label: "CONCERT HALL", color: "bg-indigo-600" },
  ted_stage: { label: "TED STAGE", color: "bg-red-600" },
  meeting_room: { label: "MEETING ROOM", color: "bg-emerald-600" },
  auditorium: { label: "AUDITORIUM", color: "bg-amber-600" },
  tech_hub: { label: "TECH HUB", color: "bg-cyan-600" },
};
