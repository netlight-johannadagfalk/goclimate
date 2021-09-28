import React from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import Preamble from '../../../common/Preamble.jsx';
import Title from '../../../common/Title.jsx';
import CategoryChart from './components/CategoryChart.jsx';

const CategoryPage = ({ footprint }) => {
  const {
    reactContentText: {
      category_chart: { title, desc },
      public_emissions,
    },
  } = useTexts();

  return (
    <>
      <Title customStyle="text-lgr" text={title} />
      <div className="max-w-lg mx-auto">
        <Preamble text={desc} />
        <CategoryChart footprint={footprint} />
        <br></br>
        <div className="text-left">
          <Preamble text={public_emissions} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
