import React, { useEffect, useState } from "react";
import { SubscribeModal } from "../../components/SubscribeModal";
import { useTokenUsdPrice } from "../../hooks/useTokenUsdPrice";
import { useParams } from "react-router-dom";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import {
  IFormattedSubscription,
  IWeb3ConnectedContextState,
} from "../../utils/types";
import { Button, Snackbar } from "@mui/material";
import { getSubscription, unsubscribe } from "../../utils/main";
import { useApi } from "../../hooks/useApi";

type IState = {
  open: boolean;
  selectedCreator: string;
  isModalOpen: boolean;
  selectedIndex: number;
  selectedRate: string | undefined;
  creator: IFormattedSubscription | null;
  isUnsubscribing: boolean;
  isSubscriber: boolean;
};

type IProps = {
  additionalInfo: any;
};

const Subscribe = (props: IProps) => {
  const [state, setState] = useState<IState>({
    open: false,
    selectedCreator: "",
    isModalOpen: false,
    selectedIndex: -1,
    selectedRate: "",
    creator: null,
    isUnsubscribing: false,
    isSubscriber: false,
  });
  const { open, selectedRate, isUnsubscribing, isSubscriber } = state;
  const { additionalInfo } = props;

  const {
    signer,
    injector,
    network,
    // TODO: Move this to a global context later
    isShowSensitiveContent,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();
  const { tokenUsdPrice } = useTokenUsdPrice(network);
  const { api } = useApi(network);

  const params = useParams();
  const { address: creator } = params as any;

  useEffect(() => {
    const getIsSubscriber = async () => {
      checkSigner();
      if (!injector || !signer || !creator) return false;
      const subscription = await getSubscription(
        creator,
        signer?.address,
        network
      );
      const _isSubscriber = !!subscription;
      setState((prev) => ({
        ...prev,
        isSubscriber: _isSubscriber,
      }));
    };
    getIsSubscriber();
  }, []);

  const onClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isUnsubscribing: value,
    }));
  };

  const checkSigner = () => {
    if (!signer || !injector) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
      return;
    }
  };

  const onSubscribeClick = () => {
    checkSigner();
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      open: true,
    }));
  };

  const callback = async () => {
    // await getSubscribedCreators();
    setState((prev) => ({
      ...prev,
      isUnsubscribing: false,
    }));
  };

  const _unsubscribe = async () => {
    checkSigner();
    if (!injector || !signer || !creator) return;
    const address = creator?.creator || "";
    const isCommitted = !!creator.isCommitted;
    const pureProxy = creator.pureProxy || "";

    await unsubscribe(
      network,
      isCommitted,
      api,
      signer.address,
      injector,
      address,
      callback,
      setLoading,
      pureProxy
    );
  };

  return (
    <div>
      {isSubscriber ? (
        <Button variant="contained" onClick={_unsubscribe}>
          Unsubscribe
        </Button>
      ) : (
        <Button variant="contained" onClick={onSubscribeClick}>
          Subscribe
        </Button>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={isUnsubscribing}
        message={"Unsubscribing..."}
      />
      <SubscribeModal
        isSubscriber={isSubscriber}
        open={open}
        onClose={onClose}
        selectedCreator={creator}
        rate={selectedRate}
        tokenUsdPrice={tokenUsdPrice}
        isUsd={additionalInfo?.isUsd}
      />
    </div>
  );
};

export default Subscribe;
