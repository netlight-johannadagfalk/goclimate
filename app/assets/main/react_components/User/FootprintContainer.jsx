import React from "react";
import CategoryChart from "./CategoryChart.jsx";
import YourFootprintText from "./YourFootprintText.jsx";
import {
  useFootprint,
  useCommonTextContext,
} from "./contexts/FootprintContext.js";

const FootprintContainer = () => {
  const footprint = useFootprint();
  const commonText = useCommonTextContext();

  return (
    <div className="max-w-5xl t:bg-white t:rounded-lg t:shadow-lg t:p-8 mt-12 t:border t:border-gray-tint-2">
      <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
        <div className="t:w-1/2 space-y-6">
          <YourFootprintText
            footprintText={{
              heading: commonText.dashboard.footprint.heading,
              tonnes_CO2: commonText.tonnes_CO2,
              description:
                commonText.dashboard.footprint.your_climate_footprint,
            }}
            footprintValue={(footprint.total.co2e / 1000).toFixed(1)}
          />
        </div>
        <div className="t:w-1/2">
          <CategoryChart categoryChartText={commonText} />
        </div>
      </div>
    </div>
  );
};

export default FootprintContainer;
