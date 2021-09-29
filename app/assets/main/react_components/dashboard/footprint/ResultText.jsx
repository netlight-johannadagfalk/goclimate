import React from "react";
import { useFootprint } from "../../contexts/FootprintContext.js";

/**
 * Description of the result including calculations of relevant numbers
 */
const ResultText = () => {
  const { footprint, countryAverage, modelText, lang, registrationsText } =
    useFootprint();

  const yourClimateFootprint = registrationsText.your_climate_footprint;
  const yourClimateFootprintComparedWorld =
    registrationsText.your_climate_footprint_compared_world;

  const footprintCo2e = {
    value: footprint.total.co2e,
    inTonnes: (decimalPlaces) => {
      return (footprintCo2e.value / 1000).toFixed(decimalPlaces);
    },
    text: () => {
      return footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1) <= 1
        ? modelText.one.replace(/%{.*?}/i, footprintCo2e.inTonnes(1))
        : modelText.other.replace(
            /%{.*?}/i,
            footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1)
          );
    },
  };
  const countryAverageCo2e = {
    value: countryAverage.co2e.co2e,
    inTonnes: (decimalPlaces) => {
      return (countryAverageCo2e.value / 1000).toFixed(decimalPlaces);
    },
  };

  const relativeText =
    footprintCo2e.value > countryAverageCo2e.value
      ? Math.ceil((footprintCo2e.value / countryAverageCo2e.value - 1) * 100) +
        " % " +
        registrationsText.higher
      : Math.ceil((1 - footprintCo2e.value / countryAverageCo2e.value) * 100) +
        " % " +
        registrationsText.lower;
  let resultText = countryAverage.countries
    ? yourClimateFootprint
    : yourClimateFootprintComparedWorld;

  const customValues = [
    footprintCo2e.text,
    relativeText,
    countryAverage.countries && footprint.country.data.translations[lang],
  ];
  const findCustomPlacement = /%{.*?}/i;
  customValues.forEach((customValue) => {
    resultText = resultText.replace(findCustomPlacement, customValue);
  });

  return <div className="text-left mt-8">{resultText}</div>;
};

export default ResultText;
