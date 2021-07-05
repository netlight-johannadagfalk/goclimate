import React from 'react';
import Questions from '../questions_en.json';
import FootprintForm from '../FootprintForm.jsx';

const Container = (props) => {
  
  return (
      <div className="callout">
          <FootprintForm questions={Questions}/>
      </div>
  )
}

export default Container;
