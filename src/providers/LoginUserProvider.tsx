import { createContext, useState } from 'react';

import type { User } from '../types/api/user';

export type LoginUserContextType = {
  LoginUser: (User & { isAdmin: boolean }) | null
  setLoginUser: (user: User & { isAdmin: boolean }) => void
}

export const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);

export const LoginUserProvider = (props: { children: React.ReactNode }) => {
  const { children } = props
  const [LoginUser, setLoginUser] = useState<(User & { isAdmin: boolean }) | null>(null);

  return (
    <LoginUserContext.Provider value={{ LoginUser, setLoginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};
