import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCreators } from "../../hooks/useCreators";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress, Grid } from "@mui/material";
import { DECIMALS, SYMBOL } from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { SubscribeModal } from "../../components/SubscribeModal";
import { Modal } from "../../components/Modal";
import { useParams } from "react-router";

const IMAGE_HEIGHT = 140;

const Root = styled("div")(() => ({
  padding: 30,
  minHeight: "calc(100vh - 70px)",
  maxWidth: 1920,
}));
const Wrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "100px",
}));
const CardImage = styled("div")(({ url }: { url: any }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  background: `url(${url}) no-repeat center`,
  width: "100%",
  height: IMAGE_HEIGHT,
  backgroundSize: ["contain", "cover"],
}));
const Blur = styled("div")(({ isClicked }: { isClicked: boolean }) => ({
  fontWeight: 700,
  flex: 1,
  textAlign: "center",
  padding: "70px 10px",
  backgroundColor: "rgba(255,255,255,.2)",
  WebkitBackdropFilter: "blur(5px)",
  backdropFilter: `blur(${isClicked ? 0 : "10px"})`,
}));
const Hint = styled("div")(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: 20,
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

  const onClick = (address: string) => {
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
              <SubscribeModal
                open={open}
                onClose={onClose}
                selectedCreator={selectedCreator}
              />
              <Grid container spacing={2}>
                {_creators?.map((creator: any, index: number) => {
                  return (
                    <Grid item xs={12} sm={4} md={3}>
                      <Card
                        sx={{ maxWidth: 345, cursor: "pointer" }}
                        onClick={() => onCardClick(index)}
                      >
                        <CardImage url={creator.imageUrl}>
                          <Blur
                            isClicked={selectedIndex === index ? true : false}
                          />
                        </CardImage>

                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {toShortAddress(creator.address)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Rate: {formatUnit(creator.rate, DECIMALS[network])}{" "}
                            {SYMBOL[network]}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            onClick={() => onClick(creator.address)}
                            size="small"
                          >
                            Subscribe
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </>
      )}
    </Root>
  );
};
