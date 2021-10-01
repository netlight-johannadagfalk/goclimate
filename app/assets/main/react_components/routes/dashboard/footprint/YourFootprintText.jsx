import React from 'react';
import ResultText from './ResultText.jsx';

/**
 * Result text for your footprint
 * Includes a heading, the footprint result in tonnes and ResultText
 */
const YourFootprintText = ({ footprintText, footprintValue }) => {
  return (
    <div>
      <h2 className="heading-lg">{footprintText.heading}</h2>
      <div className="mt-8">
        <span className="text-5xl font-bold text-green-accent">
          {footprintValue}
        </span>
        <span className="heading text-green-accent">
          {footprintText.tonnes_CO2}
        </span>
      </div>
      <ResultText />
    </div>
  );
};

export default YourFootprintText;
