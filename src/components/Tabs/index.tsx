import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import { commit, subscribe } from "../../utils/main";
import { useAccounts } from "../../hooks/useAccounts";
import { CREATOR_1, SUPPORTER_1, KUSAMA_DECIMALS } from "../../utils/constants";
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
  marginBottom: 20,
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
};

export const TabsMain = (props: IProps) => {
  const { injector }: { injector: InjectedExtension | null } = useAccounts();
  const [state, setState] = useState<IState>({
    value: 0,
    isCommitted: true,
    anonymous: "",
    rate: 0,
  });
  const { subscribedCreators, supporters } = props;
  const { value, isCommitted, rate } = state;

  const handleChange = (event: any, newValue: any) => {
    setState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const _subscribe = async () => {
    let _anonymous;
    if (isCommitted) {
      _anonymous = await commit(SUPPORTER_1, injector);
    }
    const real = isCommitted ? _anonymous : SUPPORTER_1;
    await subscribe(SUPPORTER_1, real, injector);
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
      <Wrapper>
        {value === 0 && (
          <>
            <InputWrapper>
              <TextField
                id="standard-basic"
                label="Rate"
                variant="standard"
                placeholder="Input the amount of Kusama"
                onChange={handleInputChange}
              />
              KUSAMA
              <Button
                onClick={() =>
                  setRate(rate * 10 ** KUSAMA_DECIMALS, CREATOR_1, injector)
                }
                variant="contained"
              >
                Set Rate
              </Button>
            </InputWrapper>
            <Text>Supporter List</Text>
            <Wrapper>
              {supporters.map((address, index) => (
                <Text key={index}>{address}</Text>
              ))}
            </Wrapper>
          </>
        )}
        {value === 1 && (
          <>
            {/* {creators.map((x) => (
              <Container key={x}>
                <Text>{x}</Text>
                <div>
                  {injector && (
                    <Button
                      onClick={() =>
                        subscribe(
                          "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr",
                          injector
                        )
                      }
                      variant="contained"
                    >
                      Subscribe
                    </Button>
                  )}{" "}
                  <Button variant="outlined">Unsubscribe</Button>
                </div>
              </Container>
            ))} */}
            <Text>{toShortAddress(CREATOR_1)}</Text>
            <Container>
              <ActionWrapper>
                {injector && (
                  <Container>
                    <Checkbox checked={isCommitted} onClick={handleClick} />
                    <Text>Earmark funds exclusively for this creator</Text>
                  </Container>
                )}
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
          </>
        )}
      </Wrapper>
    </Root>
  );
};
