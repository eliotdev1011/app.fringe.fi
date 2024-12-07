import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "@material-ui/core";
import { NumericText } from "components";
import { useLenderContext } from "pages/MultiAssetDashboard/providers/lenderContext";
import { get, sumBy } from "lodash";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { FTokenMethod } from "constants/methodName";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 16,
    fontFamily: "Mulish",
    lineHeight: "21px",
    color: "#434849",
  },
  subTitle: {
    fontSize: 26,
    fontFamily: "Mulish",
    lineHeight: "36px",
    color: "#AFB0B1",

    marginTop: theme.spacing(2),
  },
  divider: {
    backgroundColor: "#434849",
    marginLeft: 20,
    marginRight: 20,

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: 20,
    "& > .MuiGrid-item": {
      paddingTop: 0,
      paddingBottom: 0,
    },

    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
  price: {
    fontSize: 52,
    fontFamily: "Mulish",
    marginTop: theme.spacing(1),
    lineHeight: "64px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 32,
    },
  },
  priceTitle: {
    fontFamily: "Mulish",

    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
}));

const LenderOverview = () => {
  const { userFToken } = useLenderContext();

  const totalValue = useMemo(
    () =>
      sumBy(userFToken, (o) => {
        const priceLendingToken = get(o, "priceInfo.price", "0");
        const balanceOfUnderlyingView = get(o, FTokenMethod.balanceOfUnderlyingView, "0");
        return new BigNumber(balanceOfUnderlyingView).multipliedBy(priceLendingToken).toNumber();
      }),
    [userFToken]
  );

  const classes = useStyles();
  const { isConnected } = useAccount();

  return (
    <Grid item container spacing={6} sx={12} className={classes.container}>
      <Grid item>
        <Tooltip title="Total value of all your deposited capital assets." arrow placement="top">
          <Typography color="secondary" variant="h6" className={classes.priceTitle}>
            Deposited Total Value
          </Typography>
        </Tooltip>
        <Typography color="secondary" className={classes.price}>
          <NumericText value={isConnected ? totalValue : 0} moneyValue />
        </Typography>
      </Grid>

      <Divider orientation="vertical" flexItem className={classes.divider} />
    </Grid>
  );
};

export default LenderOverview;
