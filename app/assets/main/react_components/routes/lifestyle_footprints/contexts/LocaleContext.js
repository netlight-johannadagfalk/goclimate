import React, { useContext } from 'react';

const LocaleContext = React.createContext(undefined);
export const useLocaleData = () => {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error(
      'Please wrap component in LocaleProvider to use useLocaleData'
    );
  return context;
};

export const LocaleProvider = ({ children, currency, lang, currentRegion }) => {
  const localeData = {
    currentRegion: currentRegion.id,
    slug: currentRegion.slug ? '/' + currentRegion.slug : '',
    lang: lang,
    currency: JSON.parse(currency),
  };

  return (
    <LocaleContext.Provider value={localeData}>
      {children}
    </LocaleContext.Provider>
  );
};
