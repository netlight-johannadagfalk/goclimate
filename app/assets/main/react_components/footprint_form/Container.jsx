import React from 'react';
import FootprintForm from './FootprintForm.jsx';
import Link from '../Link.jsx';

const Container = ({ footprint, calculator, lang, registrationsText, commonText, modelText, lifestyleFootprintsText }) => {
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
          route={(lang === 'en' ? '' : lang === 'sv' ? '/se' : '/' + lang) + '/calculator'}
          questionStrings={texts.lifestyleFootprintsText.questions} 
          options={texts.lifestyleFootprintsText.options} 
          footprint={JSON.parse(footprint)} 
          calculator={JSON.parse(calculator)}
          texts={texts}
          lang={lang}
        />
      </div>
      <Link 
        link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
        linkText={texts.lifestyleFootprintsText.methodology}
      />
    </div>
  )  
}

export default Container;
