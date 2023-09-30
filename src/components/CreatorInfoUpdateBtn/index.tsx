import React, { useState, FunctionComponent } from "react";
import { ErrorMessage, InputWrapper, Wrapper } from "../../page/ManagePage";
import { Button } from "@mui/material";
import { CreatorRegistrationModal } from "../CreatorRegistrationModal";
import {
  createCreatorOffChain,
  updateInfo,
  updateInfoOffChain,
} from "../../utils/main";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { DECIMALS } from "../../utils/constants";
import { useIdentity } from "../../hooks/useIdentity";
import { validateUrls } from "../../utils/helpers";
import { useApi } from "../../hooks/useApi";

interface CreatorInfoUpdateBtnProps {
  isCreatorRegistered: boolean;
  isOnchained: boolean;
  email: string;
  twitter: string;
  display: string;
  web: string;
  imgUrl: string;
  rate: number;
  checked: boolean;
  isUsd: boolean;
  setLoading: (value: boolean) => void;
  setMessage: (value: string) => void;
  text?: string;
  callback?: () => void;
}

const CreatorInfoUpdateBtn: FunctionComponent<CreatorInfoUpdateBtnProps> = ({
  isCreatorRegistered,
  isOnchained,
  email,
  twitter,
  display,
  web,
  imgUrl,
  rate,
  checked,
  isUsd,
  setLoading,
  setMessage,
  text = "Update Creator Info",
  callback: _callback,
}) => {
  const [state, setState] = useState({
    errorMessage: "",
    message: "",
    isModalOpen: false,
    title: "",
    open: false,
    isCreatorRegistrationModalOpen: false,
  });

  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const { getIdentity } = useIdentity(signer?.address, network);
  const { api } = useApi(network);
  const { errorMessage, isCreatorRegistrationModalOpen } = state;

  const validateInfo = () => {
    return new Promise((resolve, reject) => {
      const result = validateUrls({
        web,
        img: imgUrl,
        twitter,
      });

      const reset = () => {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            errorMessage: "",
          }));
        }, 3000);
      };

      if (!display) {
        setState((prev) => ({
          ...prev,
          errorMessage: "Display Name is required.",
        }));
        reset();
        resolve(false);
        return;
      }

      if (result) {
        setState((prev) => ({
          ...prev,
          errorMessage: result,
        }));
        reset();
        resolve(false);
        return;
      }

      resolve(true);
    });
  };

  const onUpdateInfoClick = async () => {
    const isValid = await validateInfo();
    if (!isValid) return;

    if (isCreatorRegistered) {
      _updateInfo(isOnchained);
    } else {
      toggleRegistrationModal(true);
    }
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

  const _updateInfo = async (isOnChain: boolean) => {
    if (!injector || !signer) return;
    const identity = {
      email,
      twitter,
      display,
      web,
    };

    const additionalInfo = {
      imgUrl,
      rate: rate * 10 ** DECIMALS[network],
      isSensitive: checked,
      isUsd,
    };
    let data: any = {
      identity,
      additionalInfo,
      address: signer.address,
    };

    toggleRegistrationModal(false);

    if (isOnChain) {
      checkSigner();
      showUpdateInfoMessage();

      await updateInfo(
        api,
        identity,
        additionalInfo,
        signer.address,
        injector,
        _callback,
        setLoading,
        errorHandling
      );

      // It needs to store data off chain too for fetching subscribed creators list
      data = {
        ...data,
        isOnchained: true,
        network,
      };
      updateInfoOffChain(data as any, signer.address, network);
    } else {
      // TODO: refactor loading and message
      setLoading(true);
      setMessage("Updating Info...");

      const callback = () => {
        getIdentity();
        setTimeout(() => {
          setMessage("Update Info Success!");

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }, 500);
        _callback && _callback();
      };
      data = {
        ...data,
        isOnchained: false,
      };
      if (isCreatorRegistered) {
        // TODO: remove any
        updateInfoOffChain(
          data as any,
          signer.address,
          network,
          callback,
          errorHandling
        );
      } else {
        data = {
          ...data,
          network,
        };
        createCreatorOffChain(data, callback, errorHandling);
      }
    }
  };

  const toggleRegistrationModal = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isCreatorRegistrationModalOpen: value,
    }));
  };

  const showUpdateInfoMessage = () => {
    setMessage("Update Info...");
  };

  const errorHandling = (errorMessage: string) => {
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      title: errorMessage,
    }));
  };

  return (
    <>
      <CreatorRegistrationModal
        open={isCreatorRegistrationModalOpen}
        onClose={() => toggleRegistrationModal(false)}
        updateInfo={(value: boolean) => _updateInfo(value)}
        disableOnchain={!!(network === "POLKADOT")}
      />
      <Wrapper>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <InputWrapper>
          <Button onClick={onUpdateInfoClick} variant="contained">
            {text}
          </Button>
        </InputWrapper>
      </Wrapper>
    </>
  );
};

export default CreatorInfoUpdateBtn;
