import { Search, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { navigate } from '@/lib/navigation';

interface Props {
  title: string;
  isAdmin: boolean;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
}

const ICON_BUTTON_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900';

export function SiteHeader({ title, isAdmin, onOpenSearch, onOpenAdmin }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate('/');
          }}
          className="group -ml-1 flex min-w-0 items-center gap-2"
        >
          <span
            aria-hidden="true"
            className="relative -top-0.5 inline-block shrink-0 text-[25px] leading-none transition duration-300 ease-out group-hover:scale-110"
          >
            💛
          </span>
          <span className="truncate text-lg font-bold tracking-tight">{title}</span>
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="상세 검색 열기" onClick={onOpenSearch} className={ICON_BUTTON_CLASS}>
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          {isAdmin && (
            <button type="button" aria-label="관리자 모드" onClick={onOpenAdmin} className={ICON_BUTTON_CLASS}>
              <Settings className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
