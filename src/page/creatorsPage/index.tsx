import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCreators } from "../../hooks/useCreators";
import styled from "@emotion/styled";
import { Box, CircularProgress, Grid } from "@mui/material";
import { DECIMALS, SYMBOL } from "../../utils/constants";
import { formatUnit } from "../../utils/helpers";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { SubscribeModal } from "../../components/SubscribeModal";
import { Modal } from "../../components/Modal";

const Root = styled("div")(({ theme }) => ({
  padding: 30,
}));
const Wrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "100px",
}));

type IState = {
  open: boolean;
  selectedCreator: string;
  isModalOpen: boolean;
};

export const CreatorsPage = () => {
  const [state, setState] = useState<IState>({
    open: false,
    selectedCreator: "",
    isModalOpen: false,
  });
  const { creators, loading } = useCreators();
  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

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

  const { open, selectedCreator, isModalOpen } = state;

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
          <SubscribeModal
            open={open}
            onClose={onClose}
            selectedCreator={selectedCreator}
          />
          <Grid container spacing={2}>
            {creators?.map((creator: any) => {
              return (
                <Grid item xs={12} sm={4} md={3}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={creator.imageUrl}
                      alt={`creator image Url: ${creator.imageUrl}`}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {creator.address}
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
    </Root>
  );
};
