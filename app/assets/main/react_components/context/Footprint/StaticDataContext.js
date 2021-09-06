import React, { useContext } from "react";

const TextsContext = React.createContext();
export const useTexts = () => useContext(TextsContext);

const LocaleContext = React.createContext();
export const useLocaleData = () => useContext(LocaleContext);

/**  To wrap components that need access to the context in a context provider */
export const StaticDataProvider = ({ children, commonText, currency, lang, lifestyleFootprintsText, modelText, registrationsText, slug }) => {
    
    const texts = {
        registrationsText: JSON.parse(registrationsText),
        commonText: JSON.parse(commonText),
        modelText: JSON.parse(modelText),
        lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText)
    };
    
    const localeData = {
        slug: slug,
        lang: lang,
        currency: currency
    };

    return (
        <TextsContext.Provider value={texts}>
            <LocaleContext.Provider value={localeData}>
                {children}
            </LocaleContext.Provider>
        </TextsContext.Provider>
    );
};