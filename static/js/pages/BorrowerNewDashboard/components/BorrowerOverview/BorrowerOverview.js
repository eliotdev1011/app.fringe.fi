import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Tooltip } from "@material-ui/core";
import { NumericText } from "components";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { formatUnits } from "utils/number";
import { useWallet } from "hooks";
import { usePlatformState } from "hooks/contexts/BorrowContext/usePlatformState";
import { get } from "lodash";
import { useMemo } from "react";
import { convertNumberHex } from "utils/utils";
import { GraphicBar } from "components/GraphicBar";
import { Box, Grid } from "@mui/material";
import { USD_DECIMAL } from "constants/contract";
import { Skeleton } from "@material-ui/lab";
import { GraphicBarSkeleton } from "components/GraphicBar/GraphicBar";

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

    [theme.breakpoints.down("lg")]: {
      textOverflow: " ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },

    [theme.breakpoints.down("xs")]: {
      "& span": {
        fontSize: 20,
        marginTop: theme.spacing(1),
        lineHeight: "30px",
      },
    },
  },
  divider: {
    backgroundColor: "#434849",
    marginLeft: 20,
    marginRight: 20,

    "@media(max-width: 1200px)": {
      display: "none",
    },
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    margin: 0,
    "& > .MuiGrid-item": {
      paddingTop: 0,
      paddingBottom: 0,
    },

    "& > div:first-child": {
      position: "relative",
      padding: "60px 0",
      flex: 1,
      maxWidth: "100%",
    },

    [theme.breakpoints.down("md")]: {
      "& > div:first-child": {
        flex: "unset",
      },
    },

    [theme.breakpoints.up("lg")]: {
      flexWrap: "nowrap",
    },
  },
  price: {
    fontSize: 52,
    fontFamily: "Mulish",
    marginTop: theme.spacing(1),
    lineHeight: "64px",
  },
  priceTitle: {
    fontFamily: "Mulish",
  },
}));

const BorrowerOverview = () => {
  const classes = useStyles();
  const { connected } = useWallet();

  const { pitCollateralBalance } = useBorrowContext();

  const { totalDepositedInUsd, totalOutstandingUsd, totalAccrualUsd, isLoading } =
    usePlatformState();

  const totalPitAmount = useMemo(
    () => formatUnits(convertNumberHex(get(pitCollateralBalance, "totals", 0)), USD_DECIMAL),
    [pitCollateralBalance]
  );

  const totalDeposited = useMemo(
    () => (connected ? totalDepositedInUsd : 0),
    [connected, totalDepositedInUsd]
  );

  return (
    <>
      {isLoading && <BorrowOverviewSkeleton />}
      {!isLoading && +totalDeposited > 0 ? (
        <Grid item container wrap="wrap" className={classes.container}>
          <GraphicBar
            debt={Number(totalOutstandingUsd - totalAccrualUsd)}
            interest={Number(totalAccrualUsd)}
            remaining={Number(totalPitAmount)}
          />
          <Divider orientation="vertical" flexItem className={classes.divider} />
          <Grid item xs={12} lg={3}>
            <Box sx={{ display: "inline-block", width: "100%" }} mt={3}>
              <Tooltip title="Current deposited collateral value." arrow placement="top">
                <Typography color="primary" className={classes.title}>
                  Total Deposited
                </Typography>
              </Tooltip>
              <Typography color="secondary" className={classes.subTitle}>
                <NumericText value={totalDeposited} moneyValue />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ marginTop: 2 }} />
      )}
    </>
  );
};

export default BorrowerOverview;

const BorrowOverviewSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid item container wrap="wrap" className={classes.container}>
      <GraphicBarSkeleton />
      <Divider orientation="vertical" flexItem className={classes.divider} />
      <Grid item xs={12} lg={3}>
        <Box sx={{ display: "inline-block", width: "100%" }} mt={3}>
          <Tooltip title="Current deposited collateral value." arrow placement="top">
            <Typography color="primary" className={classes.title}>
              Total Deposited
            </Typography>
          </Tooltip>
          <Skeleton animation="wave" variant="rect" />
        </Box>
      </Grid>
    </Grid>
  );
};
