import React from 'react';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator, lifestyleFootprintsText, lang }) => {

  return (
      <div className="callout">
          <FootprintForm 
            route={(lang === 'en' ? '' : lang === 'sv' ? '/se' : '/' + lang) + '/calculator'}
            questions={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.questions} 
            options={JSON.parse(lifestyleFootprintsText).lifestyle_footprints.options} 
            footprint={JSON.parse(footprint)} 
            calculator={JSON.parse(calculator)}
          />
      </div>
  )
}

export default Container;
