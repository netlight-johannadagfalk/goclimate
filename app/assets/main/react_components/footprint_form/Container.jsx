import React from 'react';
import FootprintForm from './FootprintForm.jsx';
import Link from '../Link.jsx';

/**
 * The outmost container for the reactified form
 */
const Container = ({ footprint, calculator, slug, lang, registrationsText, commonText, modelText, lifestyleFootprintsText }) => {
  const texts = {
    registrationsText: JSON.parse(registrationsText),
    commonText: JSON.parse(commonText),
    modelText: JSON.parse(modelText),
    lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText)
  }
  
  return (
    <div className="space-y-6"> 
      <script src="https://js.stripe.com/v3/"></script>
      <div className="callout">
        <FootprintForm 
          URL={slug ? '/' + slug + '/calculator' : '/calculator'}
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
