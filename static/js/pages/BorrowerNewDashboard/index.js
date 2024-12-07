import { BorrowContextProvider } from "context/contracts/BorrowContextProvider";
import { withWalletLoader } from "HOCFunction";
import Dashboard from "./BorrowerDashboard";

const BorrowerDashboard = () => (
  <BorrowContextProvider>
    <Dashboard />
  </BorrowContextProvider>
);

export const BorrowerNewDashboard = withWalletLoader(BorrowerDashboard);
export default BorrowerNewDashboard;
