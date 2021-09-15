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
}) => {
  return (
    <StaticDataProvider
      registrationsText={registrationsText}
      commonText={commonText}
      modelText={modelText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      currency={currency}
      currentRegion={currentRegion}
      lang={lang}
      projects={projects}
      version={version}
    >
      <FootprintFormContainer
        footprint={JSON.parse(footprint)}
        calculator={JSON.parse(calculator)}
      />
    </StaticDataProvider>
  );
};

export default Container;
