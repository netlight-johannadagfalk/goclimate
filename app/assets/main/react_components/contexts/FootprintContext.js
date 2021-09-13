import React, { useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const FootprintContext = React.createContext();
const CommonTextContext = React.createContext();
const CountryAverageContext = React.createContext();
const ModelTextContext = React.createContext();
const LangContext = React.createContext();
const RegistrationsContext = React.createContext();
const TotalNoFootprintsContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useFootprint = () => {
  return useContext(FootprintContext);
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
export const useTotalNoFootprints = () => {
  return useContext(TotalNoFootprintsContext);
};

//***  To wrap components that need acces to the context in ***/
export const FootprintProvider = ({
  children,
  footprint,
  commonText,
  countryAverage,
  modelText,
  lang,
  registrationsText,
  totalNoFootprints,
}) => {
  const tempFootprint = JSON.parse(footprint);
  const tempCommonText = JSON.parse(commonText);
  const tempCountryAverage = JSON.parse(countryAverage);
  const tempModelText = JSON.parse(modelText);
  const tempLang = lang;
  const tempRegistrationsText = JSON.parse(registrationsText);
  const tempTotalNoFootprints = totalNoFootprints;

  return (
    <FootprintContext.Provider value={tempFootprint}>
      <CommonTextContext.Provider value={tempCommonText}>
        <CountryAverageContext.Provider value={tempCountryAverage}>
          <ModelTextContext.Provider value={tempModelText}>
            <LangContext.Provider value={tempLang}>
              <RegistrationsContext.Provider value={tempRegistrationsText}>
                <TotalNoFootprintsContext.Provider
                  value={tempTotalNoFootprints}
                >
                  {children}
                </TotalNoFootprintsContext.Provider>
              </RegistrationsContext.Provider>
            </LangContext.Provider>
          </ModelTextContext.Provider>
        </CountryAverageContext.Provider>
      </CommonTextContext.Provider>
    </FootprintContext.Provider>
  );
};
