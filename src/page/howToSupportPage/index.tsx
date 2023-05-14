import styled from "@emotion/styled";
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
}));
export const Text = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.5,
}));
export const ItalicStyle = styled("div")(() => ({
  fontStyle: "italic",
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
        <img width="400px" alt="question" src="/assets/images/step1-1.png" />
        <Text>
          Choose one of the following extensions to create an account. If you
          are new to Polkadot, it's recommended to create an account using the
          Polkadot extension.
        </Text>
        <img width="400px" alt="question" src="/assets/images/step1-2.png" />
        <Text>
          The Polkadot extension, which is an officially endorsed account
          management tool created by Parity, can be downloaded and installed on
          Chrome. It's advised to do so through the following link:
        </Text>
        <StyledLink
          color="#29b6f6"
          to="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
        >
          Chrome web store
        </StyledLink>
        <br />
        <StyledLink
          color="#29b6f6"
          to="https://docs.subwallet.app/extension-user-guide/create-an-account"
        >
          How to create an account
        </StyledLink>

        <Subtitle>Step 2: Add fund</Subtitle>
        <Subtitle>Step 3: Subscribe</Subtitle>
      </Container>
    </Root>
  );
};

export default HowToSupport;
