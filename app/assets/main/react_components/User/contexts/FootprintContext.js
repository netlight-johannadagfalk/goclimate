import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const FootprintContext = React.createContext();
const FootprintUpdateContext = React.createContext();
const CommonTextContext = React.createContext();
const CountryAverageContext = React.createContext();
const ModelTextContext = React.createContext();
const LangContext = React.createContext();
const RegistrationsContext = React.createContext();
const TempTotalNoFootprintsContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useFootprint = () => {
  return useContext(FootprintContext);
};

export const useFootprintUpdate = () => {
  return useContext(FootprintUpdateContext);
};

export const useCommonTextContext = () => {
  return useContext(CommonTextContext);
};

export const useCountryAverage = () => {
  return useContext(CountryAverageContext);
};

export const useModelText = () => {
  return useContext(ModelTextContext);
};

export const useLang = () => {
  return useContext(LangContext);
};

export const useRegistrationsText = () => {
  return useContext(RegistrationsContext);
};
export const useTempTotalNoFootprints = () => {
  return useContext(TempTotalNoFootprintsContext);
};

//***  To wrap components that need acces to the context in ***/
export const FootprintProvider = ({
  children,
  footPrint,
  commonText,
  countryAverage,
  modelText,
  lang,
  registrationsText,
  totalNoFootprints,
}) => {
  const [footprint, setFootprint] = useState(JSON.parse(footPrint));
  const tempCommonText = commonText;
  const tempCountryAverage = countryAverage;
  const tempModelText = modelText;
  const tempLang = lang;
  const tempRegistrationsText = registrationsText;
  const tempTotalNoFootprints = totalNoFootprints;

  const updateFootprint = (cat) => {
    setFootprint(cat);
  };

  return (
    <FootprintContext.Provider value={footprint}>
      <FootprintUpdateContext.Provider value={updateFootprint}>
        <CommonTextContext.Provider value={tempCommonText}>
          <CountryAverageContext.Provider value={tempCountryAverage}>
            <ModelTextContext.Provider value={tempModelText}>
              <LangContext.Provider value={tempLang}>
                <RegistrationsContext.Provider value={tempRegistrationsText}>
                  <TempTotalNoFootprintsContext value={tempTotalNoFootprints}>
                    {children}
                  </TempTotalNoFootprintsContext>
                </RegistrationsContext.Provider>
              </LangContext.Provider>
            </ModelTextContext.Provider>
          </CountryAverageContext.Provider>
        </CommonTextContext.Provider>
      </FootprintUpdateContext.Provider>
    </FootprintContext.Provider>
  );
};
