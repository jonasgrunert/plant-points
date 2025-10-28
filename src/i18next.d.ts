import "i18next";
import translation from "../public/locales/en/translation.json";
import plants from "../public/locales/en/plants.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    resources: {
      translation: typeof translation;
      plants: typeof plants;
    };
  }
}
