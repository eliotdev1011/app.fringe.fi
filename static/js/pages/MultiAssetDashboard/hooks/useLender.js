import BigNumber from "bignumber.js";
import { useLendingAssetContext } from "context/tokens/BorrowTokenContext";
import { ERC20TokenMethod, FTokenMethod } from "constants/methodName";
import { formatUnits } from "utils/number";
import { useWallet } from "hooks";
import { useFetchGraphData } from "hooks/query/graphQL/useFetchGraphData";
import { useMultiCallContract } from "hooks/contract/multicall/useMultiCallContract";
import { get, isEmpty, map } from "lodash";
import { useQuery } from "react-query";
import { bUSDCContractABI, ERC20TokenABI } from "utils/ethereum/abi";
import * as ethers from "ethers";
import { generateMulticallRequest } from "utils/contract/multicall";

export const useUserFToken = () => {
  const tokenInfo = useLendingAssetContext();

  const { isLoading, availableBorrowTokens, APY } = useFetchGraphData();
  const { account, chainId, provider } = useWallet();

  const { callRequest } = useMultiCallContract();

  return useQuery(
    ["#User-F-Token-Balance-lending", account, chainId],
    async () => {
      const tokenData = await tokenInfo.refetch();

      const fTokens = [...get(tokenData, ["data", "fTokens"], [])];
      const lendingTokens = [...get(tokenData, ["data", "balanceOfLendingToken"], [])];

      const handleGetFTokenInfo = async () => {
        const listRequest = [];

        fTokens.forEach((o) => {
          const LendingTokenContract = new ethers.Contract(o.lendingToken, ERC20TokenABI, provider);
          const FTokenContract = new ethers.Contract(o.ftoken, bUSDCContractABI, provider);

          listRequest.push(
            generateMulticallRequest(
              LendingTokenContract,
              ERC20TokenMethod.allowance,
              [account, o.ftoken],
              LendingTokenContract.address,
              LendingTokenContract.address
            ),
            generateMulticallRequest(
              FTokenContract,
              FTokenMethod.decimals,
              [],
              FTokenContract.address,
              FTokenContract.address
            ),
            generateMulticallRequest(
              FTokenContract,
              FTokenMethod.balanceOfUnderlyingView,
              [account],
              FTokenContract.address,
              FTokenContract.address
            ),
            generateMulticallRequest(
              FTokenContract,
              FTokenMethod.balanceOf,
              [account],
              FTokenContract.address,
              FTokenContract.address
            ),
            generateMulticallRequest(
              FTokenContract,
              FTokenMethod.supplyRatePerBlock,
              [],
              FTokenContract.address,
              FTokenContract.address
            )
          );
        });

        const results = await callRequest(listRequest);

        const mapData = map(fTokens, (o) => {
          const val = get(results, [o.ftoken]);
          const allowance = get(results, [o.lendingToken, 0, "returnValues", 0], 0);

          const valReturnContext = val;

          const returnValues = valReturnContext.reduce(
            (pre, rv) => ({
              ...pre,
              [get(rv, "methodName", "")]: formatUnits(get(rv, ["returnValues", 0], 0), 0),
            }),
            {}
          );

          const lendingToken = lendingTokens.find((token) => token.token === o.lendingToken);
          return {
            ...returnValues,
            ...o,
            [FTokenMethod.balanceOf]: formatUnits(
              returnValues[FTokenMethod.balanceOf] || 0,
              lendingToken?.decimal || 0
            ),
            [FTokenMethod.balanceOfUnderlyingView]: formatUnits(
              returnValues[FTokenMethod.balanceOfUnderlyingView] || 0,
              lendingToken?.decimal || 0
            ),
            apy:
              [...get(APY, "lender_apy", [])].find((x) => x.lendingTokenAddress === o.lendingToken)
                ?.amount || 0,
            allowance: !new BigNumber(allowance).isZero(),
            allowanceAmount: ethers.BigNumber.from(allowance),
          };
        });
        return mapData;
      };

      const fWallet = await handleGetFTokenInfo();

      return {
        fWallet: fWallet.map((f) => ({
          ...f,
          ...lendingTokens.find((token) => token.token === f.lendingToken),
        })),
      };
    },
    {
      enabled:
        !tokenInfo.isLoading &&
        !!tokenInfo.data &&
        !isLoading &&
        !isEmpty(availableBorrowTokens) &&
        !isEmpty(account),
    }
  );
};
