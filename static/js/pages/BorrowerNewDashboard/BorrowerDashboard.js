import Box from "@material-ui/core/Box";
import MetaTags from "react-meta-tags";
import metaImg from "assets/meta-img.png";
import { useTheme } from "@material-ui/styles";
import { Grid, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IncentivesBar } from "components/IncentivesBar";
import {
  AvailableForDepositingTable,
  AvailableToReturnTable,
  DepositedBorrowedTable,
  BorrowerOverview,
} from "./components";

const useStyles = makeStyles(() => ({
  container: {
    "& > div.MuiGrid-item": {
      paddingRight: 0,
    },
    minHeight: "auto !important",
  },
}));

const BorrowerNewDashboard = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  return (
    <Box my={3}>
      <MetaTags>
        <title>Borrow against your crypto assets | Fringe Finance</title>
        <meta
          name="description"
          content="Borrowing capital is easy! Use your crypto as collateral to get a loan instantly"
        />
        <meta
          property="og:title"
          content="Borrow stablecoins and other assets against your crypto"
        />
        <meta
          property="og:description"
          content="Borrowing stablecoin capital and other assets is easy! Use your crypto as collateral to get a loan instantly."
        />
        <meta property="og:image" content={metaImg} />
      </MetaTags>
      <Box>
        <h1>Borrow against your crypto assets</h1>
      </Box>
      {process.env.REACT_APP_INCENTIVE_ENABLE === "true" ? <IncentivesBar /> : null}

      <Grid
        container
        spacing={3}
        sx={{ minHeight: "auto !important" }}
        className={classes.container}
      >
        <BorrowerOverview />
      </Grid>
      <Box my={3}>
        <Grid container sx={{ overflow: "hidden" }}>
          <Grid item xs={12}>
            <DepositedBorrowedTable />
          </Grid>
        </Grid>
      </Box>
      <Box my={3}>
        <Grid container className={classes.container} spacing={isSm ? 4 : 6}>
          <Grid item xs={12} md={6}>
            <AvailableForDepositingTable />
          </Grid>

          <Grid item xs={12} md={6}>
            <AvailableToReturnTable />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BorrowerNewDashboard;
