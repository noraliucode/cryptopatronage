// import Bottleneck from "bottleneck";
import { API_URL } from "../utils/constants";

// TODO: limiter can be removed later
// const limiter = new Bottleneck({
//   minTime: 0, // 1 request per second
// });
class JsonBinService {
  updateData = async (jsonObject: any) => {
    try {
      // TODO: id is hardcoded for now
      const response = await fetch(`${API_URL}/data/64d088490fb1a7797dcca3e8`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
        body: JSON.stringify(jsonObject),
      });

      if (!response.ok) {
        throw new Error(`updateData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  readData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };
}

export default JsonBinService;
