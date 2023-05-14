import styled from "@emotion/styled";
import React from "react";
import { Root } from "../creatorsPage";

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
  marginBottom: 50,
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
        <Subtitle>Step 2: Add fund</Subtitle>
        <Subtitle>Step 3: Subscribe</Subtitle>
      </Container>
    </Root>
  );
};

export default HowToSupport;
