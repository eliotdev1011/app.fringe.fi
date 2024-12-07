import { LeverageType } from "constants/leverageType";
import { columnsMarginTrade } from "pages/MarginTradeDashboard/components/data/dataTable";
import { useLeveragePositionData } from "hooks/leverage/useLeveragePositionData";
import { OpenPositionTable } from "../../../components/OpenPositionTable/OpenPositionTable";

export const OpenMarginPositionTable = () => {
  const positionData = useLeveragePositionData(LeverageType.MARGIN_TRADE);

  return <OpenPositionTable data={positionData} columns={columnsMarginTrade} />;
};
