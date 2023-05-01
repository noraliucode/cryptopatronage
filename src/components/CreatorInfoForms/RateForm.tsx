import { Checkbox, TextField, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { SYMBOL } from "../../utils/constants";
import { INetwork } from "../../utils/types";
import { Title, TitleWrapper, CheckWrapper, Text } from "../Manage";
type IProps = {
  rate: any;
  network: INetwork;
  handleInputChange: any;
};

const RateForm = ({ rate, network, handleInputChange }: IProps) => {
  const { t } = useTranslation();
  const [isUsd, setIsUsd] = React.useState(false);
  const handleIsUsdClick = () => {
    setIsUsd(!isUsd);
  };

  return (
    <>
      <TitleWrapper>
        <Title>{t("manage.Add Monthly Rate")}</Title>
        <Tooltip title="Add rate for current selected creator(signer)">
          <img alt="question" src="/assets/icons/question.svg" />
        </Tooltip>
      </TitleWrapper>
      <CheckWrapper onClick={handleIsUsdClick}>
        <Checkbox checked={isUsd} />
        <Text>{t("manage.In USD")}</Text>
      </CheckWrapper>
      <TextField
        inputProps={{ min: isUsd ? 1 : 0.0000001 }}
        type="number"
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
