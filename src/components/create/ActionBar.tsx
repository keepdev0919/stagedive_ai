"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateStore } from "@/stores/useCreateStore";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/useLocale";

export default function ActionBar() {
  const router = useRouter();
  const {
    uploadedImages,
    audienceDensity,
    eventType,
    audienceMood,
    customContext,
    reset,
  } = useCreateStore();
  const { t } = useLocale();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async () => {
    if (!uploadedImages.length || isInitializing) return;

    setIsInitializing(true);

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: uploadedImages.map((image) => ({
            filename: image.file.name,
            contentType: image.file.type || "image/jpeg",
          })),
        }),
      });

      if (!uploadResponse.ok) {
        const message = await uploadResponse.text();
        throw new Error(
          `Failed to request upload URL: ${uploadResponse.status} ${uploadResponse.statusText} ${message}`,
        );
      }

      const uploadPayload = await uploadResponse.json();
      console.log("Upload payload", uploadPayload);
      const uploads = Array.isArray(uploadPayload.uploads)
        ? uploadPayload.uploads
        : uploadPayload.uploadUrl && uploadPayload.publicUrl
          ? [uploadPayload]
          : [];

      if (
        !uploads.length ||
        uploads.length !== uploadedImages.length ||
        !uploads.every(
          (entry: { uploadUrl?: string; publicUrl?: string }) =>
            Boolean(entry.uploadUrl && entry.publicUrl),
        )
      ) {
        throw new Error(`Invalid upload response: ${JSON.stringify(uploadPayload)}`);
      }

      const uploadedImageUrls = await Promise.all(
        uploads.map(
          async (
            entry: { uploadUrl: string; publicUrl: string },
            index: number,
          ) => {
            if (!entry.uploadUrl.startsWith("https://")) {
              throw new Error(`Invalid upload URL for image #${index + 1}`);
            }


            if (!entry.uploadUrl.includes("mock-upload-url.example.com")) {
              try {
                console.log(`Attempting upload to: ${entry.uploadUrl}`);
                const putResponse = await fetch(entry.uploadUrl, {

                  method: "PUT",

                  headers: {
                    "Content-Type":
                      uploadedImages[index]?.file.type || "image/jpeg",
                  },

                  body: uploadedImages[index]?.file,
                });

                if (!putResponse.ok) {
                  const text = await putResponse.text();
                  throw new Error(
                    `R2 upload failed at image #${index + 1}: ${putResponse.status} ${text}`,
                  );
                }
              } catch (error) {
                throw new Error(
                  `R2 upload failed at image #${index + 1}: ${String(error)}`,
                );
              }
            }

            return entry.publicUrl;
          },
        ),
      );

      const stageCreateResponse = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:
            uploadedImages[0]?.file.name.replace(/\.[^/.]+$/, "") ||
            t("create.action.defaultStageName"),
          category: "hackathon",
          capacity: "",
          feature: "Custom",
          source_image_url: uploadedImageUrls[0],
          source_image_urls: uploadedImageUrls,
          audience_density: audienceDensity,
          event_type: eventType,
          audience_mood: audienceMood,
          custom_context: customContext,
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
          sourceImageUrls: uploadedImageUrls,
          sourceImageUrl: uploadedImageUrls[0],
          audienceDensity,
          eventType,
          audienceMood,
          customContext,
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
      alert(t("create.action.initFailed"));
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
          {t("create.action.back")}
        </Link>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-lg text-sm font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
            {t("create.action.saveDraft")}
          </button>
          <button
            onClick={handleInitialize}
            disabled={!uploadedImages.length || isInitializing}
            className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isInitializing
              ? t("create.action.initializing")
              : t("create.action.initialize")}
            <span className="material-symbols-outlined text-lg">bolt</span>
          </button>
        </div>
      </div>
  );
}
