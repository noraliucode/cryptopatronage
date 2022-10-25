import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import { subscribe } from "../../utils/main";
import { useAccounts } from "../../hooks/useAccounts";
import { CREATOR, KUSAMA_DECIMALS, NETWORK } from "../../utils/constants";
import Checkbox from "@mui/material/Checkbox";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { toShortAddress } from "../../utils/helpers";
import { setRate } from "../../utils/apiCalls";
import TextField from "@mui/material/TextField";

const Root = styled("div")(() => ({
  width: 600,
  height: 500,
}));
const Text = styled("div")(() => ({
  color: "black",
  fontSize: 14,
  lineHeight: 2,
}));
const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  justifyContent: "center",
}));
const Wrapper = styled("div")(() => ({
  marginTop: "50px",
}));
const Title = styled("div")(() => ({
  color: "black",
  fontSize: 18,
  margin: "40px 0 0 0",
  textAlign: "left",
}));
const ActionWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
const InputWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: 50,
  flexDirection: "column",
}));

type IProps = {
  subscribedCreators: string[];
  supporters: string[];
};

type IState = {
  value: number;
  isCommitted: boolean;
  anonymous: string;
  rate: number;
  signer: string;
};

export const TabsMain = (props: IProps) => {
  const [state, setState] = useState<IState>({
    value: 0,
    isCommitted: true,
    anonymous: "",
    rate: 0,
    signer: "",
  });
  const { subscribedCreators, supporters } = props;
  const { value, isCommitted, rate, signer } = state;
  const { injector }: { injector: InjectedExtension | null } =
    useAccounts(signer);

  const handleChange = (event: any, newValue: any) => {
    setState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const _subscribe = async () => {
    await subscribe(signer, injector, isCommitted);
  };

  const handleClick = () => {
    setState((prev) => ({
      ...prev,
      isCommitted: !prev.isCommitted,
    }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      rate: Number(event.target.value),
    }));
  };

  const handleAddressInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({
      ...prev,
      signer: event.target.value,
    }));
  };

  return (
    <Root>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Creator" />
          <Tab label="Supporter" />
        </Tabs>
      </Box>
      {value === 0 && (
        <>
          <InputWrapper>
            <Title>Signer Address</Title>
            <TextField
              id="standard-basic"
              label="Signer Address"
              variant="standard"
              onChange={handleAddressInputChange}
            />
            <Title>Add Rate</Title>
            <TextField
              id="standard-basic"
              label="Rate"
              variant="standard"
              placeholder="Input the amount of Kusama"
              onChange={handleInputChange}
            />
            &nbsp;
            <Button
              onClick={() =>
                setRate(
                  rate * 10 ** KUSAMA_DECIMALS,
                  CREATOR[NETWORK],
                  injector
                )
              }
              variant="contained"
            >
              Set Rate
            </Button>
          </InputWrapper>
          <Title>Supporter List</Title>
          <Wrapper>
            {supporters.map((address, index) => (
              <Text key={index}>{address}</Text>
            ))}
          </Wrapper>
        </>
      )}
      {value === 1 && (
        <InputWrapper>
          <Title>Signer Address</Title>
          <TextField
            id="standard-basic"
            label="Signer Address"
            variant="standard"
            onChange={handleAddressInputChange}
          />
          <Title>Commit and Subscribe</Title>
          <Text>{toShortAddress(CREATOR[NETWORK])}</Text>
          <Container>
            <ActionWrapper>
              <Container>
                <Checkbox checked={isCommitted} onClick={handleClick} />
                <Text>Earmark funds exclusively for this creator</Text>
              </Container>
              <Container>
                <Button onClick={_subscribe} variant="contained">
                  Subscribe
                </Button>
                &nbsp;
                <Button variant="outlined">Unsubscribe</Button>
              </Container>
            </ActionWrapper>
          </Container>
          <Wrapper>
            <hr />
            <Wrapper>
              <Title>Subscribed Creators</Title>
              {subscribedCreators.map((address) => (
                <Text>{address}</Text>
              ))}
            </Wrapper>
          </Wrapper>
        </InputWrapper>
      )}
    </Root>
  );
};
