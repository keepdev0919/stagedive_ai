import { create } from "zustand";
import { AudienceDensity, EventType, ImagePerspective } from "@/types/stage";

export const MAX_UPLOADED_IMAGES = 3;

interface CreateStore {
  // Wizard step
  currentStep: 1 | 2 | 3;

  // Step 1: Environment
  uploadedImages: {
    file: File;
    preview: string;
  }[];
  imageUrl: string | null;

  // Step 2: Audience Density
  audienceDensity: AudienceDensity;

  // Step 3: Event + Context
  eventType: EventType;
  imagePerspective: ImagePerspective;
  customContext: string;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setUploadedImages: (images: { file: File; preview: string }[]) => void;
  addUploadedImages: (images: { file: File; preview: string }[]) => void;
  removeUploadedImage: (index: number) => void;
  clearUploadedImages: () => void;
  setImageUrl: (url: string) => void;
  setAudienceDensity: (density: AudienceDensity) => void;
  setEventType: (eventType: EventType) => void;
  setImagePerspective: (perspective: ImagePerspective) => void;
  setCustomContext: (context: string) => void;
  reset: () => void;
}

export type UploadedImage = {
  file: File;
  preview: string;
};

export const useCreateStore = create<CreateStore>((set) => ({
  currentStep: 1,
  uploadedImages: [],
  imageUrl: null,
  audienceDensity: 80,
  eventType: "presentation",
  imagePerspective: "stage_to_audience",
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
  setImagePerspective: (perspective) => set({ imagePerspective: perspective }),
  setCustomContext: (context) => set({ customContext: context }),
  reset: () =>
    set({
      currentStep: 1,
      uploadedImages: [],
      imageUrl: null,
      audienceDensity: 80,
      eventType: "presentation",
      imagePerspective: "stage_to_audience",
      customContext: "",
    }),
}));
