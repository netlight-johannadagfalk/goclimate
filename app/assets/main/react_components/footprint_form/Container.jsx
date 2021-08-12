import React from 'react';
import Questions from '../questions_en.json';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator }) => {
  return (
      <div className="space-y-6"> 
        <div className="callout">
            <FootprintForm 
              questions={Questions.en.views.lifestyle_footprints.questions} 
              options={Questions.en.views.lifestyle_footprints.options} 
              footprint={JSON.parse(footprint)} 
              calculator={JSON.parse(calculator)}
            />
        </div>
          <div class="text-sm">
          <a class="link" href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/" target="_blank">How do we calculate?</a>
          </div>
      </div>
  )   
}

export default Container;
