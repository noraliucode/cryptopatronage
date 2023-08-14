const BACKEND_URL = "https://api.imgur.com/3/image/";
const IMGUR_CLIENT_ID = process.env.REACT_APP_IMGUR_CLIENT_ID;

class ImgurService {
  uploadImage = async (selectedFile: File | null) => {
    if (!selectedFile) {
      throw new Error("No file selected for upload.");
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Upload successful:", responseData);

      return responseData.data.link;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };
}

export default ImgurService;
