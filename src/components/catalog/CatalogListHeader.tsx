import type { SortKey, ViewMode } from '@/lib/catalogQuery';
import { SortSelect } from '@/components/catalog/SortSelect';
import { ViewToggle } from '@/components/catalog/ViewToggle';

interface Props {
  count: number | null;
  sort: SortKey;
  view: ViewMode;
  onSortChange: (sort: SortKey) => void;
  onViewChange: (view: ViewMode) => void;
}

export function CatalogListHeader({ count, sort, view, onSortChange, onViewChange }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 pt-2">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">캐릭터 목록</h1>
        {count !== null && <span className="text-sm text-zinc-500">총 {count}명</span>}
      </div>
      <div className="flex items-center gap-3">
        <SortSelect value={sort} onChange={onSortChange} />
        <ViewToggle value={view} onChange={onViewChange} />
      </div>
    </div>
  );
}
