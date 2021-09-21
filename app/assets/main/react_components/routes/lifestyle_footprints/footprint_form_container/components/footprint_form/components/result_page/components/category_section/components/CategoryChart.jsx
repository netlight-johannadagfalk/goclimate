import React from 'react';
import { useTexts } from '../../../../../../../../contexts/TextsContext.js';
import { getChartData } from '../../../../../../../../helpers/result-helper.js';
import ResultBar from '../../common/ResultBar.jsx';

const CategoryChart = ({ footprint }) => {
  const maxValue = Math.max(
    footprint.housing.co2e,
    footprint.food.co2e,
    footprint.car.co2e,
    footprint.flights.co2e,
    footprint.public.co2e,
    footprint.consumption.co2e
  );
  const {
    commonText,
    commonText: { tonnes },
  } = useTexts();

  const categoryData = getChartData(footprint, commonText);

  return (
    <div className="space-y-5 mt-5">
      {categoryData.map((category) => {
        return (
          <ResultBar
            key={category.text}
            title={{ text: category.text, icon: category.icon }}
            width={
              (category.co2e / 1000).toFixed(1) > 0
                ? (category.co2e / maxValue) * 100
                : 0
            }
            value={
              ((category.co2e / 1000).toFixed(1) > 0
                ? (category.co2e / 1000).toFixed(1)
                : 0) +
              ' ' +
              tonnes
            }
            color={category.color}
            fontWeight={'text-sm'}
            spaceStyling={'space-y-1'}
            spanWidth={'w-24'}
          />
        );
      })}
    </div>
  );
};

export default CategoryChart;
