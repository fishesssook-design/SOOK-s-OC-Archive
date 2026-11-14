import { useState } from 'react';

interface Props {
  src: string | null;
  name: string;
  className?: string;
}

const SILHOUETTE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<rect width="100" height="100" fill="#e4e4e7"/>' +
  '<circle cx="50" cy="36" r="16" fill="#a1a1aa"/>' +
  '<path d="M22 100c0-22 12-36 28-36s28 14 28 36z" fill="#a1a1aa"/>' +
  '</svg>';

export const SILHOUETTE_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SILHOUETTE_SVG)}`;

export function CharacterImage({ src, name, className = '' }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = Boolean(src) && src !== failedSrc;

  return (
    <img
      src={hasImage ? src! : SILHOUETTE_SRC}
      alt={hasImage ? name : `${name} 이미지 준비 중`}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
