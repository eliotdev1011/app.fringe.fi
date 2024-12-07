import { Box, Button, Paper, Tooltip } from "@material-ui/core";
import { CoinInfo, Dialog, NumericText, PaperTitle, ShareModal, Table } from "components";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "hooks";
import { whiteBgForLogo } from "utils/utils";
import { useCommonStyles } from "helpers/styles";
import clsx from "clsx";
import DetailMenu from "components/CoinInfo/DetailMenu";
import { RedeemModal } from "../RedeemModal";
import { SupplyModal } from "../SupplyModal/index";
import { ShareLendingContext } from "./ShareLendingContext";

const COLUMNS = [
  {
    Header: () => (
      <Tooltip
        title="List of assets that can be lent on the platform to earn interest. "
        arrow
        placement="top"
      >
        <Box display="inline">Asset</Box>
      </Tooltip>
    ),
    accessor: "name",
    props: {
      width: 140,
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
        address={address}
        name={name}
        symbol={symbol}
        underlyingTokens={underlyingTokens}
      >
        {symbol}
      </CoinInfo>
    ),
  },
  {
    Header: () => (
      <Tooltip
        title="Current Annual Percentage Yield for each capital asset. Each capital asset has a separate market. Prevailing lender deposits vs borrower demand affects the market's APY."
        arrow
        placement="top"
      >
        <Box display="inline">Supply APY</Box>
      </Tooltip>
    ),
    accessor: "apy",
    props: {
      width: 100,
    },
    Cell: ({ value }) => <NumericText value={value} precision={2} suffix="%" />,
  },
  {
    Header: () => (
      <Tooltip
        title="Token count and value of your interest-earning deposits."
        arrow
        placement="top"
      >
        <Box display="inline">Supplied</Box>
      </Tooltip>
    ),
    accessor: "balanceOfUnderlyingView",
    props: {
      width: 100,
    },
    Cell: ({
      value,
      row: {
        original: { priceInfo },
      },
    }) => (
      <>
        <NumericText value={value} precision={4} />
        <Box style={{ color: "#A5A8B6" }}>
          <NumericText
            value={Number(priceInfo?.price || 0) * Number(value).toFixed(9)}
            precision={4}
            moneyValue
          />
        </Box>
      </>
    ),
  },
  {
    Header: () => (
      <Tooltip title="Token count and value held in your external wallet." arrow placement="top">
        <Box display="inline">Wallet Balance</Box>
      </Tooltip>
    ),
    accessor: "balance",
    props: {
      width: 150,
    },
    Cell: ({
      value,
      row: {
        original: { balanceInUsd },
      },
    }) => (
      <>
        <NumericText value={value} precision={4} />
        <Box style={{ color: "#A5A8B6" }}>
          <NumericText value={Number(balanceInUsd).toFixed(9)} precision={2} moneyValue />
        </Box>
      </>
    ),
  },
];
const LendingAssetsTable = ({ dataSource: data = [] }) => {
  const classes = useCommonStyles();
  const [modalData, setModalData] = useState();
  const [modalWithdrawData, setModalWithdrawData] = useState();
  const [openShare, setOpenShare] = useState(false);
  const { account } = useWallet();

  const [shareData, setShareData] = useState({
    token: "",
    amount: "",
    apy: "",
    colToken: "",
  });

  const onClose = () => {
    setModalData(null);
    setModalWithdrawData(null);
  };
  const handleClose = () => {
    setOpenShare(false);
  };
  useEffect(() => {
    if (!data) return;
    if (!modalData) return;

    const activeToken = data.find(({ lendingToken }) => lendingToken === modalData.lendingToken);
    if (activeToken) {
      setModalData(activeToken);
    }
  }, [data, modalData]);

  useEffect(() => {
    setModalData(undefined);
    setModalWithdrawData(undefined);
  }, [account]);

  const columns = useMemo(
    () => [
      ...COLUMNS,
      {
        Header: "",
        accessor: "button",
        props: {
          align: "right",
          width: 50,
        },
        Cell: ({ row: { original } }) => (
          <Box className={classes.actionButtonWrapper}>
            <Button
              className={classes.actionButton}
              fullWidth
              onClick={() => {
                setModalData(original);
              }}
              style={{ marginRight: 16, height: 36, width: 80 }}
            >
              Deposit
            </Button>
            <Button
              className={classes.actionButton}
              fullWidth
              onClick={() => {
                setModalWithdrawData(original);
              }}
              style={{ height: 36, width: 80 }}
            >
              Withdraw
            </Button>
            <DetailMenu
              address={original?.address}
              symbol={original?.symbol}
              underlyingTokens={original?.underlyingTokens}
            />
          </Box>
        ),
      },
    ],
    [classes.actionButton, classes.actionButtonWrapper]
  );

  return (
    <ShareLendingContext.Provider value={{ shareData, setShareData }}>
      <div className={classes.flexCenter}>
        <Paper className={clsx(classes.table, classes.w70)}>
          <PaperTitle>Lending Assets</PaperTitle>
          <Box mt={2}>
            <Table columns={columns} data={data} />
          </Box>

          {account && (
            <>
              {modalData && (
                <Dialog open={modalData} onClose={onClose} noPadding>
                  <SupplyModal
                    data={{
                      ...modalData,
                    }}
                    onClose={onClose}
                    openShare={() => setOpenShare(true)}
                  />
                </Dialog>
              )}

              {modalWithdrawData && (
                <Dialog open={modalWithdrawData} onClose={onClose} noPadding>
                  <RedeemModal
                    data={{
                      ...modalWithdrawData,
                      lendingTokenBalance: modalWithdrawData.balanceOfUnderlyingView,
                    }}
                    onClose={onClose}
                  />
                </Dialog>
              )}
            </>
          )}
        </Paper>
      </div>
      <ShareModal open={openShare} onCloseModal={handleClose} data={shareData} type="lending" />
    </ShareLendingContext.Provider>
  );
};

export default LendingAssetsTable;
