import { gql, useQuery as useClientQuery } from "@apollo/client";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import useWallet from "hooks/useWallet";
import { isMainNetWork } from "utils/network";

const GET_EXPOSURE_LIMIT = gql`
  query MarketHistory($skip: Int!, $startAt: BigInt!, $lendingToken: String, $limit: Int = 1000) {
    lenderAggregateCapitalDepositedHistories(
      first: $limit
      orderBy: date
      orderDirection: desc
      skip: $skip
      where: { lendingTokenAddress: $lendingToken, date_gte: $startAt }
    ) {
      amount
      date
      id
      lendingTokenAddress
    }
  }
`;

export const useGetExposureLimitMainNet = () => {
  const { shortAssetSelected } = useLeverageContext();
  const { chainId } = useWallet();

  const isMainNet = isMainNetWork(chainId);
  const handleGetLastValue = (data) => {
    if (data) {
      const objectValueTab = {};
      Object.entries(data).forEach((e) => {
        const arrayItem = data[e[0]];
        // eslint-disable-next-line prefer-destructuring
        objectValueTab[e[0]] = arrayItem[0];
      });
      return objectValueTab;
    }
    return [];
  };

  const { data, loading } = useClientQuery(GET_EXPOSURE_LIMIT, {
    variables: {
      lendingToken: shortAssetSelected?.address,
      skip: 0,
      startAt: 0,
    },
    skip: !isMainNet || !shortAssetSelected?.address,
  });

  const lastestData = handleGetLastValue(data);

  return loading || !data ? 0 : lastestData?.lenderAggregateCapitalDepositedHistories?.amount;
};
