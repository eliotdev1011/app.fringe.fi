import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { EVENT_TYPES } from "app/constants";
import {
  CoinInfo,
  DialogApplyButton,
  DialogLogo,
  DialogTotal,
  NumericText,
  NumericTextField,
  Spinner,
} from "components";
import PropTypes from "prop-types";
import { useContext, useMemo, useState } from "react";
import { lendingTokenPropType } from "types/lendingToken";

import logoImage from "assets/svg/footer-icon.svg";
import { useWallet } from "hooks";
import { useLendingTokenMutations } from "hooks/mutation";
import { useLenderContext } from "pages/MultiAssetDashboard/providers/lenderContext";
import { convertNumberHex } from "utils/utils";
import { formatUnits, parseUnits } from "utils/number";
import { TokenType } from "types/token";
import useGetPriceOfTokens from "pages/MultiAssetDashboard/hooks/useGetPriceOfTokens";
import { ShareLendingContext } from "../Table/ShareLendingContext";

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
}));

const SupplyModal = ({ data, onClose, openShare }) => {
  const {
    name,
    balance,
    allowance,
    apy,
    symbol,
    logo,
    lendingToken,
    ftoken,
    token,
    decimal,
    allowanceAmount,
    underlyingTokens,
  } = data;

  const { setShareData } = useContext(ShareLendingContext);

  const classes = useStyles();
  const { refetch } = useLenderContext();
  const { connected } = useWallet();
  const [inputValue, setInputValue] = useState("");

  const { isLoading, approve, supply } = useLendingTokenMutations({
    name,
    amount: inputValue,
    kind: EVENT_TYPES.deposit,
  });
  const { data: priceOfTokens, isLoading: isPriceLoading } = useGetPriceOfTokens();

  const allowanceValue = useMemo(
    () => formatUnits(allowanceAmount, decimal),
    [allowanceAmount, decimal]
  );

  const maxValue = balance;
  const isDisabled =
    !connected ||
    isPriceLoading ||
    !inputValue ||
    Number(inputValue) === 0 ||
    Number(inputValue) > Number(maxValue);

  const resetInputValue = () => setInputValue("");

  const handleEnable = () => {
    const amount = parseUnits(convertNumberHex(inputValue), decimal).toString();
    approve({ address: lendingToken, ftoken, value: amount });
  };

  const handleSubmit = async () => {
    try {
      const amount = parseUnits(convertNumberHex(inputValue), decimal).toString();
      await supply({
        lendingTokenAmount: amount,
        address: lendingToken,
      });
      onClose();
      refetch();
      setShareData({
        token,
        amount: inputValue,
        apy,
        colToken: name,
      });
      openShare();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    } finally {
      resetInputValue();
    }
  };

  return (
    <>
      <DialogLogo logoUrl={logo} name={symbol} underlyingTokens={underlyingTokens} />

      {isLoading && <Spinner position="absolute" color="success" />}

      <Box pt={5} p={0} className={classes.rootContainer}>
        <NumericTextField
          value={inputValue}
          onChange={setInputValue}
          maxValue={maxValue}
          decimalScale={36}
          addressToken={token}
          decimalToken={decimal}
          tokenType={TokenType.LENDING}
          priceOfTokens={priceOfTokens}
        />

        <Box className={classes.contentInner} mt={2}>
          <Box py={2} px={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item md={6}>
                <CoinInfo logoUrl={logoImage}>Supply APY</CoinInfo>
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
          {allowance && Number(allowanceValue) >= Number(inputValue) ? (
            <DialogApplyButton disabled={isDisabled} onClick={handleSubmit}>
              Deposit
            </DialogApplyButton>
          ) : (
            <DialogApplyButton disabled={!connected} onClick={handleEnable}>
              Enable
            </DialogApplyButton>
          )}
          <DialogTotal title="Wallet Balance" value={balance} currency={symbol} />
        </Box>
      </Box>
    </>
  );
};

SupplyModal.propTypes = {
  data: lendingTokenPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SupplyModal;
