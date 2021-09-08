import React from "react";
import ResultText from "./ResultText.jsx";

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
 */
const YourFootprintText = ({
  footprintText,
  footprintValue,
  footprint,
  countryAverage,
  modelText,
  lang,
  registrationsText,
}) => {
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
        {/* <p className="hidden t:block mt-6">{footprintText.description}</p> */}
        {/* Hårdkoda in string på engleska */}
      </div>
      <ResultText
        // text={footprintText.description}
        countryAverage={JSON.parse(countryAverage)}
        footprint={footprint}
        modelText={modelText}
        lang={lang}
        registrationsText={JSON.parse(registrationsText)}
      />
    </div>
  );
};

export default YourFootprintText;
