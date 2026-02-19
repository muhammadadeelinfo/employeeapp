import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@hooks/useSupabaseAuth';
import { enTranslations } from '@shared/i18n/translations/en';
import { deTranslations } from '@shared/i18n/translations/de';
import { getTranslationValue } from '@shared/utils/i18nUtils';
import {
  getLanguageStorageKey,
  interpolate,
  languageDefinitions,
  loadStoredLanguage,
  type LanguageCode,
} from '@shared/utils/languageUtils';

type TranslationVars = Record<string, string | number>;

const translations = {
  en: enTranslations,
  de: deTranslations,
} as const;


type TranslationKey = keyof typeof translations['en'];

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, vars?: TranslationVars) => string;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const storageKey = useMemo(() => getLanguageStorageKey(user?.id), [user?.id]);
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (!storageKey) {
      setLanguageState('en');
      return undefined;
    }

    let isMounted = true;
    loadStoredLanguage(AsyncStorage, storageKey)
      .then((nextLanguage) => {
        if (!isMounted) return;
        setLanguageState(nextLanguage);
      })
      .catch(() => {
        if (isMounted) {
          setLanguageState('en');
        }
      });
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const setLanguage = useCallback(
    (newLanguage: LanguageCode) => {
      setLanguageState(newLanguage);
      if (!storageKey) return;
      AsyncStorage.setItem(storageKey, newLanguage).catch(() => {
        /* ignore */
      });
    },
    [storageKey]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => interpolate(getTranslationValue(translations[language], key), vars),
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export type { TranslationKey };
