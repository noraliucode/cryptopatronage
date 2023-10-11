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
import { formatUnit, getTwitterUrl, toShortAddress } from "../../utils/helpers";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ICreator, INetwork } from "../../utils/types";
import { hexToString, isHex } from "@polkadot/util";
import { Text } from "../ManagePage";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";
import { Modal } from "../../components/Modal";
import { Link } from "../../components/Link";

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
  tokenUsdPrice: number;
  address: string;
}

const Creator: React.FC<Props> = ({
  creator,
  selectedIndex,
  index,
  network,
  onCardClick,
  tokenUsdPrice,
  address,
}) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  if (!creator) return <></>;

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

  const _onCardClick = () => {
    if (creator.web) {
      setIsModalOpen(true);
    }
  };

  const onOpenWebsite = () => {
    window.open(creator.web, "_blank");
  };

  return (
    <Grid item xs={12} sm={4} md={3}>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          "You are about to open a new tab and go to the creator's website."
        }
        action={onOpenWebsite}
      />
      <Link to={`/creators/${address}/${network}`}>
        <Card
          sx={{ maxWidth: 345, cursor: "pointer" }}
          onClick={() => onCardClick(index)}
        >
          <CardActionArea>
            <>
              <div onClick={_onCardClick}>
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
                    <a
                      href={`mailto:${creator.email}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconButton color="primary" aria-label="email icon">
                        <EmailIcon />
                      </IconButton>
                    </a>
                  ) : null}

                  {creator.twitter ? (
                    <a
                      href={getTwitterUrl(creator.twitter)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconButton color="primary" aria-label="twitter icon">
                        <TwitterIcon />
                      </IconButton>
                    </a>
                  ) : null}

                  {!creator.twitter && !creator.email ? <ExtraHeight /> : null}
                </CardContent>
              </div>
            </>
          </CardActionArea>
        </Card>
      </Link>
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
