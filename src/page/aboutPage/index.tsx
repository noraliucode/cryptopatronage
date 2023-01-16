import React from "react";
import { Root } from "../creatorsPage";
import styled from "@emotion/styled";

export const Container = styled("div")(() => ({
  maxWidth: 700,
  margin: "auto",
}));
export const Title = styled("div")(() => ({
  color: "white",
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 20,
}));
export const Text = styled("div")(() => ({
  color: "white",
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 50,
  lineHeight: 2,
}));

export const AboutPage = () => {
  const embedIds = ["Z3Fk3_9zS64", "crj_SqbczMk"];

  return (
    <Root>
      <Container>
        <Title>About</Title>
        <Text>
          CryptoPatronage is a platform that helps creators build a membership
          program by offering their followers exclusive content and a closer
          connection with their community.
        </Text>
        {embedIds.map((id) => (
          <div className="videowrapper">
            <iframe
              src={`https://www.youtube.com/embed/${id}?cc_load_policy=1`}
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        ))}
      </Container>
    </Root>
  );
};
