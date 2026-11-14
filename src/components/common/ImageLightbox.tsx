import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${alt} 이미지 보기`} className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="이미지 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/85 animate-fade-in"
      />
      <img
        src={src}
        alt={alt}
        className="relative max-h-full max-w-full rounded-lg object-contain shadow-2xl animate-fade-in"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 transition hover:bg-white"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
