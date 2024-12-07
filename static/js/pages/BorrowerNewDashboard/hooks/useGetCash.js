import { Contract } from "ethers";
import { useWallet } from "hooks";
import { useQuery } from "react-query";
import { FTokenABI } from "utils/ethereum/abi";

export const useGetCash = (fTokenAddress) => {
  const { provider } = useWallet();

  const query = useQuery(["get-cash", fTokenAddress], async () => {
    if (!fTokenAddress) return "0";

    const contract = new Contract(fTokenAddress, FTokenABI, provider);

    const cash = await contract.getCash();

    return cash;
  });

  return query;
};
