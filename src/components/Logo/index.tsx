import { Typography, styled } from "@mui/material";
import React from "react";
import { DesktopContentWarpper } from "../NavigationBar";
import { Link as StyledLink } from "../Link";
import { Text } from "../Manage";

const LogoWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

type Props = {};

const Logo = (props: Props) => {
  return (
    <StyledLink to={"/"}>
      <LogoWrapper>
        <img alt="question" src="/assets/icons/logo.png" className="logo" />
        <DesktopContentWarpper>
          <Text>
            <Typography variant="h6">CryptoPatronage</Typography>
          </Text>
        </DesktopContentWarpper>
      </LogoWrapper>
    </StyledLink>
  );
};

export default Logo;
