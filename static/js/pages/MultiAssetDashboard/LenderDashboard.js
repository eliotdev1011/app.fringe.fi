import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { TableSkeleton } from "components";
import { withWalletLoader } from "HOCFunction";
import { useWallet } from "hooks";
import MetaTags from "react-meta-tags";
import metaImg from "assets/meta-img.png";
import { TokenProvider } from "context/tokens";
import { lenderFakeData } from "utils/lenderFakeData";
import LendingAssetsTable from "pages/MultiAssetDashboard/components/Table/LendingAssets";
import { Grid } from "@mui/material";
import { useGetTokensWithoutAccount } from "pages/BorrowerNewDashboard/hooks/useTokenSupported";
import { IncentivesBar } from "components/IncentivesBar";
import { LenderOverview, LenderOverviewSkeleton } from "./components";

import { LenderContextProvider, useLenderContext } from "./providers/lenderContext";

const LenderDashboard = () => {
  const { account } = useWallet();

  const { isLoading, data, isError, userFToken } = useLenderContext();

  const {
    data: dummyData,
    isLoading: dummyLoading,
    // error: dummyError,
  } = useGetTokensWithoutAccount();

  const renderTables = () => {
    if (isError)
      return (
        <>
          {" "}
          <Typography color="error" variant="h6">
            Loading Data Error
          </Typography>
        </>
      );

    return (
      <>
        {!account && dummyLoading && (
          <Box border="1px solid #434849">
            <TableSkeleton rows={3} />
          </Box>
        )}
        {!account && !dummyLoading && (
          <LendingAssetsTable dataSource={!dummyData ? lenderFakeData : dummyData.lendingTokens} />
        )}

        {/* {!account &&
          ((!dummyData || dummyLoading) && !dummyError ? (
            <Box border="1px solid #434849">
              <TableSkeleton rows={3} />
            </Box>
          ) : (
            <LendingAssetsTable
              dataSource={!dummyData ? lenderFakeData : dummyData.lendingTokens}
            />
          ))} */}

        {isLoading && account && (
          <Box border="1px solid #434849">
            <TableSkeleton rows={3} />
          </Box>
        )}
        {!isLoading && account && <LendingAssetsTable dataSource={userFToken} />}
      </>
    );
  };

  return (
    <Box my={3}>
      <Box>
        <h1>Earn interest lending out your crypto assets</h1>
      </Box>
      {process.env.REACT_APP_INCENTIVE_ENABLE === "true" ? <IncentivesBar /> : null}
      <Grid container justifyContent="center">
        <Grid item md={6}>
          {isLoading ? (
            <LenderOverviewSkeleton />
          ) : (
            <LenderOverview accountData={data?.accountData} />
          )}
        </Grid>
      </Grid>

      <Box mt={3}>
        <Grid
          container
          sx={{
            display: {
              xs: "block",
              md: "flex",
            },
          }}
          justifyContent="center"
        >
          <Grid item md={10}>
            {renderTables()}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const ContextWrapChild = () => (
  <TokenProvider>
    <LenderContextProvider>
      <MetaTags>
        <title>Earn interest lending out your crypto assets | Fringe Finance</title>
        <meta
          name="description"
          content="Earning by lending USDC stablecoins and other assets is easy! Generate passive income by providing capital to a secure non-custodial DeFi platform."
        />
        <meta
          property="og:title"
          content="Earn consistently high interest by lending USDC stablecoins."
        />
        <meta
          property="og:description"
          content="Earning by lending USDC stablecoins and other assets is easy! Generate passive income by providing your capital to a secure DeFi platform."
        />
        <meta property="og:image" content={metaImg} />
      </MetaTags>
      <LenderDashboard />
    </LenderContextProvider>
  </TokenProvider>
);

export default withWalletLoader(ContextWrapChild);
