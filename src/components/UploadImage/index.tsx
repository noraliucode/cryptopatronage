import React, { useState } from "react";
import ImgurService from "../../services/imgurService";

const imgurService = new ImgurService();

const UploadImage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgurLink, setImgurLink] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      const link = await imgurService.uploadImage(selectedFile);
      setImgurLink(link);
    } catch (error) {
      alert("Failed to upload image.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to Imgur</button>
      {imgurLink && (
        <div>
          <p>Uploaded successfully! Link:</p>
          <a href={imgurLink} target="_blank" rel="noopener noreferrer">
            {imgurLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
