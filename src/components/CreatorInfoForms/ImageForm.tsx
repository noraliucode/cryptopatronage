import { Checkbox, styled } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { IHandleCheck } from "../../utils/types";
import { Title, TitleWrapper, Text } from "../../page/ManagePage";
import UploadImage from "../UploadImage";

export const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  justifyContent: "flex-start",
}));

type IProps = {
  imgUrl: string;
  checked: boolean;
  handleChange: IHandleCheck;
  setImageUrl: (_: string) => void;
};

const ImageForm = ({ imgUrl, checked, handleChange, setImageUrl }: IProps) => {
  const { t } = useTranslation();
  return (
    <>
      <TitleWrapper>
        <Title>{t("manage.Add Image (Optional)")}</Title>
      </TitleWrapper>
      <UploadImage setImageUrl={setImageUrl} />
      <Container>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Text>{t("manage.Label your image as sensitive content")}</Text>
      </Container>
    </>
  );
};

export default ImageForm;
