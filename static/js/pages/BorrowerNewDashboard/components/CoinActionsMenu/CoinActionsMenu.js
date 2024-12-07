import ReactGa from "react-ga";

import { coinPropType } from "types/coin";

import { Button } from "@material-ui/core";

import { Dialog, SelectAssetModal, WithdrawModal } from "components";
import { useModalState } from "hooks";

import { makeStyles } from "@material-ui/core/styles";
import { useCommonStyles } from "helpers/styles";
import clsx from "clsx";
import DetailMenu from "components/CoinInfo/DetailMenu";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 0,
    height: 36,
    width: 80,
    "&:disabled": {
      background: theme.palette.primary.light,
    },
  },
}));

const CoinsActionsMenu = ({ data, disabled }) => {
  const classes = useStyles();
  const commonStyle = useCommonStyles();
  const {
    isOpen: withdrawModalOpened,
    onOpen: handleWithdrawModalOpen,
    onClose: handleWithdrawModalClose,
  } = useModalState();
  const {
    isOpen: borrowModalOpened,
    onOpen: handleBorrowModalOpen,
    onClose: handleBorrowModalClose,
  } = useModalState();

  const handleWithdraw = () => {
    handleWithdrawModalOpen();

    ReactGa.event({
      category: "Borrower Dashboard",
      action: "Withdraw",
    });
  };

  const handleBorrow = () => {
    handleBorrowModalOpen();

    ReactGa.event({
      category: "Borrower Dashboard",
      action: "Borrow",
    });
  };

  return (
    <div className={commonStyle.actionButtonWrapper}>
      <Button
        className={clsx(classes.button, commonStyle.actionButton)}
        onClick={handleBorrow}
        disabled={disabled}
      >
        Borrow
      </Button>
      <Button
        className={clsx(classes.button, commonStyle.actionButton)}
        onClick={handleWithdraw}
        disabled={disabled}
      >
        Withdraw
      </Button>
      <DetailMenu
        address={data?.address}
        symbol={data.symbol}
        underlyingTokens={data.underlyingTokens}
      />

      <Dialog open={withdrawModalOpened} onClose={handleWithdrawModalClose} noPadding>
        <WithdrawModal data={data} onClose={handleWithdrawModalClose} />
      </Dialog>

      <SelectAssetModal open={borrowModalOpened} onClose={handleBorrowModalClose} data={data} />
    </div>
  );
};

CoinsActionsMenu.propTypes = {
  data: coinPropType.isRequired,
};

export default CoinsActionsMenu;
