import { Box, makeStyles } from "@material-ui/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import { IconInfo } from "components/Leveraged/IconInfo";
import { SwitchButton } from "components/Leveraged/SwitchButton";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { SelectAsset } from "../../../components/Leveraged/SelectLongAsset";
import { LongAssetDash } from "./LongAssetDash";

const useStyles = makeStyles((theme) => ({
  longAssetWrapper: {
    // paddingRight: "6px",
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
  hideZeroRow: {
    minWidth: "20rem",
    fontSize: "16px",
    color: "#756F86",
    fontWeight: 600,
    marginTop: "16px",

    [theme.breakpoints.down("xs")]: {
      minWidth: "auto",
      fontSize: 14,
    },
  },
  longAssetContent: {
    margin: "0",
  },
  switchWrapper: {
    marginRight: "5px !important",
  },
}));

export const LongAsset = () => {
  const classes = useStyles();
  const {
    collateralList,
    setLongAssetAddress,
    longAssetSelected,
    shortAssetSelected,
    hideZero: [hideZero, setHideZero],
  } = useLeverageContext();
  return (
    <Box className={classes.longAssetWrapper}>
      <Box display="flex" alignItems="center" className={classes.text}>
        <IconInfo title="Asset to gain long exposure to." />
        Long Asset
      </Box>
      <Box className={classes.longAssetContent}>
        <SelectAsset
          assets={collateralList}
          setSelectAsset={setLongAssetAddress}
          assetSelected={longAssetSelected}
          shortAssetSelected={shortAssetSelected}
        />
        <Box display="flex" alignItems="center" className={classes.hideZeroRow}>
          <FormControlLabel
            className={classes.switchWrapper}
            control={
              <SwitchButton
                sx={{ m: 1 }}
                defaultChecked={hideZero}
                setHideZero={setHideZero}
                hideZero={hideZero}
              />
            }
          />
          <Box>Hide zero balances</Box>
        </Box>
        <LongAssetDash />
      </Box>
    </Box>
  );
};
