import React from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';
import AnswerButton from '../common/AnswerButton.jsx';
import CategoryPage from './components/category_section/CategoryPage.jsx';
import WorldPage from './components/world_section/WorldPage.jsx';

const ResultPage = ({ result, page, onPageChange }) => {
  const {
    lifestyleFootprintsText: { next },
  } = useTexts();

  const footprint = result.footprint;
  const countryAverage = result.country_average;

  return (
    <div>
      <div className="my-8">
        {page === 0 ? (
          <WorldPage
            footprint={footprint}
            countryAverage={countryAverage}
            priceObject={result.plan.price}
          />
        ) : (
          <CategoryPage footprint={footprint} />
        )}
      </div>
      <AnswerButton
        label={next}
        onAnswerGiven={onPageChange}
        stylingClasses={'w-2/3 ' + (page === 2 && 'button-cta')}
      />
    </div>
  );
};

export default ResultPage;
