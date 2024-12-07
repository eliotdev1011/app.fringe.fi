import { Box, makeStyles } from "@material-ui/core";
import { PriceMaxLeverage } from "./PriceMaxLaverage";
import { Exposure } from "./Exposure";

const useStyles = makeStyles(() => ({
  BoxStyle: {
    alignItems: "center",
    justifyContent: "space-between",
    "@media(max-width: 576px)": {
      width: "70% !important",
    },
  },
  LeverageStyle: {
    textAlign: "-webkit-center",
    width: "100%",
    background: "#212222",
    padding: "18px",
    borderRadius: "5px",
  },
  text: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: 500,
  },
}));

export const MaxLeverage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.LeverageStyle}>
      <Exposure />
      <PriceMaxLeverage />
    </Box>
  );
};
