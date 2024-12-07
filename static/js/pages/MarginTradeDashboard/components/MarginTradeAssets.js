import { useCallback, useMemo } from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { LeverageButton } from "components/Button/LeverageButton";
import { DepositModal, WithdrawModal } from "components";
import { useModalState } from "hooks";
import { useGetLongInfoAsset } from "pages/AmplifyDashboard/hook/useGetInfoAsset";
import ReactGa from "react-ga";
import { Dialog } from "components/Dialog";
import { LongAsset } from "./LongAsset";
import { ShortAsset } from "./ShortAsset";

const useStyles = makeStyles(() => ({
  ContentWrapper: {
    background: "#000",
  },
  TextTitle: {
    color: "#FFFFFF",
    fontSize: "18px",
    textAlign: "center",
    marginTop: "18px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  FlexPosition: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row-reverse",
    justifyContent: "center",
    "@media(min-width: 1200px)": {
      justifyContent: "space-between",
    },
  },
  DashBoardBox: {
    width: "90%",
    marginTop: "50px",
    "@media(min-width: 1200px)": {
      width: "30%",
      marginTop: 0,
    },
  },
  ChartBox: {
    width: "90%",
    "@media(min-width: 1200px)": {
      width: "68%",
    },
  },
  AssetWrapper: {
    background: "#212222",
    padding: "14px",
    borderRadius: "5px",
    justifyContent: "center",
  },
  AssetColumn: {
    padding: "0 5px",
  },
}));

export const MarginTradeAssets = () => {
  const classes = useStyles();
  const { isOpen: isOpenDeposit, onOpen: onOpenDeposit, onClose: onCloseDeposit } = useModalState();

  const {
    depositedAsset,
    symbol,
    balance,
    logo,
    name,
    allowance,
    address,
    healthFactor,
    decimal,
    prjRemaining,
    totalOutstanding,
  } = useGetLongInfoAsset();

  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useModalState();

  const handleOpenDeposit = useCallback(() => {
    onOpenDeposit();

    ReactGa.event({
      category: "Margin Trade Dashboard",
      action: "Deposit",
    });
  }, [onOpenDeposit]);

  const handleOpenWithdraw = useCallback(() => {
    onOpenWithdraw();

    ReactGa.event({
      category: "Margin Trade Dashboard",
      action: "Withdraw",
    });
  }, [onOpenWithdraw]);

  const depositModalData = useMemo(
    () => ({
      logo,
      name,
      balance,
      allowance,
      address,
      symbol,
      healthFactor,
      decimal,
    }),
    [address, allowance, balance, decimal, healthFactor, logo, name, symbol]
  );

  const withdrawModalData = useMemo(
    () => ({
      name,
      logo,
      allowance,
      address,
      symbol,
      healthFactor,
      prjAmount: depositedAsset,
      data: { prjRemaining, totalOutstanding },
    }),
    [
      address,
      allowance,
      depositedAsset,
      healthFactor,
      logo,
      name,
      prjRemaining,
      symbol,
      totalOutstanding,
    ]
  );

  const isActionDisabled = useMemo(() => !address || address?.length === 0, [address]);

  return (
    <>
      <Box className={classes.ContentWrapper}>
        <Grid container className={classes.AssetWrapper}>
          <Grid item sm={6} xs={12} className={classes.AssetColumn}>
            <LongAsset />
          </Grid>
          <Grid item sm={6} xs={12} className={classes.AssetColumn}>
            <ShortAsset />
          </Grid>
          <Grid container justifyContent="flex-start">
            <LeverageButton onClick={handleOpenDeposit} disabled={isActionDisabled}>
              Deposit
            </LeverageButton>
            <LeverageButton onClick={handleOpenWithdraw} disabled={isActionDisabled}>
              Withdraw
            </LeverageButton>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={isOpenDeposit} onClose={onCloseDeposit} noPadding>
        <DepositModal data={depositModalData} onClose={onCloseDeposit} />
      </Dialog>
      <Dialog open={isOpenWithdraw} onClose={onCloseWithdraw} noPadding>
        <WithdrawModal data={withdrawModalData} onClose={onCloseWithdraw} />
      </Dialog>
    </>
  );
};
