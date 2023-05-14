import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactElement | string;
  color?: string;
}

// TODO: change later when dark/light mode applies
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
};

export const Link = (props: Props) => {
  return (
    <NavLink {...props} style={{ ...navLinkStyle, color: props.color }}>
      {props.children}
    </NavLink>
  );
};
