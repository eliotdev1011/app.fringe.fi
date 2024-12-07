import { Box, Button, Grid, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import format from "date-fns/format";
import { formatUnits } from "utils/number";
import _get from "lodash/get";
import { useSnackbar } from "notistack";
import { createContext, useMemo } from "react";
import ReactGa from "react-ga";

import { ReactComponent as ArrowFillRight } from "assets/svg/arrow-fill-right.svg";
import { ReactComponent as ChevronDown } from "assets/svg/chevron-down.svg";
import { CoinInfo, NumericText, SelectAssetModal, Table } from "components";
import { USD_DECIMAL } from "constants/contract";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { useModalState } from "hooks";
import { useDepositedAssetStates } from "hooks/contexts/BorrowContext/useDepositedAssetStates";
import { useFetchGraphData } from "hooks/query/graphQL/useFetchGraphData";
import { LeverageType } from "constants/leverageType";
import { useHistory } from "react-router-dom";
import numeral from "numeral";
import { whiteBgForLogo } from "utils/utils";
import { useCommonStyles } from "helpers/styles";
import { CoinActionsMenu, LogsTable } from "..";

const useStyles = makeStyles((theme) => ({
  table: {
    "& th": {
      whiteSpace: "nowrap",
    },
  },
  tableWrapper: {
    position: "relative",
  },
  opened: {
    transform: "scale(-1)",
  },
  coinInfoCell: {
    display: "flex",
  },
  chevronButton: {
    paddingLeft: 0,
  },
  coinInfoWrapper: {
    minWidth: 146,
  },

  leverageButton: {
    position: "absolute",
    overflow: "hidden",
    transition: theme.transitions.main,
    borderRadius: 50,
    minWidth: 40,
    width: 40,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    top: 56,
    left: "calc(100% + 8px)",

    "& $hiddenText": {
      textWrap: "nowrap",
    },

    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 10,
      margin: 0,
    },

    "&:hover": {
      transition: theme.transitions.main,
      width: 150,
      "&.lg": {
        width: 190,
      },

      "& $hiddenText": {
        transition: "all 1.5s",
        opacity: 1,
      },
    },

    [theme.breakpoints.down("sm")]: {
      left: "50%",
      top: "100%",
      marginTop: "7px",

      "&:hover": {
        left: "40%",
      },
    },
  },

  addButton: {
    position: "absolute",
    overflow: "hidden",
    transition: theme.transitions.main,
    borderRadius: 50,
    minWidth: 40,
    width: 40,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    top: 56,
    left: "calc(100% + 8px)",

    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 10,
      margin: 0,
    },

    "&:hover": {
      transition: theme.transitions.main,
      width: 90,

      "& $hiddenText": {
        transition: theme.transitions.main,
        opacity: 1,
      },
    },

    [theme.breakpoints.down("sm")]: {
      left: "50%",
      top: "100%",
      marginTop: "7px",
    },
  },
  hiddenText: {
    position: "absolute",
    left: 30,
    opacity: 0,
    transition: theme.transitions.main,
  },
  arrowButton: {
    background: "transparent",
    zIndex: 999,

    "& .MuiButton-startIcon": {
      visibility: "hidden",
    },

    "&:hover": {
      width: 40,

      "& .MuiButton-startIcon": {
        visibility: "visible",
      },

      "& $hiddenIcon": {
        visibility: "hidden",
      },
    },
  },
  hiddenIcon: {
    paddingTop: 7,
  },
  title: {
    color: "#4F4F4F",
    fontSize: 14,
    fontWeight: 500,
    marginRight: 40,

    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  tableHeading: {
    borderBottom: "1px solid #434849",
    marginLeft: 0,
  },
  paper: {
    width: "100%",
  },
  arrow: {
    [theme.breakpoints.down("sm")]: {
      rotate: "90deg",
    },
  },
  subRowText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
}));
export const ShareContext = createContext();

