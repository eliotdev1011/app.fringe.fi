import { Skeleton } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import { Tooltip } from "@material-ui/core";
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

const BorrowerOverviewSkeleton = () => {
  const classes = useStyles();
  return (
    <Grid item container spacing={6} className={classes.container} alignItems="center">
      <Grid item>
        <Tooltip
          title="Collateral value * each collateral's LVR minus any outstanding loan amounts."
          arrow
          placement="top"
        >
          <Typography color="secondary" variant="h6" className={classes.priceTitle}>
            Remaining Borrowing Capacity
          </Typography>
        </Tooltip>
        <Box width="100%" mt={2}>
          <Skeleton animation="wave" variant="rect" width="100%" height={65} />
        </Box>
      </Grid>

      <Divider orientation="vertical" flexItem className={classes.divider} />

      <Grid item>
        <Box>
          <Tooltip title="Current deposited collateral value." arrow placement="top">
            <Typography color="primary" className={classes.title}>
              Total Deposited
            </Typography>
          </Tooltip>
          <Box width="155px" mt={2}>
            <Skeleton animation="wave" variant="rect" width="100%" height={40} />
          </Box>
        </Box>
      </Grid>

      <Grid item>
        <Box>
          <Tooltip
            title="PIT tokens issued. Equals collateral value * each collateral's LVR."
            arrow
            placement="top"
          >
            <Typography color="primary" className={classes.title}>
              Tokens Issued
            </Typography>
          </Tooltip>
          <Box width="140px" mt={2}>
            <Skeleton animation="wave" variant="rect" width="100%" height={40} />
          </Box>
        </Box>
      </Grid>

      <Grid item>
        <Box>
          <Tooltip
            title="Your outstanding loan amounts including accrued interest."
            arrow
            placement="top"
          >
            <Typography color="primary" className={classes.title}>
              Outstanding
            </Typography>
          </Tooltip>
          <Box width="70px" mt={2}>
            <Skeleton animation="wave" variant="rect" width="100%" height={40} />
          </Box>
        </Box>
      </Grid>

      <Grid item>
        <Box>
          <Tooltip title="Interest accrued for all your open loan positions." arrow placement="top">
            <Typography color="primary" className={classes.title}>
              Interest Accrued
            </Typography>
          </Tooltip>
          <Box width="155px" mt={2}>
            <Skeleton animation="wave" variant="rect" width="100%" height={40} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BorrowerOverviewSkeleton;
