import { Box, makeStyles } from "@material-ui/core";
import { ChartMarginTrade } from "pages/MarginTradeDashboard/components/ChartMarginTrade";
import { OpenMarginPositionTable } from "pages/MarginTradeDashboard/components/OpenMarginPositionTable";
import { IconInfo } from "components/Leveraged/IconInfo";
import { MaxLeverage } from "../../components/Leveraged/MaxLeverage";
import { SpecifyMargin } from "../../components/Leveraged/SpecifyMargin";
import { MarginTradeAssets } from "./components/MarginTradeAssets";
import { MarginTradeListFigures } from "./components/MarginTradeListFigures";

const useStyles = makeStyles((theme) => ({
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
  DashBoardBox: {
    width: "90%",
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    rowGap: "20px",

    "@media(min-width: 1200px)": {
      width: "30%",
      marginTop: 0,
    },

    [theme.breakpoints.down("md")]: {
      width: "100%",
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
  AssetWrapper: {
    background: "#212222",
    marginBottom: "14px",
    padding: "14px",
    borderRadius: "5px",
    justifyContent: "center",
  },
  InfoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",

    [theme.breakpoints.down("md")]: {
      flexDirection: "row",
    },

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

export const MarginTradeDashboard = () => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.TextTitle}>
        <h1>Margin Trade</h1>
        <IconInfo title="Allows you to establish a leveraged trade position for a pair of assets." />
      </Box>
      <Box className={classes.FlexPosition}>
        <Box className={classes.ChartBox}>
          <ChartMarginTrade />
          <OpenMarginPositionTable />
        </Box>
        <Box className={classes.DashBoardBox}>
          <MarginTradeAssets />
          <Box className={classes.InfoBox}>
            <MaxLeverage />
            <SpecifyMargin />
          </Box>
          <MarginTradeListFigures />
        </Box>
      </Box>
    </>
  );
};
