import { createContext, useContext } from 'react';

export const AdminContext = createContext(false);

export function useIsAdmin(): boolean {
  return useContext(AdminContext);
}
