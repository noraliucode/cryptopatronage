import React from "react";
import { Root } from "../creatorsPage";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

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

export const AboutPage = () => {
  const embedIds = ["Z3Fk3_9zS64", "crj_SqbczMk"];
  const { t } = useTranslation();

  return (
    <Root>
      <Container>
        <Title>{t("about.title")}</Title>
        <Text>{t("about.content")}</Text>

        <Subtitle>{t("about.why_this_exists.subtitle")}</Subtitle>
        <Text>{t("about.why_this_exists.content")}</Text>

        <Subtitle>{t("about.for_patrons.subtitle")}</Subtitle>
        <Text>
          <ul>
            <li>{t("about.for_patrons.content1")}</li>
            <li>{t("about.for_patrons.content2")}</li>
            <li>{t("about.for_patrons.content3")}</li>
          </ul>
          <ItalicStyle>{t("about.for_patrons.italic_content")}</ItalicStyle>
        </Text>

        <Subtitle>{t("about.for_creators.subtitle")}</Subtitle>
        <Text>
          {t("about.for_creators.content1")}
          <br />
          <br />
          {t("about.for_creators.content2")}
          <br />
          <br />
          {t("about.for_creators.content3")}
          <br />
          <br />
          {t("about.for_creators.content4")}
          <br />
          <br />
          <ItalicStyle>{t("about.for_creators.italic_content")}</ItalicStyle>
          <br />
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
