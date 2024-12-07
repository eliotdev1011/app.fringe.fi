import { LeverageType } from "constants/leverageType";
import BigNumber from "bignumber.js";
import { get } from "lodash";
import numeral from "numeral";
import { useMemo } from "react";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { ListFigures } from "components/Leveraged/ListFigures";
import { useGetLVR } from "hooks/pit/useGetLVR";

const DEFAULT_LEVERAGE_INFO = [
  {
    label: "Safety Buffer",
    value: "N/A",
    helpText: "Percent fall in collateral value before the position is subject to liquidation.",
    name: "safeBuffer",
  },
  {
    label: "Liquidation Price",
    value: "N/A",
    helpText: "Price of the collateral that will result in the position being liquidatable.",
  },
  {
    label: "Interest Rate",
    value: "N/A",
    helpText: "Interest rate charged for the borrowed (short) capital asset.",
  },
  {
    label: "Est Days To Liquidation",
    value: "N/A",
    helpText:
      "Indicates the days until this position will enter a state of being subject to liquidation through accrual of interest charges, all other things being the same",
  },
];

export const AmplifyListFigures = () => {
  const { safeBuffer, longAssetSelected, shortAssetSelected, estDayLiquidation } =
    useLeverageContext();

  const lvr = useGetLVR(longAssetSelected?.address, shortAssetSelected?.address);

  const listLeverageInfo = useMemo(() => {
    if (!longAssetSelected || !lvr) {
      return DEFAULT_LEVERAGE_INFO;
    }

    const safeBufferPercent = numeral(safeBuffer || 0).format("0.000%");
    const longAssetPrice = get(longAssetSelected, "price", 1);

    const liqPrice = new BigNumber(longAssetPrice)
      .multipliedBy(new BigNumber(1).minus(safeBuffer))
      .toString();

    const borrowApy = get(shortAssetSelected, "borrowApy", 0);

    return [
      {
        label: "Safety Buffer",
        value: safeBufferPercent,
        helpText: "Percent fall in collateral value before the position is subject to liquidation.",
        name: "safeBuffer",
      },
      {
        label: "Liquidation Price",
        value: `${numeral(Number.isNaN(+liqPrice) ? 0 : liqPrice).format("[0,0].[00]")}`,
        helpText: "Price of the collateral that will result in the position being liquidatable.",
      },
      {
        label: "Interest Rate",
        value: numeral(borrowApy).format("[0,0].[0000]%"),
        helpText: "Interest rate charged for the borrowed (short) capital asset.",
      },
      {
        label: "Est Days To Liquidation",
        value: `${numeral(Number.isNaN(+estDayLiquidation) ? 0 : estDayLiquidation).format(
          "0,000"
        )} Days`,
        helpText:
          "Indicates the days until this position will enter a state of being subject to liquidation through accrual of interest charges, all other things being the same",
      },
    ];
  }, [estDayLiquidation, longAssetSelected, lvr, safeBuffer, shortAssetSelected]);

  return <ListFigures listValue={listLeverageInfo} leverageType={LeverageType.AMPLIFY} />;
};
