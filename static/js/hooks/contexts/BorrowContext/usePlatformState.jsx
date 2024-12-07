import BigNumber from "bignumber.js";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { formatUnits } from "utils/number";
import useDecimalToken from "hooks/contexts/BorrowContext/useDecimalToken";
import useOutstandingCollateral from "hooks/contexts/BorrowContext/useOutstandingCollateralPair";
import usePriceLendingToken from "hooks/contexts/LendingAssetContext/usePriceLendingToken";
import { get, map } from "lodash";
import { useMemo } from "react";
import { TokenType } from "types/token";

export const usePlatformState = () => {
  const context = useBorrowContext();
  const lendingTokenPrice = usePriceLendingToken();
  const outstandingAll = useOutstandingCollateral();

  const decimalToken = useDecimalToken();

  const [totalOutstandingUsdSummary, totalAccrualUsdSummary] = useMemo(() => {
    const totalOutstandingUsd = Object.values(outstandingAll).reduce((sum, val) => {
      const lendingToken = get(val, "lendingToken");
      const outstanding = get(val, "value", 0);
      const valueInNatural = formatUnits(outstanding, decimalToken[lendingToken]);
      const valueUsd = new BigNumber(valueInNatural).multipliedBy(lendingTokenPrice[lendingToken]);
      return new BigNumber(sum).plus(valueUsd).toString();
    }, "0");
    const totalAccrualUsd = Object.values(outstandingAll).reduce((sum, val) => {
      const lendingToken = get(val, "lendingToken");
      const outstanding = get(val, "value", 0);
      const loanBody = get(val, "loanBody", 0);
      const accrual = new BigNumber(outstanding).minus(loanBody).toString();
      const valueInNatural = formatUnits(accrual, decimalToken[lendingToken]);
      const valueUsd = new BigNumber(valueInNatural).multipliedBy(lendingTokenPrice[lendingToken]);
      return new BigNumber(sum).plus(valueUsd).toString();
    }, "0");

    return [totalOutstandingUsd, totalAccrualUsd];
  }, [lendingTokenPrice, outstandingAll, decimalToken]);

  const [decimalOfContractToken, depositedAmount, priceOfTokens, isLoading] = useMemo(
    () => [
      get(context, "decimalOfContractToken", {}),
      get(context, "depositedAssets", {}),
      get(context, "priceOfTokens", {}),
      get(context, "isLoading"),
    ],
    [context]
  );

  const total = useMemo(
    () =>
      map(depositedAmount, ({ value }, address) => {
        const decimal = get(decimalOfContractToken, address, 0);
        const price = get(priceOfTokens, address, TokenType.LENDING, 0);
        return +formatUnits(value, decimal) * price?.collateral;
      }).reduce((sum, val) => sum + val, 0),
    [depositedAmount, decimalOfContractToken, priceOfTokens]
  );

  return {
    isLoading,
    totalDepositedInUsd: total,
    tokenIssued: 0,
    totalOutstandingUsd: totalOutstandingUsdSummary,
    totalAccrualUsd: totalAccrualUsdSummary,
  };
};
