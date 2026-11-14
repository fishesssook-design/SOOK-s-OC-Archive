import { useState, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { signInWithSharedPassword } from '@/lib/auth';

export function LoginScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password || submitting) return;

    setSubmitting(true);
    setError('');
    const ok = await signInWithSharedPassword(password);
    setSubmitting(false);

    if (!ok) {
      setError('비밀번호가 틀렸어요');
      setPassword('');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-zinc-900">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold">숙의 자캐도감</h1>
          <p className="text-sm text-zinc-500">비밀번호를 입력해 주세요.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="site-password" className="sr-only">
            비밀번호
          </label>
          <input
            id="site-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-lg border border-zinc-300 px-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/60"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!password || submitting}
          className="h-11 w-full rounded-lg bg-yellow-400 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '확인 중...' : '입장하기'}
        </button>
      </form>
    </main>
  );
}
