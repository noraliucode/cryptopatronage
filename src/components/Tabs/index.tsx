import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Button from "@mui/material/Button";

const Root = styled("div")(() => ({
  width: 500,
  height: 500,
}));
const Text = styled("div")(() => ({
  color: "black",
  fontSize: 14,
}));
const Container = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  marginTop: "50px",
}));

export const TabsMain = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  console.log("value", value);

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
      {value === 0 && <Text>Supporter List</Text>}
      {value === 1 && (
        <Container>
          <Text>Creator 1</Text>
          <Button variant="contained">Subscribe</Button>
        </Container>
      )}
    </Root>
  );
};
