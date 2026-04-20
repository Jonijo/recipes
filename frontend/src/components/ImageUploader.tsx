"use client";

import { ChangeEvent, useState } from "react";
import { imageUrl, uploadsApi } from "@/lib/api";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadsApi.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const preview = imageUrl(value);

  return (
    <div className="flex items-start gap-4">
      <div className="h-32 w-32 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-100">
          {uploading ? "Uploading…" : preview ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onFile}
            disabled={uploading}
          />
        </label>
        {preview && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-left text-xs text-stone-500 hover:underline"
          >
            Remove
          </button>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <p className="text-xs text-stone-500">PNG, JPEG, or WebP. Max 5 MB.</p>
      </div>
    </div>
  );
}
