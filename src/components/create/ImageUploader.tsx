"use client";

import { useCallback, useRef, useState } from "react";
import { useCreateStore } from "@/stores/useCreateStore";

export default function ImageUploader() {
  const { uploadedPreview, setUploadedFile, clearUploadedFile } =
    useCreateStore();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 50 * 1024 * 1024) return; // 50MB max

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setUploadedFile(file, preview);
      };
      reader.readAsDataURL(file);
    },
    [setUploadedFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
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
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (uploadedPreview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        <img
          src={uploadedPreview}
          alt="Uploaded stage"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={clearUploadedFile}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Remove
          </button>
        </div>
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
          Upload background image
        </h4>
        <p className="text-slate-500 text-sm mt-2 max-w-xs">
          Drag and drop your 360° panoramas or high-resolution wide shots (JPG,
          PNG - max 50MB)
        </p>
        <button
          type="button"
          className="mt-6 px-6 py-2 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/5 transition-all"
        >
          Browse Files
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </>
  );
}
