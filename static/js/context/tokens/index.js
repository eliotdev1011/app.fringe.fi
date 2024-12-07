import { useUserTokenInfo } from "hooks/contract/useUserTokenInfo";

import { BorrowTokenContext } from "./BorrowTokenContext";

export const TokenProvider = ({ children }) => {
  const data = useUserTokenInfo();

  return <BorrowTokenContext.Provider value={data}>{children}</BorrowTokenContext.Provider>;
};
