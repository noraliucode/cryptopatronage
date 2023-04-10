import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import zh from "./zh/translation.json";

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18next.use(initReactI18next).init({
  lng: "zh", // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
});
