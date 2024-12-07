import clsx from "clsx";
import { useCallback, useMemo } from "react";
import ReactGa from "react-ga";

import { Box, Button, Grid, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CoinInfo, Dialog, NumericText, RepayModal, Table } from "components";
import { useModalState } from "hooks";

import { ReactComponent as ChevronDown } from "assets/svg/chevron-down.svg";
import { useLendingAssetContext } from "context/tokens/BorrowTokenContext";
import { useFetchGraphData } from "hooks/query/graphQL/useFetchGraphData";
import { get } from "lodash";
import numeral from "numeral";
import { whiteBgForLogo } from "utils/utils";
import { useCommonStyles } from "helpers/styles";
import DetailMenu from "components/CoinInfo/DetailMenu";

const useStyles = makeStyles((theme) => ({
  table: {
    ".MuiTableCell-head.MuiTableCell-sizeSmall": {
      padding: 8,
    },
    "& th:nth-child(3)": {
      minWidth: 130,
    },
    "& th:nth-child(4)": {
      minWidth: 150,
    },
  },
  opened: {
    transform: "scale(-1)",
  },
  coinInfoCell: {
    display: "flex",
  },
  chevronButton: {
    paddingLeft: 0,
    paddingRight: 6,
  },
  coinInfoWrapper: {},
  tableHeading: {
    marginLeft: 0,
  },
  title: {
    color: "#4F4F4F",
    fontSize: 14,
    fontWeight: 500,

    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  subRowText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));

const BorrowedTable = ({ data: propData }) => {
  const classes = useStyles();
  const commonStyle = useCommonStyles();
  const { isOpen, onOpen, onClose } = useModalState();
  const { data: lendingCtx } = useLendingAssetContext();
  const { getBorrowingApy } = useFetchGraphData();

  const borrowApy = useMemo(
    () => getBorrowingApy(propData?.lendingToken?.address),
    [propData?.lendingToken?.address, getBorrowingApy]
  );

  const data = useMemo(
    () => ({ ...propData, apy: get(borrowApy, "amount") || propData?.apy }),
    [borrowApy, propData]
  );

  const [lendingTokenDecimal, lendingTokenAddress] = useMemo(
    () => [
      get(data, ["lendingToken", "decimal"], "0"),
      get(data, ["lendingToken", "address"], "0"),
    ],
    [data]
  );
  const [priceOfLendingToken] = useMemo(
    () => [
      get(lendingCtx, ["priceLendingToken"], [])?.find(
        (o) => o.lendingToken === lendingTokenAddress
      )?.price,
    ],
    [lendingCtx, lendingTokenAddress]
  );

  const handleClick = useCallback(() => {
    onOpen();

    ReactGa.event({
      category: "Borrower Dashboard",
      action: "Repay",
    });
  }, [onOpen]);

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <Tooltip title="Borrowed asset." arrow placement="top">
            <Box display="inline">Asset</Box>
          </Tooltip>
        ),
        accessor: "asset",
        Cell: ({ row: { original, getToggleRowExpandedProps, isExpanded } }) => {
          const symbol = useMemo(() => get(original, ["lendingToken", "symbol"]), [original]);
          const name = useMemo(() => get(original, ["lendingToken", "name"]), [original]);
          const address = useMemo(() => get(original, ["lendingToken", "address"]), [original]);
          const underlyingTokens = useMemo(
            () => get(original, ["lendingToken", "underlyingTokens"], []),
            [original]
          );

          return (
            <div className={classes.coinInfoCell}>
              <IconButton {...getToggleRowExpandedProps()} className={classes.chevronButton}>
                <ChevronDown className={clsx({ [classes.opened]: isExpanded })} />
              </IconButton>

              <div className={classes.coinInfoWrapper}>
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
                  <span className="lending-token-name">{symbol}</span>
                </CoinInfo>
              </div>
            </div>
          );
        },
      },
      {
        Header: () => (
          <Tooltip title="LVR" arrow placement="top">
            <Box display="inline">LVR</Box>
          </Tooltip>
        ),
        accessor: "lvr",
        props: {
          width: 150,
        },
        Cell: ({ row: { original } }) => {
          const lvr = useMemo(() => get(original, ["lendingToken", "lvr"]), [original]);
          return <Typography color="secondary">{numeral(lvr).format("0,0%")}</Typography>;
        },
      },
      {
        Header: () => (
          <Tooltip
            title="Accrued interest against the loan position. (Accruals are repaid first whenever you make a repayment.)"
            arrow
            placement="top"
          >
            <Box>Accrual</Box>
          </Tooltip>
        ),
        accessor: "accrual",
        props: {
          width: 150,
        },
        Cell: ({
          row: {
            original: {
              data: { accrual, lendingAsset },
            },
          },
        }) => (
          <>
            <NumericText value={accrual?.decimal || 0} precision={2} suffix={lendingAsset} />
            <Typography className={commonStyle.dollarText}>
              <NumericText
                value={(accrual?.decimal || 0) * priceOfLendingToken}
                precision={2}
                moneyValue
              />
            </Typography>
          </>
        ),
      },
      {
        Header: () => (
          <Tooltip
            title="Your outstanding loan amount including accrued interest."
            arrow
            placement="top"
          >
            <Box>
              Total <br />
              Outstanding
            </Box>
          </Tooltip>
        ),
        accessor: "totalOutstanding",
        props: {
          width: 90,
        },
        Cell: ({
          row: {
            original: {
              data: { totalOutstanding, lendingAsset },
            },
          },
        }) => (
          <>
            <Box>
              <NumericText
                suffix={lendingAsset}
                value={totalOutstanding?.decimal || "0.00"}
                precision={4}
              />
            </Box>
            <Box className={commonStyle.dollarText}>
              <NumericText
                value={totalOutstanding?.decimal * priceOfLendingToken || "0.00"}
                precision={2}
                moneyValue
              />
            </Box>
          </>
        ),
      },

      {
        Header: "",
        accessor: "button",
        props: {
          align: "center",
        },
        Cell: ({
          row: {
            original: {
              lendingToken: { address, symbol, underlyingTokens },
            },
          },
        }) => (
          <div className={commonStyle.actionButtonWrapper}>
            <Button
              className={commonStyle.actionButton}
              style={{ height: 36, width: 80 }}
              onClick={handleClick}
            >
              Repay
            </Button>
            <DetailMenu address={address} symbol={symbol} underlyingTokens={underlyingTokens} />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      classes.chevronButton,
      classes.coinInfoCell,
      classes.coinInfoWrapper,
      classes.opened,
      handleClick,
      lendingTokenDecimal,
    ]
  );

  const renderRowSubComponent = ({ row }) => {
    const { apy, data: rowData } = row.original;

    const loadBalance = get(rowData, "loanBalance", 0);

    return (
      <Box my={2}>
        <Grid container className={commonStyle.table}>
          <Grid item md={12} container spacing={4} className={classes.tableHeading}>
            <Grid item>
              <Typography color="primary" className={classes.title}>
                APY
              </Typography>
              <Typography color="secondary" className={classes.subRowText}>
                <NumericText value={apy || ""} suffix="%" />
              </Typography>
            </Grid>

            <Grid item>
              <Typography color="primary" className={classes.title}>
                Loan Balance
              </Typography>
              <Typography color="secondary" className={classes.subRowText}>
                <NumericText value={loadBalance || "0"} precision={2} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };
  return (
    <Paper className={commonStyle.table}>
      <Table
        columns={columns}
        data={[data]}
        renderRowSubComponent={renderRowSubComponent}
        className={classes.table}
      />
      <Dialog open={isOpen} onClose={onClose} noPadding>
        <RepayModal data={data} onClose={onClose} />
      </Dialog>
    </Paper>
  );
};

export default BorrowedTable;
