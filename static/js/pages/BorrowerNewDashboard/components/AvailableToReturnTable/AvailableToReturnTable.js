import { useMemo } from "react";

import { Box, Paper, Tooltip, Typography } from "@material-ui/core";
import { LinearProgress } from "components/LinearProgress";

import { CoinInfo, NumericText, PaperTitle, Table, TableSkeleton } from "components";

import get from "lodash/get";
import { useBorrowContext } from "context/contracts/BorrowContext";
import {
  useGetTokensWithoutAccount,
  usePriceTokensWithoutAccount,
} from "pages/BorrowerNewDashboard/hooks/useTokenSupported";
import { useWallet } from "hooks";
import { useFetchGraphData } from "hooks/query/graphQL/useFetchGraphData";
import { whiteBgForLogo } from "utils/utils";
import { useCommonStyles } from "helpers/styles";
import DetailMenu from "components/CoinInfo/DetailMenu";

const COLUMNS = [
  {
    Header: () => (
      <Tooltip title="List of assets that can be borrowed on the platform. " arrow placement="top">
        <Box display="inline">Asset</Box>
      </Tooltip>
    ),
    accessor: "symbol",
    props: {
      width: 150,
    },
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
      <Tooltip title="Token count held in your external wallet." arrow placement="top">
        <Box display="inline">Wallet Balance</Box>
      </Tooltip>
    ),
    accessor: "balanceOf",
    props: {
      width: 200,
      align: "center",
    },
    Cell: ({
      value,
      row: {
        original: { isPlaceholderData, isLoading, price },
      },
    }) =>
      isPlaceholderData && isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "20%" }}>
            <LinearProgress color="primary" variant="query" />
          </div>
        </Box>
      ) : (
        <>
          <NumericText value={value} precision={4} />
          <Typography style={{ color: "#A5A8B6" }}>
            <NumericText value={(price?.lending || 0) * value} precision={2} moneyValue />
          </Typography>
        </>
      ),
  },
  {
    Header: () => (
      <Tooltip
        title="TOTAL lender deposits for this lending pool minus TOTAL outstanding."
        arrow
        placement="top"
      >
        <Box display="inline">Available to borrow</Box>
      </Tooltip>
    ),
    accessor: "cash",
    props: {
      align: "right",
      width: 170,
    },
    Cell: ({
      value,
      row: {
        original: { symbol, price, priceLoading, isPlaceholderData, isLoading },
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
      if (value === null || value === undefined) {
        return "-";
      }
      return (
        <>
          <div>
            <NumericText value={value} suffix={symbol} precision={4} />
          </div>
          {!priceLoading ? (
            <Typography style={{ color: "#A5A8B6" }}>
              <NumericText
                value={(price?.lending || price || 0) * value}
                precision={2}
                moneyValue
              />
            </Typography>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "20%" }}>
                <LinearProgress color="primary" variant="query" />
              </div>
            </Box>
          )}
        </>
      );
    },
  },
  {
    Header: () => (
      <Tooltip
        title="TOTAL lender deposits for this lending pool minus TOTAL outstanding."
        arrow
        placement="top"
      >
        <Box display="inline">Borrow APY</Box>
      </Tooltip>
    ),
    accessor: "borrowAPY",
    props: {
      align: "center",
    },
    Cell: ({
      value,
      row: {
        original: { isPlaceholderData, isLoading },
      },
    }) =>
      isPlaceholderData && isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "40%" }}>
            <LinearProgress color="primary" variant="query" />
          </div>
        </Box>
      ) : (
        <NumericText value={value?.amount || 0} suffix="%" precision={2} />
      ),
  },
];

const AvailableToReturnTable = () => {
  const classes = useCommonStyles();
  const { account } = useWallet();
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
            original: { address, symbol, underlyingTokens },
          },
        }) => (
          <div className={classes.actionButtonWrapper}>
            <DetailMenu address={address} symbol={symbol} underlyingTokens={underlyingTokens} />
          </div>
        ),
      },
    ],
    [classes.actionButtonWrapper]
  );
  const context = useBorrowContext();
  const cash = useMemo(() => get(context, ["cashFToken"], []), [context]);
  const userTokenInfo = useMemo(() => get(context, ["userTokenInfo"], []), [context]);
  const isPlaceholderData = useMemo(() => get(context, ["isPlaceholderData"]), [context]);
  const placeholderDataLoading = useMemo(() => get(context, ["placeholderDataLoading"]), [context]);
  const isLoading = useMemo(() => get(context, ["isLoading"]), [context]);

  const { getBorrowingApy } = useFetchGraphData();

  const {
    data: dummyData,
    isLoading: dummyLoading,
    error: dummyError,
  } = useGetTokensWithoutAccount();

  const { isLoading: priceLoading, data: priceData } = usePriceTokensWithoutAccount(
    dummyData?.lendingTokens
  );

  const lendingTokens = useMemo(() => {
    if (!dummyData?.lendingTokens) return dummyData?.lendingTokens;
    dummyData.lendingTokens.forEach((token) => {
      token.price = priceData?.[token.address];
      token.priceLoading = priceLoading;
    });
    return dummyData.lendingTokens;
  }, [dummyData, priceData, priceLoading]);

  const fakeData = [
    {
      balanceOf: "0.000",
      symbol: "USDC",
      logo: "/assets/coins_list/usd-coin.svg",
    },
    {
      balanceOf: "0.000",
      symbol: "USB",
      logo: "/assets/images/usb_token.png",
    },
  ];

  return (
    <Paper className={classes.table}>
      <PaperTitle>Lending Assets</PaperTitle>
      <Box mt={2}>
        {!account &&
          ((!dummyData || dummyLoading) && !dummyError ? (
            <TableSkeleton rows={6} />
          ) : (
            <Table columns={columns} data={!lendingTokens ? fakeData : lendingTokens} />
          ))}

        {account &&
          (placeholderDataLoading ? (
            <TableSkeleton rows={6} />
          ) : (
            isPlaceholderData &&
            userTokenInfo && (
              <Table
                columns={columns}
                data={userTokenInfo.map((i) => ({ ...i, isPlaceholderData, isLoading }))}
              />
            )
          ))}
        {!placeholderDataLoading &&
          !isPlaceholderData &&
          (!userTokenInfo.length ? (
            account && <TableSkeleton rows={6} />
          ) : (
            <Table
              columns={columns}
              data={userTokenInfo
                .filter((o) => o?.type === "lendingToken")
                .map((o) => {
                  const borrowAPY = getBorrowingApy(o.address);

                  return {
                    ...o,
                    cash: get(cash, [o.address, "cash"], 0),
                    borrowAPY,
                  };
                })}
            />
          ))}
      </Box>
    </Paper>
  );
};

export default AvailableToReturnTable;
