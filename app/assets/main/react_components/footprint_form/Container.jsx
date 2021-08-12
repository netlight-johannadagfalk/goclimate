import React from 'react';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator, lifestyleFootprintsText, lang }) => {

  return (
      <div className="callout">
          <FootprintForm 
            questions={JSON.parse(lifestyleFootprintsText)[lang].views.lifestyle_footprints.questions} 
            options={JSON.parse(lifestyleFootprintsText)[lang].views.lifestyle_footprints.options} 
            footprint={JSON.parse(footprint)} 
            calculator={JSON.parse(calculator)}
          />
      </div>
  )
}

export default Container;
