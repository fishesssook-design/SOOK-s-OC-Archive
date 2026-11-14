import { Lock } from 'lucide-react';

export function PrivateBadge() {
  return (
    <span
      role="img"
      aria-label="비공개 캐릭터"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-zinc-900"
    >
      <Lock className="h-3 w-3" aria-hidden="true" />
    </span>
  );
}
