import { supabase } from '@/lib/supabase';

const ACCOUNTS = [
  { label: 'viewer', email: 'tom9sook@gmail.com' },
  { label: 'admin', email: 'sookpje@gmail.com' },
];

export async function signInWithSharedPassword(password: string): Promise<boolean> {
  for (const { label, email } of ACCOUNTS) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) return true;

    console.error(`[auth] ${label} sign-in failed:`, error.status, error.code, error.message);
  }

  return false;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
