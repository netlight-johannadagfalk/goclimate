import React from 'react';
import { ProjectsProvider } from './ProjectsContext.js';
import { SessionProvider } from './SessionContext.js';
import { TextsProvider } from './TextsContext.js';
import { VersionProvider } from './VersionContext.js';

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
  isUserSignedIn
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
      <SessionProvider
        currency={currency}
        lang={lang}
        currentRegion={currentRegion}
        isUserSignedIn={isUserSignedIn}
      >
        <ProjectsProvider projects={projects}>
          <VersionProvider version={version}>{children}</VersionProvider>
        </ProjectsProvider>
      </SessionProvider>
    </TextsProvider>
  );
};

export default StaticDataProvider;
