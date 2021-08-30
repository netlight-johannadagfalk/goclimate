import React from 'react';
import FootprintForm from './FootprintForm.jsx';
import Link from '../Link.jsx';

/**
 * The outmost container for the reactified form
 */
const Container = ({ footprint, calculator, lifestyleFootprintsText, slug }) => {

  return (
    <div className="space-y-6"> 
      <script src="https://js.stripe.com/v3/"></script>
      <div className="callout">
        <FootprintForm 
          URL={slug ? '/' + slug + '/calculator' : '/calculator'}
          questionStrings={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.questions} 
          options={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.options} 
          footprint={JSON.parse(footprint)} 
          calculator={JSON.parse(calculator)}
        />
      </div>
      <Link 
        link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
        linkText={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.methodology}
      />
    </div>
  )  
}

export default Container;
