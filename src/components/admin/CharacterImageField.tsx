import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { CHARACTER_IMAGE_TYPES } from '@/lib/characterImages';
import type { ImageSlot } from '@/lib/characterForm';

interface Props {
  label: string;
  slot: ImageSlot;
  onChange: (slot: ImageSlot) => void;
}

export function CharacterImageField({ label, slot, onChange }: Props) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!slot.file) return;
    const url = URL.createObjectURL(slot.file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [slot.file]);

  const previewSrc = slot.file ? localPreview : slot.src;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (file) onChange({ path: slot.path, src: slot.src, file });
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-zinc-800">{label}</span>
      <div className="flex items-start gap-4">
        <div className="flex aspect-[3/4] w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt={`${label} 미리보기`}
              className="h-full w-full object-contain"
              style={{ imageRendering: 'auto' }}
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-zinc-400" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900">
            {previewSrc ? '이미지 바꾸기' : '이미지 올리기'}
            <input
              type="file"
              accept={CHARACTER_IMAGE_TYPES.join(',')}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {previewSrc && (
            <button
              type="button"
              onClick={() => onChange({ path: null, src: null, file: null })}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              이미지 제거
            </button>
          )}
          <p className="text-xs text-zinc-500">JPG, PNG, WebP, GIF / 5MB 이하</p>
          {label === '썸네일' && (
  <p className="text-[11px] text-zinc-400 -mt-0.5 select-none">추천 사이즈 : 300x400px</p>
)}
        </div>
      </div>
    </div>
  );
}
