import React from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import CategoryChart from './components/CategoryChart.jsx';
import Preamble from '../../../common/Preamble.jsx';
import Title from '../../../common/Title.jsx';

const CategoryPage = ({ footprint }) => {
  const {
    reactContentText: {
      category_chart: { title, desc },
    },
  } = useTexts();

  return (
    <div className="max-w-lg mx-auto">
      <Title custom_style="text-lgr" text={title} />
      <Preamble text={desc} />
      <CategoryChart footprint={footprint} />
    </div>
  );
};

export default CategoryPage;
