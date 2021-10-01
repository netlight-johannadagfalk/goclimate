import React from 'react';
import getChartData from '../../helpers/ResultHelper.js';
import ResultBar from './ResultBar.jsx';
import { useFootprint } from '../contexts/FootprintContext.js';
/**
 * Container to display a ResultBar for each category co2e of the footprint
 */
const CategoryChart = ({ categoryChartText }) => {
  const { footprint } = useFootprint();
  const maxValue = Math.max(
    footprint.housing.co2e,
    footprint.food.co2e,
    footprint.car.co2e,
    footprint.flights.co2e,
    footprint.public.co2e,
    footprint.consumption.co2e
  );
  const categoryData = getChartData(footprint, categoryChartText);
  return (
    <div className="realtive pb-1">
      <div className="space-y-6">
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
                categoryChartText['tonnes']
              }
              color={category.color}
              fontWeight={'text-sm'}
              spaceStyling={'space-y-1'}
              spanWidth={'w-24'}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
