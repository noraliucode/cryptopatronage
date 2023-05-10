class JsonBinService {
  updateData = async (jsonObject: any) => {
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${process.env.REACT_APP_BIN_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": `${process.env.REACT_APP_BIN_SECRET_KEY}`,
          },
          body: JSON.stringify(jsonObject),
        }
      );

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
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${process.env.REACT_APP_BIN_ID}`,
        {
          method: "GET",
          headers: {
            "X-Master-Key": `${process.env.REACT_APP_BIN_SECRET_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };
}

export default JsonBinService;
