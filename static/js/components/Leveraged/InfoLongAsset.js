import { Grid, Box, makeStyles } from "@material-ui/core";
import { useGetLongInfoAsset } from "pages/AmplifyDashboard/hook/useGetInfoAsset";
import { LeverageButton } from "components/Button/LeverageButton";
import { Dialog } from "components/Dialog";
import { DepositModal } from "components/DepositModal";
import { useModalState } from "hooks";
import ReactGa from "react-ga";
import { useCallback, useMemo } from "react";
import { WithdrawModal } from "components/WithdrawModal";
import { AssetInfoRow } from "./AssetInfoRow";

const useStyles = makeStyles(() => ({
  infoBox: {
    marginTop: "20px",
  },
  buttonRow: {
    marginTop: "16px",
  },
}));

export const InfoLongAsset = () => {
  const classes = useStyles();
  const { isOpen: isOpenDeposit, onOpen: onOpenDeposit, onClose: onCloseDeposit } = useModalState();
  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useModalState();
  const {
    price,
    depositedAsset,
    balanceUSD,
    symbol,
    depositedAssetUSD,
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

  const handleOpenDeposit = useCallback(() => {
    onOpenDeposit();

    ReactGa.event({
      category: "Amplify Dashboard",
      action: "Deposit",
    });
  }, [onOpenDeposit]);

  const handleOpenWithdraw = useCallback(() => {
    onOpenWithdraw();

    ReactGa.event({
      category: "Amplify Dashboard",
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
      <Box className={classes.infoBox}>
        <AssetInfoRow
          label="Price"
          valueUSD={address ? price : "N/A"}
          tooltipTitle="Current market price of the selected collateral asset."
        />

        <AssetInfoRow
          label="Deposited"
          valueUSD={address ? depositedAssetUSD : "N/A"}
          symbol={symbol}
          value={address ? depositedAsset : 0}
          tooltipTitle="Shows any collateral already deposited for the selected collateral asset. And also shows any balance in your external wallet for the selected collateral asset."
        />
        <AssetInfoRow
          label="Wallet Balance"
          valueUSD={address ? balanceUSD : "N/A"}
          value={address ? balance : ""}
          symbol={symbol}
          tooltipTitle="Shows any collateral already deposited for the selected collateral asset. And also shows any balance in your external wallet for the selected collateral asset."
        />
        <Grid container justifyContent="center" className={classes.buttonRow}>
          <Grid item md={6} sm={3} xs={6}>
            <LeverageButton onClick={handleOpenDeposit} disabled={isActionDisabled}>
              Deposit
            </LeverageButton>
          </Grid>
          <Grid item md={6} sm={3} xs={6}>
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
