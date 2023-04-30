import { INFURA_URL } from "../utils/constants";
import { Buffer } from "buffer";

class IPFSService {
  fetchIPFSData = async () => {
    try {
      const response = await fetch(
        `${INFURA_URL}block/get?arg=${process.env.REACT_APP_CID}`,
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.REACT_APP_INFURA_KEY +
                  ":" +
                  process.env.REACT_APP_INFURA_SECRET_KEY
              ).toString("base64"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.arrayBuffer();
      const decodedData = new TextDecoder().decode(data);
      const cleanedData = decodedData.replace(/[^\x20-\x7E]+/g, "");
      return JSON.parse(cleanedData);
    } catch (error) {
      console.error("Error fetching IPFS data:", error);
    }
  };
}

export default IPFSService;
