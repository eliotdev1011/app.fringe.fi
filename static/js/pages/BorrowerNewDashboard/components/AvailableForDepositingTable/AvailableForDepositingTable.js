import { useCallback, useMemo, useState } from "react";
import ReactGa from "react-ga";

import { Box, Button, Paper, Typography, Tooltip } from "@material-ui/core";

import { useModalState, useWallet } from "hooks";

import {
  CoinInfo,
  DepositModal,
  Dialog,
  NumericText,
  PaperTitle,
  Table,
  TableSkeleton,
} from "components";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { get } from "lodash";
import { depositTokenListExample } from "utils/availableDepositTokenExample";
import numeral from "numeral";
import { useGetTokensWithoutAccount } from "pages/BorrowerNewDashboard/hooks/useTokenSupported";
import { whiteBgForLogo } from "utils/utils";
import { useChainId } from "wagmi";
import { useCommonStyles } from "helpers/styles";
import DetailMenu from "components/CoinInfo/DetailMenu";
import { LinearProgress } from "components/LinearProgress";

const COLUMNS = [
  {
    Header: () => (
      <Tooltip title="Asset that can be deposited as collateral." arrow placement="top">
        <Box display="inline">Asset</Box>
      </Tooltip>
    ),
    accessor: "name",
    Cell: ({
      // eslint-disable-next-line no-unused-vars
      value,
      row: {
        original: { underlyingTokens, symbol, address, name },
      },
    }) => (
      <CoinInfo
        link={`/borrowing/${
          underlyingTokens?.length === 2
            ? `${underlyingTokens[0].symbol}-${underlyingTokens[1].symbol}`
            : symbol
        }`}
        whiteBg={whiteBgForLogo(symbol)}
        symbol={symbol}
        address={address}
        name={name}
        underlyingTokens={underlyingTokens}
      >
        {symbol}
      </CoinInfo>
    ),
  },
  {
    Header: () => (
      <Tooltip
        title="Loan to value ratio for the collateral asset. The maximum borrowing capacity for a given collateral deposit = collateral value * LVR. Each collateral asset has its own LVR."
        arrow
        placement="top"
      >
        <Box display="inline">LVR</Box>
      </Tooltip>
    ),
    accessor: "lvr",
    props: {
      align: "right",
    },
    Cell: ({
      value,
      row: {
        original: { isPlaceholderData, isLoading },
      },
    }) =>
      isPlaceholderData && isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "40%" }}>
            <LinearProgress color="primary" variant="query" />
          </div>
        </Box>
      ) : (
        <Typography color="secondary">{numeral(value).format("0,0%")}</Typography>
      ),
  },
  {
    Header: () => (
      <Tooltip
        title="Token count and value of the collateral asset held in your external wallet."
        arrow
        placement="top"
      >
        <Box display="inline">Wallet Balance</Box>
      </Tooltip>
    ),
    accessor: "balance",
    props: {
      align: "right",
    },
    Cell: ({
      value,
      row: {
        original: { symbol, balanceInUsd, isPlaceholderData, isLoading },
      },
    }) => {
      if (isPlaceholderData && isLoading) {
        return (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "20%" }}>
              <LinearProgress color="primary" variant="query" />
            </div>
          </Box>
        );
      }
      if (!value) {
        return "-";
      }

      return (
        <>
          <div>
            <NumericText value={value} precision={4} suffix={symbol} />
          </div>
          <Typography style={{ color: "#A5A8B6" }}>
            <NumericText value={balanceInUsd} precision={2} moneyValue />
          </Typography>
        </>
      );
    },
  },
];

const AvailableForDepositingTable = () => {
  const classes = useCommonStyles();
  const chainId = useChainId();
  const {
    availableDepositTokens: data,
    isLoading,
    isError,
    isPlaceholderData,
    placeholderDataLoading,
  } = useBorrowContext();
  const {
    data: dummyData,
    isLoading: dummyLoading,
    error: dummyError,
  } = useGetTokensWithoutAccount();

  const { isOpen, onOpen, onClose } = useModalState();
  const [modalDataIdx, setModalDataIdx] = useState(null);
  const { account } = useWallet();
  const { decimalOfContractToken } = useBorrowContext();
  const handleClick = useCallback(
    (value) => () => {
      setModalDataIdx(value);
      onOpen();

      ReactGa.event({
        category: "Borrower Dashboard",
        action: "Deposit",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onOpen]
  );

  const columns = useMemo(
    () => [
      ...COLUMNS,
      {
        Header: "",
        accessor: "button",
        props: {
          align: "center",
        },
        Cell: ({
          row: {
            index,
            original: { address, symbol, underlyingTokens },
          },
        }) => (
          <div className={classes.actionButtonWrapper}>
            <Button
              style={{ width: 80, height: 36 }}
              className={classes.actionButton}
              onClick={handleClick(index.toString())}
            >
              Deposit
            </Button>
            <DetailMenu address={address} symbol={symbol} underlyingTokens={underlyingTokens} />
          </div>
        ),
      },
    ],
    [classes.actionButtonWrapper, classes.actionButton, handleClick]
  );

  const depositModalData = useMemo(() => {
    const deposit = get(data, modalDataIdx, data?.[0]);
    return {
      ...deposit,
      decimal: get(decimalOfContractToken, [deposit?.address?.toLowerCase()], 0),
    };
  }, [data, decimalOfContractToken, modalDataIdx]);

  return (
    !isError && (
      <Paper className={classes.table}>
        <PaperTitle>Deposit Collateral</PaperTitle>

        <Box mt={1}>
          {!account &&
            ((!dummyData || dummyLoading) && !dummyError ? (
              <TableSkeleton rows={6} />
            ) : (
              <>
                <Table
                  columns={columns}
                  data={(!dummyData ? depositTokenListExample : dummyData.projectTokens).map(
                    (token) => ({
                      ...token,
                      _chainId: chainId,
                    })
                  )}
                />
              </>
            ))}
          {account &&
            (placeholderDataLoading ? (
              <TableSkeleton rows={6} />
            ) : (
              isPlaceholderData &&
              data && (
                <>
                  <Table
                    columns={columns}
                    data={data.map((token) => ({
                      ...token,
                      _chainId: chainId,
                      isPlaceholderData,
                      isLoading,
                    }))}
                  />
                </>
              )
            ))}
          {!placeholderDataLoading &&
            !isPlaceholderData &&
            (!data?.length ? (
              account && <TableSkeleton rows={6} />
            ) : (
              <>
                <Table columns={columns} data={data} />
                <Dialog open={isOpen} onClose={onClose} noPadding>
                  <DepositModal data={depositModalData} onClose={onClose} />
                </Dialog>
              </>
            ))}
        </Box>
      </Paper>
    )
  );
};

export default AvailableForDepositingTable;
