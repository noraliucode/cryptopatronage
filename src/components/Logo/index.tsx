import { Typography, styled } from "@mui/material";
import React from "react";
import { DesktopContentWarpper } from "../NavigationBar";
import { Link as StyledLink } from "../Link";
import { Text } from "../../page/ManagePage";

const LogoWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));
const LogoText = styled("div")(() => ({
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: "-1px",
}));

type Props = {};

const Logo = (props: Props) => {
  return (
    <StyledLink to={"/"}>
      <LogoWrapper>
        <img alt="question" src="/assets/icons/logo.png" className="logo" />
        <DesktopContentWarpper>
          <Text>
            <Typography>
              <LogoText>CryptoPatronage</LogoText>
            </Typography>
          </Text>
        </DesktopContentWarpper>
      </LogoWrapper>
    </StyledLink>
  );
};

export default Logo;
