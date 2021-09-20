import React from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import CategoryChart from './components/CategoryChart.jsx';
import SignUpPreamble from '../../../common/SignUpPreamble.jsx';
import Title from '../../../common/Title.jsx';

const CategoryPage = ({ footprint }) => {
  const {
    reactContentText: {
      react: {
        category_chart: { title, desc },
      },
    },
  } = useTexts();

  return (
    <div className="max-w-lg mx-auto">
      <Title custom_style="text-lgr" text={title} />
      <SignUpPreamble text={desc} />
      <CategoryChart footprint={footprint} />
    </div>
  );
};

export default CategoryPage;
