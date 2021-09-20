import React from 'react';
import { LocaleProvider } from './LocaleContext';
import { ProjectsProvider } from './ProjectsContext';
import { VersionProvider } from './VersionContext';
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
  version,
  reactContentText,
  sharedText,
}) => {
  return (
    <TextsProvider
      commonText={commonText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      modelText={modelText}
      registrationsText={registrationsText}
      slug={currentRegion.slug}
      reactContentText={reactContentText}
      sharedText={sharedText}
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
