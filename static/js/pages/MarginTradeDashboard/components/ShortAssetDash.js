import { Grid, makeStyles } from "@material-ui/core";
import { Box } from "@mui/material";
import { IconInfo } from "components/Leveraged/IconInfo";
import { Text } from "components/Title/Text";
import { MainNetworkSupported } from "utils/network";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import usePriceLendingToken from "hooks/contexts/LendingAssetContext/usePriceLendingToken";
import numeral from "numeral";
import { useEffect, useMemo } from "react";
import { useWallet } from "hooks";
import { useGetExposureLimitMainNet } from "hooks/query/graphQL/useFetchExposureLimitMainNet";

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
export const ShortAssetDash = () => {
  const { chainId } = useWallet();
  const isMainet = MainNetworkSupported.includes(+chainId);

  const classes = useStyles();
  const { shortAssetSelected, exposureLimit, setExposureLimit } = useLeverageContext();
  const lendingTokenPrice = usePriceLendingToken();

  const exposureLimitMainNet = useGetExposureLimitMainNet();

  const formattedExposureLimit = useMemo(() => {
    if (isMainet)
      return numeral(exposureLimitMainNet).format() !== "NaN"
        ? numeral(exposureLimitMainNet).format("0,0.[00]")
        : exposureLimitMainNet;

    return numeral(exposureLimit).format() !== "NaN"
      ? numeral(exposureLimit).format("0,0.[00]")
      : exposureLimit;
  }, [exposureLimit, exposureLimitMainNet, isMainet]);

  useEffect(() => {
    setExposureLimit(formattedExposureLimit);
  }, [formattedExposureLimit, setExposureLimit]);

  return (
    <Box
      marginBottom={2}
      sx={{
        marginTop: {
          xs: "16px",
          sm: "70px",
        },
      }}
      className={classes.text}
    >
      <Grid container display="flex" className={classes.rowStyle}>
        <Grid item xs={12}>
          <Box display="flex" gridGap={2}>
            <Text>Price</Text>
            <IconInfo title="Current price of the long asset / short asset." />
          </Box>
        </Grid>
        <Grid item xs={12}>
          ${Number(lendingTokenPrice[shortAssetSelected?.address] || 0).toFixed(2)}
        </Grid>
      </Grid>
      <Grid container display="flex" className={classes.rowStyle}>
        <Grid item xs={12}>
          <Box display="flex" gridGap={2}>
            <Text>Exposure Limit</Text>
            <IconInfo title="Value of the available funds in the short asset lending pool." />
          </Box>
        </Grid>
        {isMainet ? (
          <Grid item xs={12} className={classes.alignCenterBox}>
            ${formattedExposureLimit}
          </Grid>
        ) : (
          <Grid item xs={12} className={classes.alignCenterBox}>
            ${exposureLimit !== null ? formattedExposureLimit : "N/A"}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
