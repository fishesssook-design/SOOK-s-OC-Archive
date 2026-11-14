import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';

export function LogoutButton() {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    await signOut();
  };

  return (
    <button
      type="button"
      aria-label="로그아웃"
      title="로그아웃"
      onClick={handleClick}
      disabled={busy}
      className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
