import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useWeb3ConnectedContext } from "../../context/Web3ConnectedContext";
import { useCreators } from "../../hooks/useCreators";
import { DECIMALS } from "../../utils/constants";
import { formatUnit, toShortAddress } from "../../utils/helpers";
import { IWeb3ConnectedContextState } from "../../utils/types";
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
  const { signer, injector, network }: IWeb3ConnectedContextState =
    useWeb3ConnectedContext();
  return (
    <Wrapper>
      {creators &&
        creators.map((creator: any, index: number) => (
          <PullPaymentWrapper key={index}>
            <Text>{toShortAddress(creator?.address)}</Text>
            {/* for testing */}
            {/* <Text>{supporter?.pure}</Text> */}

            <Text>
              {`Rate: ${formatUnit(
                Number(creator?.rate),
                DECIMALS[network]
              )} ${network}`}
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
  );
};
