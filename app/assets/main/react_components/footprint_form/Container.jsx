import React, { useState } from 'react';
import Link from '../Link.jsx';
import FootprintForm from './FootprintForm.jsx';
import InformationSection from './InformationSection.jsx';
import { StaticDataProvider } from '../context/Footprint/StaticDataContext.js';

const Container = ({ footprint, calculator, slug, lang, registrationsText, commonText, modelText, lifestyleFootprintsText, currency, projects }) => {
  const [showInformationSection, setShowInformationSection] = useState(false)

  const texts = {
    registrationsText: JSON.parse(registrationsText),
    commonText: JSON.parse(commonText),
    modelText: JSON.parse(modelText),
    lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText)
  }
  
  return (
    <StaticDataProvider 
      registrationsText={registrationsText}
      commonText={commonText}
      modelText={modelText}
      lifestyleFootprintsText={lifestyleFootprintsText}
      currency={currency}
      slug={slug}
      lang={lang}
    >
      <div className="space-y-6">
        <div className="callout">
          <FootprintForm
            URL={slug ? '/' + slug + '/calculator' : '/calculator'}
            questionStrings={texts.lifestyleFootprintsText.questions} 
            options={texts.lifestyleFootprintsText.options} 
            footprint={JSON.parse(footprint)} 
            calculator={JSON.parse(calculator)}
            texts={texts}
            slug={slug}
            lang={lang}
            currency={JSON.parse(currency)}
            onChangeInformationSection={(value) => setShowInformationSection(value)}
          />
        </div>
        <Link
          link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
          linkText={texts.lifestyleFootprintsText.methodology}
        />
        { showInformationSection && 
          <InformationSection
            texts={texts}
            projects={JSON.parse(projects)}
          />
        }
      </div>
    </StaticDataProvider>
  )  
}

export default Container;
