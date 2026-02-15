import { create } from "zustand";
import { AudienceDensity, AudienceMood, EventType } from "@/types/stage";

export const MAX_UPLOADED_IMAGES = 3;

export type UploadedImage = {
  file: File;
  preview: string;
};

interface CreateStore {
  // Wizard step
  currentStep: 1 | 2 | 3;

  // Step 1: Environment
  uploadedImages: UploadedImage[];
  imageUrl: string | null;

  // Step 2: Audience Density
  audienceDensity: AudienceDensity;

  // Step 3: Event + Mood
  eventType: EventType;
  audienceMood: AudienceMood;
  customContext: string;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setUploadedImages: (images: UploadedImage[]) => void;
  addUploadedImages: (images: UploadedImage[]) => void;
  removeUploadedImage: (index: number) => void;
  clearUploadedImages: () => void;
  setImageUrl: (url: string) => void;
  setAudienceDensity: (density: AudienceDensity) => void;
  setEventType: (eventType: EventType) => void;
  setAudienceMood: (mood: AudienceMood) => void;
  setCustomContext: (context: string) => void;
  reset: () => void;
}

export const useCreateStore = create<CreateStore>((set) => ({
  currentStep: 1,
  uploadedImages: [],
  imageUrl: null,
  audienceDensity: 80,
  eventType: "presentation",
  audienceMood: "auto",
  customContext: "",

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3,
    })),
  setUploadedImages: (images) =>
    set({
      uploadedImages: images.slice(0, MAX_UPLOADED_IMAGES),
    }),
  addUploadedImages: (images) =>
    set((state) => ({
      uploadedImages: [...state.uploadedImages, ...images].slice(
        0,
        MAX_UPLOADED_IMAGES,
      ),
    })),
  removeUploadedImage: (index) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((_, i) => i !== index),
    })),
  clearUploadedImages: () => set({ uploadedImages: [], imageUrl: null }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setAudienceDensity: (density) => set({ audienceDensity: density }),
  setEventType: (eventType) => set({ eventType }),
  setAudienceMood: (mood) => set({ audienceMood: mood }),
  setCustomContext: (context) => set({ customContext: context }),
  reset: () =>
    set({
      currentStep: 1,
      uploadedImages: [],
      imageUrl: null,
      audienceDensity: 80,
      eventType: "presentation",
      audienceMood: "auto",
      customContext: "",
    }),
}));
