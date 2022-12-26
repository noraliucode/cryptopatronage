import { AppBar, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SOCIAL_ITEMS } from "../../utils/constants";

const Wrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));
const IconWrapper = styled("div")(() => ({
  display: "flex",
}));
const Link = styled("a")(() => ({
  textDecoration: "none",
  margin: 10,
}));
const HR = styled("div")(() => ({
  height: 0.5,
  width: "100%",
  backgroundColor: "gray",
}));
const Text = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 14,
  lineHeight: 2,
}));

export const Footer = () => {
  return (
    <>
      <HR />
      <AppBar position="static" color="transparent" enableColorOnDark>
        <Toolbar>
          <Wrapper>
            <Text>© CryptoPatronage Team, 2022.</Text>
            <IconWrapper>
              {SOCIAL_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={item.href}
                    key={item.href}
                  >
                    <Icon color="primary" fontSize="large" />
                  </Link>
                );
              })}
            </IconWrapper>
          </Wrapper>
        </Toolbar>
      </AppBar>
    </>
  );
};
