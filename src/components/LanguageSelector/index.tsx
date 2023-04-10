import { Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { lngs } from "../../utils/constants";
import LanguageIcon from "@mui/icons-material/Language";
import { IMenuItem } from "../../utils/types";

const LanguageSelector = ({ item }: { item: IMenuItem }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { i18n } = useTranslation();

  return (
    <div>
      <Button
        color="primary"
        aria-label={item.label}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <LanguageIcon htmlColor="white" titleAccess={item.label} />
      </Button>
      <Menu
        aria-labelledby="basic-menu-1"
        id="basic-menu-1"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {Object.keys(lngs).map((lng) => (
          <MenuItem
            key={`${lng}`}
            onClick={() => {
              i18n.changeLanguage(lng);
              handleClose();
            }}
          >
            {lngs[lng].nativeName}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageSelector;
