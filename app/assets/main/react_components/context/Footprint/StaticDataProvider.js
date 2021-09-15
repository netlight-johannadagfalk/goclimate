import React from 'react';
import { LocaleProvider } from './LocaleContext';
import { TextsProvider } from './TextsContext';
import { ProjectsProvider } from './ProjectsContext';

const StaticDataProvider = ({ children, commonText, currency, lang, lifestyleFootprintsText, modelText, projects, registrationsText, currentRegion, reactContentText }) => {

    return (
        <TextsProvider 
            commonText={commonText}
            lifestyleFootprintsText={lifestyleFootprintsText}
            modelText={modelText}
            registrationsText={registrationsText}
            slug={currentRegion.slug}
            reactContentText={reactContentText}
        >
            <LocaleProvider 
                currency={currency} 
                lang={lang}
                currentRegion={currentRegion}
            >
                <ProjectsProvider projects={projects}>
                    {children}
                </ProjectsProvider>
            </LocaleProvider>
        </TextsProvider>
    );
    };

export default StaticDataProvider;
