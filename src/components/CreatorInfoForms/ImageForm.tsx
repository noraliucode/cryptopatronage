import { Checkbox, styled, TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { IHandleChange, IHandleCheck } from "../../utils/types";
import { Title, TitleWrapper, Wrapper, Text } from "../Manage";

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
  handleInputChange: IHandleChange;
};

const ImageForm = ({
  imgUrl,
  checked,
  handleChange,
  handleInputChange,
}: IProps) => {
  const { t } = useTranslation();
  return (
    <>
      <TitleWrapper>
        <Title>{t("manage.Add Image (Optional)")}</Title>
      </TitleWrapper>
      <TextField
        fullWidth
        value={imgUrl}
        id="standard-basic"
        label="Image Url"
        variant="standard"
        placeholder={"https://www.example.com/image.png"}
        onChange={handleInputChange}
      />
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
