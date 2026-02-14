import { create } from "zustand";
import { AudienceDensity, Persona } from "@/types/stage";

interface CreateStore {
  // Wizard step
  currentStep: 1 | 2 | 3;

  // Step 1: Environment
  uploadedFile: File | null;
  uploadedPreview: string | null;
  imageUrl: string | null;

  // Step 2: Audience Density
  audienceDensity: AudienceDensity;

  // Step 3: Persona
  persona: Persona;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setUploadedFile: (file: File, preview: string) => void;
  clearUploadedFile: () => void;
  setImageUrl: (url: string) => void;
  setAudienceDensity: (density: AudienceDensity) => void;
  setPersona: (persona: Persona) => void;
  reset: () => void;
}

export const useCreateStore = create<CreateStore>((set) => ({
  currentStep: 1,
  uploadedFile: null,
  uploadedPreview: null,
  imageUrl: null,
  audienceDensity: 80,
  persona: "presenter",

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3,
    })),
  setUploadedFile: (file, preview) =>
    set({ uploadedFile: file, uploadedPreview: preview }),
  clearUploadedFile: () =>
    set({ uploadedFile: null, uploadedPreview: null, imageUrl: null }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setAudienceDensity: (density) => set({ audienceDensity: density }),
  setPersona: (persona) => set({ persona }),
  reset: () =>
    set({
      currentStep: 1,
      uploadedFile: null,
      uploadedPreview: null,
      imageUrl: null,
      audienceDensity: 80,
      persona: "presenter",
    }),
}));
