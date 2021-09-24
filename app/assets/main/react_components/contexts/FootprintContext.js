import React, { useContext } from "react";

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
    footprint: JSON.parse(footprint),
    commonText: JSON.parse(commonText),
    countryAverage: JSON.parse(countryAverage),
    modelText: JSON.parse(modelText),
    lang: lang,
    registrationsText: JSON.parse(registrationsText),
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
      "Please wrap component in UserProvider to use useUserActions"
    );
  }

  return context;
};

export { FootprintProvider, useFootprint };
