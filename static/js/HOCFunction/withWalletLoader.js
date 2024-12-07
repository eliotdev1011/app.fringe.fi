/* eslint-disable no-unused-vars */
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { CHAIN_ERROR_MESSAGE } from "app/constants";
import { Spinner } from "components";
import { EventContractProvider } from "context/EventContract/EventContractProvider";
import { TokenProvider } from "context/tokens";
import { useWallet } from "hooks";

const useStyles = makeStyles({
  alert: {
    justifyContent: "center",
  },
});

const withWalletLoader = (Component) => () => {
  const classes = useStyles();
  const { connected, account, connecting, isNetworkUnsupported } = useWallet();

  if (!account || !connected)
    return (
      <>
        <Component />
      </>
    );

  if (connected && isNetworkUnsupported) {
    return (
      <Grid container justifyContent="center">
        <Grid item md={4}>
          <Alert variant="filled" severity="error" icon={false} className={classes.alert}>
            {CHAIN_ERROR_MESSAGE}
          </Alert>
        </Grid>
      </Grid>
    );
  }

  if (connecting) {
    return <Spinner />;
  }

  return (
    <EventContractProvider>
      <TokenProvider>
        <Component />
      </TokenProvider>
    </EventContractProvider>
  );
};

export default withWalletLoader;
