/* eslint-disable no-await-in-loop */
import { PriceContractMethod, ERC20TokenMethod, MulticallMethod } from "constants/methodName";
import { BigNumber, Contract } from "ethers";
import BNjs from "bignumber.js";
import { formatUnits, numberToString } from "utils/number";
import { useFetchGraphData } from "hooks/query/graphQL/useFetchGraphData";
import { useMultiCallContract } from "hooks/contract/multicall/useMultiCallContract";
import useWallet from "hooks/useWallet";
import { flatten, get, groupBy, isEmpty } from "lodash";
import { useQuery } from "react-query";
import { ERC20TokenABI } from "utils/ethereum/abi";
import { generateMulticallRequest } from "utils/contract/multicall";
import { isWrapNative, mappingTokenInfo } from "utils/token";
import { ContractName } from "constants/contractName";
import { useMemo } from "react";
import { useDataToUpdatePrice } from "hooks/pyth/useDataToUpdatePrice";
import { usePITContractRead } from "./usePITContract";
import { usePriceContract } from "./core/usePriceContract";

const handleGetDataFromResultZkSyncMulticall = ({ contractRefs = [], methodName, resultInRaw }) =>
  flatten(
    contractRefs.map((ref) => {
      const contract = get(resultInRaw, [ref], []);

      const groupByMethod = groupBy(contract, "methodName");
      const methodResult = get(groupByMethod, methodName, []);

      return [...methodResult].map((e) => ({ ...e, contractAddress: e.contract.address }));
    })
  );

const handleGetRequest = async ({
  availableBorrowTokens,
  account,
  PriceContract,
  MultiCallContract,
  pythData,
}) => {
  const requests = [
    generateMulticallRequest(
      MultiCallContract,
      MulticallMethod.getEthBalance,
      [account],
      MultiCallContract.address,
      ContractName.MultiCallContract
    ),
  ];
  const listRequestPrice = [];

  for (let idx = 0; idx < availableBorrowTokens.length; idx += 1) {
    const token = availableBorrowTokens[idx];
    const erc20Contract = new Contract(token.address, ERC20TokenABI);

    const listTokenRequest = [
      generateMulticallRequest(
        erc20Contract,
        ERC20TokenMethod.balanceOf,
        [account],
        erc20Contract.address,
        erc20Contract.address
      ),
      generateMulticallRequest(
        erc20Contract,
        ERC20TokenMethod.decimals,
        [],
        erc20Contract.address,
        erc20Contract.address
      ),
      generateMulticallRequest(
        erc20Contract,
        ERC20TokenMethod.name,
        [],
        erc20Contract.address,
        erc20Contract.address
      ),
      generateMulticallRequest(
        erc20Contract,
        ERC20TokenMethod.symbol,
        [],
        erc20Contract.address,
        erc20Contract.address
      ),
    ];

    requests.push(...listTokenRequest);

    listRequestPrice.push(
      generateMulticallRequest(
        PriceContract,
        PriceContractMethod.getUpdatedPriceMethod,
        [token.address, pythData?.priceIds, pythData?.updateData],
        token.address,
        ContractName.PriceContract,
        pythData?.payableAmount
      )
    );
  }

  return [...requests, ...listRequestPrice];
};

export const useUserTokenInfo = () => {
  const { availableBorrowTokens } = useFetchGraphData();

  const { account, chainId, provider } = useWallet();
  const { callRequest, multiCallSMC: MultiCallContract } = useMultiCallContract();

  const { PriceContract } = usePriceContract();
  const {
    data: { PitContract },
  } = usePITContractRead();
  const tokenAddressList = useMemo(
    () => availableBorrowTokens.map((t) => t.address),
    [availableBorrowTokens]
  );
  const { refetch } = useDataToUpdatePrice(tokenAddressList);

  const res = useQuery(
    ["f-token-info", account, chainId, tokenAddressList.sort().toString()],
    async () => {
      const { data: pythData } = await refetch();
      const requests = await handleGetRequest({
        PitContract,
        availableBorrowTokens,
        account,
        provider,
        PriceContract,
        MultiCallContract,
        pythData,
      });

      const results = await callRequest(requests);

      const nativeBalanceData = handleGetDataFromResultZkSyncMulticall({
        contractRefs: [ContractName.MultiCallContract],
        methodName: MulticallMethod.getEthBalance,
        resultInRaw: results,
      }).map((o) => {
        const value = get(o, ["returnValues", 0], BigNumber.from(0));
        return {
          formatted: numberToString(value / 10 ** 18),
          value,
        };
      });

      const nativeBalance = nativeBalanceData[0]?.formatted;
      const priceOfTokens = handleGetDataFromResultZkSyncMulticall({
        contractRefs: [ContractName.PriceContract],
        methodName: PriceContractMethod.getUpdatedPriceMethod,
        resultInRaw: results,
      }).map((o) => {
        const priceDecimal = get(o, ["returnValues", 0], 0);
        const lendingPriceBN = get(o, ["returnValues", 3], 0);
        const lendingToken = get(o, ["reference"], "");
        return {
          price: formatUnits(lendingPriceBN, priceDecimal),
          lendingToken,
        };
      });

      const fTokens = availableBorrowTokens.map((o) => ({
        lendingToken: o.address,
        ftoken: o.fTokenAddress,
      }));

      const decimalOfLendingToken = handleGetDataFromResultZkSyncMulticall({
        contractRefs: availableBorrowTokens.map((l) => l.address),
        methodName: ERC20TokenMethod.decimals,
        resultInRaw: results,
      }).map((o) => ({
        token: get(o, "contractAddress", ""),
        value: BigNumber.from(get(o, ["returnValues"], "")).toString(),
      }));

      const balanceOfLendingToken = handleGetDataFromResultZkSyncMulticall({
        contractRefs: availableBorrowTokens.map((l) => l.address),
        methodName: ERC20TokenMethod.balanceOf,
        resultInRaw: results,
      }).map((o, idx) => {
        const lendingToken = get(o, "contractAddress", "");

        const balance = isWrapNative(lendingToken, chainId)
          ? nativeBalance
          : formatUnits(get(o, ["returnValues", 0], ""), decimalOfLendingToken[idx].value);
        const priceInfo = priceOfTokens.find((p) => p.lendingToken === lendingToken);
        const availableBorrowToken = availableBorrowTokens.find((x) => x.address === lendingToken);
        return {
          token: lendingToken,
          balance,
          balanceInUsd: new BNjs(balance).multipliedBy(priceInfo?.price).toString(),
          decimal: decimalOfLendingToken[idx].value,
          priceInfo,
          ...mappingTokenInfo(availableBorrowToken, chainId),
        };
      });

      return {
        fTokens,
        balanceOfLendingToken,
        priceLendingToken: priceOfTokens,
      };
    },
    {
      enabled: !isEmpty(availableBorrowTokens) && !!PitContract && !!PriceContract,
    }
  );

  return res;
};
