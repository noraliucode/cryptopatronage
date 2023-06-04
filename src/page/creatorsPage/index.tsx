import React, { useState } from "react";
import { useCreators } from "../../hooks/useCreators";
import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { FOOTER_HEIGHT, NAV_BAR_HEIGHT, NETWORK } from "../../utils/constants";
import { IWeb3ConnectedContextState } from "../../utils/types";
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
};

export const CreatorsPage = () => {
  const [state, setState] = useState<IState>({
    open: false,
    selectedCreator: "",
    isModalOpen: false,
    selectedIndex: -1,
    selectedRate: "",
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
  const { userPureProxy } = usePureProxy(signer?.address);

  const { committedCreators, uncommittedCreators } = useSubscribedCreators(
    signer?.address,
    network,
    userPureProxy
  );
  const { tokenUsdPrice } = useTokenUsdPrice(network);

  const getIsSubscriber = (creator: string | undefined) => {
    if (!creator) return false;
    let committedCreator;
    let uncommittedCreator;
    if (committedCreators.length > 0) {
      committedCreator = committedCreators.find(
        (x) => x?.creator?.toLowerCase() === creator.toLowerCase()
      );
    }

    if (uncommittedCreators.length > 0) {
      uncommittedCreator = uncommittedCreators.find(
        (x) => x?.creator?.toLowerCase() === creator.toLowerCase()
      );
    }

    return !!(committedCreator || uncommittedCreator);
    // committedCreators.length > 0 || uncommittedCreators.length > 0;
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

  const { open, selectedCreator, isModalOpen, selectedIndex, selectedRate } =
    state;
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
                      isSubscriber={getIsSubscriber(creator?.address)}
                      tokenUsdPrice={tokenUsdPrice}
                      creator={creator}
                      selectedIndex={selectedIndex}
                      index={index}
                      network={network}
                      onCardClick={onCardClick}
                      onSubscribeClick={() => {
                        creator &&
                          onSubscribeClick(creator?.address, creator?.rate);
                      }}
                    />
                  ))}
                </Grid>
              </Container>
            </>
          )}
        </>
      )}
    </Root>
  );
};
