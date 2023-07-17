import { useEffect, useState } from "react";
import { IContentLinks } from "../utils/types";
import { getCreatorContentLinks } from "../utils/main";
import { useWeb3ConnectedContext } from "../context/Web3ConnectedContext";

interface IState {
  links: IContentLinks;
  loading: boolean;
}

export const useContentLinks = (creator: string) => {
  const [state, setState] = useState<IState>({
    links: [],
    loading: false,
  });

  const { signer } = useWeb3ConnectedContext();

  const getContentLinks = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const links = await getCreatorContentLinks(
        creator,
        signer?.address as any
      );

      setState((prev) => ({
        ...prev,
        links,
      }));
    } catch (error) {
      console.error("getContentLinks error", error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  useEffect(() => {
    getContentLinks();
  }, []);
  return { ...state, getContentLinks };
};
