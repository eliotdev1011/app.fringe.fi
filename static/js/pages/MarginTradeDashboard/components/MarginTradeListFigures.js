import { LeverageType } from "constants/leverageType";
import { ListFigures } from "components/Leveraged/ListFigures";
import numeral from "numeral";
import { useMemo } from "react";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { get } from "lodash";
import BigNumber from "bignumber.js";

const DEFAULT_LEVERAGE_INFO = [
  {
    label: "Trade Leverage",
    value: "N/A",
    max: "N/A",
    helpText: "Trade Leverage = (Margin + Exposure) / Margin",
  },
  {
    label: "Liquidation Price",
    value: "N/A",
    helpText:
      "Price of long asset / short asset that will result in the position becoming liquidatable.",
  },
  {
    label: "Interest Rate",
    value: "N/A",
    helpText: "Interest rate charged for the borrowed (short) capital asset.",
  },
  {
    label: "Est days to liquidation",
    value: "N/A",
    helpText:
      "Indicates the days until this position will enter a state of being subject to liquidation through accrual of interest charges, all other things being the same.",
  },
];

export const MarginTradeListFigures = () => {
  const {
    longAssetSelected,
    shortAssetSelected,
    estDayLiquidation,
    safeBuffer,
    amplification: [amplification],
  } = useLeverageContext();

  const listLeverageInfo = useMemo(() => {
    if (!longAssetSelected) {
      return DEFAULT_LEVERAGE_INFO;
    }

    const longAssetPrice = get(longAssetSelected, "price", 1);

    const tradeLeverage = amplification;

    const liqPrice = new BigNumber(longAssetPrice)
      .multipliedBy(new BigNumber(1).minus(safeBuffer))
      .toString();

    const borrowApy = get(shortAssetSelected, "borrowApy", 0);

    return [
      {
        label: "Trade Leverage",
        value: `${numeral(Number.isNaN(tradeLeverage) ? 0 : tradeLeverage).format("[0,0].[00]")}x`,
        helpText: "(Margin + Exposure) / Margin",
        name: "tradeLeverage",
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
  }, [longAssetSelected, amplification, safeBuffer, shortAssetSelected, estDayLiquidation]);

  return <ListFigures listValue={listLeverageInfo} leverageType={LeverageType.MARGIN_TRADE} />;
};
