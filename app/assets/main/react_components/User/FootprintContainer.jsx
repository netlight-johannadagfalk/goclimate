import React from "react";
import CategoryChart from "./CategoryChart.jsx";
import YourFootprintText from "./YourFootprintText.jsx";

/**
 * React container for Result page components
 */

const FootprintContainer = ({ footprint, commonText }) => {
  const commonStrings = JSON.parse(commonText);

  return (
    <div className="max-w-5xl t:bg-white t:rounded-lg t:shadow-lg t:p-8 mt-12 t:border t:border-gray-tint-2">
      <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
        <div className="t:w-1/2 space-y-6">
          <YourFootprintText
            footprintText={{
              heading: commonStrings.dashboard.footprint.heading,
              tonnes_CO2: commonStrings.tonnes_CO2,
              description:
                commonStrings.dashboard.footprint.your_climate_footprint,
            }}
            footprintValue={(JSON.parse(footprint).total.co2e / 1000).toFixed(
              1
            )}
          />
        </div>
        <div className="t:w-1/2">
          <CategoryChart
            footprint={JSON.parse(footprint)}
            categoryChartText={commonStrings}
          />
        </div>
      </div>
    </div>
  );
};

export default FootprintContainer;
