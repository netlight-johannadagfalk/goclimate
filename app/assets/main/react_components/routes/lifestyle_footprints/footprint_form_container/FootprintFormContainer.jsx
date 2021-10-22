import React, { useState } from 'react';
import { useTexts } from '../contexts/TextsContext.js';
import Link from './components/common/Link.jsx';
import FootprintForm from './components/footprint_form/FootprintForm/FootprintForm.jsx';
import InformationSection from './components/information_section/InformationSection.jsx';

const FootprintFormContainer = ({ footprint, calculator }) => {
  const [showInformationSection, setShowInformationSection] = useState(false);
  const {
    lifestyleFootprintsText: { methodology }
  } = useTexts();

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="callout space-y-8">
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
      </div>
      {showInformationSection && <InformationSection />}
    </div>
  );
};

export default FootprintFormContainer;
