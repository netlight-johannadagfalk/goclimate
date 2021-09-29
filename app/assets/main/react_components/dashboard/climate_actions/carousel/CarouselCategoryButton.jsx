import React from 'react';
import {
  useClimateActionsOriginal,
  useClimateActionsUpdate,
} from '../../../contexts/ClimateActionsContext';
import { useCategoryUpdate } from '../../../contexts/CategoryContext';

import { useClimateActionsText } from '../../../contexts/TextContext.js';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useUserState } from '../../../contexts/UserContext';

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  active,
  setAllCategories,
  categories,
  localUserActions,
  actionsToplist,
  setPopular,
}) => {
  const setCategory = useCategoryUpdate();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();
  const { data: data } = useUserState();
  const userActions = data.userActions;

  const climateActionsText = useClimateActionsText();

  let options = [
    { value: 'allCategories', label: climateActionsText.all_categories },
    { value: 'popular', label: climateActionsText.popular },
  ];

  const categoryColor = () => {
    if (!categories) {
      return active
        ? 'category_' +
            categoryName.toLowerCase().replace(/ /g, '_') +
            '_active'
        : 'category_' + categoryName.toLowerCase().replace(/ /g, '_');
    }
  };

  const createOptions = () =>
    categories.map((cat) => {
      options.push({ value: cat.id, label: cat.name });
    });
  categories && createOptions();

  const handleCategory = (categoryID) => {
    let filteredActions = [];
    if (categoryID === 'popular') {
      handleCategoryClick(true, false);
      filteredActions = actionsToplist.slice(0, 5);
    } else if (categoryID === 'allCategories') {
      handleCategoryClick(false, true);
      filteredActions = totClimateActions;
    } else {
      handleCategoryClick(false, false, categoryID);
      filteredActions = totClimateActions.filter(
        (temp) => temp.climate_action_category_id === categoryID
      );
    }
    updateCategoryAttributes(filteredActions);
  };

  const handleCategoryClick = (showPopular, showAllCategories, categoryID) => {
    setPopular(showPopular);
    setAllCategories(showAllCategories);
    categoryID ? setCategory(categoryID) : setCategory();
  };

  const updateCategoryAttributes = (filteredActions) => {
    const filteredActionsWithStatus = filteredActions.map((action) => {
      return userActions.some(
        (userAction) => userAction.climate_action_id === action.id
      )
        ? {
            ...action,
            accepted: true,
          }
        : { ...action, accepted: false };
    });

    setClimateActions(
      filteredActionsWithStatus.map((action) => {
        return localUserActions.some(
          (localUserAction) => localUserAction.id === action.id
        )
          ? {
              ...action,
              total: ++action.total,
            }
          : action;
      })
    );

    setClimateActions(
      filteredActionsWithStatus.map((action) => {
        return userActions.some((userAction) => userAction.id === action.id)
          ? {
              ...action,
              total: ++action.total,
            }
          : action;
      })
    );
  };

  return (
    <>
      {categories ? (
        <div className="mx-5">
          <Dropdown
            placeholder={climateActionsText.all_categories}
            controlClassName={'dropdown-control'}
            arrowClosed={<i className="fas fa-chevron-down" />}
            arrowOpen={<i className="fas fa-chevron-up" />}
            options={options}
            defaultOption={options[0]}
            onChange={(val) => handleCategory(val.value)}
          ></Dropdown>
        </div>
      ) : (
        <button
          className={`${categoryColor()} rounded-full py-1 px-4 button inline-block focus:outline-none m-1 ${
            active
              ? 'category_unknown_active text-white'
              : 'category_unknown hover:text-white hover:bg-opacity-80'
          } `}
          onClick={() => !active && handleCategory(categoryID)}
        >
          {categoryName}
        </button>
      )}
    </>
  );
};

export default CarouselCategoryButton;
