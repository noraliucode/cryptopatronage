import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useIdentity } from "../../hooks/useIdentity";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { formatUnit } from "../../utils/helpers";
import { DECIMALS } from "../../utils/constants";
import { useParams } from "react-router-dom";

type IState = {
  imgUrl: string;
  email: string;
  twitter: string;
  display: string;
  web: string;
};

const CreatorPage = () => {
  const defaultState = {
    imgUrl: "",
    email: "",
    twitter: "",
    display: "",
    web: "",
  };
  const [state, setState] = useState<IState>(defaultState);
  const { network }: IWeb3ConnectedContextState = useWeb3ConnectedContext();
  const params = useParams();
  const { address } = params as any;

  const {
    rate: currentRate,
    getIdentity,
    isRegisterToPaymentSystem,
    additionalInfo,
    identity,
    loading: isInfoLoading,
    isOnchained,
    network: _network,
  } = useIdentity(address, network);

  useEffect(() => {
    if (identity) {
      const { email, twitter, display, web } = identity;
      setState((prev) => ({ ...prev, email, twitter, display, web }));
    }
    if (additionalInfo) {
      const { rate, imgUrl, isSensitive } = additionalInfo;
      setState((prev) => ({
        ...prev,
        rate: rate ? formatUnit(rate, DECIMALS[network]) : 0,
        imgUrl: imgUrl,
        checked: isSensitive,
      }));
    }
  }, []);

  const { display, email, twitter, web, imgUrl } = state;
  return (
    <div>
      <Profile
        name={display}
        email={email}
        twitter={twitter}
        website={web}
        iconURL={imgUrl}
        bannerURL={imgUrl}
      />
    </div>
  );
};

export default CreatorPage;
