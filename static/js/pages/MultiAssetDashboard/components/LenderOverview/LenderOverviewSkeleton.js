import { Skeleton } from "@material-ui/lab";
import { Tooltip } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),

    "& > .MuiGrid-item": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  divider: {
    backgroundColor: "#434849",
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Mulish",
    lineHeight: "21px",
    color: "#434849",
  },
  priceTitle: {
    fontFamily: "Mulish",
  },
}));

const LenderOverviewSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid item container spacing={6} className={classes.container} alignItems="center">
      <Grid item>
        <Tooltip title="Total value of all your deposited capital assets." arrow placement="top">
          <Typography color="secondary" variant="h6" className={classes.priceTitle}>
            Deposited Total Value
          </Typography>
        </Tooltip>

        <Box width="100%" mt={2}>
          <Skeleton animation="wave" variant="rect" width="100%" height={65} />
        </Box>
      </Grid>

      <Divider orientation="vertical" flexItem className={classes.divider} />
    </Grid>
  );
};

export default LenderOverviewSkeleton;
