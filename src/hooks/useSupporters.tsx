import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { APIService } from "../services/apiService";
import { NODE_ENDPOINT } from "../utils/constants";
import { getSupportersForCreator } from "../utils/main";
import { INetwork, ISupporter, ISupporters } from "../utils/types";
import * as _ from "lodash";
interface IState {
  committedSupporters: ISupporters;
  uncommittedSupporters: ISupporters;
  loading: boolean;
}

export const useSupporters = (
  creator: string | undefined,
  rate: number,
  network: INetwork
) => {
  const [state, setState] = useState<IState>({
    committedSupporters: [],
    uncommittedSupporters: [],
    loading: false,
  });

  const getSupporters = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const wsProvider = new WsProvider(NODE_ENDPOINT[network]);
      const api = await ApiPromise.create({ provider: wsProvider });
      const apiService = new APIService(api);
      const { committedSupporters, uncommittedSupporters } =
        await getSupportersForCreator(creator);

      // get balances
      const committedSupporterBalances = await apiService.getBalances(
        committedSupporters.map(
          (supporter: ISupporter) => supporter.pureProxy as string
        )
      );
      const uncommittedSupporterBalances = await apiService.getBalances(
        uncommittedSupporters.map(
          (supporter: ISupporter) => supporter.address as string
        )
      );

      const _committedSupporters: any[] = [];
      const _uncommittedSupporters: any[] = [];
      // filter accounts that has balances that is greater than the rate
      committedSupporters.forEach((supporter: ISupporter, index: number) => {
        const _balance =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          committedSupporterBalances[index]?.toHuman().data.free;
        // format number wirh commas: '1,000,890,001,100'
        const balance = Number(_balance?.replace(/,/g, ""));

        _committedSupporters.push({
          ...supporter,
          pureBalance: balance,
        });
      });

      uncommittedSupporters.forEach((supporter: any, index: any) => {
        const _balance =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uncommittedSupporterBalances[index]?.toHuman().data.free;
        // format number wirh commas: '1,000,890,001,100'
        const balance = Number(_balance?.replace(/,/g, ""));
        _uncommittedSupporters.push({
          ...supporter,
          supporterBalance: balance,
        });
      });

      setState((prev) => ({
        ...prev,
        committedSupporters: _committedSupporters,
        uncommittedSupporters: _uncommittedSupporters,
      }));
    } catch (error) {
      console.error("getSupporters error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getSupporters();
  }, [creator, rate]);
  return { ...state, getSupporters };
};
