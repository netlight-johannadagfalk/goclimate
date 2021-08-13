import React from 'react';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator, lifestyleFootprintsText, lang }) => {

  return (
    <div className="space-y-6"> 
      <div className="callout">
        <FootprintForm 
          route={(lang === 'en' ? '' : lang === 'sv' ? '/se' : '/' + lang) + '/calculator'}
          questions={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.questions} 
          options={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.options} 
          footprint={JSON.parse(footprint)} 
          calculator={JSON.parse(calculator)}
        />
      </div>
      <div className="text-sm">
        <a className="link" href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/" target="_blank">{JSON.parse(lifestyleFootprintsText).lifestyle_footprints.methodology}</a>
      </div>
    </div>
  )  
}

export default Container;
