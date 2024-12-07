import { Box, makeStyles } from "@material-ui/core";
import { IconInfo } from "components/Leveraged/IconInfo";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import SelectShortAsset from "components/Leveraged/SelectShortAsset";
import { ShortAssetDash } from "./ShortAssetDash";

const useStyles = makeStyles((theme) => ({
  longAssetWrapper: {
    "@media(max-width: 576px)": {
      margin: "0 1rem",
    },
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  text: {
    fontSize: "16px",
    color: "#756F86",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  longAssetContent: {
    margin: "0",
  },
}));

export const ShortAsset = () => {
  const classes = useStyles();
  const { lendingList, collateralList, setShortAssetAddress, shortAssetSelected } =
    useLeverageContext();

  return (
    <Box className={classes.longAssetWrapper}>
      <Box display="flex" alignItems="center" className={classes.text}>
        <IconInfo title="Asset to gain short exposure to." />
        Short Asset
      </Box>
      <Box className={classes.longAssetContent}>
        <SelectShortAsset
          assets={lendingList}
          longAssets={collateralList}
          assetSelected={shortAssetSelected}
          setSelectAsset={setShortAssetAddress}
        />
        <ShortAssetDash />
      </Box>
    </Box>
  );
};
