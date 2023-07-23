import { Button } from "@mui/material";
import React, { ChangeEvent, useRef } from "react";
import { InputWrapper } from "../../page/ManagePage";

const ImportButton = ({
  importBackupCode,
}: {
  importBackupCode?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
}) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInput.current?.click();
  };

  return (
    <InputWrapper>
      <input
        ref={fileInput}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={importBackupCode && importBackupCode}
      />
      <Button variant="outlined" onClick={handleClick}>
        Import backup code
      </Button>
    </InputWrapper>
  );
};

export default ImportButton;
