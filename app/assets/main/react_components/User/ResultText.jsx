import React from "react";

/**
 * Simple text component that can be modified using the customValues array
 * If customValues has values, each value is placed in the first found spot in the text that matches: %{...}
 */
const ResultText = ({
  footprint,
  countryAverage,
  modelText,
  lang,
  registrationsText,
}) => {
  const yourClimateFootprint = registrationsText.your_climate_footprint;
  // "Your carbon footprint of %{footprint} is %{relative} than the average in %{country}. To be in line with the 1.5 degree target set by the Paris agreement, we need to reach an average of 2.5 tonnes per person globally by the year 2030.";
  const yourClimateFootprintComparedWorld =
    registrationsText.your_climate_footprint_compared_world;
  // "Your carbon footprint of %{footprint} is %{relative} than the world average. To be in line with the 1.5 degree target set by the Paris agreement, we need to reach an average of 2.5 tonnes per person globally by the year 2030.";
  const modelText2 = JSON.parse(modelText);

  const footprintCo2e = {
    value: footprint.total.co2e,
    inTonnes: (decimalPlaces) => {
      return (footprintCo2e.value / 1000).toFixed(decimalPlaces);
    },
    text: () => {
      return footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1) <= 1
        ? modelText2.one.replace("%{count}", footprintCo2e.inTonnes(1))
        : modelText2.other.replace(
            "%{count}",
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
