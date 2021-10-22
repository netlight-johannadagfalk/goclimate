import React from 'react';
import StaticDataProvider from './contexts/StaticDataProvider.js';
import FootprintFormContainer from './footprint_form_container/FootprintFormContainer.jsx';

const Container = ({
  footprint,
  calculator,
  currentRegion,
  lang,
  registrationsText,
  commonText,
  modelText,
  lifestyleFootprintsText,
  currency,
  projects,
  version,
  reactContentText,
  sharedText,
  isUserSignedIn
}) => {
  return (
    <StaticDataProvider
      registrationsText={registrationsText}
      commonText={commonText}
      modelText={modelText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      currency={currency}
      currentRegion={JSON.parse(currentRegion)}
      lang={lang}
      projects={projects}
      version={version}
      reactContentText={reactContentText}
      sharedText={sharedText}
      isUserSignedIn={isUserSignedIn}
    >
      <FootprintFormContainer
        footprint={JSON.parse(footprint)}
        calculator={JSON.parse(calculator)}
      />
    </StaticDataProvider>
  );
};

export default Container;
