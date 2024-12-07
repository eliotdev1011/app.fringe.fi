import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Skeleton } from "@material-ui/lab";
import { Box } from "@mui/material";
import { CoinInfo } from "components/CoinInfo";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { constants } from "ethers";
import { useWallet } from "hooks";
import { get } from "lodash";
import React from "react";
import { MainNetworkSupported, isEqualLowerString } from "utils/network";
import { whiteBgForLogo } from "utils/utils";

const NO_VALUE = "No valid asset found";

const useStyles = makeStyles((theme) => ({
  SelectItem: {
    color: "#fff",
    background: "#000",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    minHeight: "70px",
  },
  selectStyled: {
    width: "100%",
    maxWidth: "260px",
    minHeight: "58px",
    background: "#000",
    color: "#fff",
    fontSize: "14px",
    position: "relative",
    marginTop: "8px",
    display: "flex",
    border: "#fff 2px solid",
    borderRadius: "10px",

    [theme.breakpoints.down("xs")]: {
      maxWidth: "unset",
    },

    "& .MuiSelect-icon": {
      color: "#fff",
      marginRight: "10px",
      fontSize: "30px",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "42px",
    },
    "@media(max-width: 576px)": {
      width: "100%",
    },
  },
  imgIcon: {
    width: "42px",
    height: "42px",
    marginRight: "8px",
    borderRadius: "50%",
  },
  arrowIcon: {
    width: "30px !important",
    cursor: "pointer",
  },
  logo: {
    width: "45px",
    marginRight: "8px",
  },
  skeletonWrapper: {
    marginTop: "8px",
    borderRadius: "10px",
  },
  menuPaper: {
    maxHeight: 366,
  },
}));

const SelectShortAsset = ({
  setSelectAsset = () => {},
  assets = [],
  assetSelected,
  longAssets = [],
}) => {
  const classes = useStyles();
  const { chainId } = useWallet();
  const { pairToken: lendingPairToken } = useBorrowContext();
  const usdcToken = localStorage.getItem("usdcToken");

  return (
    <>
      {assets ? (
        <Select
          onChange={(e) => {
            setSelectAsset(e.target.value);
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          className={classes.selectStyled}
          value={assetSelected?.address || NO_VALUE}
          MenuProps={{
            classes: {
              paper: classes.menuPaper,
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
            MenuListProps: {
              sx: {
                backgroundColor: "red",
              },
            },
          }}
          IconComponent={({ ...rest }) => <ExpandMoreIcon {...rest} />}
        >
          {assets?.length > 0 ? (
            assets.map((item) => {
              const arrayCollateHavePair = longAssets.filter((collat) => {
                const isHavePair = !isEqualLowerString(
                  get(collat, ["pairToken", item?.address]),
                  constants.AddressZero
                );

                return isHavePair;
              });

              const isDisable = isEqualLowerString(item.address, usdcToken)
                ? arrayCollateHavePair.length === 0
                : item?.underlyingTokens?.length === 0 &&
                  (arrayCollateHavePair.length === 0 ||
                    isEqualLowerString(lendingPairToken[item?.address], constants.AddressZero));

              return (
                <MenuItem
                  key={item?.address}
                  className={classes.SelectItem}
                  value={item?.address}
                  name={item?.symbol}
                  disabled={MainNetworkSupported.includes(+chainId) ? false : isDisable}
                >
                  <Box sx={{ ml: 1 }}>
                    <CoinInfo
                      whiteBg={whiteBgForLogo(item?.symbol)}
                      symbol={item?.symbol}
                      address={item?.address}
                      name={item?.name}
                      underlyingTokens={item?.underlyingTokens}
                    >
                      {item?.symbol}
                    </CoinInfo>
                  </Box>
                </MenuItem>
              );
            })
          ) : (
            <MenuItem className={classes.SelectItem} value={NO_VALUE} disabled>
              No valid asset found
            </MenuItem>
          )}
        </Select>
      ) : (
        <Skeleton
          className={classes.skeletonWrapper}
          animation="wave"
          variant="rounded"
          width={260}
          height={58}
        />
      )}
    </>
  );
};

export default React.memo(SelectShortAsset);
