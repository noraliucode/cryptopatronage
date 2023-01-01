import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactElement;
}

// TODO: change later when dark/light mode applies
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
};

export const Link = (props: Props) => {
  return (
    <NavLink {...props} style={navLinkStyle}>
      {props.children}
    </NavLink>
  );
};
