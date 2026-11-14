import { useEffect, useState } from 'react';
import { fetchIsAdmin } from '@/lib/admin';

export function useAdminStatus(userId: string): boolean | undefined {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let active = true;

    fetchIsAdmin(userId)
      .then((result) => {
        if (active) setIsAdmin(result);
      })
      .catch((err: unknown) => {
        console.error('[admin] could not check admin status:', err);
        if (active) setIsAdmin(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
