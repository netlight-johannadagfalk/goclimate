import React, { useState } from 'react';
import CarouselHeader from './CarouselHeader.jsx';
import CarouselList from './CarouselList.jsx';
import CarouselCategoryButton from './CarouselCategoryButton.jsx';
import { useCategory } from '../../../contexts/CategoryContext.js';
import { useClimateActionsOriginal } from '../../../contexts/ClimateActionsContext';
import { useMediaQuery } from 'react-responsive';
import { d } from '../../../constants';
import 'react-dropdown/style.css';

import { useClimateActionsText } from '../../../contexts/TextContext.js';

const CarouselContainer = ({
  user,
  updateLocalAccepted,
  categories,
  localUserActions,
  locallyDeletedActions,
  actionsToplist
}) => {
  const [allCategories, setAllCategories] = useState(true);
  const [popular, setPopular] = useState(false);
  const category = useCategory();
  const totClimateActions = useClimateActionsOriginal();
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${d})` });
  const climateActionsText = useClimateActionsText();

  const showFilterButton = (cat) => {
    return totClimateActions.some(
      (action) => action.climate_action_category_id === cat.id
    );
  };

  return (
    <section className="section-padding">
      <CarouselHeader />
      <div className="mx-auto space-y-3 t:bg-transparent t:rounded-lg">
        {isTabletOrMobile ? (
          <CarouselCategoryButton
            categories={categories}
            setPopular={setPopular}
            setAllCategories={setAllCategories}
            localUserActions={localUserActions}
            locallyDeletedActions={locallyDeletedActions}
            actionsToplist={actionsToplist}
          ></CarouselCategoryButton>
        ) : (
          <>
            <CarouselCategoryButton
              categoryName={climateActionsText.all_categories}
              categoryID={'allCategories'}
              active={allCategories}
              setPopular={setPopular}
              setAllCategories={setAllCategories}
              localUserActions={localUserActions}
              locallyDeletedActions={locallyDeletedActions}
            />
            {actionsToplist.length > 0 && (
              <CarouselCategoryButton
                categoryName={climateActionsText.popular}
                categoryID={'popular'}
                active={popular}
                setPopular={setPopular}
                setAllCategories={setAllCategories}
                localUserActions={localUserActions}
                locallyDeletedActions={locallyDeletedActions}
                actionsToplist={actionsToplist}
              />
            )}
            {categories.map(
              (cat) =>
                showFilterButton(cat) && (
                  <CarouselCategoryButton
                    key={cat.id}
                    categoryName={cat.name}
                    categoryID={cat.id}
                    active={category === cat.id ? true : false}
                    setPopular={setPopular}
                    setAllCategories={setAllCategories}
                    localUserActions={localUserActions}
                    locallyDeletedActions={locallyDeletedActions}
                  />
                )
            )}
          </>
        )}
        <CarouselList
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={categories}
          actionsToplist={actionsToplist}
        ></CarouselList>
      </div>
    </section>
  );
};

export default CarouselContainer;
