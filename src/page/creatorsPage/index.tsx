import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCreators } from "../../hooks/useCreators";
import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import { DECIMALS, SYMBOL } from "../../utils/constants";
import { formatUnit } from "../../utils/helpers";
import { IWeb3ConnectedContextState } from "../../utils/types";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";

const Root = styled("div")(({ theme }) => ({
  padding: 30,
}));

export const CreatorsPage = () => {
  const { creators } = useCreators();
  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();

  return (
    <Root>
      <Grid container spacing={2}>
        {creators?.map((creator: any) => {
          return (
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`/assets/testImages/${Math.floor(
                    Math.random() * 10
                  )}.jpeg`}
                  alt="green iguana"
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
                  <Button size="small">Subscribe</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Root>
  );
};
