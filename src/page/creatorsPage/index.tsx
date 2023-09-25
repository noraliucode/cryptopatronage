import React, { useEffect, useState } from "react";
import { useCreators } from "../../hooks/useCreators";
import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { FOOTER_HEIGHT, NAV_BAR_HEIGHT, NETWORK } from "../../utils/constants";
import {
  IFormattedSubscription,
  IWeb3ConnectedContextState,
} from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { SubscribeModal } from "../../components/SubscribeModal";
import { Modal } from "../../components/Modal";
import { useParams } from "react-router";
import Creator from "./Creator";
import { Link } from "../../components/Link";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSubscribedCreators } from "../../hooks/useSubscribedCreators";
import { useTokenUsdPrice } from "../../hooks/useTokenUsdPrice";
import { usePureProxy } from "../../hooks/usePureProxy";
import ContentLinkTable from "../../components/ContentLinkTable";
import BasicTable from "../../components/Table";
import { downloadBackupCode, importBackupCode } from "../../utils/helpers";
import { useContentLinks } from "../../hooks/useContentLinks";
import { Content, LoadingContainer, Text } from "../ManagePage";
import { unsubscribe } from "../../utils/main";
import { useApi } from "../../hooks/useApi";

export const Root = styled("div")(() => ({
  padding: 30,
  minHeight: `calc(100vh - (${NAV_BAR_HEIGHT + FOOTER_HEIGHT + 45}px))`,
  maxWidth: 1920,
}));
const Wrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "100px",
}));
const Hint = styled("div")(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: 20,
}));
const Title = styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2rem",
  fontWeight: 500,
  marginBottom: 30,
  fontFamily: "RussoOne",
}));
const Container = styled("div")(({ theme }) => ({
  marginTop: 50,
}));

type IState = {
  open: boolean;
  selectedCreator: string;
  isModalOpen: boolean;
  selectedIndex: number;
  selectedRate: string | undefined;
  creator: IFormattedSubscription | null;
};

export const CreatorsPage = () => {
  const [state, setState] = useState<IState>({
    open: false,
    selectedCreator: "",
    isModalOpen: false,
    selectedIndex: -1,
    selectedRate: "",
    creator: null,
  });
  const {
    signer,
    injector,
    network,
    // TODO: Move this to a global context later
    isShowSensitiveContent,
  }: IWeb3ConnectedContextState = useWeb3ConnectedContext();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const networkParamFromUrl = queryParams.get(NETWORK);
  const networkParam = networkParamFromUrl || (network as any);

  const { creators, loading } = useCreators(
    networkParam,
    isShowSensitiveContent
  );
  const params = useParams();
  const { t } = useTranslation();
  const { address } = params as any;
  const { api } = useApi(network);
  // TODO: refactor later
  // const { userPureProxy } = usePureProxy(signer?.address);
  useEffect(() => {
    if (address) {
      const _creator = getCreator();
      setState((prev) => ({
        ...prev,
        creator: _creator as any,
      }));
    }
  }, [address]);

  const { committedCreators, uncommittedCreators, getSubscribedCreators } =
    useSubscribedCreators(signer?.address, network);
  const { tokenUsdPrice } = useTokenUsdPrice(network);
  const {
    links,
    loading: isContentLoading,
    getContentLinks,
  } = useContentLinks(address);

  const getCreator = (creatorAddress?: string) => {
    const _address = creatorAddress || address;
    let committedCreator;
    let uncommittedCreator;
    if (committedCreators?.length > 0) {
      committedCreator = committedCreators.find(
        (x) => x?.creator?.toLowerCase() === _address?.toLowerCase()
      );
    }

    if (uncommittedCreators?.length > 0) {
      uncommittedCreator = uncommittedCreators.find(
        (x) => x?.creator?.toLowerCase() === _address?.toLowerCase()
      );
    }

    return committedCreator || uncommittedCreator;
  };

  const getIsSubscriber = (address: string) => {
    return !!getCreator(address);
  };

  const onClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
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

  const onSubscribeClick = (address: string, rate: string | undefined) => {
    checkSigner();
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      open: true,
      selectedCreator: address,
      selectedRate: rate,
    }));
  };

  const onCardClick = (index: number) => {
    setState((prev) => ({
      ...prev,
      selectedIndex: index,
    }));
  };

  const {
    open,
    selectedCreator,
    isModalOpen,
    selectedIndex,
    selectedRate,
    creator,
  } = state;
  const _creators = address
    ? creators?.filter(
        (x) => x?.address?.toLowerCase() === address.toLowerCase()
      )
    : creators;

  const getIsUsd = () => {
    const selectedCratorIdentity = _creators?.find(
      (x) => x?.address?.toLowerCase() === selectedCreator.toLowerCase()
    );
    return !!selectedCratorIdentity?.isUsd;
  };

  const _downloadBackupCode = async () => {
    if (!signer) return;
    downloadBackupCode(signer?.address);
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

  const _unsubscribe = async () => {
    if (!signer) return;
    checkSigner();
    if (!injector || !signer) return;
    const address = creator?.creator || "";
    const isCommitted = !!creator?.isCommitted;
    const pureProxy = creator?.pureProxy || "";
    await unsubscribe(
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
    <Root>
      <>
        <Title>{t("title")}</Title>
        <Link to={"/create"}>
          <Button variant="contained">{t("button.becomeCreator")}</Button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={"/how-to-support"}>
          <Button color="success" variant="outlined">
            {t("button.how to support")}
          </Button>
        </Link>
      </>
      <Modal
        open={isModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
          }))
        }
      />
      {loading ? (
        <Wrapper>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </Wrapper>
      ) : (
        <>
          {_creators?.length === 0 || !_creators ? (
            <Wrapper>
              <Hint>No Creator(s)</Hint>
            </Wrapper>
          ) : (
            <>
              <SubscribeModal
                isSubscriber={getIsSubscriber(selectedCreator)}
                open={open}
                onClose={onClose}
                selectedCreator={selectedCreator}
                rate={selectedRate}
                tokenUsdPrice={tokenUsdPrice}
                isUsd={getIsUsd()}
              />
              <Container>
                <Grid container spacing={2}>
                  {_creators.map((creator, index) => (
                    <Creator
                      key={`${creator}_${index}`}
                      isSubscriber={getIsSubscriber(creator?.address || "")}
                      tokenUsdPrice={tokenUsdPrice}
                      creator={creator}
                      selectedIndex={selectedIndex}
                      index={index}
                      network={network}
                      onCardClick={onCardClick}
                      onSubscribeClick={() => {
                        creator &&
                          onSubscribeClick(
                            creator?.address,
                            creator?.rate as any
                          ); // TODO: fix any
                      }}
                    />
                  ))}
                </Grid>
              </Container>
              <p />
              <p />
              {address && getIsSubscriber(address) && (
                <Button fullWidth variant="contained" onClick={_unsubscribe}>
                  Unsubscribe
                </Button>
              )}
              <p />
              <p />
              {/* {TODO: duplicated conditional component} */}
              {isContentLoading ? (
                <LoadingContainer>
                  <CircularProgress size={30} thickness={5} />
                </LoadingContainer>
              ) : links.length > 0 && address ? (
                <BasicTable
                  downloadBackupCode={_downloadBackupCode}
                  network={network}
                  contentLinks={links}
                  importBackupCode={(e) =>
                    importBackupCode(e, signer?.address, getContentLinks)
                  }
                />
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}
    </Root>
  );
};
