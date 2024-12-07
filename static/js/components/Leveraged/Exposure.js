import { makeStyles, Grid, Box } from "@material-ui/core";
import { Text } from "components/Title/Text";
import { ShowNumber } from "pages/AmplifyDashboard/components/ShowNumber";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import { useMarginTradeContext } from "context/InstantsLeverage/MarginTradeContext/useMarginTradeContext";
import { MARGIN_TRADE_FIELD } from "context/InstantsLeverage/MarginTradeContext/MarginTradeContext";
import numeral from "numeral";
import { IconInfo } from "./IconInfo";

const useStyles = makeStyles((theme) => ({
  boxStyle: {
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
    textAlign: "center",
    // "@media(max-width: 576px)": {
    //   width: "70% !important",
    // },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  inputStyle: {
    display: "flex",
    marginTop: "10px",
    width: "100%",
    "@media(max-width: 576px)": {
      marginTop: "10px",
    },
  },
  iconBoxStyle: {
    marginLeft: "24px",
    display: "flex",
    alignItems: "center",
  },
  marginErrorMessage: {
    margin: "5px 0",
    color: "#ff0000",
  },
}));

export const Exposure = () => {
  const classes = useStyles();
  const { shortAssetSelected, longAssetSelected, exposureLimit } = useLeverageContext();
  const { notionalExp, setNotionalExp, setFocussedField } = useMarginTradeContext();

  const onMouseEnter = useCallback(() => {
    setFocussedField(MARGIN_TRADE_FIELD.NOTIONAL_EXPOSURE);
  }, [setFocussedField]);

  const invalidMarginErrorMessage = useMemo(() => {
    if (new BigNumber(notionalExp).lte(0)) {
      return "Notional exposure should be greater than 0";
    }
    if (exposureLimit !== null && new BigNumber(notionalExp).gt(exposureLimit)) {
      const value =
        numeral(exposureLimit).format() !== "NaN"
          ? numeral(exposureLimit).format("0,0.[00]")
          : exposureLimit;
      return `Exposure limit is $${value}`;
    }
    return "";
  }, [exposureLimit, notionalExp]);

  return (
    <Grid container className={classes.boxStyle} marginTop={2}>
      <Grid item xs={12}>
        <Box display="flex" gridGap={3} justifyContent="center">
          <Text>
            {longAssetSelected?.symbol || "..."}/{shortAssetSelected?.symbol || "..."} Exposure
          </Text>
          <IconInfo
            title={
              <Box>
                <p>
                  Notional value of exposure that this position will establish. This notional value
                  is the amount of the short asset borrowed and then swapped for the long asset.
                </p>
                <p>To note: Notional Exposure = Total Exposure - Margin.</p>
              </Box>
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.inputStyle}>
        <ShowNumber
          valueInput={notionalExp}
          min={0}
          setValueInput={setNotionalExp}
          onMouseEnter={onMouseEnter}
        />
      </Grid>

      <p className={classes.marginErrorMessage}>{invalidMarginErrorMessage}</p>
    </Grid>
  );
};
