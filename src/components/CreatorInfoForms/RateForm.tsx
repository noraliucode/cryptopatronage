import { TextField, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { SYMBOL } from "../../utils/constants";
import { INetwork } from "../../utils/types";
import { Title, TitleWrapper } from "../Tabs";

type IProps = {
  rate: any;
  network: INetwork;
  handleInputChange: any;
};

const RateForm = ({ rate, network, handleInputChange }: IProps) => {
  const { t } = useTranslation();
  return (
    <>
      <TitleWrapper>
        <Title>{t("manage.Add Monthly Rate")}</Title>
        <Tooltip title="Add rate for current selected creator(signer)">
          <img alt="question" src="/assets/icons/question.svg" />
        </Tooltip>
      </TitleWrapper>
      <TextField
        fullWidth
        value={rate}
        id="standard-basic"
        label="Rate"
        variant="standard"
        placeholder={`Input the amount of ${SYMBOL[network]}`}
        onChange={handleInputChange}
        defaultValue={""}
      />
    </>
  );
};

export default RateForm;
