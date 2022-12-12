import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useCreators } from "../../hooks/useCreators";
import { toShortAddress } from "../../utils/helpers";
import { Text } from "../Tabs";
const Wrapper = styled("div")(() => ({
  marginTop: "15px",
}));
const PullPaymentWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  alignItems: "center",
}));
const InputWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: 30,
  flexDirection: "column",
}));

export const PaymentSystem = () => {
  const { creators } = useCreators();
  return (
    <Wrapper>
      {creators &&
        creators.map((creator: any, index: number) => (
          <PullPaymentWrapper key={index}>
            <Text>{toShortAddress(creator?.address)}</Text>
            {/* for testing */}
            {/* <Text>{supporter?.pure}</Text> */}

            {/* <Text>
                {`${formatUnit(
                  Number(creator?.supporterBalance),
                  DECIMALS[NETWORK]
                )} ${NETWORK}`}
              </Text> */}

            <Button onClick={() => {}} variant="contained">
              Transfer
            </Button>
          </PullPaymentWrapper>
        ))}
      <InputWrapper>
        <Button onClick={() => {}} variant="contained">
          Transfer All
        </Button>
      </InputWrapper>
    </Wrapper>
  );
};
