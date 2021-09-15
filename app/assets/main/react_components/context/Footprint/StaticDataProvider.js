import React from 'react';
import { LocaleProvider } from './LocaleContext';
import { TextsProvider } from './TextsContext';
import { ProjectsProvider } from './ProjectsContext';
import { VersionProvider } from './VersionContext';

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
  version,
}) => {
  return (
    <TextsProvider
      commonText={commonText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      modelText={modelText}
      registrationsText={registrationsText}
      slug={currentRegion.slug}
    >
      <LocaleProvider
        currency={currency}
        lang={lang}
        currentRegion={currentRegion}
      >
        <ProjectsProvider projects={projects}>
          <VersionProvider version={version}>{children}</VersionProvider>
        </ProjectsProvider>
      </LocaleProvider>
    </TextsProvider>
  );
};

export default StaticDataProvider;
