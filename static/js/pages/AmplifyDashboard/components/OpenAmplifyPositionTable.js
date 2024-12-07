import { OpenPositionTable } from "components/OpenPositionTable/OpenPositionTable";
import { LeverageType } from "constants/leverageType";
import { useLeveragePositionData } from "hooks/leverage/useLeveragePositionData";
import { columns } from "pages/AmplifyDashboard/data/dataTable";

export const OpenAmplifyPositionTable = () => {
  const positionData = useLeveragePositionData(LeverageType.AMPLIFY);

  return <OpenPositionTable data={positionData} columns={columns} />;
};
