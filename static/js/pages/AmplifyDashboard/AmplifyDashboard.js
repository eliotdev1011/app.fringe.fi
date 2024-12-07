import { Box, makeStyles } from "@material-ui/core";
import { useEffect } from "react";

import { IconInfo } from "components/Leveraged/IconInfo";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "components/ErrorFallback/ErrorFallback";

import { customUSDCSymbol } from "constants/usdcSymbol";
import { SpecifyMargin } from "../../components/Leveraged/SpecifyMargin";
import { ChartMarginTrade } from "../MarginTradeDashboard/components/ChartMarginTrade";
import { AmplifyAsset } from "./components/AmplifyAsset";
import { OpenAmplifyPositionTable } from "./components/OpenAmplifyPositionTable";
import { AmplifyListFigures } from "./components/AmplifyListFigures";

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    background: "#000",
    paddingLeft: "20px",
    paddingRight: "20px",

    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  textTitle: {
    color: "#FFFFFF",
    fontSize: "18px",
    textAlign: "center",
    marginTop: "18px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconInf: {
    marginLeft: "12px",
  },
  flexPosition: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    "@media(min-width: 1200px)": {
      justifyContent: "space-between",
    },

    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      gap: theme.spacing(3),
    },
  },
  ChartBox: {
    width: "90%",
    "@media(min-width: 1200px)": {
      width: "68%",
    },

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  DashBoardBox: {
    width: "90%",
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",

    "@media(min-width: 1200px)": {
      width: "30%",
      marginTop: 0,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  PositionButton: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    marginTop: "27px",
    marginBottom: "37px",
  },
  InfoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",

    [theme.breakpoints.down("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));

export const AmplifyDashboard = () => {
  const classes = useStyles();
  const { setShortAssetAddress, lendingList } = useLeverageContext();

  useEffect(() => {
    const usdcToken = lendingList.find((o) => customUSDCSymbol.includes(o.symbol));
    setShortAssetAddress(usdcToken?.address);
  }, [lendingList, setShortAssetAddress]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box className={classes.contentWrapper}>
        <Box className={classes.textTitle}>
          <h1>Amplify</h1>
          <IconInfo title="Allows you to amplify your collateral by establishing a leveraged position." />
        </Box>
        <Box className={classes.flexPosition}>
          <Box className={classes.ChartBox}>
            <ChartMarginTrade />
            <OpenAmplifyPositionTable />
          </Box>
          <Box className={classes.DashBoardBox}>
            <Box className={classes.InfoBox}>
              <AmplifyAsset />
              <SpecifyMargin />
            </Box>
            <AmplifyListFigures />
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};
