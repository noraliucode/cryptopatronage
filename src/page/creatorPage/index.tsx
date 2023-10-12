import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useIdentity } from "../../hooks/useIdentity";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import {
  downloadBackupCode,
  formatUnit,
  importBackupCode,
} from "../../utils/helpers";
import { DECIMALS } from "../../utils/constants";
import { useParams } from "react-router-dom";
import { LoadingContainer } from "../ManagePage";
import {
  Box,
  CircularProgress,
  Snackbar,
  Typography,
  styled,
} from "@mui/material";
import BasicTable from "../../components/Table";
import { useContentLinks } from "../../hooks/useContentLinks";
import Subscribe from "./Subscribe";

type IState = {
  imgUrl: string;
  email: string;
  twitter: string;
  display: string;
  web: string;
};

export const Divider = styled("hr")(() => ({
  borderWidth: "0.5px",
  marginTop: "20px",
  marginBottom: "20px",
  borderColor: "#777777",
}));

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

  const {
    links,
    loading: isContentLoading,
    getContentLinks,
  } = useContentLinks(address);

  const { signer }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

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
  }, [identity, additionalInfo, network]);

  const { display, email, twitter, web, imgUrl } = state;
  const image = imgUrl ? imgUrl : "/assets/images/default.webp";
  const _downloadBackupCode = async () => {
    if (!signer) return;
    downloadBackupCode(signer?.address);
  };

  return (
    <div>
      {isInfoLoading ? (
        <LoadingContainer>
          <CircularProgress size={30} thickness={5} />
        </LoadingContainer>
      ) : (
        <Profile
          name={display || address}
          email={email}
          twitter={twitter}
          website={web}
          iconURL={image}
          bannerURL={image}
        />
      )}
      <Box>
        {!(signer?.address === address) && (
          <Subscribe additionalInfo={additionalInfo} />
        )}
        {isContentLoading ? (
          <LoadingContainer>
            <CircularProgress size={30} thickness={5} />
          </LoadingContainer>
        ) : links.length > 0 && address ? (
          <>
            <Divider />
            <Typography
              variant="h5"
              sx={{ color: "#fff", marginBottom: "20px" }}
            >
              ContentLink
            </Typography>
            <BasicTable
              downloadBackupCode={_downloadBackupCode}
              network={network}
              contentLinks={links}
              importBackupCode={(e) =>
                importBackupCode(e, signer?.address, getContentLinks)
              }
            />
          </>
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
};

export default CreatorPage;
