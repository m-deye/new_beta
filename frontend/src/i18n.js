import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import TranslationFR from "./locales/translation_fr.json";
import TranslationAR from "./locales/translation_ar.json";

const resources = {
  ar: { translation: TranslationAR },
  fr: { translation: TranslationFR }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

 fallbackLng: "fr",   // langue de repli si détection échoue
  detection: {         // active le caching de la langue (localStorage/cookie)
    order: ['localStorage','cookie','navigator'],
  caches: ['localStorage','cookie']
 },
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
