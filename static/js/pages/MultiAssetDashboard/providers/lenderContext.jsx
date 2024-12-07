import { get } from "lodash";
import { useWallet } from "hooks";
import { createContext, useContext } from "react";
import { useUserFToken } from "../hooks/useLender";

const lenderContext = createContext(null);

export const LenderContextProvider = ({ children }) => {
  const userFToken = useUserFToken();

  const { isError, isLoading } = userFToken;

  const { account } = useWallet();

  return (
    <lenderContext.Provider
      value={{
        userFToken: get(userFToken, "data.fWallet", []),
        refetch: get(userFToken, "refetch", () => {}),
        isError,
        isLoading: (account && !userFToken.isFetched) || isLoading,
      }}
    >
      {children}
    </lenderContext.Provider>
  );
};

export const useLenderContext = () => useContext(lenderContext);
