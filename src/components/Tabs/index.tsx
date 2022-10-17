import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Button from "@mui/material/Button";
import { subscribe } from "../../utils/main";
import { useAccounts } from "../../hooks/useAccounts";
import { CREATOR_1 } from "../../utils/constants";

const Root = styled("div")(() => ({
  width: 500,
  height: 500,
}));
const Text = styled("div")(() => ({
  color: "black",
  fontSize: 14,
  lineHeight: 2,
}));
const Container = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  marginTop: "10px",
}));
const Wrapper = styled("div")(() => ({
  marginTop: "50px",
}));
const Title = styled("div")(() => ({
  color: "black",
  fontSize: 18,
  marginBottom: 20,
}));

type IProps = {
  subscribedCreators: string[];
  supporters: string[];
};

export const TabsMain = (props: IProps) => {
  const { injector } = useAccounts();
  const [value, setValue] = useState(0);
  const { subscribedCreators, supporters } = props;

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
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
            <Container>
              <Text>{CREATOR_1}</Text>
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
