"use client";

import { ChangeEvent, useState } from "react";
import { imageUrl, uploadsApi } from "@/lib/api";
import { PantryIcon } from "./PantryIcon";

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
    <div className="flex items-start gap-5">
      <div className="h-36 w-36 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-2/60">
            <PantryIcon className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm text-ink transition hover:border-terracotta hover:text-terracotta">
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
            className="text-left text-xs text-ink-2 transition hover:text-terracotta"
          >
            Remove
          </button>
        )}
        {error && <p className="text-xs text-terracotta">{error}</p>}
        <p className="text-xs text-ink-2">PNG, JPEG, or WebP. Max 5 MB.</p>
      </div>
    </div>
  );
}
