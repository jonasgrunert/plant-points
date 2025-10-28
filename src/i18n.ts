import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { pouchBackend } from "./storage/translation";

i18n
  .use(Backend) // load translations from public/locales
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      backends: [pouchBackend, HttpBackend],
      backendOptions: [
        {},
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
      cacheHitMode: "refreshAndUpdateStore",
    },
  });
export default i18n;
