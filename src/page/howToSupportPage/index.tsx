import { styled } from "@mui/material";
import React from "react";
import { Root } from "../creatorsPage";
import { Link as StyledLink } from "../../components/Link";

export const Container = styled("div")(() => ({
  maxWidth: 700,
  margin: "auto",
  textAlign: "left",
}));
export const Title = styled("div")(() => ({
  color: "white",
  fontSize: 28,
  fontWeight: 500,
  marginBottom: 20,
}));
export const Subtitle = styled("div")(() => ({
  color: "white",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 20,
  marginTop: 20,
}));
export const Text = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.5,
  marginBottom: 20,
}));
export const ItalicStyle = styled("div")(() => ({
  fontStyle: "italic",
}));
export const LinkText = styled("div")(() => ({
  color: "#29b6f6",
  fontSize: 18,
  marginBottom: 20,
}));
export const LinkText2 = styled("div")(() => ({
  color: "#29b6f6",
  fontSize: 18,
  display: "inline-block",
}));
const Image = styled("img")(({ theme }) => ({
  width: "600px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const HowToSupport = () => {
  return (
    <Root>
      <Container>
        <Title>How to support</Title>
        <Subtitle>Step 1: create an account</Subtitle>
        <Text>
          Click on connect wallet button on the top right corner of the page.
        </Text>
        <img width="350px" alt="step1-1" src="/assets/images/step1-1.png" />
        <Text>
          Choose one of the following extensions to create an account. If you
          are new to Polkadot, it's recommended to create an account using the
          Polkadot extension.
        </Text>
        <img width="300px" alt="step1-2" src="/assets/images/step1-2.png" />
        <Text>
          The Polkadot extension, which is an officially endorsed account
          management tool created by Parity, can be downloaded and installed on
          Chrome. It's advised to do so through the following link:
        </Text>
        <a
          target="blank"
          href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
        >
          <LinkText>Chrome web store</LinkText>
        </a>
        <Text>How to create an account:</Text>
        <a
          target="blank"
          href="https://docs.subwallet.app/extension-user-guide/create-an-account"
        >
          <LinkText>Create a New Account (Wallet)</LinkText>
        </a>

        <Subtitle>Step 2: Add fund</Subtitle>
        <Text>
          Some of the wallets may offer the services to add fund. For example,
          you can choose the service provider in subwallet:
        </Text>
        <a href="https://docs.subwallet.app/extension-user-guide/buy-crypto-from-fiat-money">
          <LinkText>Buy crypto from fiat money</LinkText>
        </a>
        <Text>
          Optionally, you can go to a cryptocurrency exchange: There are
          numerous cryptocurrency exchanges where you can purchase Kusama
          tokens, such as{" "}
          <a href="https://www.binance.com/en">
            <LinkText2>Binance,</LinkText2>
          </a>{" "}
          <a href="https://www.kraken.com/">
            <LinkText2>Kraken,</LinkText2>,
          </a>{" "}
          or{" "}
          <a href="https://www.coinbase.com/">
            <LinkText2>Coinbase.</LinkText2>
          </a>{" "}
          Sign up or log into your account on your chosen exchange.
        </Text>
        <Subtitle>Step 3: Subscribe</Subtitle>
      </Container>
      <Image alt="step3-1" src="/assets/images/step3-1.png" />
      <Text>
        Go to Expore and click on the project you want to support. Click on the
        "Subscribe" button.
      </Text>
    </Root>
  );
};

export default HowToSupport;
