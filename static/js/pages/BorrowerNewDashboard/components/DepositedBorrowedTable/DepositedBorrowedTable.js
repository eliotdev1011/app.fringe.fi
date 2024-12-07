/* eslint-disable no-unused-vars */
import { Box, Grid } from "@material-ui/core";
import { PaperTitle, TableSkeleton } from "components";
import { get } from "lodash";
import { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";

import useAllBorrowData from "hooks/contexts/BorrowContext/useAllBorrowData";
import { useDepositedAssetStates } from "hooks/contexts/BorrowContext/useDepositedAssetStates";
import { useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@mui/material";
import { useBorrowContext } from "context/contracts/BorrowContext";
import { BorrowedTable, DepositedTable } from "../index";

const useStyles = makeStyles((theme) => ({
  rowItem: {
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
}));

const DepositedBorrowedTable = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoading } = useBorrowContext();
  const [data] = useDepositedAssetStates();
  const { lendingTokensObj, collateralTokenObj } = useAllBorrowData();

  const showBorrowedTitle = useMemo(() => data.some((coin) => coin?.data?.loanBalance), [data]);
  const sortedData = useMemo(
    () =>
      data.map((o) => {
        const apy = get(lendingTokensObj, [o?.lendingToken?.address, "borrowApy"], 0);
        return { ...collateralTokenObj[o.address], ...o, apy };
      }),
    [collateralTokenObj, data, lendingTokensObj]
  );

  return isLoading ? (
    <DepositedBorrowedSkeletonTable />
  ) : (
    <>
      <Box mb={isSm ? 10 : 2}>
        <Grid container spacing={isSm ? 5 : 7}>
          {sortedData.map((o, index) => {
            const coin = { ...o };
            return (
              <Grid
                key={`${coin?.address}-row`}
                container
                item
                className={classes.rowItem}
                spacing={isSm ? 0 : 7}
              >
                <Grid item sm={12} md={6}>
                  {index === 0 && <PaperTitle>Collateral Deposited</PaperTitle>}
                  {index > 0 && isSm && <PaperTitle>Collateral Deposited</PaperTitle>}

                  <DepositedTable
                    data={coin}
                    isOpened={+coin?.data?.loanBalance > 0 && !coin?.isLeverage}
                  />
                </Grid>

                <Grid item sm={12} md={6}>
                  {index === 0 && !isSm && showBorrowedTitle && <PaperTitle>Borrowed</PaperTitle>}
                  {index >= 0 &&
                    showBorrowedTitle &&
                    isSm &&
                    +coin?.data?.loanBalance > 0 &&
                    !coin?.isLeverage && <PaperTitle>Borrowed</PaperTitle>}
                  {+coin?.data?.loanBalance > 0 && !coin?.isLeverage && (
                    <BorrowedTable data={coin} />
                  )}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default DepositedBorrowedTable;

const DepositedBorrowedSkeletonTable = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box mb={isSm ? 10 : 2}>
      <Grid container spacing={isSm ? 5 : 7}>
        {new Array(3).fill(undefined).map((_, index) => (
          <Grid container item className={classes.rowItem} spacing={isSm ? 0 : 7}>
            <Grid item sm={12} md={6}>
              {index === 0 && <PaperTitle>Collateral Deposited</PaperTitle>}
              {index > 0 && isSm && <PaperTitle>Collateral Deposited</PaperTitle>}

              <TableSkeleton rows={1} />
            </Grid>

            <Grid item sm={12} md={6}>
              {index === 0 && !isSm && <PaperTitle>Borrowed</PaperTitle>}
              {index >= 0 && isSm && <PaperTitle>Borrowed</PaperTitle>}
              {/* {!isSm && <PaperTitle>Borrowed</PaperTitle>} */}
              <TableSkeleton rows={1} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
