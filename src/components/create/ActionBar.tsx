"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateStore } from "@/stores/useCreateStore";
import { useState } from "react";

export default function ActionBar() {
  const router = useRouter();
  const { uploadedFile, audienceDensity, persona, reset } = useCreateStore();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async () => {
    if (!uploadedFile || isInitializing) return;

    setIsInitializing(true);

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: uploadedFile.name,
          contentType: uploadedFile.type || "image/jpeg",
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to request upload URL");
      }

      const { uploadUrl, publicUrl } = await uploadResponse.json();

      if (!uploadUrl || !publicUrl) {
        throw new Error("Invalid upload response");
      }

      if (!uploadUrl.includes("mock-upload-url.example.com")) {
        const putResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": uploadedFile.type || "application/octet-stream",
          },
          body: uploadedFile,
        });

        if (!putResponse.ok) {
          throw new Error("Failed to upload image");
        }
      }

      const stageCreateResponse = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: uploadedFile.name.replace(/\.[^/.]+$/, "") || "Custom Stage",
          category: "hackathon",
          capacity: "",
          feature: "Custom",
          source_image_url: publicUrl,
          audience_density: audienceDensity,
          persona,
        }),
      });

      if (!stageCreateResponse.ok) {
        throw new Error("Failed to create stage");
      }

      const { stage } = await stageCreateResponse.json();

      if (!stage?.id) {
        throw new Error("Invalid stage response");
      }

      const imageResponse = await fetch("/api/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: stage.id,
          sourceImageUrl: publicUrl,
          audienceDensity,
          persona,
        }),
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to generate audience image");
      }

      const imageResult = await imageResponse.json();

      await fetch(`/api/stages/${stage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generated_image_url: imageResult.imageUrl,
          status: "generating",
          updated_at: new Date().toISOString(),
        }),
      });

      const videoResponse = await fetch("/api/generate/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: stage.id,
          generatedImageUrl: imageResult.imageUrl,
        }),
      });

      if (videoResponse.ok) {
        const videoResult = await videoResponse.json();
        await fetch(`/api/stages/${stage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_url: videoResult.videoUrl,
            status: "ready",
            updated_at: new Date().toISOString(),
          }),
        });
      }

      reset();
      router.push(`/waiting/${stage.id}`);
    } catch (error) {
      console.error(error);
      alert("Stage initialization failed. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Stages
      </Link>
      <div className="flex gap-4">
        <button className="px-8 py-3 rounded-lg text-sm font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
          Save as Draft
        </button>
        <button
          onClick={handleInitialize}
          disabled={!uploadedFile || isInitializing}
          className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isInitializing ? "Initializing..." : "Initialize Stage"}
          <span className="material-symbols-outlined text-lg">bolt</span>
        </button>
      </div>
    </div>
  );
}
