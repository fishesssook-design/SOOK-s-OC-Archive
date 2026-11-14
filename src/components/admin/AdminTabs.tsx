import { navigate } from '@/lib/navigation';

interface Props {
  active: 'settings' | 'characters';
}

const TABS = [
  { key: 'settings', label: '사이트 설정', path: '/admin' },
  { key: 'characters', label: '캐릭터 관리', path: '/admin/characters' },
] as const;

export function AdminTabs({ active }: Props) {
  return (
    <nav aria-label="관리자 메뉴" className="mb-8 flex gap-2 border-b border-zinc-200">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <a
            key={tab.key}
            href={tab.path}
            aria-current={isActive ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigate(tab.path);
            }}
            className={`-mb-px border-b-2 px-3 pb-3 text-sm font-semibold transition ${
              isActive
                ? 'border-yellow-400 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
