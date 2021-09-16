import React from 'react';
import { LocaleProvider } from './LocaleContext';
import { ProjectsProvider } from './ProjectsContext';
import { TextsProvider } from './TextsContext';

const StaticDataProvider = ({
  children,
  commonText,
  currency,
  lang,
  lifestyleFootprintsText,
  modelText,
  projects,
  registrationsText,
  currentRegion,
  reactContentText
}) => {
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
