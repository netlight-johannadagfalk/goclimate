import React from 'react';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator, data, lang }) => {

  console.log("DATA,", data);
  console.log("LANG", lang);

  return (
      <div className="callout">
          <FootprintForm 
            questions={JSON.parse(data)[lang].views.lifestyle_footprints.questions} 
            options={JSON.parse(data)[lang].views.lifestyle_footprints.options} 
            footprint={JSON.parse(footprint)} 
            calculator={JSON.parse(calculator)}
          />
      </div>
  )
}

export default Container;
