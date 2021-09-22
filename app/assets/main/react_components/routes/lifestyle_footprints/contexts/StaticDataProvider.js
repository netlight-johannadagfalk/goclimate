import React from 'react';
import { SessionInformationProvider } from './SessionInformationContext.js';
import { ProjectsProvider } from './ProjectsContext.js';
import { VersionProvider } from './VersionContext.js';
import { TextsProvider } from './TextsContext.js';

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
  isUserSignedIn,
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
      <SessionInformationProvider
        currency={currency}
        lang={lang}
        currentRegion={currentRegion}
        isUserSignedIn={isUserSignedIn}
      >
        <ProjectsProvider projects={projects}>
          <VersionProvider version={version}>{children}</VersionProvider>
        </ProjectsProvider>
      </SessionInformationProvider>
    </TextsProvider>
  );
};

export default StaticDataProvider;
