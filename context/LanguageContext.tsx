import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../data/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  noteNames: 'solfege' | 'letter';
  setNoteNames: (n: 'solfege' | 'letter') => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key],
  noteNames: 'solfege',
  setNoteNames: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [noteNames, setNoteNames] = useState<'solfege' | 'letter'>('solfege');
  const t = (key: TranslationKey) => translations[language][key] || translations.en[key];
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, noteNames, setNoteNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
