import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { DECIMALS, NETWORK } from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";

const Text = styled("div")(() => ({
  color: "black",
  fontSize: 14,
  lineHeight: 2,
}));
const Wrapper = styled("div")(() => ({
  marginTop: "15px",
}));
const Title = styled("div")(() => ({
  color: "black",
  fontSize: 18,
  margin: "20px 0 0 0",
  textAlign: "left",
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

export const PaymentSystem = ({ creators }: { creators: any }) => {
  return (
    <>
      <Title>Creators registered to payment system</Title>
      <Wrapper>
        {creators &&
          creators.map((creator: any, index: number) => (
            <PullPaymentWrapper key={index}>
              <Text>{toShortAddress(creator?.creator)}</Text>
              {/* for testing */}
              {/* <Text>{supporter?.pure}</Text> */}

              <Text>
                {`${formatUnit(
                  Number(creator?.supporterBalance),
                  DECIMALS[NETWORK]
                )} ${NETWORK}`}
              </Text>

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
    </>
  );
};
