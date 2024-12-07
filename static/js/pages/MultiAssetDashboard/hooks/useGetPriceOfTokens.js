import { useWallet } from "hooks";
import { usePriceContract } from "hooks/contract/core/usePriceContract";
import { useMultiCallContract } from "hooks/contract/multicall/useMultiCallContract";
import { useQuery } from "react-query";
import { formatUnits } from "utils/number";
import { TokenType } from "types/token";
import { useGetTokens } from "../../BorrowerNewDashboard/hooks/useTokenSupported";

const { ContractName } = require("constants/contractName");
const { PriceContractMethod } = require("constants/methodName");
const { generateMulticallRequest } = require("utils/contract/multicall");
const { getDataToUpdatePrice } = require("utils/ethereum/getDataToUpdatePrice");
const { handleGetPriceInUsd } = require("../../BorrowerNewDashboard/hooks/helper/getDataContract");

const useGetPriceOfTokens = () => {
  const { loading, projectTokenList: collaterals, availableBorrowTokens } = useGetTokens();
  const { chainId, account } = useWallet();

  const { callRequest } = useMultiCallContract();

  const { PriceContract } = usePriceContract();

  const collateralKeys = collaterals
    .map((c) => c.address)
    .sort()
    .join(",");
  return useQuery(
    ["price-of-tokens", account, collateralKeys, chainId],
    async () => {
      const requests = [];
      const listToken = [...collaterals];

      const tokensNeedToUpdatePrice = Array.from(
        new Set([...availableBorrowTokens, ...listToken].map((token) => token.address))
      );
      const { priceIds, updateData, payableAmount } = await getDataToUpdatePrice(
        tokensNeedToUpdatePrice,
        PriceContract
      );

      for (let idx = 0; idx < listToken.length; idx += 1) {
        const token = listToken[idx];

        requests.push(
          generateMulticallRequest(
            PriceContract,
            PriceContractMethod.getUpdatedPriceMethod,
            [token.address, priceIds, updateData],
            token.address,
            ContractName.PriceContract,
            payableAmount
          )
        );
      }
      for (let idx = 0; idx < availableBorrowTokens.length; idx += 1) {
        const token = listToken[idx];

        requests.push(
          generateMulticallRequest(
            PriceContract,
            PriceContractMethod.getUpdatedPriceMethod,
            [token.address, priceIds, updateData],
            token.address,
            ContractName.PriceContract,
            payableAmount
          )
        );
      }

      const results = await callRequest(requests);

      const priceOfTokens = [...listToken, ...availableBorrowTokens].reduce((res, o) => {
        const { priceCollateralTokenBN, priceLendingTokenBN, priceDecimal } = handleGetPriceInUsd(
          results,
          o.address
        );

        return {
          ...res,
          [o.address]: {
            [TokenType.COLLATERAL]: formatUnits(priceCollateralTokenBN, priceDecimal),
            [TokenType.LENDING]: formatUnits(priceLendingTokenBN, priceDecimal),
          },
        };
      }, {});

      return priceOfTokens;
    },
    {
      retry: 3,
      enabled:
        !!PriceContract &&
        !loading &&
        !!account &&
        !!collaterals?.length &&
        !!availableBorrowTokens?.length &&
        !!chainId,
    }
  );
};

export default useGetPriceOfTokens;
