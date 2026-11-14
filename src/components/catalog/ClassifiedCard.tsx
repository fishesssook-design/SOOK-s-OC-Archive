import { Lock } from 'lucide-react';
import { formatDexNumber } from '@/lib/format';

interface Props {
  variant: 'row' | 'card' | 'notice';
  dexNumber: number;
}

export function ClassifiedCard({ variant, dexNumber }: Props) {
  const dexLabel = `No. ${formatDexNumber(dexNumber)}`;

  if (variant === 'row') {
    return (
      <>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-zinc-900 sm:h-16 sm:w-16">
          <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </span>
        <span className="font-bold tracking-[0.2em] text-zinc-900">CLASSIFIED</span>
        <span className="ml-auto shrink-0 text-xs text-zinc-500 sm:text-sm">{dexLabel}</span>
      </>
    );
  }

  if (variant === 'card') {
    return (
      <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-zinc-900 text-white">
        <Lock className="h-7 w-7 text-yellow-400" aria-hidden="true" />
        <span className="text-sm font-bold tracking-[0.25em] text-yellow-400">CLASSIFIED</span>
        <span className="text-xs text-zinc-400">{dexLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-zinc-900 px-8 text-center text-white">
      <Lock className="h-10 w-10 text-yellow-400" aria-hidden="true" />
      <p className="text-3xl font-bold tracking-[0.25em] text-yellow-400">CLASSIFIED</p>
      <p className="text-sm text-zinc-300">열람이 제한된 자료입니다.</p>
      <p className="text-xs text-zinc-400">{dexLabel}</p>
    </div>
  );
}
