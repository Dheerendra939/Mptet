import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SupportedLanguage, 
  TranslationDict, 
  translations, 
  detectDeviceLanguage, 
  LANGUAGE_NAMES 
} from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDict;
  isRtl: boolean;
  isDeviceDetected: boolean;
  deviceLanguageCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => detectDeviceLanguage());
  const [deviceLangRaw, setDeviceLangRaw] = useState<string>('en');
  const [isDeviceDetected, setIsDeviceDetected] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator) {
      const raw = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
      setDeviceLangRaw(raw);
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    setIsDeviceDetected(false);
    try {
      localStorage.setItem('preferred_app_language', newLang);
    } catch (_) {}
  };

  const currentTranslation = translations[language] || translations.en;
  const isRtl = Boolean(LANGUAGE_NAMES[language]?.isRtl);

  useEffect(() => {
    // Set document dir attribute
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslation,
        isRtl,
        isDeviceDetected,
        deviceLanguageCode: deviceLangRaw,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
