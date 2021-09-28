import React from 'react';
import { useTexts } from '../../../../../../../contexts/TextsContext.js';
import { useVersion } from '../../../../../../../contexts/VersionContext.js';
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

  const version = useVersion();

  return (
    <div className="max-w-lg mx-auto">
      <Title custom_style="text-lgr" text={title} />
      <Preamble text={desc} />
      <CategoryChart footprint={footprint} />
      {version === 'v1' && (
        <>
          <br></br>
          <div className="text-left">
            <Preamble text={public_emissions} />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
