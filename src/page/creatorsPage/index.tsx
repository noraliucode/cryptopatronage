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

const Root = styled("div")(({ theme }) => ({
  padding: 30,
}));

export const CreatorsPage = () => {
  // const { creators } = useCreators();
  const creators = [
    "5GWvpX5j4RiSk5S5zgdtY1UQij4phvLnvb244bFqHqzfafJt",
    "5FNo9v1nd4a7C4KBiv769xMqtpmePRnRWpTHrHRPr9SdB1jf",
  ];

  return (
    <Root>
      <Grid container spacing={2}>
        {creators?.map((x: any) => {
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
                    {x}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Root>
  );
};
