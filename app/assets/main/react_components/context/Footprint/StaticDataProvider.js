import React from "react";
import { LocaleProvider } from "./LocaleContext";
import { TextsProvider } from "./TextsContext";
import { ProjectsProvider } from "./ProjectsContext";

const StaticDataProvider = ({ children, commonText, currency, lang, lifestyleFootprintsText, modelText, projects, registrationsText, slug }) => {

    return (
        <TextsProvider 
            commonText={commonText}
            lifestyleFootprintsText={lifestyleFootprintsText}
            modelText={modelText}
            registrationsText={registrationsText}
            slug={slug}
        >
            <LocaleProvider 
                currency={currency} 
                lang={lang}
                slug={slug}
            >
                <ProjectsProvider projects={projects}>
                    {children}
                </ProjectsProvider>
            </LocaleProvider>
        </TextsProvider>
    );
};

export default StaticDataProvider;
