import { API_URL } from "../utils/constants";
import { getSignature } from "../utils/helpers";
import { IInjector, INetwork } from "../utils/types";

class DatabaseService {
  injector: IInjector;
  address: string;
  constructor(injector: IInjector, address: string) {
    this.injector = injector;
    this.address = address;
  }

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

  // TODO: `network` needs to be added to read data
  readData = async (collections = "data") => {
    try {
      const response = await fetch(`${API_URL}/${collections}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
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

  getCreators = async (network: INetwork) => {
    const collections = "creators";
    try {
      const response = await fetch(
        `${API_URL}/${collections}/network/${network}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  updateCreator = async (
    jsonObject: any,
    address: string,
    network: INetwork
  ) => {
    const signature = await getSignature(this.injector, this.address);
    const _jsonObject = {
      ...jsonObject,
      signature,
    };

    try {
      const response = await fetch(
        `${API_URL}/creators/network/${network}/address/${address}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
          body: JSON.stringify(_jsonObject),
        }
      );

      if (!response.ok) {
        throw new Error(`updateData HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  createCreator = async (jsonObject: any) => {
    const signature = await getSignature(this.injector, this.address);
    const _jsonObject = {
      ...jsonObject,
      signature,
    };

    try {
      const response = await fetch(`${API_URL}/creators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
        body: JSON.stringify(_jsonObject),
      });

      if (!response.ok) {
        throw new Error(`updateData HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  getCreator = async (address: string, network: INetwork) => {
    try {
      const response = await fetch(
        `${API_URL}/creators/network/${network}/address/${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  deleteCreator = async (address: string, network: INetwork) => {
    const signature = await getSignature(this.injector, this.address);

    try {
      const response = await fetch(
        `${API_URL}/creators/network/${network}/address/${address}/${signature}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`deleteData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  createUser = async (jsonObject: any) => {
    const signature = await getSignature(this.injector, this.address);
    const _jsonObject = {
      ...jsonObject,
      signature,
    };

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
        body: JSON.stringify(_jsonObject),
      });

      if (!response.ok) {
        throw new Error(`updateData HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  getUser = async (address: string, network: INetwork) => {
    try {
      const response = await fetch(
        `${API_URL}/users/network/${network}/address/${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  createSubscription = async (jsonObject: any) => {
    const signature = await getSignature(this.injector, this.address);
    const _jsonObject = {
      ...jsonObject,
      signature,
    };

    try {
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
        body: JSON.stringify(_jsonObject),
      });

      if (!response.ok) {
        throw new Error(`updateData HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  getSubscription = async (
    creator: string,
    supporter: string,
    network: INetwork
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/network/${network}/creator/${creator}/supporter/${supporter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  getSubscriptions = async (supporter: string, network: INetwork) => {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions/network/${network}/supporter/${supporter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`readData HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };

  deleteSubscription = async (jsonObject: any) => {
    const signature = await getSignature(this.injector, this.address);
    const _jsonObject = {
      ...jsonObject,
      signature,
    };

    try {
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_DATABASE_API_KEY}`,
        },
        body: JSON.stringify(_jsonObject),
      });

      if (!response.ok) {
        throw new Error(`delete HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("There was a network error:", error);
    }
  };
}

export default DatabaseService;
