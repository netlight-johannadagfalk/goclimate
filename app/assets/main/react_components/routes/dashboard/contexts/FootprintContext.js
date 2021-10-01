import React, { useContext } from 'react';

const FootprintContext = React.createContext(undefined);

const FootprintProvider = ({
  children,
  footprint,
  commonText,
  countryAverage,
  modelText,
  lang,
  registrationsText,
  totalNoFootprints,
}) => {
  const data = {
    footprint: footprint,
    commonText: commonText,
    countryAverage: countryAverage,
    modelText: modelText,
    lang: lang,
    registrationsText: registrationsText,
    totalNoFootprints: totalNoFootprints,
  };

  return (
    <FootprintContext.Provider value={data}>
      {children}
    </FootprintContext.Provider>
  );
};

const useFootprint = () => {
  const context = useContext(FootprintContext);
  if (!context) {
    throw new Error(
      'Please wrap component in FootprintProvider to use useFootprint'
    );
  }

  return context;
};

export { FootprintProvider, useFootprint };
