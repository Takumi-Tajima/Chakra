import { createContext, useState } from 'react';

import type { User } from '../types/api/user';

export type LoginUserContextType = {
  LoginUser: User | null
  setLoginUser: (user: User) => void
}

export const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);

export const LoginUserProvider = (props: { children: React.ReactNode }) => {
  const { children } = props
  const [LoginUser, setLoginUser] = useState<User | null>(null);

  return (
    <LoginUserContext.Provider value={{ LoginUser, setLoginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};
