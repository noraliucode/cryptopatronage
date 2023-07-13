import { useEffect, useState } from "react";
import { IContentLinks } from "../utils/types";
import { getCreatorsContentLinks } from "../utils/main";

interface IState {
  links: IContentLinks;
  loading: boolean;
}

export const useContentLinks = (creators = [], supporter?: string) => {
  const [state, setState] = useState<IState>({
    links: [],
    loading: false,
  });

  const getContentLinks = async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const links = await getCreatorsContentLinks(creators, supporter);

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
  }, [creators]);
  return { ...state, getContentLinks };
};
