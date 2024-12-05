import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

i18next
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    debug: true,
    resources,
    fallbackLng: 'vi',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });
