import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import WorldComparisonChart from '../footprint_result/WorldComparisonChart.jsx';
import YourFootprintText from '../footprint_result/YourFootprintText.jsx';
import Title from './Title.jsx';

const WorldPage = ({ footprint, countryAverage, priceObject }) => {
  const {
    registrationsText: { well_done },
  } = useTexts();

  return (
    <div className="max-w-lg mx-auto">
      <Title custom_style="text-lgr" text={well_done} />
      <YourFootprintText
        footprintValue={(footprint.total.co2e / 1000).toFixed(1)}
        priceObject={priceObject}
      />
      <br></br>
      <WorldComparisonChart
        footprint={footprint}
        countryAverage={countryAverage}
      />
    </div>
  );
};

export default WorldPage;
