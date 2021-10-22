import React, { useContext } from 'react';

const SessionContext = React.createContext(undefined);
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error(
      'Please wrap component in SessionProvider to use useSession'
    );
  return context;
};

export const SessionProvider = ({
  children,
  currency,
  lang,
  currentRegion,
  isUserSignedIn
}) => {
  const sessionData = {
    currentRegion: currentRegion.id,
    slug: currentRegion.slug ? '/' + currentRegion.slug : '',
    lang: lang,
    currency: JSON.parse(currency),
    signedInUser: isUserSignedIn
  };

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};
