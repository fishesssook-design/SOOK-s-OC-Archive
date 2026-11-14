interface Props {
  message: string;
  action?: { label: string; onClick: () => void };
}

export function StatusMessage({ message, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-sm text-zinc-500">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
