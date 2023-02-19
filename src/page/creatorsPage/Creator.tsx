import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { DECIMALS, IMAGE_HEIGHT, SYMBOL } from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ICreator, INetwork } from "../../utils/types";
import { hexToString, isHex } from "@polkadot/util";
import { Text } from "../../components/Tabs";

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
const ExtraHeight = styled("div")(() => ({
  marginBottom: 40,
}));

interface Props {
  creator?: ICreator;
  selectedIndex: number;
  index: number;
  network: INetwork;
  onCardClick: (index: number) => void;
  onSubscribeClick: (_: string) => void;
}

const Creator: React.FC<Props> = ({
  creator,
  selectedIndex,
  index,
  network,
  onCardClick,
  onSubscribeClick,
}) => {
  if (!creator) return <></>;
  const WrapperComponent = ({ children }: { children: React.ReactElement }) =>
    creator.web ? (
      <a href={creator.web ? creator.web : ""} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card
        sx={{ maxWidth: 345, cursor: "pointer" }}
        onClick={() => onCardClick(index)}
      >
        <WrapperComponent>
          <>
            <CardImage
              url={
                creator.imageUrl
                  ? creator.imageUrl
                  : "/assets/images/default.webp"
              }
            >
              <Blur isClicked={selectedIndex === index ? true : false} />
            </CardImage>

            <CardContent>
              <Text>
                <Typography gutterBottom variant="h5" component="div">
                  {creator.display
                    ? isHex(creator.display)
                      ? hexToString(creator.display)
                      : creator.display
                    : toShortAddress(creator.address)}
                </Typography>
              </Text>
              {creator.rate && (
                <Typography variant="body2" color="text.secondary">
                  Rate: {formatUnit(Number(creator.rate), DECIMALS[network])}{" "}
                  {SYMBOL[network]}
                </Typography>
              )}
              {creator.email ? (
                <a href={`mailto:${creator.email}`}>
                  <IconButton color="primary" aria-label="email icon">
                    <EmailIcon />
                  </IconButton>
                </a>
              ) : null}

              {creator.twitter ? (
                <a href={creator.twitter} target="_blank" rel="noreferrer">
                  <IconButton color="primary" aria-label="twitter icon">
                    <TwitterIcon />
                  </IconButton>
                </a>
              ) : null}

              {!creator.twitter && !creator.email ? <ExtraHeight /> : null}
            </CardContent>
          </>
        </WrapperComponent>
        <CardActions>
          <Button
            onClick={() => onSubscribeClick(creator.address)}
            size="small"
          >
            Subscribe
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Creator;
