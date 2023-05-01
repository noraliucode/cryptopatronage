import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DECIMALS, IMAGE_HEIGHT, SYMBOL } from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ICreator, INetwork } from "../../utils/types";
import { hexToString, isHex } from "@polkadot/util";
import { Text } from "../../components/Manage";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";

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
  // TODO: remove blur effect later
  // backgroundColor: "rgba(255,255,255,.2)",
  // WebkitBackdropFilter: "blur(5px)",
  // backdropFilter: `blur(${isClicked ? 0 : "10px"})`,
}));
const ExtraHeight = styled("div")(() => ({
  marginBottom: 40,
}));
const Wrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

interface Props {
  creator?: ICreator;
  selectedIndex: number;
  index: number;
  network: INetwork;
  onCardClick: (index: number) => void;
  onSubscribeClick: (_: string) => void;
  tokenUsdPrice: number;
  hasAddress: boolean;
  isSubscriber: boolean;
}

const Creator: React.FC<Props> = ({
  creator,
  selectedIndex,
  index,
  network,
  onCardClick,
  onSubscribeClick,
  tokenUsdPrice,
  hasAddress,
  isSubscriber,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  if (!creator) return <></>;
  const WrapperComponent = ({ children }: { children: React.ReactElement }) =>
    creator.web ? (
      <a href={creator.web ? creator.web : ""} target="_blank" rel="noreferrer">
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  const onShareClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(
      `${window.location.host}/creators/${creator.address}/?network=${network}`
    );
  };

  const getRate = () => {
    const rate = formatUnit(Number(creator.rate), DECIMALS[network]);
    const usdRate = rate * tokenUsdPrice;
    return [usdRate.toFixed(2), rate];
  };

  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card
        sx={{ maxWidth: 345, cursor: "pointer" }}
        onClick={() => onCardClick(index)}
      >
        <CardActionArea>
          <>
            <WrapperComponent>
              <>
                <CardImage
                  url={
                    // TODO: add node.js server to handle redirect url and remove this later
                    creator.imageUrl
                      ? creator.display === "DatDot"
                        ? "/assets/images/datdot.png"
                        : creator.imageUrl
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
                      {t("Rate")}: {getRate()[0]} USD / {getRate()[1]}{" "}
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
            <Wrapper>
              <CardActions>
                <Button
                  onClick={() => onSubscribeClick(creator.address)}
                  size="small"
                >
                  {hasAddress && isSubscriber ? (
                    <Text>{t("button.top up")}</Text>
                  ) : (
                    <Text>{t("button.subscribe")}</Text>
                  )}
                </Button>
              </CardActions>
              <CardActions>
                <Button onClick={onShareClick} size="small">
                  <ShareIcon color="action" />
                </Button>
              </CardActions>
            </Wrapper>
          </>
        </CardActionArea>
      </Card>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </Grid>
  );
};

export default Creator;
