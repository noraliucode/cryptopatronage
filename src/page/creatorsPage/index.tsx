import React, { useState } from "react";
import { useCreators } from "../../hooks/useCreators";
import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { FOOTER_HEIGHT, NAV_BAR_HEIGHT } from "../../utils/constants";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { SubscribeModal } from "../../components/SubscribeModal";
import { Modal } from "../../components/Modal";
import { useParams } from "react-router";
import Creator from "./Creator";
import { Link } from "../../components/Link";

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
};

export const CreatorsPage = () => {
  const [state, setState] = useState<IState>({
    open: false,
    selectedCreator: "",
    isModalOpen: false,
    selectedIndex: -1,
  });
  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  const { creators, loading } = useCreators(network);
  const params = useParams();
  const { address } = params as any;

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

  const onSubscribeClick = (address: string) => {
    checkSigner();
    if (!signer) return;
    setState((prev) => ({
      ...prev,
      open: true,
      selectedCreator: address,
    }));
  };

  const onCardClick = (index: number) => {
    setState((prev) => ({
      ...prev,
      selectedIndex: index,
    }));
  };

  const { open, selectedCreator, isModalOpen, selectedIndex } = state;
  const _creators = address
    ? creators?.filter(
        (x) => x?.address?.toLowerCase() === address.toLowerCase()
      )
    : creators;

  return (
    <Root>
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
              <Title> Membership driving creativity</Title>
              <Link to={"/create"}>
                <Button variant="contained">Become a creator</Button>
              </Link>
              <SubscribeModal
                open={open}
                onClose={onClose}
                selectedCreator={selectedCreator}
              />
              <Container>
                <Grid container spacing={2}>
                  {_creators.map((creator, index) => (
                    <Creator
                      creator={creator}
                      selectedIndex={selectedIndex}
                      index={index}
                      network={network}
                      onCardClick={onCardClick}
                      onSubscribeClick={onSubscribeClick}
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
