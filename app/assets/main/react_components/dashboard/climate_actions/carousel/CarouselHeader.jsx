import React from 'react';
import { useClimateActionsText } from '../../../contexts/TextContext.js';

const CarouselHeader = () => {
  const climateActionsText = useClimateActionsText();
  return (
    <>
      <h3 className="heading-lg mb-3">{climateActionsText.take_action}</h3>
      <h3 className="heading mb-3">
        {climateActionsText.low_effort_high_impact_actions}
      </h3>
    </>
  );
};

export default CarouselHeader;
