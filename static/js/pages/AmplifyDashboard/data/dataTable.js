import { Box } from "@material-ui/core";
import { CoinInfo } from "components";
import { IconInfo } from "components/Leveraged/IconInfo";
import { Text } from "components/Title/Text";
import { whiteBgForLogo } from "utils/utils";

export const columns = [
  {
    Header: "Asset",
    accessor: "asset",
    Cell: ({
      value,
      row: {
        original: { name, symbol, address, underlyingTokens },
      },
    }) => (
      <CoinInfo
        whiteBg={whiteBgForLogo(symbol)}
        symbol={symbol}
        address={address}
        name={name}
        underlyingTokens={underlyingTokens}
      >
        {value}
      </CoinInfo>
    ),
  },
  { Header: "Current Price", accessor: "currentPrice", Cell: ({ value }) => <Box>{value}</Box> },
  {
    accessor: "liquidationPrice",
    Header: "Liquidation Price",
    label: "Liquidation Price",
    Cell: ({ value }) => <Box>{value}</Box>,
  },
  {
    Header: "Safety Buffer",
    accessor: "safetyBuffer",
    Cell: ({ value }) => <Box className="buffer-color">{value}</Box>,
  },
  {
    Header: "APY",
    accessor: "apy",
    Cell: ({ value }) => <Box>{value}</Box>,
  },
  {
    Header: "Exposure",
    accessor: "exposure",
    Cell: ({
      value,
      row: {
        original: { exposureUSD },
      },
    }) => (
      <Box>
        <Box>{exposureUSD}</Box>
        <Box style={{ whiteSpace: "nowrap" }}>{value}</Box>
      </Box>
    ),
  },
  {
    Header: (
      <Box display="flex" gridGap={2}>
        <Text>Equity</Text>
        <IconInfo title="Total Long Asset Current Value minus (Total Short Asset Current Value including interest accrued)" />
      </Box>
    ),
    accessor: "equity",
    Cell: ({
      value,
      row: {
        original: { equityUSD },
      },
    }) => (
      <Box>
        <Box>{equityUSD}</Box>
        <Box style={{ whiteSpace: "nowrap" }}>{value}</Box>
      </Box>
    ),
  },
  {
    Header: (
      <Box display="flex" gridGap={2}>
        <Text>Profit/Loss</Text>
        <IconInfo title="Change in value of your additional exposure." />
      </Box>
    ),
    accessor: "profit",
    Cell: ({
      value,
      row: {
        original: { profitUSD },
      },
    }) => (
      <Box>
        <Box>{profitUSD}</Box>
        <Box style={{ whiteSpace: "nowrap" }}>{value}</Box>
      </Box>
    ),
  },
];
