import React from "react";
import ResultText from "./ResultText.jsx";

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
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
          {" "}
          {footprintText.tonnes_CO2}
        </span>
        <p className="hidden t:block mt-6">{footprintText.description}</p>
      </div>
      {/* <ResultText
        text={footprintText.description}
        customValues={[
          footprintCo2e.text,
          relativeText,
          countryAverage.countries && footprint.country.data.translations[lang],
        ]}
      /> */}
    </div>
  );
};

export default YourFootprintText;
