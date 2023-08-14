import React, { useRef, useState } from "react";
import ImgurService from "../../services/imgurService";
import { InputWrapper } from "../../page/ManagePage";
import { Button } from "@mui/material";

const imgurService = new ImgurService();

const UploadImage = ({ setImageUrl }: { setImageUrl: (_: string) => void }) => {
  const [imgurLink, setImgurLink] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const link = await imgurService.uploadImage(file);
      setImageUrl(link);
      setImgurLink(link);
    } catch (error) {
      alert("Failed to upload image.");
    }
  };

  const handleClick = () => {
    fileInput.current?.click();
  };

  return (
    <InputWrapper>
      {imgurLink && (
        <img src={imgurLink} alt="imgur" width="100" height="100" />
      )}
      <br />
      <input
        ref={fileInput}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button variant="contained" onClick={handleClick}>
        Upload Image
      </Button>
    </InputWrapper>
  );
};

export default UploadImage;
