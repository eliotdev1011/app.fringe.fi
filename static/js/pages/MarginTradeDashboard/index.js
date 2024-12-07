import { TokenProvider } from "context/tokens";
import MetaTags from "react-meta-tags";
import metaImg from "assets/meta-img.png";

import { withWalletLoader } from "HOCFunction";
import { MarginTradeContextProvider } from "context/InstantsLeverage/MarginTradeContext/MarginTradeContext";
import { MarginTradeDashboard } from "./MarginTradeDashboard";

export const MarginTrade = withWalletLoader(() => (
  <>
    <MetaTags>
      <title>Margin Trade | Fringe Finance</title>
      <meta
        name="description"
        content="Unlock Greater Trading Opportunities with Fringe.fi's Margin Trading. Borrow stablecoins and other assets against your cryptocurrency holdings to amplify your trading power. Take advantage of leverage to maximize potential gains and diversify your portfolio. Discover the world of margin trading today and elevate your trading strategies with Fringe.fi."
      />
      <meta property="og:title" content="Margin Trade | Fringe Finance" />
      <meta
        property="og:description"
        content="Unlock Greater Trading Opportunities with Fringe.fi's Margin Trading. Borrow stablecoins and other assets against your cryptocurrency holdings to amplify your trading power. Take advantage of leverage to maximize potential gains and diversify your portfolio. Discover the world of margin trading today and elevate your trading strategies with Fringe.fi."
      />
      <meta property="og:image" content={metaImg} />
    </MetaTags>
    <TokenProvider>
      <MarginTradeContextProvider>
        <MarginTradeDashboard />
      </MarginTradeContextProvider>
    </TokenProvider>
  </>
));

export default MarginTrade;
