import { Box, Grid, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { NumericText } from "components/NumericText";
import { useCommonStyles } from "helpers/styles";
import { IconInfo } from "./IconInfo";

const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: 500,
    marginBottom: "4px",
    minHeight: "41px",

    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  infoIcon: {
    marginRight: "2px",
    display: "flex",
  },
}));
export const AssetInfoRow = ({ label, valueUSD, value, symbol, tooltipTitle }) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.text}>
      <Grid item sm={3} md={6} xs={6}>
        <Box className={classes.infoIcon}>
          <IconInfo title={tooltipTitle} />
          {label}
        </Box>
      </Grid>
      <Grid item sm={3} md={6} xs={6}>
        {value ? (
          <>
            <NumericText value={value} suffix={symbol} precision={4} />
            <div className={commonClasses.dollarText}>
              <NumericText value={valueUSD} moneyValue precision={4} />
            </div>
          </>
        ) : (
          <NumericText value={valueUSD} moneyValue precision={4} />
        )}
      </Grid>
    </Grid>
  );
};

AssetInfoRow.propTypes = {
  label: PropTypes.string,
  valueUSD: PropTypes.string,
  value: PropTypes.string,
};

AssetInfoRow.defaultProps = {
  label: "Label",
  valueUSD: "0$",
  value: "",
};
