import { Button, Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useApi } from "../../hooks/useApi";
import { useSubscribedCreators } from "../../hooks/useSubscribedCreators";
import { My_Subscription, Unnote_Preimages } from "../../utils/constants";
import { unsubscribe } from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { Modal } from "../Modal";
import {
  InputWrapper,
  Title,
  TitleWrapper,
  Text,
  Wrapper,
  Content,
  SpaceBetweenWrapper,
  SectionTitle,
} from "../../page/ManagePage";
import { usePureProxy } from "../../hooks/usePureProxy";

type IState = {
  rate: number;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  isModalOpen: boolean;
  isDelayed: boolean;
  selectedCreator: string;
  creatorUrl: string;
};

export const Supporter = () => {
  const [state, setState] = useState<IState>({
    rate: 0,
    isSubscribing: false,
    isUnsubscribing: false,
    isModalOpen: false,
    isDelayed: false,
    selectedCreator: "",
    creatorUrl: "",
  });

  const { isSubscribing, isUnsubscribing, isModalOpen } = state;

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  // TODO: refactor
  // const { userPureProxy } = usePureProxy(signer?.address);
  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer?.address, network);

  const { api } = useApi(network);
  const { t } = useTranslation();

  const checkSigner = () => {
    if (!signer || !injector) {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
      }));
      return;
    }
  };

  const callback = async () => {
    await getSubscribedCreators();
    setState((prev) => ({
      ...prev,
      isUnsubscribing: false,
    }));
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isUnsubscribing: value,
    }));
  };

  const _unsubscribe = async (
    isCommitted: boolean,
    creator: string,
    pureProxy?: string
  ) => {
    checkSigner();
    if (!injector || !signer) return;
    // TODO: refactor
    // await unsubscribe(
    //   isCommitted,
    //   api,
    //   signer.address,
    //   injector,
    //   creator,
    //   callback,
    //   setLoading,
    //   pureProxy
    // );
  };

  const _unnotePreimage = async () => {
    // await signAndSendUnnotePreimage(signer, injector, "");
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
      />
      <InputWrapper>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isSubscribing}
          message="Subscribing..."
        />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isUnsubscribing}
          message="Unsubscribing..."
        />

        <TitleWrapper>
          <Title id={Unnote_Preimages.split(" ").join("")}>
            {t("manage sections.Unnote Preimages")}
          </Title>
          <Tooltip title="Withdraw the deposit for delay proxy">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </TitleWrapper>
        <Button disabled onClick={_unnotePreimage} variant="contained">
          {t("manage sections.Unnote Preimages")}
        </Button>
      </InputWrapper>
    </>
  );
};
