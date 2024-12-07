import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import React, { useMemo } from "react";
import { NumericText } from "components";
import { Grid } from "@mui/material";
import { lightGreen, yellow, orange } from "@mui/material/colors";
import { Skeleton } from "@material-ui/lab";

const isZero = (value) => value < 1e-6;

const generalStyles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "78%",
    marginRight: "2%",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
});

const GraphicBar = ({ debt, remaining, interest }) => {
  const total = debt + remaining;
  const debtRate = Math.round(
    Math.max(
      (debt * 100) / total > 99 && !isZero(remaining) ? 99 : (debt * 100) / total,
      !isZero(debt) ? 2 : 0
    )
  );
  const interestRate = Math.round(Math.max((interest * 100) / total, !isZero(interest) ? 2 : 0));

  const useStyles = makeStyles((theme) => ({
    ...generalStyles(theme),
    width100: {
      width: "100%",
    },
    totalBar: {
      border: "1px solid #434343",
      height: 50,
      width: "100%",
      borderRadius: 10,
    },
    debtBar: {
      border: "1px solid #CC0000",
      height: "95%",
      width: `${Math.min(100, Math.round(debtRate))}%`,
      margin: "1px 0px",
      padding: "2px 0px",
      borderRadius: 10,
      position: "relative",
    },
    interestBar: {
      height: "86%",
      width: `${Math.round((Math.min(interestRate, 100) * 100) / debtRate)}%`,
      margin: "1px 0px",
      border: "1px solid #C9DAF8",
      position: "absolute",
      right: Math.round((interestRate * 100) / debtRate) < 100 ? 3 : "unset",
      borderRadius: 10,
      left: Math.round((interestRate * 100) / debtRate) >= 100 ? 0 : "unset",
    },
    title: {
      color: "white",
      fontSize: 15,
      fontWeight: 400,
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      width: 10,
    },
    remainingBar: {
      width: `${Math.round(100 - debtRate)}%`,
      height: "100%",
      position: "absolute",
      right: 0,
    },
    debtTitlePos: {
      position: "absolute",
      top: "60%",
      marginLeft: "auto",
      marginRight: "auto",
      left: 0,
      right: 0,
    },
    interestTitlePos: {
      position: "absolute",
      bottom: "60%",
      marginLeft: "auto",
      marginRight: "auto",
      left: 0,
      right: 0,
    },
    remainingTitlePos: {
      position: "absolute",
      top: "17%",
      marginLeft: "auto",
      marginRight: "auto",
      left: 0,
      right: 0,

      [theme.breakpoints.down("xs")]: {
        "& p": {
          width: Math.round(debtRate) > 80 && "100%",
          display: Math.round(debtRate) > 80 && "flex",
          flexDirection: "column",
          alignItems: "end",
        },
      },
    },
    line: {
      borderLeft: "2px solid white",
      height: 30,
      zIndex: 100,
    },
    textPosition: {
      [theme.breakpoints.down("md")]: {
        width: Math.round(debtRate - interestRate / 2) < 4 && "100%",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 13,
      },
    },
    remainingText: {
      [theme.breakpoints.down("xs")]: {
        fontSize: 13,
      },
    },
  }));

  const debtBarColor = useMemo(() => {
    const value = debt / (debt + remaining);
    const colors = [
      lightGreen.A400,
      lightGreen.A200,
      lightGreen.A100,
      yellow[200],
      yellow[400],
      orange[300],
      orange[400],
      orange[500],
      orange[600],
      orange[900],
    ];
    return colors[Math.round(value * 10)];
  }, [debt, remaining]);

  const classes = useStyles();
  return (
    <Grid item md={12} lg={8.5} xl={9} className={classes.container}>
      <Box className={classes.totalBar}>
        <Box className={classes.remainingBar}>
          {!isZero(remaining) && (
            <div className={`${classes.title} ${classes.remainingTitlePos}`}>
              <div className={classes.line} />
              <p style={{ margin: 0 }} className={classes.remainingText}>
                Remaining <br />
                <NumericText value={remaining} moneyValue />
              </p>
            </div>
          )}
        </Box>

        <Box className={classes.debtBar} style={{ borderColor: debtBarColor }}>
          {!isZero(debt) && (
            <div className={`${classes.title} ${classes.debtTitlePos}`}>
              <div className={classes.line} />
              <p style={{ margin: 0 }} className={classes.textPosition}>
                Debt <br />
                <NumericText value={debt} moneyValue />
              </p>
            </div>
          )}
          <Box className={classes.interestBar}>
            {!isZero(interest) && (
              <div className={`${classes.title} ${classes.interestTitlePos}`}>
                <p style={{ margin: 0 }} className={classes.textPosition}>
                  Interest <br />
                  <NumericText value={interest} moneyValue />
                </p>
                <div className={classes.line} />
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

GraphicBar.propTypes = {
  debt: PropTypes.number.isRequired,
  remaining: PropTypes.number.isRequired,
  interest: PropTypes.number.isRequired,
};

export default GraphicBar;

export const GraphicBarSkeleton = () => {
  const classes = makeStyles(generalStyles)();
  return (
    <Grid item md={12} lg={8.5} xl={9} className={classes.container}>
      <Skeleton animation="wave" variant="rect" width="100%" />
    </Grid>
  );
};
