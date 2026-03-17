import { useContext } from "react";

import { LoginUserContext } from "../providers/LoginUserProvider";
import type { LoginUserContextType } from "../providers/LoginUserProvider";

export const useLoginUser = (): LoginUserContextType => {
  const context = useContext(LoginUserContext);
  console.log('useLoginUserの中の情報です')
  console.log("context:", context)
  if (context === undefined) {
    throw new Error("useLoginUserはLoginUserProviderの中で使ってください");
  }
  return context;
};
