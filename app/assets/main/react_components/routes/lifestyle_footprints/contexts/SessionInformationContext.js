import React, { useContext } from 'react';

const SessionInformationContext = React.createContext(undefined);
export const useSessionInformation = () => {
  const context = useContext(SessionInformationContext);
  if (!context)
    throw new Error(
      'Please wrap component in SessionInformationProvider to use useSessionInformation'
    );
  return context;
};

export const SessionInformationProvider = ({
  children,
  currency,
  lang,
  currentRegion,
  isUserSignedIn,
}) => {
  const sessionInformation = {
    currentRegion: currentRegion.id,
    slug: currentRegion.slug ? '/' + currentRegion.slug : '',
    lang: lang,
    currency: JSON.parse(currency),
    signedInUser: isUserSignedIn,
  };

  return (
    <SessionInformationContext.Provider value={sessionInformation}>
      {children}
    </SessionInformationContext.Provider>
  );
};
