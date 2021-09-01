import React, { useState } from 'react';
import Link from '../Link.jsx';
import FootprintForm from './FootprintForm.jsx';
import InformationSection from './InformationSection.jsx';

const Container = ({ footprint, calculator, slug, lang, registrationsText, commonText, modelText, lifestyleFootprintsText, currency, projects }) => {
  const [showInformationSection, setShowInformationSection] = useState(false)

  const texts = {
    registrationsText: JSON.parse(registrationsText),
    commonText: JSON.parse(commonText),
    modelText: JSON.parse(modelText),
    lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText)
  }
  
  return (
    <div className="space-y-6"> 
      <div className="callout">
        <FootprintForm 
          URL={slug ? '/' + slug + '/calculator' : '/calculator'}
          questionStrings={texts.lifestyleFootprintsText.questions} 
          options={texts.lifestyleFootprintsText.options} 
          footprint={JSON.parse(footprint)} 
          calculator={JSON.parse(calculator)}
          texts={texts}
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
  )  
}

export default Container;
