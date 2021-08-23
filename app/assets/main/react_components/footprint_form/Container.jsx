import React from 'react';
import FootprintForm from './FootprintForm.jsx';
import Link from '../Link.jsx';

const Container = ({ footprint, calculator, lifestyleFootprintsText, lang }) => {

  return (
    <div className="space-y-6"> 
      <div className="callout">
        <FootprintForm 
          route={(lang === 'en' ? '' : lang === 'sv' ? '/se' : '/' + lang) + '/calculator'}
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
