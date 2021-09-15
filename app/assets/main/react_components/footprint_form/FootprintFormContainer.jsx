import React, { useState } from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import Link from '../Link.jsx';
import FootprintForm from './FootprintForm.jsx';
import InformationSection from './InformationSection.jsx';

const FootprintFormContainer = ({ footprint, calculator }) => {
  const [showInformationSection, setShowInformationSection] = useState(false);
  const {
    lifestyleFootprintsText: { methodology },
  } = useTexts();

  return (
    <div className="space-y-6">
      <div className="callout">
        <FootprintForm
          footprint={footprint}
          calculator={calculator}
          onChangeInformationSection={(value) =>
            setShowInformationSection(value)
          }
        />
      </div>
      <Link
        style={'text-sm'}
        link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
        linkText={methodology}
      />
      {showInformationSection && <InformationSection />}
    </div>
  );
};

export default FootprintFormContainer;
