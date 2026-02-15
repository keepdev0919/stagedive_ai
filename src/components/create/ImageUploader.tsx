"use client";

import { useCallback, useRef, useState } from "react";
import {
  MAX_UPLOADED_IMAGES,
  useCreateStore,
} from "@/stores/useCreateStore";
import { useLocale } from "@/lib/i18n/useLocale";

export default function ImageUploader() {
  const { uploadedImages, addUploadedImages, removeUploadedImage } =
    useCreateStore();
  const { t } = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prepareImages = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      const remainingSlots = MAX_UPLOADED_IMAGES - uploadedImages.length;
      const selectedFiles = imageFiles
        .slice(0, remainingSlots)
        .filter((file) => file.size <= 50 * 1024 * 1024);

      if (selectedFiles.length === 0) return;

      const previews = Promise.all(
        selectedFiles.map(
          (file) =>
            new Promise<{ file: File; preview: string }>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve({
                  file,
                  preview: e.target?.result as string,
                });
              };
              reader.readAsDataURL(file);
            }),
        ),
      );

      void previews.then((images) => {
        addUploadedImages(images);
      });
    },
    [addUploadedImages, uploadedImages.length],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      prepareImages(files);
    },
    [prepareImages],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      prepareImages(files);
      e.target.value = "";
    },
    [prepareImages],
  );

  if (uploadedImages.length > 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div
              key={`${image.file.name}-${index}`}
              className="relative rounded-xl overflow-hidden border border-white/10"
            >
              <img
                src={image.preview}
                alt={t("create.environment.uploadedAlt", {
                  index: index + 1,
                })}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removeUploadedImage(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  {t("create.environment.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {uploadedImages.length < MAX_UPLOADED_IMAGES ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-white/[0.02] transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-white/10 hover:border-primary/50"
            }`}
            >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-3xl">
                add
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {t("create.environment.addAnother", {
                current: uploadedImages.length,
                max: MAX_UPLOADED_IMAGES,
              })}
            </p>
          </div>
        ) : null}

        <p className="text-xs text-slate-500">
          {t("create.environment.imagesSelected", {
            current: uploadedImages.length,
            max: MAX_UPLOADED_IMAGES,
          })}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          multiple
          onChange={handleInputChange}
        />
      </div>
    );
  }

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-white/[0.02] transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-white/10 hover:border-primary/50"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl">
            cloud_upload
          </span>
        </div>
        <h4 className="text-lg font-bold text-white">
          {t("create.environment.uploadTitle")}
        </h4>
        <p className="text-slate-500 text-sm mt-2 max-w-xs">
          {t("create.environment.uploadHint")}
        </p>
        <p className="text-slate-500 text-xs mt-2">
          {t("create.environment.uploadLimit", { count: MAX_UPLOADED_IMAGES })}
        </p>
        <button
          type="button"
          className="mt-6 px-6 py-2 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/5 transition-all"
        >
          {t("create.environment.browseFiles")}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        multiple
        onChange={handleInputChange}
      />
    </>
  );
}
