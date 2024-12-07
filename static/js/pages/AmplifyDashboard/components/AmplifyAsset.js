import { Box, Grid, makeStyles } from "@material-ui/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import { IconInfo } from "components/Leveraged/IconInfo";
import { SwitchButton } from "components/Leveraged/SwitchButton";
import { useLeverageContext } from "context/InstantsLeverage/LeverageContext/useLeverageContext";
import { InfoLongAsset } from "../../../components/Leveraged/InfoLongAsset";
import { SelectAsset } from "../../../components/Leveraged/SelectLongAsset";

const useStyles = makeStyles((theme) => ({
  longAssetWrapper: {
    background: "#212222",
    borderRadius: "5px",
    padding: "15px 24px 24px 24px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
  text: {
    fontSize: "16px",
    color: "#756F86",
    fontWeight: 600,
    marginLeft: 8,
    display: "flex",
    alignItems: "center",

    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  LongAssetContent: {
    // marginLeft: "20px",
    "@media(max-width: 576px)": {
      marginLeft: "10px",
    },
  },
  SwitchWrapper: {
    marginLeft: "16px !important",
  },
}));

export const AmplifyAsset = () => {
  const classes = useStyles();

  const {
    hideZero: [hideZero, setHideZero],
    setLongAssetAddress,
    collateralList,
    longAssetSelected,
    shortAssetSelected,
  } = useLeverageContext();

  return (
    <Box className={classes.longAssetWrapper}>
      <Grid container justifyContent="center">
        <Grid item className={classes.text}>
          Asset to amplify
          <IconInfo title="Asset to gain long exposure to." />
        </Grid>
        <Grid item className={classes.text}>
          <Box>Hide zero balances</Box>
          <FormControlLabel
            className={classes.SwitchWrapper}
            control={
              <SwitchButton
                sx={{ m: 1 }}
                defaultChecked={hideZero}
                setHideZero={setHideZero}
                hideZero={hideZero}
              />
            }
          />
        </Grid>
      </Grid>
      <Box className={classes.LongAssetContent}>
        <Box display="flex" justifyContent="center">
          <SelectAsset
            {...{
              setSelectAsset: setLongAssetAddress,
              assets: collateralList,
              assetSelected: longAssetSelected,
              shortAssetSelected,
            }}
            hideZero={hideZero}
          />
        </Box>

        <InfoLongAsset />
      </Box>
    </Box>
  );
};
