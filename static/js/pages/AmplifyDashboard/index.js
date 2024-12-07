import { TokenProvider } from "context/tokens";
import { withWalletLoader } from "HOCFunction";
import MetaTags from "react-meta-tags";
import metaImg from "assets/meta-img.png";
import { AmplifyContextProvider } from "context/InstantsLeverage/AmplifyContext/AmplifyContext";
import { AmplifyDashboard } from "./AmplifyDashboard";

export const Amplify = withWalletLoader(() => (
  <>
    <MetaTags>
      <title>Amplify | Fringe Finance</title>
      <meta
        name="description"
        content="Allows you to amplify your collateral by establishing a leveraged position."
      />
      <meta property="og:title" content="Amplify | Fringe Finance" />
      <meta
        property="og:description"
        content="Allows you to amplify your collateral by establishing a leveraged position."
      />
      <meta property="og:image" content={metaImg} />
    </MetaTags>
    <TokenProvider>
      <AmplifyContextProvider>
        <AmplifyDashboard />
      </AmplifyContextProvider>
    </TokenProvider>
  </>
));

export default Amplify;
