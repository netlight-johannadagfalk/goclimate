import React from 'react';
import Questions from '../questions_en.json';
import FootprintForm from './FootprintForm.jsx';

const Container = ({ footprint, calculator}) => {
  return (
      <div className="callout">
          <FootprintForm questions={Questions.en.views.lifestyle_footprints.questions} options={Questions.en.views.lifestyle_footprints.options} footprint={JSON.parse(footprint)} calculator={JSON.parse(calculator)}/>
      </div>
  )
}

export default Container;
