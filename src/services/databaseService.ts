import { API_URL } from "../utils/constants";

class DatabaseService {
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

  readData = async (collections = "data") => {
    try {
      const response = await fetch(`${API_URL}/${collections}`, {
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

  getCreators = async () => {
    try {
      const data = await this.readData("creators");

      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };
}

export default DatabaseService;
