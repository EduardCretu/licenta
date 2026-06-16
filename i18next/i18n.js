import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.js';
import ro from './locales/ro.js';

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    //compatibilityJSON: 'v3', // CRITICAL
    resources: {
        en,
        ro,
    },

    lng: 'en', // Default language
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, //no nee, already safe from XSS
    },
  });

export default i18n;