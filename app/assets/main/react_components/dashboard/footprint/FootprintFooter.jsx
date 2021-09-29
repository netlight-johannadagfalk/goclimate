import React from 'react';
import { useFootprint } from '../../contexts/FootprintContext.js';
import { useClimateActionsText } from '../../contexts/TextContext.js';

const FootprintFooter = () => {
  const { footprint, totalNoFootprints } = useFootprint();
  const climateActionsText = useClimateActionsText();

  return (
    <div className="text-center space-y-2 space-x-4 mt-8 max-w-5xl">
      <a
        href={
          footprint.country
            ? '/calculator?country=' + footprint.country.data.alpha2
            : '/'
        }
        className="button"
      >
        <i className="fas fa-plus" aria-hidden="true"></i>
        {' ' + climateActionsText.new_calculation}
      </a>
      {totalNoFootprints && (
        <div className="inline-block">
          <a className="link whitespace-nowrap" href="/calculator/results">
            {climateActionsText.previous_footprints}
          </a>
        </div>
      )}

      <div className="inline-block">
        <a className="link whitespace-nowrap" href="/users/subscription">
          {climateActionsText.balance_footprint}
        </a>
      </div>
      <div className="inline-block">
        <a
          className="link"
          href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
          target="_blank"
        >
          {climateActionsText.how_calculate}
        </a>
      </div>
    </div>
  );
};

export default FootprintFooter;
