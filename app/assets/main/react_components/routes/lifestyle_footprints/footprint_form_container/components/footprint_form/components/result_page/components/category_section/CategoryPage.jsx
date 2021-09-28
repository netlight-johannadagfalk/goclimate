import React from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import CategoryChart from './components/CategoryChart.jsx';
import Preamble from '../../../common/Preamble.jsx';
import Title from '../../../common/Title.jsx';

const CategoryPage = ({ footprint }) => {
  const {
    reactContentText: {
      category_page: {
        category_chart: { title, desc },
        public_emissions,
      },
    },
  } = useTexts();

  return (
    <>
      <Title customStyle="text-lgr" text={title} />
      <div className="max-w-lg mx-auto">
        <Preamble text={desc} />
        <CategoryChart footprint={footprint} />
        <br></br>
        <Preamble text={public_emissions} />
      </div>
    </>
  );
};

export default CategoryPage;
