import React, { useContext } from "react";

const TextsContext = React.createContext();
export const useTexts = () => useContext(TextsContext);

const LocaleContext = React.createContext();
export const useLocaleData = () => useContext(LocaleContext);

const ProjectsContext = React.createContext();
export const useProjects = () => useContext(ProjectsContext);

/**  To wrap components that need access to the context in a context provider */
export const StaticDataProvider = ({ children, commonText, currency, lang, lifestyleFootprintsText, modelText, projects, registrationsText, slug }) => {
    
    const texts = {
        registrationsText: JSON.parse(registrationsText),
        commonText: JSON.parse(commonText),
        modelText: JSON.parse(modelText),
        lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText)
    };
    const localeData = {
        slug: slug ? '/' + slug : '',
        lang: lang,
        currency: JSON.parse(currency)
    };

    const allProjects = JSON.parse(projects)

    if(texts.registrationsText.accept_policies === undefined)
        texts.registrationsText.accept_policies = "By signing up you accept the <a>terms of use and policies</a>"

    texts.registrationsText.accept_policies = texts.registrationsText.accept_policies.replace("<a>","<a href='" + localeData.slug + "/privacy-policy' target='_blank'>" )

    return (
        <TextsContext.Provider value={texts}>
            <LocaleContext.Provider value={localeData}>
                <ProjectsContext.Provider value={allProjects}>
                    {children}
                </ProjectsContext.Provider>
            </LocaleContext.Provider>
        </TextsContext.Provider>
    );
};
