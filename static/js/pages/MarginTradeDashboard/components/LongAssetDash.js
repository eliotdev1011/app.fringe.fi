import { Box, Grid, makeStyles } from "@material-ui/core";
import { NumericText } from "components";
import { IconInfo } from "components/Leveraged/IconInfo";
import { Text } from "components/Title/Text";
import { useCommonStyles } from "helpers/styles";
import { useGetLongInfoAsset } from "pages/AmplifyDashboard/hook/useGetInfoAsset";

const useStyles = makeStyles(() => ({
  text: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: 500,
    marginBottom: "20px",
  },
  alignCenterBox: {
    display: "flex",
    alignItems: "center",
  },
  iconBox: {
    transform: "translateX(5px)",
    display: "flex",
    alignItems: "center",
  },
  rowStyle: {
    flexWrap: "wrap",
    marginTop: "10px",
  },
}));
export const LongAssetDash = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { price, depositedAsset, balanceUSD, symbol, depositedAssetUSD, balance } =
    useGetLongInfoAsset();

  return (
    <Box marginBottom={2} className={classes.text}>
      <Grid container className={classes.rowStyle}>
        <Grid item xs={12}>
          <Box display="flex" gridGap={2}>
            <Text>Price</Text>
            <IconInfo title="Current price of the collateral asset." />
          </Box>
        </Grid>
        <Grid item xs={12}>
          ${Number(price).toFixed(2)}
        </Grid>
      </Grid>
      <Grid container display="flex" className={classes.rowStyle}>
        <Grid item xs={12}>
          <Box display="flex" gridGap={2}>
            <Text>Deposited</Text>
            <IconInfo title="Shows any collateral already deposited for the selected collateral asset. And also shows any balance in your external wallet for the selected collateral asset." />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <NumericText value={depositedAsset} suffix={symbol} precision={4} />
        </Grid>
        <Grid item xs={12} className={commonClasses.dollarText}>
          <NumericText value={depositedAssetUSD} precision={2} moneyValue />
        </Grid>
      </Grid>
      <Grid container display="flex" className={classes.rowStyle}>
        <Grid item xs={12}>
          <Box display="flex" gridGap={2}>
            <Text>Wallet Balance</Text>
            <IconInfo title="Shows any collateral already deposited for the selected collateral asset. And also shows any balance in your external wallet for the selected collateral asset." />
          </Box>
        </Grid>
        <Grid item className={classes.alignCenterBox} xs={12}>
          <NumericText value={balance} suffix={symbol} precision={4} />
        </Grid>
        <Grid item xs={12} className={commonClasses.dollarText}>
          <NumericText value={balanceUSD} precision={2} moneyValue />
        </Grid>
      </Grid>
    </Box>
  );
};