const DepositedTable = ({ data, isOpened }) => {
  const classes = useStyles();
  const commonStyle = useCommonStyles();
  const { isOpen, onOpen, onClose } = useModalState();
  const ctx = useBorrowContext();
  const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: () => (
          <Box ml={2}>
            <Tooltip title="Deposited collateral asset." arrow placement="top">
              <Box display="inline">Asset</Box>
            </Tooltip>
          </Box>
        ),
        accessor: "symbol",
        Cell: ({
          value,
          row: {
            original: {
              healthFactor,
              underlyingTokens = [],
              lendingTokenData,
              evaluation,
              symbol,
              address,
              name,
            },
            getToggleRowExpandedProps,
            isExpanded,
          },
        }) => (
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
                healthFactor={+healthFactor || null}
                symbol={symbol}
                address={address}
                name={name}
                underlyingTokens={underlyingTokens}
                currentPrice={
                  lendingTokenData ? Number(lendingTokenData.evaluation) / Number(evaluation) : 0
                }
                lendingSymbol={lendingTokenData?.symbol}
              >
                {value}
              </CoinInfo>
            </div>
          </div>
        ),
      },
      {
        Header: () => (
          <Tooltip
            title="Loan to Value Ratio for the collateral asset. The maximum borrowing capacity for a given collateral deposit = collateral value * LVR. Each collateral asset has its own LVR."
            arrow
            placement="top"
          >
            <Box display="flex" alignItems="center">
              LVR
              {/* <Tooltip title="Loan to value ratio" arrow placement="top">
                <DangerIcon />
              </Tooltip> */}
            </Box>
          </Tooltip>
        ),
        accessor: "lvr",
        Cell: ({
          row: {
            original: {
              data: { lvr },
            },
          },
        }) => <Typography color="secondary">{numeral(lvr.decimal).format("0,0%")}</Typography>,
      },
      {
        Header: () => (
          <Tooltip
            title="Token count and balance amount of the collateral you have deposited."
            arrow
            placement="top"
          >
            <Box>Collateral Balance</Box>
          </Tooltip>
        ),
        accessor: "collateralBalance",
        Cell: ({
          row: {
            original: {
              data: { collateralBalance },
            },
          },
        }) => {
          if (!collateralBalance) return null;

          const [depositedAmount, symbol, balance] = collateralBalance;

          return (
            <>
              <NumericText value={depositedAmount} suffix={symbol} precision={4} />
              <Typography className={commonStyle.dollarText}>
                <NumericText value={balance?.rounded} precision={2} moneyValue />
              </Typography>
            </>
          );
        },
      },
      {
        Header: () => (
          <Tooltip
            title="Remaining borrowing capacity for this collateral deposit. Equals Collateral Value * LVR  minus any outstanding loan amount. Avoid too a high a borrowing balance so as to avoid liquidations of your position in adverse market conditions. "
            arrow
            placement="top"
          >
            <Box>
              Remaining
              <br /> Loan Capacity
            </Box>
          </Tooltip>
        ),
        accessor: "pitRemaining",
        Cell: ({
          row: {
            original: {
              data: { pitRemaining, pitCollateral },
              lendingToken,
            },
          },
        }) => (
          <>
            <NumericText
              value={
                isOpened ? pitRemaining?.decimal?.toString() : pitCollateral?.decimal?.toString()
              }
              precision={2}
              suffix={isOpened ? lendingToken?.symbol : "PIT"}
            />
            {isOpened ? (
              <Typography className={commonStyle.dollarText}>
                <NumericText
                  value={pitRemaining?.decimal?.toString() * lendingToken?.price}
                  precision={2}
                  moneyValue
                />
              </Typography>
            ) : null}
          </>
        ),
      },

      {
        Header: "",
        accessor: "actions",
        props: {
          align: "left",
        },
        Cell: ({ row: { original } }) => (
          <>
            <CoinActionsMenu data={original} disabled={original.isLeverage} />
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, isOpened]
  );

  const { borrowLogs } = useFetchGraphData();
  const [depositedAssetStates] = useDepositedAssetStates();
  const { enqueueSnackbar } = useSnackbar();

  const renderRowSubComponent = ({ row }) => {
    const collateralCoin = _get(row, ["original", "address"], "");
    const logs = _get(borrowLogs, [collateralCoin], []).sort((a, b) => b.date - a.date);

    const pitIssuedData = depositedAssetStates.find((o) => o.address === collateralCoin);

    const liquidationThresholdList = _get(ctx, ["liquidationThresholdList"], []).find(
      (o) => o.collateralToken === collateralCoin && +o.value > 0
    );

    const {
      data: { totalOutstanding },
    } = row.original;

    return (
      <Box mt={2}>
        <Grid container className={commonStyle.table}>
          <Grid item md={12} container spacing={4} className={classes.tableHeading}>
            <Grid item>
              <Typography color="primary" className={classes.title}>
                Deposit Date
              </Typography>
              <Typography color="secondary" className={classes.subRowText}>
                {format(_get(logs, [0, "date"], 0) * 1000, "dd.MM.yyyy hh:mm a ")}
              </Typography>
            </Grid>

            <Grid item>
              <Typography color="primary" className={classes.title}>
                Liquidation Threshold
              </Typography>
              <Typography color="secondary" className={classes.subRowText}>
                <NumericText
                  value={formatUnits(_get(liquidationThresholdList, ["value"], 0), USD_DECIMAL)}
                  precision={2}
                />
                <span> | </span>
                <NumericText value={totalOutstanding.rounded || "0"} precision={2} />
              </Typography>
            </Grid>

            <Grid item>
              <Typography color="primary" className={classes.title}>
                PIT Issued
              </Typography>
              <Typography color="secondary" className={classes.subRowText}>
                <NumericText
                  value={_get(pitIssuedData, ["issuedInUsd"], 0)}
                  suffix="PIT"
                  precision={2}
                />
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <LogsTable logs={logs} />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleBorrow = () => {
    if (data?.isLeverage) {
      enqueueSnackbar("That is Leverage Position!", { variant: "warning", autoHideDuration: 5000 });
      return;
    }
    onOpen();

    ReactGa.event({
      category: "Borrower Dashboard",
      action: "Borrow",
    });
  };

  const handleViewLeverage = () => {
    if (data?.leverageType === LeverageType.MARGIN_TRADE) {
      history.push("/margin-trade");
    } else {
      history.push("/amplify");
    }
  };
  return (
    <div className={classes.tableWrapper}>
      <Paper className={clsx(classes.paper, commonStyle.table)}>
        <Table
          columns={columns}
          data={[data]}
          className={classes.table}
          renderRowSubComponent={renderRowSubComponent}
        />
      </Paper>

      {data?.isLeverage ? (
        <Button
          startIcon={<AddIcon />}
          className={[
            classes.leverageButton,
            commonStyle.actionButton,
            data?.leverageType === LeverageType.MARGIN_TRADE ? "lg" : "",
          ]}
          onClick={handleViewLeverage}
        >
          {data?.leverageType === LeverageType.MARGIN_TRADE ? (
            <span className={classes.hiddenText}>View on Margin Trade</span>
          ) : (
            <span className={classes.hiddenText}>View on Amplify</span>
          )}
        </Button>
      ) : (
        <>
          {data?.data?.lendingAsset ? (
            <Button
              startIcon={<AddIcon />}
              className={clsx(classes.addButton, classes.arrowButton, commonStyle.actionButton)}
              onClick={handleBorrow}
            >
              <span className={classes.hiddenIcon}>
                <ArrowFillRight className={classes.arrow} />
              </span>
            </Button>
          ) : (
            <Button
              startIcon={<AddIcon />}
              className={clsx(classes.addButton, commonStyle.actionButton)}
              onClick={handleBorrow}
            >
              <span className={classes.hiddenText}>Borrow</span>
            </Button>
          )}
        </>
      )}

      <SelectAssetModal open={isOpen} onClose={onClose} data={data} />
    </div>
  );
};

export default DepositedTable;
