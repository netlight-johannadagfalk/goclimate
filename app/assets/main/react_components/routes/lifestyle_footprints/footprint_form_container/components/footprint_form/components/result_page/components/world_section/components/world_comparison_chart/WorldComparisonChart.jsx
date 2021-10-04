import React from 'react';
import { useSession } from '../../../../../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../../../../../contexts/TextsContext.js';
import ResultBar from '../../../common/ResultBar.jsx';
import WorldComparisonText from './components/WorldComparisonText.jsx';

const WorldComparisonChart = ({ footprint, countryAverage }) => {
  const {
    modelText: { one, other },
    registrationsText: {
      higher,
      lower,
      your_climate_footprint,
      your_climate_footprint_compared_world,
      you,
      goal_2030,
      average_in,
      world_average
    }
  } = useTexts();

  const { lang } = useSession();

  const maxValue = Math.max(
    footprint.total.co2e,
    countryAverage.co2e.co2e,
    2500
  );

  const footprintCo2e = {
    value: footprint.total.co2e,
    inTonnes: (decimalPlaces) => {
      return (footprintCo2e.value / 1000).toFixed(decimalPlaces);
    },
    text: () => {
      return footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1) <= 1
        ? one.replace(
            /%{.*?}/i,
            footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1)
          )
        : other.replace(
            /%{.*?}/i,
            footprintCo2e.inTonnes(footprintCo2e.value < 100 ? 2 : 1)
          );
    }
  };
  const countryAverageCo2e = {
    value: countryAverage.co2e.co2e,
    inTonnes: (decimalPlaces) => {
      return (countryAverageCo2e.value / 1000).toFixed(decimalPlaces);
    }
  };

  const relativeText =
    footprintCo2e.value > countryAverageCo2e.value
      ? Math.ceil((footprintCo2e.value / countryAverageCo2e.value - 1) * 100) +
        ' % ' +
        higher
      : Math.ceil((1 - footprintCo2e.value / countryAverageCo2e.value) * 100) +
        ' % ' +
        lower;

  const resultText = countryAverage.countries
    ? your_climate_footprint
    : your_climate_footprint_compared_world;

  return (
    <>
      <div className="relative">
        <div className="space-y-6">
          <ResultBar
            title={{ text: you + ' <-' }}
            width={
              footprintCo2e.inTonnes(1) > 0
                ? (footprintCo2e.value / maxValue) * 100
                : 0
            }
            value={footprintCo2e.inTonnes(1)}
            color={'bg-green-accent'}
            fontStyling={'font-bold'}
          />
          <ResultBar
            title={{
              text: countryAverage.countries
                ? average_in.replace(
                    /%{.*?}/i,
                    footprint.country.data.translations[lang]
                  )
                : world_average
            }}
            width={
              countryAverageCo2e.inTonnes(1) > 0
                ? (countryAverageCo2e.value / maxValue) * 100
                : 0
            }
            value={countryAverageCo2e.inTonnes(1)}
          />
          <ResultBar
            title={{ text: goal_2030 }}
            width={(2500 / maxValue) * 100}
            value={2.5}
          />
        </div>
      </div>
      <WorldComparisonText
        text={resultText}
        customValues={[
          footprintCo2e.text,
          relativeText,
          countryAverage.countries && footprint.country.data.translations[lang]
        ]}
      />
    </>
  );
};

export default WorldComparisonChart;
