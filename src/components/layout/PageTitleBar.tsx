import type { ReactNode } from 'react';

export const PAGE_CONTAINER_CLASS = 'mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12';

interface Props {
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}

export function PageTitleBar({ title, meta, children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 pt-2">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {meta}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function PageTitleButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
    >
      {children}
    </button>
  );
}
