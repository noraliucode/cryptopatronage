import { Checkbox, TextField } from "@mui/material";
import React from "react";
import { IHandleChange, IHandleCheck } from "../../utils/types";
import { Title, TitleWrapper, Wrapper, Text } from "../Tabs";

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
  return (
    <>
      <TitleWrapper>
        <Title>Add Image (Optional)</Title>
      </TitleWrapper>
      <TextField
        fullWidth
        value={imgUrl}
        id="standard-basic"
        label="Image Url"
        variant="standard"
        placeholder={`Input image Url`}
        onChange={handleInputChange}
      />
      <Wrapper>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Text>Label your image as sensitive content</Text>
      </Wrapper>
    </>
  );
};

export default ImageForm;
