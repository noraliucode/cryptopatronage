import { TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { IDENTITY_LABELS } from "../../utils/constants";
import { Title, TitleWrapper } from "../Tabs";

type IProps = {
  display: string;
  email: string;
  twitter: string;
  web: string;
  handleInputChange: (
    _: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: string
  ) => void;
};

const IdentityForm = ({
  display,
  email,
  twitter,
  web,
  handleInputChange,
}: IProps) => {
  const value: any = {
    "Display Name": display,
    Email: email,
    Twitter: twitter,
    Web: web,
  };
  return (
    <>
      <TitleWrapper>
        <Title>On-chain Identity (Optional)</Title>
      </TitleWrapper>
      {IDENTITY_LABELS.map((label) => (
        <TextField
          fullWidth
          value={value[label]}
          id="standard-basic"
          label={label}
          variant="standard"
          placeholder={label}
          onChange={(event) => handleInputChange(event, label)}
        />
      ))}
    </>
  );
};

export default IdentityForm;
