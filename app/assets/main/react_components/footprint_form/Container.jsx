import React, { useState } from 'react';
import Link from '../Link.jsx';
import FootprintForm from './FootprintForm.jsx';
import InformationSection from './InformationSection.jsx';
import StaticDataProvider from '../context/Footprint/StaticDataProvider.js';

const Container = ({
  footprint,
  calculator,
  slug,
  lang,
  registrationsText,
  commonText,
  modelText,
  lifestyleFootprintsText,
  currency,
  projects,
}) => {
  const [showInformationSection, setShowInformationSection] = useState(false);

  return (
    <StaticDataProvider
      registrationsText={registrationsText}
      commonText={commonText}
      modelText={modelText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      currency={currency}
      slug={slug}
      lang={lang}
      projects={projects}
    >
      <div className="space-y-6">
        <div className="callout">
          <FootprintForm
            footprint={JSON.parse(footprint)}
            calculator={JSON.parse(calculator)}
            onChangeInformationSection={(value) =>
              setShowInformationSection(value)
            }
          />
        </div>
        <Link
          style={'text-sm'}
          link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
          linkText={JSON.parse(lifestyleFootprintsText).methodology}
        />
        {showInformationSection && <InformationSection />}
      </div>
    </StaticDataProvider>
  );
};

export default Container;
