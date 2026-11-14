interface Props {
  label: string;
}

export function KeywordChip({ label }: Props) {
  return (
    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
      {label}
    </span>
  );
}
