import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DECIMAL_SCALE, EVENT_TYPES } from "app/constants";
import { BigNumber } from "ethers";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import {
  DialogApplyButton,
  DialogLogo,
  DialogTotal,
  NumericText,
  NumericTextField,
  Spinner,
} from "components";
import { useWallet } from "hooks";
import { useLendingTokenMutations } from "hooks/mutation";
import { useGetCash } from "pages/BorrowerNewDashboard/hooks/useGetCash";
import { useLenderContext } from "pages/MultiAssetDashboard/providers/lenderContext";
import { lendingTokenPropType } from "types/lendingToken";
import { formatUnits, parseUnits, minBigNumber } from "utils/number";
import { isWrapNative } from "utils/token";
import { useERC20TokenApproval } from "hooks/contract/tokens/useERC20TokenApproval";
import { TokenType } from "types/token";
import { usePITWrappedTokenGatewayContract } from "hooks/contract/usePITWrappedTokenGatewayContract";
import useGetPriceOfTokens from "pages/MultiAssetDashboard/hooks/useGetPriceOfTokens";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    minWidth: 400,
    color: theme.palette.primary.main,
    paddingLeft: 0,
    paddingRight: 0,
    width: 429,

    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      minWidth: "100%",
      height: "100%",
      width: "100%",
    },
  },
  contentInner: {
    position: "relative",
    backgroundColor: "#F8F8F8",
    [theme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
  dialogTotal: {
    width: "100%",
    backgroundColor: "#333333",
  },
}));

const RedeemModal = ({ data, onClose }) => {
  const { name, apy, lendingTokenBalance, symbol, logo, token, decimal, ftoken, underlyingTokens } =
    data;
  const { data: cash, isLoading: isFetchingCash } = useGetCash(ftoken);

  const classes = useStyles();
  const { connected, chainId } = useWallet();
  const [inputValue, setInputValue] = useState("");
  const { refetch } = useLenderContext();
  const {
    data: { GatewayInstance },
  } = usePITWrappedTokenGatewayContract();
  const { isLoading, redeemUnderlying } = useLendingTokenMutations({
    name,
    amount: inputValue,
    kind: EVENT_TYPES.withdraw,
  });
  const {
    approve: approveGateway,
    query: { data: allowance, refetch: refetchGatewayAllowance },
    isLoading: gatewayLoading,
  } = useERC20TokenApproval(token, GatewayInstance?.address);

  const { data: priceOfTokens, isLoading: isPriceLoading } = useGetPriceOfTokens();

  const isLoadingModal = useMemo(
    () => isLoading || isFetchingCash || gatewayLoading || isPriceLoading,
    [gatewayLoading, isFetchingCash, isLoading, isPriceLoading]
  );

  const getMin = useMemo(
    () => minBigNumber([BigNumber.from(cash || 0), parseUnits(lendingTokenBalance, decimal)]),
    [lendingTokenBalance, cash, decimal]
  );

  const maxValue = useMemo(() => formatUnits(getMin || 0, decimal), [decimal, getMin]);

  const isDisabled =
    !connected || !inputValue || Number(inputValue) === 0 || Number(inputValue) > Number(maxValue);

  const resetInputValue = () => setInputValue("");
  const isNative = useMemo(() => isWrapNative(token, chainId), [chainId, token]);
  const needApproveToGateway = useMemo(() => {
    if (!isNative) return false;
    if (!allowance) return true;
    return Number(formatUnits(allowance, decimal)) < inputValue;
  }, [decimal, allowance, inputValue, isNative]);

  const handleSubmit = async () => {
    try {
      await redeemUnderlying({
        lendingTokenAmount: parseUnits(`${inputValue || 0}`, decimal),
        address: token,
      });
      refetch();
      onClose();
    } finally {
      resetInputValue();
    }
  };

  const handleApproveGateway = async () => {
    await approveGateway({ value: parseUnits(`${inputValue || 0}`, decimal) });
    refetchGatewayAllowance();
  };

  return (
    <>
      <DialogLogo logoUrl={logo} name={symbol} underlyingTokens={underlyingTokens} />

      {isLoadingModal && <Spinner position="absolute" color="success" />}

      <Box pt={5} p={0} className={classes.rootContainer}>
        <NumericTextField
          value={inputValue}
          onChange={setInputValue}
          maxValue={maxValue}
          decimalScale={DECIMAL_SCALE}
          addressToken={token}
          decimalToken={decimal}
          tokenType={TokenType.LENDING}
          priceOfTokens={priceOfTokens}
        />

        <Box className={classes.contentInner} mt={2}>
          <Box py={2} px={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item md={6}>
                Supply APY
              </Grid>
              <Grid item>
                <Typography color="primary">
                  <NumericText value={apy} suffix="%" />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box>
          {needApproveToGateway ? (
            <DialogApplyButton disabled={isDisabled} onClick={handleApproveGateway}>
              Enable
            </DialogApplyButton>
          ) : (
            <DialogApplyButton disabled={isDisabled} onClick={handleSubmit}>
              Withdraw
            </DialogApplyButton>
          )}

          <Box py={1} className={classes.dialogTotal}>
            <DialogTotal
              title="Available To Withdraw"
              value={maxValue}
              currency={symbol}
              type="withdraw"
            />
            <DialogTotal
              title="Supplied Amount"
              value={Number(lendingTokenBalance)}
              currency={symbol}
              type="withdraw"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

RedeemModal.propTypes = {
  data: lendingTokenPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RedeemModal;
