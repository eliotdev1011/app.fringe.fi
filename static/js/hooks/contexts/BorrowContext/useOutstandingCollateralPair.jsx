import { get } from "lodash";
import { useBorrowContext } from "context/contracts/BorrowContext";

const useOutstandingCollateral = () => {
  const context = useBorrowContext();

  const outstanding = get(context, "totalOutstandingAssets", {});

  return outstanding;
};

export default useOutstandingCollateral;
