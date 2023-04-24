import React, { useState } from "react";
import { WalletModal } from "../WalletModal";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function ConnectButton() {
  const { t } = useTranslation();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const toggleModal = () => {
    setWalletModalOpen(!walletModalOpen);
  };

  return (
    <>
      <WalletModal open={walletModalOpen} onClose={toggleModal} />
      <Button variant="contained" onClick={toggleModal}>
        <AccountBalanceWalletIcon />
        &nbsp;
        {t("button.connect")}
      </Button>
    </>
  );
}
