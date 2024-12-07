import { makeStyles, Grid, Box } from "@material-ui/core";
import { Text } from "components/Title/Text";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { NumericText } from "components/NumericText";
import { IconInfo } from "./IconInfo";

const useStyles = makeStyles((theme) => ({
  boxStyle: {
    alignItems: "center",
    textAlign: "left",
    justifyContent: "space-between",
    width: "80%",
    margin: "auto",
    marginTop: "16px",
    rowGap: "8px",

    // "@media(max-width: 576px)": {
    //   width: "70% !important",
    // },

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  iconBox: {
    paddingLeft: "24px",
  },
  textRight: {
    textAlign: "right !important",
    color: "#fff",
  },
}));

export const PriceMaxLeverage = () => {
  const classes = useStyles();
  const { shortAssetSelected, longAssetSelected, notionalExp } = useLeverageContext();

  const notionalExpInLongAsset = useMemo(() => {
    const notionalExpLong = new BigNumber(notionalExp)
      .dividedBy(longAssetSelected?.price)
      .toString();
    return <NumericText value={notionalExpLong} precision={4} suffix={longAssetSelected?.symbol} />;
  }, [longAssetSelected, notionalExp]);

  const notionalExpInShortAsset = useMemo(() => {
    const notionalExpShort = new BigNumber(notionalExp)
      .dividedBy(shortAssetSelected?.price)
      .toString();
    return (
      <NumericText value={notionalExpShort} precision={4} suffix={shortAssetSelected?.symbol} />
    );
  }, [shortAssetSelected, notionalExp]);

  const swapRate = useMemo(() => {
    const price = new BigNumber(longAssetSelected?.price)
      .dividedBy(shortAssetSelected?.price)
      .toString();
    return <NumericText value={price} precision={4} />;
  }, [longAssetSelected?.price, shortAssetSelected?.price]);

  return (
    <Grid container className={classes.boxStyle}>
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Text>{notionalExpInLongAsset} </Text>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box className={classes.textRight}>{notionalExpInShortAsset} </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Box display="flex" gridGap={3}>
            <Text>
              Price ({longAssetSelected?.symbol}
              {" / "}
              {shortAssetSelected?.symbol})
            </Text>
            <IconInfo title="Current price of the long asset / short asset." />
          </Box>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box className={classes.textRight}>{swapRate}</Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
