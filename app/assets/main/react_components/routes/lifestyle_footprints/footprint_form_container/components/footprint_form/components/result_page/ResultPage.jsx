import React from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';
import AnswerButton from '../common/AnswerButton.jsx';
import CategoryPage from './components/category_section/CategoryPage.jsx';
import WorldPage from './components/world_section/WorldPage.jsx';

const ResultPage = ({ result, page, onPageChange }) => {
  const {
    lifestyleFootprintsText: { next },
    reactContentText: {
      category_page: { answer_button_logged_in },
    },
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
        label={
          page === 1 && result.user_page_path ? answer_button_logged_in : next
        }
        onAnswerGiven={() => {
          if (result.user_page_path && page === 1)
            window.location.href = result.user_page_path;
          else onPageChange();
        }}
        stylingClasses={'w-5/6 ' + (page === 2 && 'button-cta')}
      />
    </div>
  );
};

export default ResultPage;
