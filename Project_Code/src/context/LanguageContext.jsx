import { useCallback, useEffect, useMemo, useState } from 'react';
import { directPhraseMap, translations } from '../data/translations';
import { LanguageContext } from './useLanguage';

const STORAGE_KEY = 'tripforge_language';

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'bn' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-lang', language);

    window.dispatchEvent(
      new CustomEvent('tripforge:language-changed', {
        detail: { language },
      })
    );
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'bn' || lang === 'en') {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  }, []);

  const t = useCallback(
    (key, fallback = '') => {
      if (!key && !fallback) return '';

      if (language === 'bn') {
        // Direct key in Bengali dictionary
        if (translations.bn && translations.bn[key]) {
          return translations.bn[key];
        }
        // Direct phrase lookup for plain string
        if (directPhraseMap[key]) {
          return directPhraseMap[key];
        }
        // Check if fallback has a phrase match
        if (fallback && directPhraseMap[fallback]) {
          return directPhraseMap[fallback];
        }
        // Check if English translation maps to a direct phrase
        if (translations.en && translations.en[key] && directPhraseMap[translations.en[key]]) {
          return directPhraseMap[translations.en[key]];
        }
        // Fallback to explicit fallback or English or key
        return fallback || (translations.en && translations.en[key]) || key;
      }

      // English
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return fallback || key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      isBangla: language === 'bn',
      toggleLanguage,
      setLanguage,
      t,
    }),
    [language, toggleLanguage, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
