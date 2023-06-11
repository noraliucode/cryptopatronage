import { Checkbox, TextField, Tooltip, styled } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { SYMBOL } from "../../utils/constants";
import { INetwork } from "../../utils/types";
import { Title, TitleWrapper, CheckWrapper, Text } from "../../page/ManagePage";
import { useTokenUsdPrice } from "../../hooks/useTokenUsdPrice";

export const TextWrapper = styled("div")(() => ({
  textAlign: "left",
}));

type IProps = {
  rate: any;
  network: INetwork;
  handleInputChange: any;
  setIsUsd: (isUsd: boolean) => void;
  isUsd: boolean;
};

const RateForm = ({
  rate,
  network,
  handleInputChange,
  setIsUsd,
  isUsd,
}: IProps) => {
  const { t } = useTranslation();
  const { tokenUsdPrice } = useTokenUsdPrice(network);
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
        inputProps={{ min: isUsd ? 1 : 0.01 }}
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
      <TextWrapper>
        {isUsd
          ? `≈ ${rate} USD`
          : `${rate} ${SYMBOL[network]} (≈ ${rate * tokenUsdPrice} USD)`}
      </TextWrapper>
    </>
  );
};

export default RateForm;
