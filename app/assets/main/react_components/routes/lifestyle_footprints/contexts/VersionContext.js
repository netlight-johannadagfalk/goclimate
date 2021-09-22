import React, { useContext } from 'react';

const VersionContext = React.createContext(undefined);
export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context)
    throw new Error(
      'Please wrap component in VersionProvider to use useVersion'
    );
  return context;
};

export const VersionProvider = ({ children, version }) => {
  return (
    <VersionContext.Provider value={version}>
      {children}
    </VersionContext.Provider>
  );
};
