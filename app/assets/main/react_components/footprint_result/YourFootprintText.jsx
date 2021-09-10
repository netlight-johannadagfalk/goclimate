import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';

const YourFootprintText = ({ footprintValue }) => {
  const {
    commonText: {
      dashboard: {
        footprint: { heading },
      },
      tonnes_CO2,
    },
  } = useTexts();

  return (
    <div>
      <h2 className='text-sm'>{heading}</h2>
      <div className='mt-1'>
        <span className='text-xl font-bold text-green-accent'>
          {footprintValue}
        </span>
        <span className='text-lg font-semibold'> {tonnes_CO2}</span>
      </div>
    </div>
  );
};

export default YourFootprintText;
