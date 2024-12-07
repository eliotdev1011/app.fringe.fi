import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { useWallet } from "hooks";
import { NumericText } from "components";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  progressValues: ({ progressValue }) => ({
    position: "absolute",
    left: `${progressValue}%`,
    top: -16,
  }),
  progressValueText: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: "23px",

    marginLeft: 6,
  },
  progressValueSmallText: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",

    marginTop: theme.spacing(2),
    marginLeft: 6,
  },
  root: {
    color: "transparent",
    height: 2,
    padding: "15px 0",

    position: "relative",

    "&:before, &:after": {
      content: "''",
      position: "absolute",
      display: "inline-block",
      borderStyle: "solid",
      paddingTop: 8,
      paddingBottom: 8,
      borderColor: theme.palette.primary.light,
      borderWidth: "0 0 0 1px",
      top: 8,
    },

    "&:before": {
      left: 0,
    },

    "&:after": {
      right: 0,
    },
  },
  thumb: {
    height: 65,
    marginTop: -32,
    width: 1,
    borderRight: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: 0,
    marginLeft: 0,
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 6px)",
    top: 4,

    fontSize: 18,
    fontWeight: 600,
    lineHeight: "23px",

    "& *": {
      background: "transparent",
      color: "#fff",
    },
  },
  track: {
    height: 65,
    marginTop: -32,
    background:
      "linear-gradient(358.85deg, rgba(236, 51, 59, 0.21) 0.95%, rgba(236, 51, 59, 0) 98.98%)",
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: theme.palette.primary.light,
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 4,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
}));

const ValueLabelComponent = ({ value, children }) => {
  const { connected } = useWallet();
  const classes = useStyles({ progressValue: value });

  return (
    <>
      {children}

      <div className={classes.progressValues}>
        <Typography color="secondary" className={classes.progressValueText}>
          <NumericText value={value} suffix="%" />
        </Typography>

        <Typography
          color="secondary"
          className={classes.progressValueSmallText}
        >
          <NumericText value={connected ? 209.95 : 0} moneyValue />
        </Typography>
      </div>
    </>
  );
};

const ClaimSlider = () => {
  const { connected } = useWallet();
  const progressValue = connected ? 35 : 0;
  const classes = useStyles();

  return (
    <Box mb={3}>
      <Slider
        defaultValue={progressValue}
        valueLabelDisplay="on"
        classes={classes}
        ValueLabelComponent={ValueLabelComponent}
      />
    </Box>
  );
};

export default ClaimSlider;
