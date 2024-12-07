import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { USD_DECIMAL } from "constants/contract";
import { formatUnits } from "utils/number";
import useAllBorrowData from "hooks/contexts/BorrowContext/useAllBorrowData";
import { sumBy } from "lodash";

export const useDepositedAssetStates = () => {
  const { collateralList, lendingTokensObj } = useAllBorrowData();

  const depositedCollateralList = useMemo(
    () =>
      collateralList
        .filter((o) => o.depositedAmount > 0)
        .map((token) => {
          const {
            depositedAmount,
            price,
            lvr,
            lendingToken,
            decimal,
            healthFactor,
            pitRemaining,
            pitCollateral,
            loanBody,
            accrual,
            accrualBN,
            outstanding,
            outstandingBN,
            pitRemainingBN,
            ...item
          } = token;
          const prjRemainingBN = new BigNumber(pitRemainingBN)
            .div(lvr ?? 1)
            .div(price ?? 1)
            .dividedToIntegerBy(1)
            .toString();
          const prjRemaining = formatUnits(prjRemainingBN, USD_DECIMAL);
          const tokenIssued = lvr * depositedAmount;
          const issuedInUsd = price * lvr * depositedAmount;

          return {
            ...item,
            issuedInUsd,
            tokenIssued,
            healthFactor: +healthFactor,
            prjAmount: depositedAmount,
            lendingToken: lendingTokensObj[lendingToken]?.[0],
            data: {
              lendingAsset: lendingTokensObj[lendingToken]?.[0]?.symbol,
              collateralBalance: [
                depositedAmount,
                token?.symbol,
                { rounded: depositedAmount * price },
              ],
              price,
              lvr: { decimal: lvr },
              currentBorrowingLevel: null,
              pitRemaining: {
                decimal: pitRemaining,
                rounded: pitRemaining,
              },
              pitCollateral: {
                decimal: +pitCollateral,
                rounded: +pitCollateral,
              },
              loanBalance: loanBody,
              loanBalanceRaw: token.loanBodyBN,
              accrual: {
                decimal: accrual,
                rounded: accrual,
                rawBN: accrualBN,
              },
              totalOutstanding: {
                decimal: outstanding,
                rawBN: outstandingBN,
              },
              prjRemaining: {
                decimal: prjRemaining,
                rounded: prjRemaining,
                BN: prjRemainingBN,
              },
            },
          };
        }),
    [collateralList, lendingTokensObj]
  );

  return [depositedCollateralList, sumBy(depositedCollateralList, "issuedInUsd")];
};
