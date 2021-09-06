import React from "react";
import CategoryChart from "./CategoryChart.jsx";
import YourFootprintText from "./YourFootprintText.jsx";

/**
 * React container for Result page components
 */

const ResultContainer = ({ footprint, commonText }) => {
  const commonStrings = JSON.parse(commonText);

  console.log(commonStrings.dashboard.footprint.your_climate_footprint);

  return (
    <section className="section-padding space-y-12 t:space-y-6">
      <div className="max-w-5xl mx-auto t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
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

      {/* Hårdkodat - fixa! */}
      <div className="text-center space-y-2 space-x-2">
        <a href="/calculator?country=SE" className="button">
          <i className="fas fa-plus" aria-hidden="true"></i>
          {" New calculation "}
        </a>
        <div className="inline-block">
          <a className="link whitespace-nowrap m-2" href="/users/subscription">
            Balance your footprint
          </a>
        </div>
        <div className="inline-block">
          <a
            className="link"
            href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
            target="_blank"
          >
            How do we calculate?
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResultContainer;
