import React from 'react';
import StaticDataProvider from '../context/Footprint/StaticDataProvider.js';
import FootprintFormContainer from './FootprintFormContainer.jsx';

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
    >
      <FootprintFormContainer
        footprint={JSON.parse(footprint)}
        calculator={JSON.parse(calculator)}
      />
    </StaticDataProvider>
  );
};

export default Container;
