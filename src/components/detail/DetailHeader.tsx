import type { ReactNode } from 'react';

interface Props {
  title: string;
  dexNumber: number;
  children?: ReactNode;
}

export function DetailHeader({ title, dexNumber, children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 pt-2">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold text-zinc-400 sm:text-3xl">{title}</h1>
        <span className="text-xs font-semibold text-zinc-400">No. {String(dexNumber).padStart(3, '0')}</span>
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

export function DetailHeaderButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
    >
      {children}
    </button>
  );
}
